import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function ResourceNominationForm({ circleId }: { circleId?: string }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resonanceNote, setResonanceNote] = useState("");

  async function handleSubmit() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not logged in");
      // Optionally, show a message to the user
      return;
    }

    const { data: resource, error } = await supabase
      .from("resources")
      .insert([{
        url,
        title,
        description,
        resonance_note: resonanceNote,
        submitted_by: user.id,
        type: url.includes("youtube.com") ? "youtube" : "website"
      }])
      .select()
      .single();

    if (circleId && resource) {
      await supabase.from("circle_resources").insert([{
        circle_id: circleId,
        resource_id: resource.id
      }]);
    }

    if (error) {
        console.error(error);
    } else {
      setUrl(""); setTitle(""); setDescription(""); setResonanceNote("");
    }
  }

  return (
    <div className="space-y-4 p-4 bg-card rounded-2xl shadow-lg">
      <Input placeholder="Paste a YouTube link or website URL" value={url} onChange={e => setUrl(e.target.value)} />
      <Input placeholder="Title (auto-filled if possible)" value={title} onChange={e => setTitle(e.target.value)} />
      <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
      <Textarea placeholder="Why are you sharing this? (Resonance Note)" value={resonanceNote} onChange={e => setResonanceNote(e.target.value)} />
      <Button onClick={handleSubmit}>Share Resource</Button>
    </div>
  );
}
