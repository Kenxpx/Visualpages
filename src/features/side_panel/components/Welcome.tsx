import React, { useState } from "react";
import { Relationship } from "../types/relationship";
import DiagramComponent from "./DiagramComponent";
import { Github, Twitter, Youtube } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Welcome: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("built-in");

  const relationships: Relationship[] = [
    {
      entity1: "Web Page Sections",
      entity2: "Summaries",
      description: "Summarized with Summary API",
      sourceUrl: "",
    },
    {
      entity1: "Summaries",
      entity2: "Relationships",
      description: "Analyzed with Prompt API to generate",
      sourceUrl: "",
    },
    {
      entity1: "Relationships",
      entity2: "Section-specific Mermaid Diagram",
      description: "Converted to",
      sourceUrl: "",
    },
    {
      entity1: "Relationships",
      entity2: "Combined Mermaid Diagram",
      description: "Converted to",
      sourceUrl: "",
    },
  ];

  const geminiRelationships: Relationship[] = [
    {
      entity1: "Web Page",
      entity2: "Gemini API",
      description: "Analyzed with ",
      sourceUrl: "",
    },
    {
      entity1: "Gemini API",
      entity2: "Summaries",
      description: "Outputs summaries for each section",
      sourceUrl: "",
    },
    {
      entity1: "Gemini API",
      entity2: "Relationships",
      description: "Outputs relationships for each section",
      sourceUrl: "",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold">How does this work?</h2>
      <p className="mb-4 text-muted-foreground">
        Docagram uses Chrome's built-in AI tools to turn web pages into
        diagrams. To get started, open a new tab and click the "Analyze" button.
      </p>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="built-in">Built-In</TabsTrigger>
          <TabsTrigger value="gemini">Gemini</TabsTrigger>
        </TabsList>
        <TabsContent value="built-in">
          <DiagramComponent
            relationships={relationships}
            startingDirection="TD"
          />
        </TabsContent>
        <TabsContent value="gemini">
          {/* Add content for the Gemini tab here */}
          <DiagramComponent
            relationships={geminiRelationships}
            startingDirection="TD"
          />
        </TabsContent>
      </Tabs>{" "}
      <div className="w-full flex justify-center gap-4 pt-4">
        <a
          href="https://github.com/jtmuller5/docagram-react"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4 mr-1" />
          Source
        </a>
        <a
          href="https://twitter.com/code_ontherocks"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Twitter className="h-4 w-4 mr-1" />
          Code on the Rocks
        </a>
        <a
          href="https://youtu.be/VkwgNrxnONw"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Youtube className="h-4 w-4 mr-1" />
          Video
        </a>
      </div>
    </div>
  );
};

export default Welcome;
