import React, { useState } from "react";
import Header from "@/components/Header";
import ColorPicker from "@/components/ColorPicker";
import ColorInput from "@/components/ColorInput";
import ColorResult from "@/components/ColorResult";
import SavedMixes from "@/components/SavedMixes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findBestColorMix } from "@/utils/paintColors";
import { useToast } from "@/components/ui/use-toast";

const Index: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [colorMix, setColorMix] = useState<
    Array<{ name: string; percentage: number; hex: string }> | null
  >(null);
  const [mixedColor, setMixedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("photo");
  const { toast } = useToast();

  const handleColorSelected = (color: string) => {
    setSelectedColor(color);
    const result = findBestColorMix(color);
    setColorMix(result.colorMix);
    setMixedColor(result.mixedColor);
  };

  // New mix resets selection and results
  const handleNewMix = () => {
    setSelectedColor(null);
    setColorMix(null);
    setMixedColor(null);
    setActiveTab("code");
  };

  // Save current mix to localStorage and notify user
  const handleSaveMix = () => {
    if (!selectedColor || !colorMix || !mixedColor) return;

    // Create a canvas to generate a color swatch image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
      gradient.addColorStop(0, selectedColor);
      gradient.addColorStop(1, mixedColor);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 100, 100);
      
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/png');

      const existingMixes = JSON.parse(localStorage.getItem("savedColorMixes") || "[]");
      const newMix = {
        id: existingMixes.length
          ? Math.max(...existingMixes.map((m: any) => m.id)) + 1
          : 1,
        targetColor: selectedColor,
        mixedColor,
        colorMix,
        imageData,
        createdAt: new Date().toISOString(),
      };

      const updatedMixes = [newMix, ...existingMixes];
      localStorage.setItem("savedColorMixes", JSON.stringify(updatedMixes));

      // Dispatch custom event to notify of localStorage update
      window.dispatchEvent(new Event('localStorageUpdated'));

      toast({
        title: "Mix saved",
        description: "Your paint mix has been saved successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Find the Perfect Paint Mix</h1>
          <p className="text-muted-foreground">
            Upload a photo or enter a color code to discover the ideal paint combination
          </p>
        </div>

        <SavedMixes onSelectMix={handleColorSelected} />

        {!selectedColor && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="photo">Photo</TabsTrigger>
              <TabsTrigger value="code">Color Code</TabsTrigger>
            </TabsList>

            <TabsContent value="photo">
              <ColorPicker onColorSelected={handleColorSelected} />
            </TabsContent>

            <TabsContent value="code">
              <ColorInput onColorSelected={handleColorSelected} />
            </TabsContent>
          </Tabs>
        )}

        {selectedColor && colorMix && mixedColor && (
          <ColorResult
            targetColor={selectedColor}
            colorMix={colorMix}
            mixedColor={mixedColor}
            onNewMix={handleNewMix}
            onSaveMix={handleSaveMix}
          />
        )}
      </main>

      <footer className="border-t mt-12 py-6 px-4">
        <div className="max-w-xl mx-auto text-center text-sm text-muted-foreground">
          <p>Pigment Mixer - Find the perfect paint mix for any color</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

