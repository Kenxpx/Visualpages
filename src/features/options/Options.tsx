import { Toaster } from "@/components/ui/toaster";
import { OptionsForm } from "./components/OptionsForm";

export interface DocagramOptions {
  temperature: number;
  topK: number;
  minimumEntityCount: number;
  chunkSize: number;
  systemPrompt: string;
}

export const DEFAULT_OPTIONS: DocagramOptions = {
  temperature: 0.7,
  topK: 40,
  minimumEntityCount: 2,
  chunkSize: 3000,
  systemPrompt: `Analyze this and identify key relationships between entities.
Express each relationship using this format: Entity1 to Entity2 (Description of relationship)

Format rules:
1. Each line should be: Entity1 to Entity2 (Description)
2. Keep entity names clear but concise
3. Place the relationship description in parentheses
4. Make descriptions brief and specific
5. Only include relationships that are clear and meaningful

Examples:
Google to Chrome Browser (develops and maintains the browser)
Chrome to Web Extensions (provides platform and APIs)
Microsoft to Windows (develops and distributes operating system)

Only output the relationships, no additional text or explanation.
Each relationship should be on its own line.

Text chunk to analyze:`,
};

function Options() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Docagram Options</h1>
      <OptionsForm />
      <Toaster />
    </div>
  );
}

export default Options;
