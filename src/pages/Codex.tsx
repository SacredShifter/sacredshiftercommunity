import { useEffect, useState } from "react";
import { supa } from "../../packages/supa/client";

type Entry = { id: string; title: string; body: string };

export function Codex() {
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(() => {
    supa.from("codex_entries").select("id,title,body").order("created_at", { ascending: false })
      .then(({ data }) => setEntries(data ?? []));
  }, []);
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Codex</h1>
      {entries.map(e => (
        <article key={e.id} className="border rounded-xl p-4">
          <h2 className="text-xl font-semibold">{e.title}</h2>
          <p className="mt-2 whitespace-pre-wrap">{e.body}</p>
        </article>
      ))}
    </div>
  );
}
