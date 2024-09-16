import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import TextareaAutosize from "react-textarea-autosize";
import { Loader2, Image as LucideImage, X } from "lucide-react";
import { Organization, OrganizationPost } from '@/lib/types';
import Image from "next/image";
import { checkImageFileAndToast } from "@/lib/utils";
import { useUser } from "@/lib/contexts/UserContext";
import { createOrganizationPost } from '@/lib/api/createOrganizationPost';
import CircularProgress from "@/components/CircularProgressBar/CircularProgressBar";

const MAX_CHAR_COUNT = 300;

interface CreateOrgPostProps {
  organization: Organization;
  onPostCreated: (newPost: OrganizationPost) => void;
}

const CreateOrgPost: React.FC<CreateOrgPostProps> = ({ organization, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const handleCreatePost = async () => {
    if (!user || !content.trim()) return;
    setIsLoading(true);

    try {
      if (image && !(await checkImageFileAndToast(image, toast))) {
        setIsLoading(false);
        return;
      }

      const newPost = await createOrganizationPost(user, organization.id, content, image || undefined);
      onPostCreated(newPost);
      setContent("");
      setImage(null);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const charCount = content.length;

  return (
    <Card className="mb-4 w-full bg-background border-primary rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <Avatar className="mr-2">
            <AvatarImage src={organization.profile_photo} />
            <AvatarFallback>{organization.name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{organization.name}</span>
        </div>
        <div className="flex-grow w-full">
          <TextareaAutosize
            placeholder="What's new with the organization?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded resize-none"
            maxRows={10}
          />
          {image && (
            <div className="relative w-full h-48 mt-2">
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white bg-opacity-70"
                onClick={removeImage}
              >
                <X />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <CircularProgress charCount={charCount} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <LucideImage className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={handleCreatePost}
          disabled={charCount > MAX_CHAR_COUNT || !content || isLoading}
        >
          Post
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </CardFooter>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </Card>
  );
};

export default CreateOrgPost;