"""Generates the lesson sound effects in assets/sounds – own work, no third-party audio.

Run: python3 scripts/generate-sounds.py
"""
import math
import struct
import wave
from pathlib import Path

RATE = 22050
OUT = Path(__file__).resolve().parent.parent / "assets" / "sounds"


def tone(frequency, seconds, volume=0.5, decay=6.0):
    """A soft bell-like tone: a sine with one overtone and an exponential fade-out."""
    samples = []
    for i in range(int(RATE * seconds)):
        t = i / RATE
        attack = min(1.0, t / 0.008)
        envelope = attack * math.exp(-decay * t)
        value = math.sin(2 * math.pi * frequency * t) + 0.3 * math.sin(4 * math.pi * frequency * t)
        samples.append(volume * envelope * value / 1.3)
    return samples


def sequence(*notes, gap=0.0):
    result = []
    for frequency, seconds in notes:
        result += tone(frequency, seconds)
        result += [0.0] * int(RATE * gap)
    return result


def save(name, samples):
    with wave.open(str(OUT / f"{name}.wav"), "wb") as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32767)) for s in samples))


OUT.mkdir(parents=True, exist_ok=True)
save("correct", sequence((784, 0.12), (1047, 0.35)))  # G5 → C6, a bright rising pair
save("wrong", sequence((220, 0.18), (196, 0.3)))  # A3 → G3, a low soft fall
save("combo", sequence((784, 0.09), (988, 0.09), (1175, 0.09), (1568, 0.4)))  # quick arpeggio
save("complete", sequence((523, 0.15), (659, 0.15), (784, 0.15), (1047, 0.7), gap=0.02))  # fanfare
