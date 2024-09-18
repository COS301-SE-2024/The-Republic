import React, { useState, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  fullname: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const staticUsers: User[] = [
  { id: '1', username: 'hlokomani', fullname: 'Hlokomani Khondlo' },
  { id: '2', username: 'mulisa', fullname: 'Mulisa Musehane' },
  { id: '3', username: 'boitumelo', fullname: 'Boitumelo Segwane' },
  { id: '4', username: 'boipelo', fullname: 'Boipelo Madumo' },
  { id: '5', username: 'shama', fullname: 'Shama Ntenda' },
];

const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchUserSuggestions = useCallback((query: string): User[] => {
    return staticUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullname.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const lastAtSymbolIndex = newValue.lastIndexOf('@');
    if (lastAtSymbolIndex !== -1) {
      const query = newValue.slice(lastAtSymbolIndex + 1);
      const fetchedSuggestions = fetchUserSuggestions(query);
      setSuggestions(fetchedSuggestions);
      setShowSuggestions(fetchedSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleInputChange}
        className={`w-full p-2 border rounded resize-none ${className}`}
        placeholder={placeholder}
      />
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {suggestions.map((user) => (
            <div key={user.id} className="p-2 cursor-pointer hover:bg-gray-100">
              <span className="font-medium">{user.username}</span>
              <span className="ml-2 text-gray-500">{user.fullname}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;