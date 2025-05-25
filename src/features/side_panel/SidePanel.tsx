import { useEffect, useRef, useState } from "react";
import { AIService } from "../shared/services/ai_service";
import CombinedTab from "./components/CombinedTab";
import { RelationshipService } from "../shared/services/relationship_service";

function SidePanel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [supportInfo, setSupportInfo] = useState<{
    hasLanguageModel: boolean;
    hasSummarizer: boolean;
    languageModelStatus: string;
    summarizerStatus: string;
  } | null>(null);

  const aiServiceRef = useRef(new AIService());
  const aiService = aiServiceRef.current;

  const relationshipServiceRef = useRef(new RelationshipService());
  const relationshipService = relationshipServiceRef.current;

  useEffect(() => {
    const initializeAI = async () => {
      try {
        await aiService.initialize();
        const stats = aiService.getSessionStats();
        console.log("AI Service Initialized:", stats);

        const support = await aiService.checkSupport();
        setSupportInfo(support);
      } catch (error) {
        console.error("AIService initialization failed:", error);
      }
    };

    initializeAI();

    return () => {
      aiService.destroy();
    };
  }, []);

  return (
    <div className="p-4 space-y-4 w-full">
      <CombinedTab
        loading={loading}
        aiService={aiService}
        relationshipService={relationshipService}
      />

      {/* <div className="mt-8">
        <AIDetails stats={stats} supportInfo={supportInfo} />
      </div> */}
    </div>
  );
}

export default SidePanel;
