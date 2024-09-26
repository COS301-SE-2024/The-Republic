import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Issue from '@/components/Issue/Issue';
import { Issue as IssueType } from "@/lib/types";

export interface RelatedIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: IssueType[];

}

const RelatedIssuesModal: React.FC<RelatedIssuesModalProps> = ({ isOpen, onClose, issues }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Related Issues</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {issues.map((issue, index) => (
            <Issue
              key={index}
              issue={issue}
              id={`related-${index}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelatedIssuesModal;
