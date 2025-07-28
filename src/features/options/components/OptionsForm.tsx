import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { useOptions } from '../hooks/useOptions';
import { DocagramOptions } from '../Options';
import { toast } from '@/hooks/use-toast';

export function OptionsForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { options, saveOptions, resetToDefaults } = useOptions();
  
  useEffect(() => {
    if (formRef.current) {
      // Update form values when options change
      const form = formRef.current;
      Object.entries(options).forEach(([key, value]) => {
        const element = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
        if (element) {
          element.value = value.toString();
        }
      });
    }
  }, [options]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newOptions: Partial<DocagramOptions> = {
      temperature: parseFloat(formData.get('temperature') as string),
      topK: parseInt(formData.get('topK') as string),
      minimumEntityCount: parseInt(formData.get('minimumEntityCount') as string),
      chunkSize: parseInt(formData.get('chunkSize') as string),
      systemPrompt: formData.get('systemPrompt') as string,
    };
    
    try {
      await saveOptions(newOptions);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefaults();
      toast({
        title: "Settings reset",
        description: "All settings have been restored to their default values.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Docagram Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (0.0 - 1.0)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              min="0"
              max="1"
              defaultValue={options.temperature}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topK">Top K</Label>
            <Input
              id="topK"
              name="topK"
              type="number"
              min="1"
              defaultValue={options.topK}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumEntityCount">Minimum Entity Count</Label>
            <Input
              id="minimumEntityCount"
              name="minimumEntityCount"
              type="number"
              min="1"
              defaultValue={options.minimumEntityCount}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chunkSize">Chunk Size</Label>
            <Input
              id="chunkSize"
              name="chunkSize"
              type="number"
              min="100"
              defaultValue={options.chunkSize}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              name="systemPrompt"
              rows={4}
              defaultValue={options.systemPrompt}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit">Save Settings</Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Reset to Defaults</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all settings to their default values. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

