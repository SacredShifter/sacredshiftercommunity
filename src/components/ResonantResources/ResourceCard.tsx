import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg">
      {resource.thumbnail_url && (
        <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-40 object-cover" />
      )}
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-bold">{resource.title}</h3>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
        <p className="italic text-sm">“{resource.resonance_note}”</p>
        <div className="flex justify-between items-center mt-2">
          <Badge>{resource.type}</Badge>
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Visit</a>
        </div>
      </CardContent>
    </Card>
  );
}
