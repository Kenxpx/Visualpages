import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIOutputProps {
  message: string;
}

export function AIOutput({ message }: AIOutputProps) {
  if (!message) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">AI Output</h3>
            <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-2 rounded-md">
              {message}
            </pre>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}