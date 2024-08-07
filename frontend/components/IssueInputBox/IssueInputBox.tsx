"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import TextareaAutosize from "react-textarea-autosize";
import { categoryOptions, moodOptions } from "@/lib/constants";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Loader2, Image as LucideImage, X, MapPin } from "lucide-react";
import { LocationType, IssueInputBoxProps } from "@/lib/types";
import Image from "next/image";
import { checkImageFileAndToast } from "@/lib/utils";
import { useUser } from "@/lib/contexts/UserContext";
import { checkContentAppropriateness } from "@/lib/api/checkContentAppropriateness";
import CircularProgress from "../CircularProgressBar/CircularProgressBar";
import LocationModal from "@/components/LocationModal/LocationModal";
import { fetchUserLocation } from "@/lib/api/fetchUserLocation";

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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

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

  useEffect(() => {
    const loadUserLocation = async () => {
      if (user && user.location_id) {
        try {
          const userLocation = await fetchUserLocation(user.location_id);
          if (userLocation) {
            setLocation(userLocation);
          }
        } catch (error) {
          console.error("Failed to fetch user location:", error);
        }
      }
    };

    loadUserLocation();
  }, [user]);

  const handleLocationSet = (newLocation: LocationType) => {
    setLocation(newLocation);
    setIsLocationModalOpen(false);
  };

  const handleIssueSubmit = async () => {
    const validationChecks = [
      {
        check: !user,
        message: "You need to be logged in to post",
        variant: "destructive",
      },
      {
        check: !category,
        message: "Please select a category.",
        variant: "destructive",
      },
      {
        check: !mood,
        message: "Please select a mood.",
        variant: "destructive",
      },
      {
        check: !location,
        message: "Please set a location.",
        variant: "destructive",
      },
    ];

    for (const { check, message, variant = "default" } of validationChecks) {
      if (check) {
        toast({
          variant: variant as
            | "default"
            | "destructive"
            | "success"
            | "warning"
            | null
            | undefined,
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
    requestBody.append("user_id", user?.user_id || "");
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
        <div className="flex flex-col sm:flex-row items-start">
          {user && (
            <div className="pr-2 mb-2 sm:mb-0">
              <Avatar>
                <AvatarImage src={user.image_url} />
                <AvatarFallback>{user.fullname[0]}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="flex-grow w-full">
            <TextareaAutosize
              placeholder="What's going on!?"
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
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex flex-wrap items-center space-x-2 space-y-2 sm:space-y-0">
          <Dropdown
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            placeholder="Select category..."
            className="w-full sm:w-40 mb-2 sm:mb-0"
          />
          <Dropdown
            options={moodOptions}
            value={mood}
            onChange={setMood}
            placeholder="😟"
            className="w-full sm:w-36"
            showSearch={false}
            compact={true}
          />
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center w-full sm:w-auto"
            onClick={() => setIsLocationModalOpen(true)}
          >
            <MapPin className="w-4 h-4 mr-1" />
            {location ? location.value.suburb : 'Set Location'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => fileInputRef.current?.click()}
          >
            <LucideImage className="w-4 h-4" />
          </Button>
          <div className="flex items-center w-full sm:w-auto">
            <Checkbox
              id="anon"
              checked={isAnonymous}
              onCheckedChange={(state) => setIsAnonymous(state as boolean)}
            />
            <label htmlFor="anon" className="text-sm ml-2">
              Anonymous
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <CircularProgress charCount={charCount} />
          <Button
            onClick={handleIssueSubmit}
            disabled={charCount > MAX_CHAR_COUNT || !content}
            className="w-full sm:w-auto"
          >
            Post
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </CardFooter>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSet={handleLocationSet}
        defaultLocation={location}
      />
    </Card>
  );
};

export default IssueInputBox;
