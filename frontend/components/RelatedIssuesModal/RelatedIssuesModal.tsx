import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Issue from '@/components/Issue/Issue';
import { IssueProps } from "@/lib/types";

interface RelatedIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  relatedIssues: IssueProps['issue'][];
}

const RelatedIssuesModal: React.FC<RelatedIssuesModalProps> = ({ isOpen, onClose, relatedIssues }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Related Issues</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {relatedIssues.map((issue) => (
            <Issue
              key={issue.issue_id}
              issue={issue}
              id={`related-${issue.issue_id}`}
              onDeleteIssue={() => {}}
              onResolveIssue={() => {}}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelatedIssuesModal;