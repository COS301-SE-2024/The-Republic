import React, { useState, useRef, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TextareaAutosize from "react-textarea-autosize";
import debounce from 'lodash/debounce';
import { UserSearchResult } from '@/lib/types';
import { searchForUser } from '@/lib/api/searchForUser';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedFetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length > 0) {
        const fetchedSuggestions = await searchForUser({ username: query });
        setSuggestions(fetchedSuggestions);
        setShowSuggestions(fetchedSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
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

  return (
    <div className="relative">
      <TextareaAutosize
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        className={`w-full p-2 border rounded resize-none bg-transparent text-foreground ${className}`}
        placeholder={placeholder}
        style={{ caretColor: 'auto' }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full p-2 pointer-events-none text-transparent"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {value.split(/(@\w+)/).map((part, index) => (
          part.startsWith('@') ? 
            <span key={index} className="text-primary font-semibold">{part}</span> : 
            <span key={index}>{part}</span>
        ))}
      </div>
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
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{user.username}</span>
              <span className="ml-2 text-muted-foreground">{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;
