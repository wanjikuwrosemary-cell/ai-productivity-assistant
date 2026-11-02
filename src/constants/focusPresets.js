// Each technique is just a set of numbers. Adding another fixed-time
// technique later means adding one object here.
export const FOCUS_PRESETS = [
  {
    id: "pomodoro",
    label: "Pomodoro (25/5)",
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 20, // the method allows 15–30
    cyclesBeforeLongBreak: 4,
  },
  {
    id: "52-17",
    label: "52/17",
    workMinutes: 52,
    breakMinutes: 17,
    longBreakMinutes: null,
    cyclesBeforeLongBreak: null,
  },
  {
    id: "90-minute",
    label: "90-minute block",
    workMinutes: 90,
    breakMinutes: 20, // the method doesn't set a break; this is my default
    longBreakMinutes: null,
    cyclesBeforeLongBreak: null,
  },
];