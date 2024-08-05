import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import Image from 'next/image';

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSelfResolution: boolean;
  onSubmit: (resolutionData: {
    resolutionText: string;
    proofImage: File | null;
    resolutionSource: 'self' | 'unknown' | 'other';
    resolvedBy?: string;
    politicalAssociation?: string;
    stateEntityAssociation?: string;
  }) => void;
}

const ResolutionModal: React.FC<ResolutionModalProps> = ({
  isOpen,
  onClose,
  isSelfResolution,
  onSubmit,
}) => {
  const [resolutionText, setResolutionText] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resolutionSource, setResolutionSource] = useState<'self' | 'unknown' | 'other'>(
    isSelfResolution ? 'self' : 'unknown'
  );
  const [resolvedBy, setResolvedBy] = useState('');
  const [politicalAssociation, setPoliticalAssociation] = useState('');
  const [stateEntityAssociation, setStateEntityAssociation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      resolutionText,
      proofImage,
      resolutionSource,
      resolvedBy: resolutionSource === 'other' ? resolvedBy : undefined,
      politicalAssociation: !isSelfResolution ? politicalAssociation : undefined,
      stateEntityAssociation: !isSelfResolution ? stateEntityAssociation : undefined,
    });
    resetForm();
  };

  const resetForm = () => {
    setResolutionText('');
    setProofImage(null);
    setImagePreview(null);
    setResolutionSource(isSelfResolution ? 'self' : 'unknown');
    setResolvedBy('');
    setPoliticalAssociation('');
    setStateEntityAssociation('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProofImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className={cn(
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      )}>
        <DialogHeader>
          <DialogTitle>Resolve Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSelfResolution && (
            <RadioGroup
              value={resolutionSource}
              onValueChange={(value: 'self' | 'unknown' | 'other') => setResolutionSource(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self">I fixed the issue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="unknown" />
                <Label htmlFor="unknown">I don't know who fixed it</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">It was fixed by someone else</Label>
              </div>
            </RadioGroup>
          )}

          {resolutionSource === 'other' && (
            <div>
              <Label htmlFor="resolvedBy">Resolved By</Label>
              <Input
                id="resolvedBy"
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                placeholder="Who resolved the issue?"
              />
            </div>
          )}

          <div>
            <Label htmlFor="resolutionText">Resolution Details</Label>
            <Textarea
              id="resolutionText"
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="Provide more information about the resolution..."
              rows={4}
            />
          </div>

          {!isSelfResolution && (
            <>
              <div>
                <Label htmlFor="politicalAssociation">Political Association (optional)</Label>
                <Input
                  id="politicalAssociation"
                  value={politicalAssociation}
                  onChange={(e) => setPoliticalAssociation(e.target.value)}
                  placeholder="Political association (if any)"
                />
              </div>

              <div>
                <Label htmlFor="stateEntityAssociation">State Entity Association (optional)</Label>
                <Input
                  id="stateEntityAssociation"
                  value={stateEntityAssociation}
                  onChange={(e) => setStateEntityAssociation(e.target.value)}
                  placeholder="State entity association (if any)"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="proofImage">Proof Image (optional)</Label>
            <div className="mt-1 flex items-center">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                )}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <Input
                id="proofImage"
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {imagePreview && (
              <div className="mt-2 relative">
                <Image
                  src={imagePreview}
                  alt="Proof Image"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <Button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                  title="Remove Image"
                >
                  <X className="w-4 h-4 text-white" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Resolution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionModal;