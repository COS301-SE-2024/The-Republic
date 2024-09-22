import React, { useState, useRef, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TextareaAutosize from "react-textarea-autosize";
import debounce from 'lodash/debounce';

interface User {
  id: string;
  username: string;
  fullname: string;
  image_url: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const staticUsers: User[] = [
  { id: '1', username: 'hlokomani', fullname: 'Hlokomani Khondlo', image_url: 'https://example.com/johndoe.jpg' },
  { id: '2', username: 'mulisa', fullname: 'Mulisa Musehane', image_url: 'https://example.com/janesmith.jpg' },
  { id: '3', username: 'boitumelo', fullname: 'Boitumelo Segwane', image_url: 'https://example.com/bobross.jpg' },
  { id: '4', username: 'boipelo', fullname: 'Boipelo Madumo', image_url: 'https://example.com/alicegreen.jpg' },
  { id: '5', username: 'shama', fullname: 'Shama Ntenda', image_url: 'https://example.com/charliew.jpg' },
];

const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchUserSuggestions = useCallback((query: string): User[] => {
    return staticUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullname.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, []);

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      if (query.length > 0) {
        const fetchedSuggestions = fetchUserSuggestions(query);
        setSuggestions(fetchedSuggestions);
        setShowSuggestions(fetchedSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    [fetchUserSuggestions]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart;
    onChange(newValue);
    setCursorPosition(newCursorPosition);

    const lastAtSymbolIndex = newValue.lastIndexOf('@', newCursorPosition);
    if (lastAtSymbolIndex !== -1 && lastAtSymbolIndex < newCursorPosition) {
      const query = newValue.slice(lastAtSymbolIndex + 1, newCursorPosition);
      debouncedFetchSuggestions(query);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (username: string) => {
    const beforeMention = value.slice(0, value.lastIndexOf('@', cursorPosition));
    const afterMention = value.slice(cursorPosition);
    const newValue = `${beforeMention}@${username} ${afterMention}`;
    onChange(newValue);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const highlightMentions = (text: string) => {
    return text.replace(/@(\w+)/g, '<span class="text-primary font-semibold">@$1</span>');
  };

  return (
    <div className="relative">
      <TextareaAutosize
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        className={`w-full p-2 border rounded resize-none bg-transparent text-foreground ${className}`}
        placeholder={placeholder}
      />
      <div
        className="absolute top-0 left-0 w-full h-full p-2 pointer-events-none text-foreground"
        dangerouslySetInnerHTML={{ __html: highlightMentions(value) }}
      />
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded shadow-lg dark:shadow-gray-800">
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleSuggestionClick(user.username)}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={user.image_url} alt={user.username} />
                <AvatarFallback>{user.fullname[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{user.username}</span>
              <span className="ml-2 text-muted-foreground">{user.fullname}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;