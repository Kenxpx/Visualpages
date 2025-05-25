import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";
import DiagramComponent from "./DiagramComponent";
import { SectionData } from "./CombinedTab";

export default function SectionCard({
  index,
  section,
  showSummary,
  showDiagram,
  selectedEntity,
  handleNodeClick,
}: {
  index: number;
  showSummary: boolean;
  showDiagram: boolean;
  selectedEntity: string | null;
  section: SectionData;
  handleNodeClick: (entity: string) => void;
}) {
  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(true);
  const [showRelationships, setShowRelationships] = useState<boolean>(false);

  return (
    <Card key={index} className="mb-6">
      <CardContent className="space-y-4">
        <Collapsible
          open={isSectionOpen}
          onOpenChange={(open) => {
            setIsSectionOpen(open);
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold py-4">Section {index + 1}</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="flex flex-col gap-4">
              {showSummary && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <Switch
                      id={`show-relationships-${index}`}
                      checked={showRelationships}
                      onCheckedChange={() => {
                        setShowRelationships(!showRelationships);
                      }}
                    />
                  </div>
                  {!showRelationships && section && section.summary && (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      <Markdown>{section.summary}</Markdown>
                    </p>
                  )}
                  {showRelationships && (
                    <div className="space-y-4">
                      {section.relationships.map((rel, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-sm font-semibold">
                            {rel.entity1} ({rel.description}) {rel.entity2}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {showDiagram && section && (
                <div className="mt-4">
                  <DiagramComponent
                    relationships={section.relationships}
                    onNodeClick={handleNodeClick}
                  />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
