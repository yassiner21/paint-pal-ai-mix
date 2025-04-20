
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save } from "lucide-react";

interface ColorResultProps {
  targetColor: string;
  colorMix: Array<{ name: string; percentage: number; hex: string }>;
  mixedColor: string;
  onNewMix?: () => void;
  onSaveMix?: () => void;
}

const ColorResult: React.FC<ColorResultProps> = ({
  targetColor,
  colorMix,
  mixedColor,
  onNewMix,
  onSaveMix,
}) => {
  return (
    <div className="bg-background rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Paint Mix Result</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (onNewMix) onNewMix();
            }}
          >
            <RotateCcw className="h-4 w-4" />
            New Mix
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (onSaveMix) onSaveMix();
            }}
          >
            <Save className="h-4 w-4" />
            Save Mix
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Target Color</span>
            <span className="text-sm font-mono">{targetColor}</span>
          </div>
          <div className="h-16 w-full rounded-md" style={{ backgroundColor: targetColor }} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Mixed Result</span>
            <span className="text-sm font-mono">{mixedColor}</span>
          </div>
          <div className="h-16 w-full rounded-md" style={{ backgroundColor: mixedColor }} />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Paint Colors to Mix</h3>
          <div className="space-y-3">
            {colorMix.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md" style={{ backgroundColor: color.hex }} />
                <div className="flex-1">
                  <div className="text-sm">{color.name}</div>
                  <div className="text-sm text-muted-foreground">{color.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Mixing Instructions</h3>
          <div className="h-32 border rounded-md bg-muted/10 relative">
            {colorMix.map((color, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  backgroundColor: color.hex,
                  width: `${Math.max(20, color.percentage / 2)}px`,
                  height: `${Math.max(20, color.percentage / 2)}px`,
                  borderRadius: "50%",
                  top: `${20 + index * 15}px`,
                  left: `${30 + index * 30}px`,
                }}
              />
            ))}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full"
              style={{ backgroundColor: mixedColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorResult;

