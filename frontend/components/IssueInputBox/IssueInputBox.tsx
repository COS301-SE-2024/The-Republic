"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Dropdown from "@/components/Dropdown/Dropdown";
import { MapPin } from 'lucide-react';
import { Image as LucideImage } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/globals';



// TODO: Add emojies to options

const categoryOptions = {
  group: 'Categories',
  items: [
    { value: 'Healthcare Services', label: 'Healthcare Services' },
    { value: 'Public Safety', label: 'Public Safety' },
    { value: 'Water', label: 'Water' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Electricity', label: 'Electricity' },
    { value: 'Sanitation', label: 'Sanitation' },
    { value: 'Social Services', label: 'Social Services' },
    { value: 'Administrative Services', label: 'Administrative Services' },
  ],
};

const moodOptions = {
  group: 'Moods',
  items: [
    { value: 'Concerned', label: 'Concerned' },
    { value: 'Angry', label: 'Angry' },
    { value: 'Sad', label: 'Sad' },
    { value: 'Happy', label: 'Happy' }
  ],
};



const IssueInputBox = () => {
  // const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const handleIssueSubmit = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error || data.session == null) {
      toast({
          description: "You need to be logged in to post",
      });

      return;
    }

    // TODO: Get category ID and time backend
    const res = await fetch("http://localhost:8080/api/issues", {
      method: "POST",
      body: JSON.stringify({
          user_id: data.session!.user.id,
          category_id: 1,
          content,
          sentiment: mood,
          is_anonymous: isAnonymous,
          created_at: new Date().toISOString(),
      }),
      headers: {
        "Content-Type": "application/json",
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

      toast({
          description: "Post successful",
      });
    }
  };

  return (
    <Card className="mb-4 w-full bg-background border-primary rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="pr-2">
            <Avatar>
              <AvatarImage src="https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <Input
            type="text"
            placeholder="What's going on!?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow mr-4"
          />
          <Button onClick={handleIssueSubmit} disabled={!content}>
            Post
          </Button>
        </div>
      </CardContent>
      <CardFooter className="">
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
          <div className="mx-2">
            <MapPin />
          </div>
          <div className="mx-2">
            <LucideImage />
          </div>
          <div className="mx-2">
            <Checkbox checked={isAnonymous} onCheckedChange={(state) => setIsAnonymous(state as boolean)}/>
            <label 
            htmlFor="anon"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 p-2">
              Anonymous
            </label>
          </div>
      </CardFooter>
    </Card>
  );
};

export default IssueInputBox;
