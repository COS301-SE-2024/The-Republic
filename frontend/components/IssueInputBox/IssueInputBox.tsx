"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Dropdown from "@/components/Dropdown/Dropdown"
import { MapPin } from 'lucide-react';
import { Image } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"



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
    { value: 'concerned', label: 'Concerned' },
    { value: 'angry', label: 'Angry' },
    { value: 'sad', label: 'Sad' },
    { value: 'happy', label: 'Happy' }
  ],
};



const IssueInputBox = () => {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");

  const handleIssueSubmit = () => {
    console.log('Posting:', content);
    setContent('');
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
            <Image />
          </div>
          <div className="mx-2">
            <Checkbox className=""/>
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
