import { Relationship } from "../types/relationship";

export const sanitizeMermaidText = (text: string): string => {
  return text
    .replace(/[-–—]/g, "") // Remove hyphens and dashes
    .replace(/[,.'’"±!@#$%^&*()′″°+=\[\]{}|\\/<>:;−_\s]/g, "_")
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_|_$/g, "")
    .trim(); // Remove leading/trailing underscores
};

export const sanitizeMermaidLabel = (text: string): string => {
  return text.trim().replace(/[©®*"’`\[\]\(\)]/g, "");
};

export const exportForNomnoml = (relationships: Relationship[]): string => {
  const nomnomlText = relationships
    .map(
      (relationship) =>
        `[${sanitizeMermaidLabel(relationship.entity1)}] ${
          relationship.description
        } [${sanitizeMermaidLabel(relationship.entity2)}]`
    )
    .join("\n");

  return nomnomlText;
};
