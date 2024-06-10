"use client";

import React, { useState, useEffect } from 'react';
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
import { IssueInputBoxProps } from "@/lib/types";

const categoryOptions = {
  group: 'Categories',
  items: [
    { value: '1', label: 'Healthcare Services' },
    { value: '2', label: 'Public Safety' },
    { value: '3', label: 'Water' },
    { value: '4', label: 'Transportation' },
    { value: '5', label: 'Electricity' },
    { value: '6', label: 'Sanitation' },
    { value: '7', label: 'Social Services' },
    { value: '8', label: 'Administrative Services' },
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

const IssueInputBox: React.FC = () => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<IssueInputBoxProps['user']>(null);


  useEffect(() => {
    const setUserObject = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
    
        if (!(error || data.session == null)) {
          const { id, user_metadata: { fullname, avatar_url: image_url } } = data.session.user;
          setUser({ id, fullname, image_url });
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    setUserObject();

  }, []);

  const handleIssueSubmit = async () => {
    const categoryID = parseInt(category);
    if (!user) {
      toast({
        description: "You need to be logged in to post",
      });
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issueskkk`, {
      method: "POST",
      body: JSON.stringify({
          user_id: user.id,
          category_id: categoryID,
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
      window.location.reload();
    }
  };

  return (
    <Card className="mb-4 w-full bg-background border-primary rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center">
          {user && (
            <div className="pr-2">
              <Avatar>
                <AvatarImage src={user.image_url  || '/default.png' } />
                <AvatarFallback>{user.fullname}</AvatarFallback>
              </Avatar>
            </div>
          )}
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
