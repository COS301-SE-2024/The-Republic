// MobileIssueInput.tsx
import React, { useEffect } from 'react';
import IssueInputBox from '@/components/IssueInputBox/IssueInputBox';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Issue as IssueType } from "@/lib/types";

interface MobileIssueInputProps {
  onClose: () => void;
  onAddIssue: (issue: IssueType) => void;
}

const MobileIssueInput: React.FC<MobileIssueInputProps> = ({ onClose, onAddIssue }) => {
  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  }, []);

  const handleAddIssue = (issue: IssueType) => {
    onAddIssue(issue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 p-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      <div className="mt-12">
        <IssueInputBox onAddIssue={handleAddIssue} />
      </div>
    </div>
  );
};

export default MobileIssueInput;