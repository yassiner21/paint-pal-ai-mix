import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '@/utils/paintColors';

interface ColorInputProps {
  onColorSelected: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ onColorSelected }) => {
  const [colorCode, setColorCode] = useState('#3399cc');
  const [isValid, setIsValid] = useState(true);
  const [hue, setHue] = useState(200);
  const [saturation, setSaturation] = useState(75);
  const [lightness, setLightness] = useState(59);
  const [rgb, setRgb] = useState({ r: 51, g: 153, b: 204 });
  const { toast } = useToast();

  useEffect(() => {
    // Update RGB when HSL changes
    const newRgb = hslToRgb(hue, saturation, lightness);
    setRgb(newRgb);
    setColorCode(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }, [hue, saturation, lightness]);

  const handleHexInput = (value: string) => {
    setColorCode(value);
    if (validateColor(value)) {
      const rgb = hexToRgb(value);
      setRgb(rgb);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(Math.round(hsl.h));
      setSaturation(Math.round(hsl.s));
      setLightness(Math.round(hsl.l));
    }
  };

  const handleRgbInput = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [component]: value };
    setRgb(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColorCode(hex);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHue(Math.round(hsl.h));
    setSaturation(Math.round(hsl.s));
    setLightness(Math.round(hsl.l));
  };

  const validateColor = (value: string) => {
    const hexRegex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
    return hexRegex.test(value);
  };

  const handleSubmit = () => {
    if (!isValid) {
      toast({
        title: "Invalid color format",
        description: "Please enter a valid HEX color code.",
        variant: "destructive",
      });
      return;
    }
    onColorSelected(colorCode);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          {/* Color Preview */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div 
                className="w-full h-[200px] rounded-lg border-2 border-border shadow-inner"
                style={{ backgroundColor: colorCode }}
              />
            </div>
            <div className="w-[200px] space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Hex</label>
                <div className="flex gap-2">
                  <Input
                    value={colorCode}
                    onChange={(e) => handleHexInput(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">RGB</label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => handleRgbInput('r', parseInt(e.target.value) || 0)}
                    className="font-mono"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => handleRgbInput('g', parseInt(e.target.value) || 0)}
                    className="font-mono"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => handleRgbInput('b', parseInt(e.target.value) || 0)}
                    className="font-mono"
                  />
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full"
              >
                <Check className="h-4 w-4 mr-1" /> Select Color
              </Button>
            </div>
          </div>

          {/* HSL Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Hue: {hue}°</label>
              <div 
                className="h-4 rounded-full mb-2"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, ${saturation}%, ${lightness}%),
                    hsl(60, ${saturation}%, ${lightness}%),
                    hsl(120, ${saturation}%, ${lightness}%),
                    hsl(180, ${saturation}%, ${lightness}%),
                    hsl(240, ${saturation}%, ${lightness}%),
                    hsl(300, ${saturation}%, ${lightness}%),
                    hsl(360, ${saturation}%, ${lightness}%)
                  )`
                }}
              />
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Saturation: {saturation}%</label>
              <div 
                className="h-4 rounded-full mb-2"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, 0%, ${lightness}%),
                    hsl(${hue}, 100%, ${lightness}%)
                  )`
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Lightness: {lightness}%</label>
              <div 
                className="h-4 rounded-full mb-2"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, ${saturation}%, 0%),
                    hsl(${hue}, ${saturation}%, 50%),
                    hsl(${hue}, ${saturation}%, 100%)
                  )`
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="text-sm font-medium mb-2 block">Presets</label>
            <div className="grid grid-cols-8 gap-2">
              {['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
                '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
                '#795548', '#9E9E9E', '#607D8B', '#000000', '#FFFFFF'].map((color, index) => (
                <div 
                  key={index} 
                  className="color-swatch w-full border-2 hover:border-primary transition-all"
                  style={{ 
                    backgroundColor: color,
                    borderColor: colorCode === color ? 'hsl(var(--primary))' : 'transparent'
                  }}
                  onClick={() => handleHexInput(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorInput;
