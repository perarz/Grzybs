// A small deterministic host for hook control-flow tests, not a native UI renderer.
function createHookHost() {
  const slots = [];
  const pending = [];
  let cursor = 0;
  let writes = 0;
  const equal = (a, b) =>
    a && b && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
  const react = {
    useState(initial) {
      const id = cursor++;
      if (!slots[id]) slots[id] = { value: typeof initial === 'function' ? initial() : initial };
      return [
        slots[id].value,
        (value) => {
          writes++;
          slots[id].value = typeof value === 'function' ? value(slots[id].value) : value;
        },
      ];
    },
    useRef(value) {
      const id = cursor++;
      if (!slots[id]) slots[id] = { current: value };
      return slots[id];
    },
    useMemo(factory, deps) {
      const id = cursor++;
      if (!slots[id] || !equal(slots[id].deps, deps)) slots[id] = { deps, value: factory() };
      return slots[id].value;
    },
    useCallback(callback, deps) {
      return react.useMemo(() => callback, deps);
    },
    useEffect(effect, deps) {
      const id = cursor++;
      if (slots[id] && equal(slots[id].deps, deps)) return;
      const old = slots[id];
      slots[id] = { deps };
      pending.push(() => {
        old?.cleanup?.();
        slots[id].cleanup = effect();
      });
    },
  };
  return {
    react,
    render(hook) {
      cursor = 0;
      const result = hook();
      pending.splice(0).forEach((effect) => effect());
      return result;
    },
    unmount() {
      slots.forEach((slot) => slot?.cleanup?.());
    },
    writes: () => writes,
  };
}
module.exports = { createHookHost };
