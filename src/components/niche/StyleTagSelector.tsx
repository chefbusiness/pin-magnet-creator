
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StyleTag, TrendTag } from '@/data/nicheStyleTags';
import { Palette, TrendingUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleTagSelectorProps {
  availableStyleTags: StyleTag[];
  availableTrendTags: TrendTag[];
  selectedStyleTags: string[];
  selectedTrendTags: string[];
  onStyleTagsChange: (tags: string[]) => void;
  onTrendTagsChange: (tags: string[]) => void;
  nicheName: string;
  hideIllustration?: boolean;
}

export const StyleTagSelector = ({ 
  availableStyleTags,
  availableTrendTags,
  selectedStyleTags,
  selectedTrendTags,
  onStyleTagsChange,
  onTrendTagsChange,
  nicheName,
  hideIllustration = false
}: StyleTagSelectorProps) => {
  // Filter out illustration style if hideIllustration is true
  const filteredStyleTags = hideIllustration 
    ? availableStyleTags.filter(tag => tag.id !== 'illustration-style')
    : availableStyleTags;

  const toggleStyleTag = (tagId: string) => {
    if (selectedStyleTags.includes(tagId)) {
      onStyleTagsChange(selectedStyleTags.filter(id => id !== tagId));
    } else {
      onStyleTagsChange([...selectedStyleTags, tagId]);
    }
  };

  const toggleTrendTag = (tagId: string) => {
    if (selectedTrendTags.includes(tagId)) {
      onTrendTagsChange(selectedTrendTags.filter(id => id !== tagId));
    } else {
      onTrendTagsChange([...selectedTrendTags, tagId]);
    }
  };

  const TagButton = ({ 
    tag, 
    isSelected, 
    onToggle 
  }: { 
    tag: StyleTag | TrendTag; 
    isSelected: boolean; 
    onToggle: () => void; 
  }) => (
    <button
      onClick={onToggle}
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

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="w-5 h-5 text-primary" />
          Personalización Visual
        </CardTitle>
        <CardDescription>
          Selecciona el estilo visual y las tendencias para {nicheName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Estilo Visual
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tendencias Pinterest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="mt-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Elige el tipo de imagen que mejor represente tu contenido
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredStyleTags.map((tag) => (
                  <TagButton
                    key={tag.id}
                    tag={tag}
                    isSelected={selectedStyleTags.includes(tag.id)}
                    onToggle={() => toggleStyleTag(tag.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Selecciona las tendencias populares de Pinterest que quieres incluir
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableTrendTags.map((tag) => (
                  <TagButton
                    key={tag.id}
                    tag={tag}
                    isSelected={selectedTrendTags.includes(tag.id)}
                    onToggle={() => toggleTrendTag(tag.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {(selectedStyleTags.length > 0 || selectedTrendTags.length > 0) && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Selección actual:</div>
            <div className="flex flex-wrap gap-2">
              {selectedStyleTags.map((tagId) => {
                const tag = filteredStyleTags.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="default" className="text-xs">
                    <Palette className="w-3 h-3 mr-1" />
                    {tag.name}
                  </Badge>
                ) : null;
              })}
              {selectedTrendTags.map((tagId) => {
                const tag = availableTrendTags.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
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

const TagButton = ({ 
  tag, 
  isSelected, 
  onToggle 
}: { 
  tag: StyleTag | TrendTag; 
  isSelected: boolean; 
  onToggle: () => void; 
}) => (
  <button
    onClick={onToggle}
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
