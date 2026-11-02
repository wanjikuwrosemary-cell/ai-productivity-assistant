import { useEffect, useRef, useState } from "react";

export function phaseMs(preset, phase) {
  const minutes =
    phase === "work"
      ? preset.workMinutes
      : phase === "break"
        ? preset.breakMinutes
        : preset.longBreakMinutes;
  return Math.round(minutes * 60000);
}

// Works from an end timestamp, not a counter that subtracts one each second,
// so it stays accurate even when the browser slows down a background tab.
export function useFocusTimer(preset, onPhaseEnd) {
  const [phase, setPhase] = useState("work"); // work | break | longBreak
  const [status, setStatus] = useState("idle"); // idle | running | paused
  const [endsAt, setEndsAt] = useState(0);
  const [now, setNow] = useState(0);
  const [pausedMs, setPausedMs] = useState(() => phaseMs(preset, "work"));
  const [cycles, setCycles] = useState(0); // focus sessions completed

  // Always call the latest callback without restarting the interval
  const onPhaseEndRef = useRef(onPhaseEnd);
  useEffect(() => {
    onPhaseEndRef.current = onPhaseEnd;
  });

  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      const t = Date.now();
      if (t < endsAt) {
        setNow(t);
        return;
      }

      // The current phase just finished
      const finishedWork = phase === "work";
      const nextCycles = finishedWork ? cycles + 1 : cycles;
      let nextPhase = "work";
      if (finishedWork) {
        const longDue =
          preset.longBreakMinutes &&
          nextCycles % preset.cyclesBeforeLongBreak === 0;
        nextPhase = longDue ? "longBreak" : "break";
      }

      setCycles(nextCycles);
      setPhase(nextPhase);
      setPausedMs(phaseMs(preset, nextPhase));
      setStatus("idle"); // waits for you to press Start: you stay in control
      onPhaseEndRef.current?.({ finishedPhase: phase, nextPhase });
    }, 250);

    return () => clearInterval(id);
  }, [status, endsAt, phase, cycles, preset]);

  const remainingMs =
    status === "running" ? Math.max(0, endsAt - now) : pausedMs;

  function start() {
    const t = Date.now();
    setNow(t);
    setEndsAt(t + pausedMs);
    setStatus("running");
  }

  function pause() {
    setPausedMs(Math.max(0, endsAt - Date.now()));
    setStatus("paused");
  }

  function reset() {
    setPhase("work");
    setCycles(0);
    setPausedMs(phaseMs(preset, "work"));
    setStatus("idle");
  }

  return { phase, status, remainingMs, cycles, start, pause, reset };
}