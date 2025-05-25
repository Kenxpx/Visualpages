import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Direction = "LR" | "RL" | "TD" | "BT";

interface DirectionSelectorProps {
    direction: Direction;
    onDirectionChange: (value: Direction) => void;
  }

export default function DirectionSelector({ direction, onDirectionChange }: DirectionSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select 
        value={direction} 
        onValueChange={onDirectionChange}
      >
        <SelectTrigger id="direction-select" className="w-[180px]">
          <SelectValue placeholder="Select direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LR">Left to Right</SelectItem>
          <SelectItem value="RL">Right to Left</SelectItem>
          <SelectItem value="TD">Top Down</SelectItem>
          <SelectItem value="BT">Bottom Up</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}