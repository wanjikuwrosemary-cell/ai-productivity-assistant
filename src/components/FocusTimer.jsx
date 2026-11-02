import { useState } from "react";
import { FOCUS_PRESETS } from "../constants/focusPresets";
import { useFocusTimer } from "../hooks/useFocusTimer";
import { logFocusSession } from "../lib/focusApi";

const PHASE_LABELS = {
  work: "Focus",
  break: "Short break",
  longBreak: "Long break",
};

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function notify(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function TimerRunner({ preset, tasks }) {
  const [taskId, setTaskId] = useState("");
  const [message, setMessage] = useState("");

  async function handlePhaseEnd({ finishedPhase, nextPhase }) {
    if (finishedPhase === "work") {
      notify("Focus session complete", "Nice work. Time for a break.");
      setMessage("Focus session complete. Press Start when you're ready for your break.");
      try {
        await logFocusSession({
          taskId: taskId ? Number(taskId) : null,
          technique: preset.id,
          minutes: preset.workMinutes,
        });
      } catch {
        setMessage("Session complete, but it could not be saved to your history.");
      }
    } else {
      notify("Break over", "Ready for the next focus session?");
      setMessage(`${PHASE_LABELS[finishedPhase]} over. Press Start for the next focus session.`);
    }
    return nextPhase;
  }

  const timer = useFocusTimer(preset, handlePhaseEnd);

  function handleStart() {
    // Ask for notification permission on a click, as browsers require
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setMessage("");
    timer.start();
  }

  return (
    <div>
      <div className="field">
        <label htmlFor="focusTask">Focus on (optional)</label>
        <select
          id="focusTask"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        >
          <option value="">No specific task</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="timer-phase">
        {PHASE_LABELS[timer.phase]} · {timer.cycles} completed today's session
        {timer.cycles === 1 ? "" : "s"}
      </div>
      <div className="timer-display" role="timer" aria-live="off">
        {formatTime(timer.remainingMs)}
      </div>

      <div className="timer-actions">
        {timer.status === "running" ? (
          <button type="button" className="btn-primary" onClick={timer.pause}>
            Pause
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={handleStart}>
            {timer.status === "paused" ? "Resume" : "Start"}
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={timer.reset}>
          Reset
        </button>
      </div>

      {message && <p className="status" role="status">{message}</p>}
    </div>
  );
}

function FocusTimer({ tasks }) {
  const [presetId, setPresetId] = useState(FOCUS_PRESETS[0].id);
  const preset = FOCUS_PRESETS.find((p) => p.id === presetId);

  return (
    <section className="focus">
      <h2>Focus</h2>
      <div className="field">
        <label htmlFor="technique">Technique</label>
        <select
          id="technique"
          value={presetId}
          onChange={(e) => setPresetId(e.target.value)}
        >
          {FOCUS_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* key makes the timer start fresh whenever the technique changes */}
      <TimerRunner key={preset.id} preset={preset} tasks={tasks} />
    </section>
  );
}

export default FocusTimer;