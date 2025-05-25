import { SessionStats } from "../../shared/services/ai_service";

export default function AIDetails({
  supportInfo,
  stats,
}: {
  supportInfo: {
    hasLanguageModel: boolean;
    hasSummarizer: boolean;
    languageModelStatus: string;
    summarizerStatus: string;
  } | null;
  stats: SessionStats | null;
}) {
  return (
    <div className="border border-gray-800 rounded-md mt-4 p-2">
      <h3>AI Details</h3>
      {/* Display AI Support Information */}
      {supportInfo && (
        <div className="mt-2">
          <h4 className="text-md font-semibold mb-1">AI Support Information</h4>
          <p>
            <strong>Language Model Available:</strong>{" "}
            {supportInfo.languageModelStatus}
          </p>
          <p>
            <strong>Summarizer Available:</strong>{" "}
            {supportInfo.summarizerStatus}
          </p>
        </div>
      )}

      {/* Display AI Session Statistics */}
      {stats && (
        <div className="mt-2">
          <h4 className="text-md font-semibold mb-1">AI Session Statistics</h4>
          <p>
            <strong>Temperature:</strong> {stats.temperature}
          </p>
          <p>
            <strong>Top K:</strong> {stats.topK}
          </p>
          <p>
            <strong>Tokens Left:</strong> {stats.tokensLeft}
          </p>
          <p>
            <strong>Tokens So Far:</strong> {stats.tokensSoFar}
          </p>
          <p>
            <strong>Is Initialized:</strong> {stats.isInitialized.toString()}
          </p>
          <p>
            <strong>Has Summarizer:</strong> {stats.hasSummarizer.toString()}
          </p>
        </div>
      )}

      {/* If neither support info nor stats are available */}
      {!supportInfo && !stats && (
        <p className="text-sm mt-2">No AI details available.</p>
      )}
    </div>
  );
}
