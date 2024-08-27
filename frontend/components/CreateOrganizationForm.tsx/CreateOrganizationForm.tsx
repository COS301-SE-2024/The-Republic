'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface CreateOrganizationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [website, setWebsite] = useState('');
  const [joinPolicy, setJoinPolicy] = useState('open');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const router = useRouter();

  const MAX_WORDS = 250;

  useEffect(() => {
    const words = description.trim().split(/\s+/);
    setWordCount(words.length);
  }, [description]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    const words = newDescription.trim().split(/\s+/);
    if (words.length <= MAX_WORDS) {
      setDescription(newDescription);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Please enter an organization name.');
      return;
    }

    try {
      // Here you would typically make an API call to create the organization
      console.log('Creating organization:', { name, description, joinPolicy, website, logo });
      setSuccess('Organization created successfully!');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the new organization's page (you'll need to implement this route)
      router.push(`/organization/${Math.floor(Math.random() * 1000)}`);
      onClose();
    } catch (err) {
      setError('Failed to create organization. Please try again.');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-auto">
          <Dialog.Title className="text-xl font-bold mb-4">Create New Organization</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description 
                {wordCount >= MAX_WORDS && (
                  <span className="text-red-500 ml-1">
                    (Word limit reached: {wordCount}/{MAX_WORDS})
                  </span>
                )}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                rows={3}
              ></textarea>
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Logo
              </label>
              <input
                type="file"
                id="logo"
                onChange={handleLogoChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website 
              </label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                pattern="https?://.*"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label htmlFor="joinPolicy" className="block text-sm font-medium text-gray-700">
                Join Policy
              </label>
              <select
                id="joinPolicy"
                value={joinPolicy}
                onChange={(e) => setJoinPolicy(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              >
                <option value="open">Open</option>
                <option value="request">Request to Join</option>
                <option value="invite">Invite Only</option>
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Organization
            </button>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 p-1" onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateOrganizationForm;
