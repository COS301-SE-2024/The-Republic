import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface TypedDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

const TypedDeleteConfirmation: React.FC<TypedDeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType
}) => {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = `delete ${itemName}`;

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === expectedText.toLowerCase()) {
      onConfirm();
      setConfirmText('');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemType}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            {itemName} {itemType.toLowerCase()} and all of its associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <p className="text-sm text-gray-500 mb-2">
            To confirm, type "delete {itemName}" below:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`delete ${itemName}`}
          />
        </div>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText.toLowerCase() !== expectedText.toLowerCase()}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TypedDeleteConfirmation;