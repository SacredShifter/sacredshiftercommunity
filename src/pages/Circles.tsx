import { useEffect, useState } from "react";
import { supa } from "../../packages/supa/client";

type Circle = { id: string; name: string; description: string | null };
export function Circles() {
  const [circles, setCircles] = useState<Circle[]>([]);
  useEffect(() => {
    supa.from("circles").select("id,name,description").then(({ data }) => setCircles(data ?? []));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Circles</h1>
      <ul className="space-y-2">
        {circles.map(c => (
          <li key={c.id} className="border rounded-xl p-3">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm opacity-70">{c.description ?? ""}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}