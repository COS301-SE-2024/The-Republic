import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { Check, Loader2, Search, Upload, X } from "lucide-react";
import Image from 'next/image';
import { Organization, UserSearchResult } from "@/lib/types";
import { getOrganizations } from '@/lib/api/getOrganizations';
import { useUser } from "@/lib/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { debounce } from 'lodash';
import { searchForUser } from '@/lib/api/searchForUser';
import { useToast } from '../ui/use-toast';

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSelfResolution: boolean;
  onSubmit: (resolutionData: {
    resolutionText: string;
    proofImage: File | null;
    resolutionSource: 'self' | 'unknown' | 'other';
    resolvedBy?: string;
    resolverId?: string;
    organizationIds?: string[];
  }) => void;
  isLoading: boolean;
}

interface OrganizationToggleProps {
  organization: Organization;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const OrganizationToggle: React.FC<OrganizationToggleProps> = ({ organization, isSelected, onToggle }) => {
  const { theme } = useTheme();

  return (
    <Toggle
      pressed={isSelected}
      onPressedChange={() => onToggle(organization.id)}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-md",
        "w-24 h-24 border-2",
        isSelected ? "border-primary bg-primary/10" : "border-gray-200",
        theme === 'dark'
          ? "hover:bg-[#0C0A09] hover:text-white"
          : "hover:bg-gray-100",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <Avatar className="w-12 h-12 mb-2">
        <AvatarImage src={organization.profile_photo} alt={organization.name} />
        <AvatarFallback>{organization.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-xs text-center line-clamp-2">{organization.name}</span>
    </Toggle>
  );
};


const ResolutionModal: React.FC<ResolutionModalProps> = ({
  isOpen,
  onClose,
  isSelfResolution,
  onSubmit,
  isLoading,
}) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [resolutionText, setResolutionText] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resolutionSource, setResolutionSource] = useState<'self' | 'user' | 'unknown' | 'other'>(
    isSelfResolution ? 'self' : 'unknown'
  );
  const [resolvedBy, setResolvedBy] = useState('');
  const [resolverId, setResolverID] = useState<string>();
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<Organization[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchUserOrganizations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    setResolutionSource(isSelfResolution ? 'self' : 'unknown');
  }, [isSelfResolution]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUserOrganizations = async () => {
    try {
      if (user) {
        const result = await getOrganizations(user);
        const userOrgs = result.data.filter(org => org.isMember);
        setUserOrganizations(userOrgs);
      } else {
        setUserOrganizations([]);
      }
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      setError("Failed to fetch user organizations");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalResolutionSource = isSelfResolution ? 'self' : resolutionSource;

    if (resolutionSource === "other" && !resolverId) {
      toast({
        description: 
          "Please specify who resolved the issue " + 
          "or set the resolution type to 'I don't know who fixed it'"
      });

      return;
    }

    onSubmit({
      resolutionText,
      proofImage,
      resolutionSource: finalResolutionSource as 'self' | 'unknown' | 'other',
      resolvedBy: finalResolutionSource === 'other' ? resolvedBy : undefined,
      resolverId,
      organizationIds: selectedOrganization ? [selectedOrganization] : undefined,
    });
  };

  const resetForm = () => {
    setResolutionText('');
    setProofImage(null);
    setImagePreview(null);
    setResolutionSource(isSelfResolution ? 'self' : 'unknown');
    setResolvedBy('');
    setSelectedOrganization(null);
    setSearchResults([]);
    setSearchQuery('');
    setError(null);
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

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (resolutionSource === 'other' && query.length > 0) {
        try {
          const result = await searchForUser({ name: query });
          setSearchResults(result);
          setIsSearchOpen(true);
        } catch (error) {
          console.error("Error during search:", error);
          setError("Failed to perform search");
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
  }, 500), [resolutionSource]);

  const toggleOrganization = (orgId: string) => {
    setSelectedOrganization(prev => prev === orgId ? null : orgId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className={cn("bg-card")}>
        <DialogHeader>
          <DialogTitle>Resolve Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          
          {!isSelfResolution && (
            <RadioGroup
              value={resolutionSource}
              onValueChange={(value: 'user' | 'unknown' | 'other') => setResolutionSource(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user">I fixed the issue</Label>
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
            <div className="relative" ref={searchRef}>
              <Label htmlFor="resolvedBy">Resolved By</Label>
              <div className='relative'>
                <Input
                  id="resolvedBy"
                  placeholder="Search for organization or user..."
                  value={searchQuery}
                  onChange={(e) => {
                    setResolverID(undefined);
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full pr-10"
                />
                <div className='absolute right-2 top-[50%] -translate-y-[50%]'>
                  {resolverId 
                    ? <Check className='text-green-300'/>
                    : <Search className='text-gray-300'/>
                  }
                </div>
              </div>
              {isSearchOpen && searchResults.length > 0 && (
  <div className={cn(
    "absolute z-10 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto",
    theme === "dark" 
      ? "bg-[#262626] border-gray-700" 
      : "bg-white border-gray-200"
  )}>
    {searchResults.map((item) => (
      <div
        key={item.id}
        className={cn(
          "px-4 py-2 cursor-pointer",
          theme === "dark"
            ? "hover:bg-[#404040] text-white"
            : "hover:bg-gray-100 text-foreground"
        )}
        onClick={() => {
          setResolvedBy(item.name);
          setResolverID(item.id);
          setSearchQuery(item.name);
          setIsSearchOpen(false);
        }}
      >
        <span className="font-medium">
          {item.name}
        </span>
        <span className={cn(
          "ml-2 text-sm",
          theme === "dark" ? "text-gray-400" : "text-muted-foreground"
        )}>
          @{item.username}
        </span>
        <span className={cn(
          "px-2 rounded absolute right-2",
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        )}>
          {item.type}
        </span>
      </div>
    ))}
  </div>
)}
            </div>
          )}

          {(resolutionSource === 'self' || resolutionSource === 'user' || isSelfResolution) && (
            <div>
              <Label>Credit An Organization (optional)</Label>
              <p className="text-sm text-gray-500 mb-2">
                You can select the organization that you resolved this issue on behalf of. This helps with tracking and crediting efforts across your organization.
              </p>
              {userOrganizations.length > 0 ? (
                <div className="flex flex-row flex-wrap gap-2 mt-2">
                  {userOrganizations.map((org) => (
                    <TooltipProvider key={org.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <OrganizationToggle
                            organization={org}
                            isSelected={selectedOrganization === org.id}
                            onToggle={toggleOrganization}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to {selectedOrganization === org.id ? 'deselect' : 'select'} {org.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No organizations found.</p>
              )}
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

          <div>
            <Label htmlFor="proofImage">Proof Image (optional)</Label>
            <div className="mt-1 flex items-center">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  theme === "dark"
                    ? "bg-[#0C0A09] text-white hover:bg-[#262626]"
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Resolution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionModal;