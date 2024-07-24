"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import TextareaAutosize from "react-textarea-autosize";
import { categoryOptions, moodOptions } from "@/lib/constants";
import LocationAutocomplete from "@/components/LocationAutocomplete/LocationAutocomplete";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Loader2, Image as LucideImage, X } from "lucide-react";
import { LocationType, IssueInputBoxProps } from "@/lib/types";
import Image from "next/image";
import { checkImageFileAndToast } from "@/lib/utils";
import { useUser } from "@/lib/contexts/UserContext";
import { checkContentAppropriateness } from "@/lib/api/checkContentAppropriateness";
import CircularProgress from "../CircularProgressBar/CircularProgressBar";

const MAX_CHAR_COUNT = 500;

const IssueInputBox: React.FC<IssueInputBoxProps>  = ({ onAddIssue }) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  // This should be intergrated as described in the comment for mutations in Issue.tsx
  /* const mutation = useMutation({
    mutationFn: async () => {
      if (user) {
        return await createIssue(user as UserAlt, ...otherParamaters);
      } else {
        toast({
          description: "You need to be logged in to delete a comment",
        });
      }
    },
    onSuccess: (issue) => {
      setContent("");
      setCategory("");
      setMood("");
      setIsAnonymous(false);
      setLocation(null);
      setImage(null);

      toast({
        description: "Post successful",
      });

      onAddIssue(issue);
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to post, please try again",
      });
    },
  }); */

  const handleIssueSubmit = async () => {
    const validationChecks = [
      { check: !user, message: "You need to be logged in to post", variant: "destructive" },
      { check: !category, message: "Please select a category.", variant: "destructive" },
      { check: !mood, message: "Please select a mood.", variant: "destructive" },
      { check: !location, message: "Please set a location.", variant: "destructive" },
    ];

    for (const { check, message, variant = "default" } of validationChecks) {
      if (check) {
        toast({
          variant: variant as "default" | "destructive" | "success" | "warning" | null | undefined,
          description: message,
        });
        return;
      }
    }

    setIsLoading(true);

    const isContentAppropriate = await checkContentAppropriateness(content);

    if (!isContentAppropriate) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: "Please use appropriate language.",
      });
      return;
    }

    if (image && !(await checkImageFileAndToast(image, toast))) {
      setIsLoading(false);
      return;
    }

    const categoryID = parseInt(category);

    const requestBody = new FormData();
    requestBody.append("category_id", categoryID.toString());
    requestBody.append("content", content);
    requestBody.append("sentiment", mood);
    requestBody.append("is_anonymous", isAnonymous.toString());
    requestBody.append(
      "location_data",
      JSON.stringify(location ? location.value : {}),
    );
    requestBody.append("created_at", new Date().toISOString());
    requestBody.append("user_id", user.user_id);
    if (image) {
      requestBody.append("image", image);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/create`,
      {
        method: "POST",
        body: requestBody,
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );

    if (!res.ok) {
      toast({
        variant: "destructive",
        description: "Failed to post, please try again",
      });
    } else {
      setContent("");
      setCategory("");
      setMood("");
      setIsAnonymous(false);
      setLocation(null);
      setImage(null);

      toast({
        description: "Post successful",
      });

      const apiResponse = await res.json();
      onAddIssue(apiResponse.data);
    }

    setIsLoading(false);
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
    <Card className="mb-4 w-full bg-background border-primary rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center">
          {user && (
            <div className="pr-2">
              <Avatar>
                <AvatarImage src={user.image_url} />
                <AvatarFallback>{user.fullname[0]}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <TextareaAutosize
            placeholder="What's going on!?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow mr-4 p-2 border rounded resize-none"
            maxRows={10}
            style={{ width: "100%" }}
          />
          <Button
            onClick={handleIssueSubmit}
            disabled={charCount > MAX_CHAR_COUNT || !content}
          >
            Post
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin text-white"/>}
          </Button>
        </div>
        {charCount > MAX_CHAR_COUNT && (
          <div className="text-red-500 mt-2">
            You are over the limit by {charCount - MAX_CHAR_COUNT} characters.
          </div>
        )}
      </CardContent>
      <CardFooter className="relative">
        <Dropdown
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          placeholder="Select category..."
        />
        <Dropdown
          options={moodOptions}
          value={mood}
          onChange={setMood}
          placeholder="Mood"
        />
        <LocationAutocomplete location={location} setLocation={setLocation} />
        <Button
          variant="ghost"
          size="sm"
          className="mx-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <LucideImage />
        </Button>
        {image && (
          <div className="relative w-32 h-32">
            <Image
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              fill
              objectFit="cover"
              className="rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0"
              onClick={removeImage}
            >
              <X />
            </Button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <div className="mx-2 flex items-center">
          <Checkbox
            checked={isAnonymous}
            onCheckedChange={(state) => setIsAnonymous(state as boolean)}
          />
          <label
            htmlFor="anon"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 p-2"
          >
            Anonymous
          </label>
        </div>
        <div className="absolute bottom-2 right-0 m-4">
          <CircularProgress charCount={charCount} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default IssueInputBox;
