import { useMemo, useState } from "react";

const PRESETS = [
  { key: "liberation", label: "Liberation Breath", pattern: [4, 4, 6, 2] }, // inhale, hold, exhale, hold
  { key: "box", label: "Box 4-4-4-4", pattern: [4, 4, 4, 4] },
];

export function Breath() {
  const [idx, setIdx] = useState(0);
  const preset = useMemo(() => PRESETS[idx], [idx]);
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Breath of Source</h1>
      <select value={idx} onChange={e => setIdx(Number(e.target.value))} className="border p-2 rounded-xl">
        {PRESETS.map((p, i) => <option key={p.key} value={i}>{p.label}</option>)}
      </select>
      <ul className="text-sm opacity-80">
        <li>Inhale (Life) – The chosen experience: {preset.pattern[0]}s</li>
        <li>Hold – Presence: {preset.pattern[1]}s</li>
        <li>Exhale (Death) – Return to Source: {preset.pattern[2]}s</li>
        <li>Hold – Emptiness: {preset.pattern[3]}s</li>
      </ul>
    </div>
  );
}
