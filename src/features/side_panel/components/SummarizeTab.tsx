import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SystemStatus } from "./SystemStatus";
import { AIOutput } from "./AIOutput";
import { ContentService } from "@/features/shared/services/content_service";
import { useCallback, useState } from "react";
import { AIService } from "@/features/shared/services/ai_service";
import Markdown from "react-markdown";

interface SummarizeTabProps {
  loading: boolean;
  aiService: AIService;
}

export function SummarizeTab({ loading, aiService }: SummarizeTabProps) {
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("");

  const summarizePageContent = useCallback(async () => {
    try {
      setError(null);
      setStatus("Summarizing page content...");

      const pageContent = await ContentService.getPageContent();

      const chunks = await ContentService.splitIntoChunks(pageContent);

      let combinedSummary = "";

      for (const chunk of chunks) {
        const chunkSummary = await aiService.summarizeContent(chunk);
        combinedSummary += chunkSummary + "\n";
        setSummary(combinedSummary);
      }
    } catch (error: any) {
      console.error("Summarization failed:", error);
      setStatus(`Summarization failed: ${error.message} (${error.name})`);
      setError(error.message);
    } finally {
      setStatus("");
    }
  }, [aiService]);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <Button onClick={summarizePageContent} disabled={loading}>
          Generate Summary
        </Button>
        <SystemStatus status={status} error={error} />
        {message && <AIOutput message={message} />}
        {summary && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-2">Summary</h3>
              <Markdown>{summary}</Markdown>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
