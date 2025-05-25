import { Button } from "@/components/ui/button";
import { getShade } from "../utils/entity_utils";

interface EntityListProps {
  entities: { name: string; count: number }[];
  minimumEntityCount: number;
  setMinimumEntityCount: (count: number) => void;
  selectedEntity: string | null;
  handleShowAllRelationships: () => void;
  handleEntityClick: (entity: string) => void;
  deleteEntity: (entity: string) => void;
}

export function EntityList({
  entities,
  minimumEntityCount,
  setMinimumEntityCount,
  selectedEntity,
  handleShowAllRelationships,
  handleEntityClick,
  deleteEntity,
}: EntityListProps) {
  const handleEntityRightClick = (e: React.MouseEvent, entityName: string) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      `Delete ${entityName} and its relationships?`
    );
    if (confirmDelete) {
      deleteEntity(entityName);
    }
  };

  return (
    <div className="entities-list">
      <div className="chips-container mb-4 flex flex-wrap">
        <button
          key={"Docagram-All"}
          className="chip-button border rounded-sm px-2 py-1 mr-1 my-1 flex items-center hover:bg-gray-800 hover:text-white"
          style={{
            backgroundColor: selectedEntity === null ? "green" : "inherit",
            color: selectedEntity === null ? "white" : "inherit",
          }}
          onClick={handleShowAllRelationships}
        >
          All
        </button>
        {entities
          .sort((a, b) => b.count - a.count)
          .filter((entity) => entity.count >= minimumEntityCount)
          .map((entity) => (
            <button
              key={entity.name}
              className="chip-button border rounded-sm px-2 py-1 mr-1 my-1 flex items-center hover:bg-gray-800 hover:text-white"
              style={{
                backgroundColor:
                  entity.name === selectedEntity
                    ? "green"
                    : getShade(entity.count),
                color: entity.name === selectedEntity ? "white" : "inherit",
              }}
              onClick={() => handleEntityClick(entity.name)}
              onContextMenu={(e) => handleEntityRightClick(e, entity.name)}
            >
              {entity.name}{" "}
              <span className="ml-1 text-sm">({entity.count})</span>
            </button>
          ))}
      </div>
    </div>
  );
}
