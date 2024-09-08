import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Organization } from '@/lib/types';
import Image from 'next/image';

interface CreateOrganizationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newOrg: FormData) => Promise<Organization>;
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [joinPolicy, setJoinPolicy] = useState<'open' | 'request' | 'closed'>('open');
  const [orgType, setOrgType] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form state when dialog is closed
      setName('');
      setUsername('');
      setDescription('');
      setWebsite('');
      setJoinPolicy('open');
      setOrgType('');
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!name || !username) {
      setError('Please enter an organization name and username.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('bio', description);
    formData.append('website_url', website);
    formData.append('join_policy', joinPolicy);
    formData.append('org_type', orgType);
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      await onCreate(formData);
      onClose();
    } catch (err) {
      setError('Failed to create organization. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website URL</label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="joinPolicy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Join Policy</label>
            <Select value={joinPolicy} onValueChange={(value: 'open' | 'request' | 'closed') => setJoinPolicy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select join policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="request">Request to Join</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="orgType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Type</label>
            <Select value={orgType} onValueChange={setOrgType}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="political">Political</SelectItem>
                <SelectItem value="npo">Non-Profit</SelectItem>
                <SelectItem value="governmental">Governmental</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Photo</label>
            <Input
              id="profilePhoto"
              type="file"
              onChange={handleProfilePhotoChange}
              accept="image/*"
            />
            {profilePhotoPreview && (
              <div className="mt-2">
                <Image
                  src={profilePhotoPreview}
                  alt="Profile photo preview"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </div>
            )}
          </div>
          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationForm;