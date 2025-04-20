import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface SavedMix {
  id: number;
  targetColor: string;
  mixedColor: string;
  colorMix: Array<{ name: string; percentage: number; hex: string }>;
  createdAt: string;
  imageData?: string;
}

interface SavedMixesProps {
  onSelectMix: (targetColor: string) => void;
}

const SavedMixes: React.FC<SavedMixesProps> = ({ onSelectMix }) => {
  const [savedMixes, setSavedMixes] = useState<SavedMix[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Custom hook to listen for localStorage changes
  useEffect(() => {
    // Initial load
    const loadSavedMixes = () => {
      const mixes = JSON.parse(localStorage.getItem('savedColorMixes') || '[]');
      setSavedMixes(mixes);
    };

    // Load initial data
    loadSavedMixes();

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedColorMixes') {
        loadSavedMixes();
      }
    };

    // Listen for changes in other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Create a custom event listener for same-tab updates
    const handleCustomStorageChange = () => loadSavedMixes();
    window.addEventListener('localStorageUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageChange);
    };
  }, []);

  const handleDeleteMix = (id: number) => {
    const updatedMixes = savedMixes.filter(mix => mix.id !== id);
    setSavedMixes(updatedMixes);
    localStorage.setItem('savedColorMixes', JSON.stringify(updatedMixes));
    
    toast({
      title: "Mix deleted",
      description: "The saved mix has been removed.",
    });
  };

  const handleDownloadMix = (mix: SavedMix) => {
    if (mix.imageData) {
      // Create a canvas to draw over the existing image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 1000; // Increased width for better layout
        canvas.height = 1000; // Increased height for better spacing
        
        if (ctx) {
          // Fill white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the original image in a larger size
          const imgSize = 300;
          const imgX = (canvas.width - imgSize) / 2;
          const imgY = 50;
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          
          // Add color information
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          
          // Add title
          ctx.fillText('Color Mix Recipe', canvas.width/2, 400);
          
          // Add color codes
          ctx.font = '24px Arial';
          ctx.fillText(`Target Color: ${mix.targetColor}`, canvas.width/2, 450);
          ctx.fillText(`Mixed Color: ${mix.mixedColor}`, canvas.width/2, 490);
          
          // Add mixing recipe
          ctx.font = 'bold 28px Arial';
          ctx.fillText('Mixing Recipe:', canvas.width/2, 550);

          // Draw recipe color swatches
          const swatchSize = 80;
          const spacing = 40;
          const startX = (canvas.width - (mix.colorMix.length * (swatchSize + spacing))) / 2;
          
          mix.colorMix.forEach((color, index) => {
            const x = startX + index * (swatchSize + spacing);
            const y = 580;
            
            // Draw color swatch with rounded corners
            ctx.beginPath();
            ctx.roundRect(x, y, swatchSize, swatchSize, 10);
            ctx.fillStyle = color.hex;
            ctx.fill();
            
            // Draw border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add color name and percentage
            ctx.fillStyle = '#000000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(color.name, x + swatchSize/2, y + swatchSize + 30);
            ctx.fillText(`${color.percentage}%`, x + swatchSize/2, y + swatchSize + 60);
          });

          // Add date
          ctx.font = '18px Arial';
          ctx.fillStyle = '#666666';
          ctx.fillText(`Created: ${new Date(mix.createdAt).toLocaleDateString()}`, canvas.width/2, canvas.height - 50);

          // Download the modified image
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `color-mix-${mix.id}.png`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
      
      img.src = mix.imageData;
    } else {
      // Create a canvas to generate a color swatch image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1000;
      canvas.height = 1000;
      
      if (ctx) {
        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw color swatches
        const swatchSize = 300;
        const swatchX = (canvas.width - swatchSize) / 2;
        const swatchY = 50;

        // Draw target color swatch with rounded corners
        ctx.beginPath();
        ctx.roundRect(swatchX, swatchY, swatchSize, swatchSize, 15);
        ctx.fillStyle = mix.targetColor;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw mixed color swatch with rounded corners
        ctx.beginPath();
        ctx.roundRect(swatchX, swatchY + swatchSize + 30, swatchSize, swatchSize, 15);
        ctx.fillStyle = mix.mixedColor;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add color information
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        
        // Add title
        ctx.fillText('Color Mix Recipe', canvas.width/2, 450);
        
        // Add color codes
        ctx.font = '24px Arial';
        ctx.fillText(`Target Color: ${mix.targetColor}`, canvas.width/2, 500);
        ctx.fillText(`Mixed Color: ${mix.mixedColor}`, canvas.width/2, 540);
        
        // Add mixing recipe
        ctx.font = 'bold 28px Arial';
        ctx.fillText('Mixing Recipe:', canvas.width/2, 600);

        // Draw recipe color swatches vertically with increased spacing
        const recipeSwatchSize = 120;
        const verticalSpacing = 250; // Significantly increased spacing between swatches
        const startY = 500; // Adjusted starting position
        const centerX = canvas.width / 2 - recipeSwatchSize / 2;
        
        // Adjust canvas height based on number of colors
        canvas.height = Math.max(1000, startY + (mix.colorMix.length * verticalSpacing) + 100);
        
        // Redraw white background for new canvas size
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Redraw the title and color information
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Color Mix Recipe', canvas.width/2, 80);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Target Color: ${mix.targetColor}`, canvas.width/2, 130);
        ctx.fillText(`Mixed Color: ${mix.mixedColor}`, canvas.width/2, 170);
        
        // Draw target and mixed color swatches
        const mainSwatchSize = 200;
        const mainSwatchX = (canvas.width - mainSwatchSize) / 2;
        const mainSwatchY = 200;
        
        // Draw target color swatch
        ctx.beginPath();
        ctx.roundRect(mainSwatchX, mainSwatchY, mainSwatchSize, mainSwatchSize, 15);
        ctx.fillStyle = mix.targetColor;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText('Mixing Recipe:', canvas.width/2, 450);
        
        mix.colorMix.forEach((color, index) => {
          const y = startY + index * verticalSpacing;
          
          // Draw color swatch with rounded corners and shadow
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          
          ctx.beginPath();
          ctx.roundRect(centerX, y, recipeSwatchSize, recipeSwatchSize, 12);
          ctx.fillStyle = color.hex;
          ctx.fill();
          
          // Draw border
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
          
          // Add color name with background
          const nameX = centerX + recipeSwatchSize + 20;
          const textY = y + recipeSwatchSize/2;
          
          // Draw text background
          ctx.fillStyle = '#f8f8f8';
          ctx.beginPath();
          ctx.roundRect(nameX - 10, textY - 30, 200, 60, 8);
          ctx.fill();
          
          // Add color name and percentage
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'left';
          ctx.font = 'bold 22px Arial';
          ctx.fillText(color.name, nameX, textY - 8);
          
          ctx.font = '20px Arial';
          ctx.fillText(`${color.percentage}%`, nameX, textY + 20);
        });

        // Add date at the bottom
        ctx.font = '18px Arial';
        ctx.fillStyle = '#666666';
        ctx.textAlign = 'center';
        ctx.fillText(`Created: ${new Date(mix.createdAt).toLocaleDateString()}`, canvas.width/2, canvas.height - 40);

        // Convert canvas to image and download
        const imageData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `color-mix-${mix.id}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    toast({
      title: "Image downloaded",
      description: "The color mix image has been saved to your device.",
    });
  };

  if (savedMixes.length === 0) {
    return null;
  }

  return (
    <div className="bg-background rounded-lg border mb-4">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-base"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Saved Mixes</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <ScrollArea className="h-[120px]">
          <div className="px-4 pb-3 space-y-2">
            {savedMixes.map((mix) => (
              <div 
                key={mix.id} 
                className="flex items-center gap-2 py-1"
              >
                <div 
                  className="flex gap-1 cursor-pointer"
                  onClick={() => onSelectMix(mix.targetColor)}
                >
                  {mix.imageData ? (
                    <img 
                      src={mix.imageData} 
                      alt="Color mix" 
                      className="w-8 h-8 rounded-sm object-cover"
                    />
                  ) : (
                    <>
                      <div 
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: mix.targetColor }}
                        title="Target color"
                      />
                      <div 
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: mix.mixedColor }}
                        title="Mixed result"
                      />
                    </>
                  )}
                </div>
                
                <div className="flex-1 text-sm text-muted-foreground">
                  {mix.colorMix.map((color, idx) => (
                    <span key={idx}>
                      {color.name} {color.percentage}%
                      {idx < mix.colorMix.length - 1 && ' · '}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadMix(mix)}
                    className="h-6 w-6"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteMix(mix.id)}
                    className="h-6 w-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default SavedMixes;
