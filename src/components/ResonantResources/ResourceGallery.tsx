import useSWR from "swr";
import { supabase } from "@/integrations/supabase/client";
import ResourceCard from "./ResourceCard";

export default function ResourceGallery({ circleId }: { circleId?: string }) {
  const fetcher = async () => {
    if (circleId) {
      const { data, error } = await supabase
        .from("resources")
        .select("*, circle_resources!inner(circle_id)")
        .eq("circle_resources.circle_id", circleId);
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from("resources").select("*");
      if (error) throw error;
      return data;
    }
  };

  const { data: resources } = useSWR(["resources", circleId], fetcher);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {resources?.map((r: any) => <ResourceCard key={r.id} resource={r} />)}
    </div>
  );
}
