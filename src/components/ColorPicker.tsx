import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Pipette, X, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface ColorPickerProps {
  onColorSelected: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelected }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const startColorPicking = () => {
    setIsPickingColor(true);
    setSelectedColor(null);
  };

  const cancelColorPicking = () => {
    setIsPickingColor(false);
    setSelectedColor(null);
  };

  const confirmColorSelection = () => {
    if (selectedColor) {
      onColorSelected(selectedColor);
      setIsPickingColor(false);
    }
  };

  const getColorAtPosition = (x: number, y: number) => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const realX = Math.floor((x - rect.left) * scaleX);
    const realY = Math.floor((y - rect.top) * scaleY);
    
    const pixelData = context.getImageData(realX, realY, 1, 1).data;
    
    const hex = '#' + 
      ('0' + pixelData[0].toString(16)).slice(-2) +
      ('0' + pixelData[1].toString(16)).slice(-2) +
      ('0' + pixelData[2].toString(16)).slice(-2);
    
    return hex;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPickingColor) return;
    
    const color = getColorAtPosition(e.clientX, e.clientY);
    if (color) {
      setSelectedColor(color);
    }
  };

  React.useEffect(() => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
    };
    img.src = image;
  }, [image]);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          {image && (
            <div className="color-picker-container relative">
              <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className={`w-full h-auto rounded-lg border border-border ${isPickingColor ? 'cursor-crosshair' : ''}`}
              />
              
              {selectedColor && (
                <div 
                  className="absolute top-2 right-2 p-2 rounded-full shadow-lg"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="w-8 h-8 block rounded-full border border-white"></span>
                </div>
              )}

              <div className="absolute bottom-2 right-2 flex gap-2">
                {!isPickingColor ? (
                  <Button 
                    size="sm" 
                    variant="default" 
                    onClick={startColorPicking}
                  >
                    <Pipette className="mr-2 h-4 w-4" /> Pick Color
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={cancelColorPicking}
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={confirmColorSelection}
                      disabled={!selectedColor}
                    >
                      <Check className="mr-2 h-4 w-4" /> Confirm
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {!image && (
            <div className="image-upload-container">
              <div className="text-muted-foreground mb-2">
                Upload an image to pick a color
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;
