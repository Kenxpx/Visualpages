export interface Relationship {
    entity1: string;
    entity2: string;
    description: string;
    sourceUrl: string;
  }
  
  export interface ExportedData {
    relationships: Relationship[];
    entities: Record<string, string>; // Entity name to source URL mapping
    selectedEntity: string | null;
  }