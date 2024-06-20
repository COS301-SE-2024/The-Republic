"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import TextareaAutosize from 'react-textarea-autosize';
import CircularProgress from '../CircularProgressBar/CircularProgressBar';
import { categoryOptions, moodOptions } from '@/lib/constants';
import { supabase } from '@/lib/globals';
import LocationAutocomplete from '@/components/LocationAutocomplete/LocationAutocomplete';
import Dropdown from "@/components/Dropdown/Dropdown";
import { Image as LucideImage } from 'lucide-react';
import { LocationType } from '@/lib/types';

const MAX_CHAR_COUNT = 500;

interface IssueInputBoxProps {
  user: {
    user_id: string;
    email_address: string;
    username: string;
    fullname: string;
    image_url: string;
    bio: string;
    is_owner: boolean;
    total_issues: number;
    resolved_issues: number;
  } | null;
}

const IssueInputBox: React.FC<IssueInputBoxProps> = ({ user }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);
  const { toast } = useToast();

  const handleIssueSubmit = async () => {
    if (!user) {
      toast({
        description: "You need to be logged in to post",
      });
      return;
    }

    const isContentAppropriate = await checkContentAppropriateness(content);
    console.log(isContentAppropriate);
    if (!isContentAppropriate) {
      toast({
        variant: "destructive",
        description: "Please use appropriate language.",
      });
      return;
    }

    const categoryID = parseInt(category);
    const { data } = await supabase.auth.getSession();

    const requestBody = {
      category_id: categoryID,
      content,
      sentiment: mood,
      is_anonymous: isAnonymous,
      location_data: location ? location.value : {},
      created_at: new Date().toISOString(),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/create`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data.session!.access_token}`,
      },
    });

    if (!res.ok) {
      toast({
        variant: "destructive",
        description: "Failed to post, please try again"
      });
    } else {
      setContent("");
      setCategory("");
      setMood("");
      setIsAnonymous(false);
      setLocation(null);

      toast({
        description: "Post successful",
      });
      window.location.reload();
    }
  };

  const checkContentAppropriateness = async (text: string): Promise<boolean> => {
    const apiKey = process.env.NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_KEY as string;
    const url = process.env.NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_URL as string;

    const headers = {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "text/plain",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: text,
    });

    const result = await response.json();

    console.log(result);

    if (result.Terms && result.Terms.length > 0) {
      return false;
    }

    return true;
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
                <AvatarFallback>{user.fullname ? user.fullname[0] : ''}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <TextareaAutosize
            placeholder="What's going on!?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow mr-4 p-2 border rounded resize-none"
            maxRows={10}
            style={{ width: '100%' }}
          />
          <Button onClick={handleIssueSubmit} disabled={charCount > MAX_CHAR_COUNT || !content}>
            Post
          </Button>
        </div>
        {charCount > MAX_CHAR_COUNT && (
          <div className="text-red-500 mt-2">You are over the limit by {charCount - MAX_CHAR_COUNT} characters.</div>
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
        <LocationAutocomplete
          location={location}
          setLocation={setLocation}
        />
        <Button variant="ghost" size="sm" className="mx-2">
          <LucideImage />
        </Button>
        <div className="mx-2 flex items-center">
          <Checkbox checked={isAnonymous} onCheckedChange={(state) => setIsAnonymous(state as boolean)} />
          <label
            htmlFor="anon"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 p-2">
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