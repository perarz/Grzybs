type Heading = { accuracy: number; trueHeading: number };
const HEADING_MAX_AGE = 10_000;

export function createHeadingMonitor(
  update: (heading: number | null) => void,
  valid: () => boolean,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  function clear() {
    clearTimeout(timer);
    timer = undefined;
    if (valid()) update(null);
  }
  function receive(heading: Heading) {
    if (!valid()) return;
    clearTimeout(timer);
    const value =
      heading.accuracy > 0 &&
      Number.isFinite(heading.trueHeading) &&
      heading.trueHeading >= 0 &&
      heading.trueHeading < 360
        ? heading.trueHeading
        : null;
    update(value);
    if (value !== null) timer = setTimeout(clear, HEADING_MAX_AGE);
  }
  return { receive, clear };
}
