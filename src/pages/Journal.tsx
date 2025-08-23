import { useEffect, useState } from "react";
import { supa } from "../../packages/supa/client";

export function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  const submit = async () => {
    const uid = (await supa.auth.getUser()).data.user?.id;
    if (!uid || !text.trim()) return;
    await supa.from("journal_entries").insert({ user_id: uid, content: text.trim() });
    setText("");
    const { data } = await supa.from("journal_entries").select("*").order("created_at", { ascending: false });
    setEntries(data ?? []);
  };

  useEffect(() => { supa.from("journal_entries").select("*").order("created_at", { ascending: false })
    .then(({ data }) => setEntries(data ?? [])); }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Journal & Dreamscape</h1>
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full min-h-32 border rounded-xl p-3" placeholder="Write a journal entry or paste a dream…" />
      <button onClick={submit} className="px-4 py-2 border rounded-xl">Save</button>
      <div className="space-y-3">
        {entries.map(e => (
          <div key={e.id} className="border rounded-xl p-3">
            <div className="text-sm opacity-70">{new Date(e.created_at).toLocaleString()}</div>
            <div className="whitespace-pre-wrap mt-2">{e.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}