// CombinedTab.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SystemStatus } from "./SystemStatus";
import { Relationship } from "../types/relationship";
import { useState, useCallback, useEffect } from "react";
import { RelationshipService } from "@/features/shared/services/relationship_service";
import { ContentService } from "@/features/shared/services/content_service";
import DiagramComponent from "./DiagramComponent";
import Markdown from "react-markdown";
import { AIService } from "@/features/shared/services/ai_service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EntityList } from "./EntityList";
import { tab } from "@testing-library/user-event/dist/tab";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import Welcome from "./Welcome";
import SectionCard from "./SectionCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SectionData {
  summary: string;
  relationships: Relationship[];
  message: string;
}

interface CombinedTabProps {
  loading: boolean;
  aiService: AIService;
  relationshipService: RelationshipService;
}

export default function CombinedTab({
  loading,
  aiService,
  relationshipService,
}: CombinedTabProps) {
  // Existing state variables
  const [sections, setSections] = useState<SectionData[]>([]);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<string>("built-in");

  const [showSummaries, setShowSummaries] = useState<boolean>(true);
  const [showDiagrams, setShowDiagrams] = useState<boolean>(true);

  // Combined Diagram and Entities
  const [combinedRelationships, setCombinedRelationships] = useState<
    Relationship[]
  >([]);
  const [combinedEntities, setCombinedEntities] = useState<
    { name: string; count: number }[]
  >([]);
  const [entitySummary, setEntitySummary] = useState<string | null>(null);
  const [selectedCombinedTab, setSelectedCombinedTab] =
    useState<string>("diagram");

  // Entity interactions
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [minimumEntityCount, setMinimumEntityCount] = useState<number>(1);

  // Collapsible state variables
  const [isCombinedDiagramOpen, setIsCombinedDiagramOpen] =
    useState<boolean>(true);

  useEffect(() => {
    // Cleanup highlights when component unmounts
    return () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "highlight",
            entity: "",
          });
        }
      });
    };
  }, []);

  /* useEffect(() => {
    if (combinedRelationships.length > 0 && selectedEntity) {
      aiService.writeAbout(selectedEntity).then((overview) => {
        setEntitySummary(overview);
      });
    } else {
      setEntitySummary(null);
    }
  }, [combinedRelationships]); */

  const analyzeSummaryAndContent = useCallback(async () => {
    try {
      relationshipService.reset();
      setSections([]);
      setError(null);
      setStatus("Analyzing page content...");
      setCombinedRelationships([]);
      setCombinedEntities([]);
      setSelectedEntity(null);
      const pageUrl = window.location.href;
      const newSections: SectionData[] = [];
      const pageContent = await ContentService.getPageContent();

      if (model === "built-in") {
        const chunks = await ContentService.splitIntoChunks(pageContent);

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          setStatus(`Processing section ${i + 1} of ${chunks.length}`);

          try {
            // Generate summary for the chunk
            const chunkSummary = await aiService.summarizeContent(chunk);

            // Analyze relationships in the chunk
            const stream = await aiService.streamAnalysis(chunkSummary);
            let chunkResult = "";

            const reader = stream.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunkResult = value;

              // Create temporary RelationshipService for this section
              const sectionRelationshipService = new RelationshipService();
              sectionRelationshipService.parseRelationships(
                chunkResult,
                pageUrl
              );
              const sectionRelationships =
                sectionRelationshipService.getRelationships();

              // Create section data
              const sectionData: SectionData = {
                summary: chunkSummary,
                relationships: sectionRelationships,
                message: chunkResult,
              };

              // Update sections
              newSections[i] = sectionData;
              setSections([...newSections]);
            }
          } catch (error: any) {
            console.error(`Error processing section ${i + 1}:`, error);
            setError(`Error processing section ${i + 1}: ${error.message}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      } else {
        const sections = await aiService.analyzeTextWithGemini(
          pageContent,
          model === "pro"
        );

        setSections(sections);
      }
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setError(error.message);
    } finally {
      setStatus("");
    }
  }, [aiService, model]);

  const handleEntityClick = (entity: string) => {
    if (entity === selectedEntity) {
      setSelectedEntity(null);
      setCombinedRelationships(
        sections.flatMap((section) => section.relationships)
      );
    } else {
      setSelectedEntity(entity);
      // Filter relationships to those involving the selected entity
      const filteredRelationships = combinedRelationships.filter(
        (rel) => rel.entity1 === entity || rel.entity2 === entity
      );
      setCombinedRelationships(filteredRelationships);
    }
  };

  const handleShowAllRelationships = () => {
    setSelectedEntity(null);
    setCombinedRelationships(
      sections.flatMap((section) => section.relationships)
    );
  };

  const deleteEntity = (entity: string) => {
    // Remove entity from combinedRelationships
    const updatedRelationships = combinedRelationships.filter(
      (rel) => rel.entity1 !== entity && rel.entity2 !== entity
    );
    setCombinedRelationships(updatedRelationships);

    // Update combinedEntities
    const updatedEntities = combinedEntities.filter((e) => e.name !== entity);
    setCombinedEntities(updatedEntities);

    // If the deleted entity was selected, reset selection
    if (selectedEntity === entity) {
      setSelectedEntity(null);
    }
  };

  const handleNodeClick = async (entity: string) => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "highlight",
          entity: entity === selectedEntity ? "" : entity,
        });
      }
    } catch (error) {
      console.error("Failed to send highlight message:", error);
    }
  };

  const handleDiagramNodeClick = (entity: string) => {
    handleNodeClick(entity);
    handleEntityClick(entity);
  };

  const combineAllDiagrams = () => {
    // Collect all relationships from all sections
    const allRelationships = sections.flatMap(
      (section) => section.relationships
    );

    const uniqueRelationships =
      relationshipService.getUniqueRelationships(allRelationships);

    // Generate mermaid diagram
    setCombinedRelationships(uniqueRelationships);

    // Collect entities and their counts
    const entityCounts = new Map<string, number>();
    uniqueRelationships.forEach((rel) => {
      entityCounts.set(rel.entity1, (entityCounts.get(rel.entity1) || 0) + 1);
      entityCounts.set(rel.entity2, (entityCounts.get(rel.entity2) || 0) + 1);
    });
    const entities = Array.from(entityCounts.entries()).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
    setCombinedEntities(entities);
  };

  return (
    <Card className="w-full bg-background">
      <CardContent className="pt-0 px-0">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 border-b-[1px] border-border bg-background rounded-t-xl">
          <div className="flex flex-wrap items-center gap-2 p-2 md:p-4">
            <img
              src="/docagram.png"
              alt="Docagram Logo"
              onClick={() => {
                setSections([]);
                setStatus("");
                setError(null);
                setShowSummaries(true);
                setShowDiagrams(true);
                setModel("built-in");
                setCombinedRelationships([]);
                setCombinedEntities([]);
                setSelectedCombinedTab("diagram");
                setSelectedEntity(null);
                setMinimumEntityCount(1);
                setIsCombinedDiagramOpen(true);
              }}
              className="h-9 w-auto mr-4 rounded-sm cursor-pointer"
            />
            <Button
              onClick={analyzeSummaryAndContent}
              disabled={loading}
              className="mr-4"
            >
              Analyze
            </Button>
            <Button
              className="block md:hidden"
              onClick={combineAllDiagrams}
              disabled={sections.length === 0}
              variant="outline"
            >
              Combine All Diagrams
            </Button>

            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center">
                <Switch
                  id="show-summaries"
                  checked={showSummaries}
                  onCheckedChange={setShowSummaries}
                />
                <Label htmlFor="show-summaries" className="ml-2 mr-4">
                  Show Summaries
                </Label>
              </div>
              <div className="flex items-center">
                <Switch
                  id="show-diagrams"
                  checked={showDiagrams}
                  onCheckedChange={setShowDiagrams}
                />
                <Label htmlFor="show-diagrams" className="ml-2 mr-4">
                  Show Diagrams
                </Label>
              </div>
              <div className="flex items-center">
                <Select onValueChange={setModel} value={model}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Model</SelectLabel>
                      <SelectItem value="built-in">Built-In</SelectItem>
                      <SelectItem value="flash">Flash</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {(model === "flash" || model === "pro") && (
            <div className="p-2 mx-2 mb-2 md:p-4 bg-muted border border-muted rounded-md shadow-md text-muted-foreground">
              <Markdown>
                {`**Gemini Mode** is enabled. This will use advanced AI models to analyze the content. This may take longer and consume more resources.`}
              </Markdown>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6 pt-6 px-4">
          <SystemStatus status={status} error={error} />

          {sections && sections.length > 1 && (
            <Button
              className="hidden md:block"
              onClick={combineAllDiagrams}
              disabled={sections.length === 0}
              variant="outline"
            >
              Combine All Diagrams
            </Button>
          )}
          {combinedRelationships && combinedRelationships.length > 0 && (
            <Card className="mb-6">
              <CardContent>
                <Collapsible
                  open={isCombinedDiagramOpen}
                  onOpenChange={setIsCombinedDiagramOpen}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold pt-4">Combined Diagram</h2>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <Tabs
                      value={selectedCombinedTab}
                      onValueChange={setSelectedCombinedTab}
                    >
                      <div className="flex gap-4 pt-4 items-center">
                        <TabsList>
                          <TabsTrigger value="diagram">Diagram</TabsTrigger>
                          <TabsTrigger value="entities">Entities</TabsTrigger>
                        </TabsList>
                        {selectedEntity && (
                          <div>
                            <Label className="mr-2">Selected Entity:</Label>
                            <span className="font-semibold text-primary">
                              {selectedEntity}
                            </span>
                          </div>
                        )}
                        {selectedEntity && (
                          <Button
                            variant={"outline"}
                            onClick={handleShowAllRelationships}
                          >
                            Show All
                          </Button>
                        )}
                      </div>
                      <TabsContent value="diagram">
                        {selectedEntity && (
                          <div className="py-4">
                            <span className="font-semibold py-4">
                              {entitySummary}
                            </span>
                          </div>
                        )}
                        <DiagramComponent
                          relationships={combinedRelationships}
                          onNodeClick={handleDiagramNodeClick}
                        />
                      </TabsContent>
                      <TabsContent value="entities">
                        <EntityList
                          entities={combinedEntities}
                          minimumEntityCount={minimumEntityCount}
                          setMinimumEntityCount={setMinimumEntityCount}
                          selectedEntity={selectedEntity}
                          handleShowAllRelationships={
                            handleShowAllRelationships
                          }
                          handleEntityClick={(entity) => {
                            handleEntityClick(entity);
                            setSelectedCombinedTab("diagram");
                          }}
                          deleteEntity={deleteEntity}
                        />
                      </TabsContent>
                    </Tabs>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          )}

          {sections.map((section, index) => (
            <SectionCard
              key={index}
              section={section}
              index={index}
              selectedEntity={selectedEntity}
              showSummary={showSummaries}
              showDiagram={showDiagrams}
              handleNodeClick={handleNodeClick}
            />
          ))}

          {(!sections || sections.length === 0) && <Welcome />}
        </div>
      </CardContent>
    </Card>
  );
}
