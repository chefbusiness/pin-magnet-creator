
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StyleTag } from '@/data/nicheStyleTags';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleTagSelectorProps {
  availableTags: StyleTag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  nicheName: string;
}

export const StyleTagSelector = ({ 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  nicheName 
}: StyleTagSelectorProps) => {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="w-5 h-5 text-primary" />
          Estilo Visual
        </CardTitle>
        <CardDescription>
          Selecciona los estilos que mejor representen tu visión para {nicheName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "relative p-3 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="font-medium text-sm">{tag.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {tag.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Estilos seleccionados:</div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagId) => {
                const tag = availableTags.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
