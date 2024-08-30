'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Organization } from '../../lib/types';

interface CreateOrganizationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newOrg: Organization) => void;
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [website, setWebsite] = useState('');
  const [joinPolicy, setJoinPolicy] = useState<'open' | 'request' | 'invite'>('open');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const MAX_WORDS = 250;

  useEffect(() => {
    const words = description.trim().split(/\s+/);
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

    const newOrg: Organization = {
      id: Date.now(), // Use a timestamp as a temporary ID
      name,
      description,
      members: [
        {
          id: Date.now(), // Temporary ID for the creator
          name: 'Creator Name', // Set the creator's name or get from user context
          email: 'johndoe',
          username: 'johndoe',
          imageUrl: '/path-to-avatar.jpg',
          isAdmin: true,
        },
      ],
      userIsMember: true,
      logo: logo ? URL.createObjectURL(logo) : 'https://via.placeholder.com/64?text=' + name.charAt(0),
      website,
      isAdmin: true,
      memberCount: 1,
      isPrivate: joinPolicy === 'request',
      joinRequests: [],
      joinPolicy: 'open' 
    };

    try {
      // Simulate API call
      onCreate(newOrg);
      setSuccess('Organization created successfully!');
      onClose();
      router.push(`/organization/${newOrg.id}`); // Redirect to the new organization's page
    } catch (err) {
      setError('Failed to create organization. Please try again.');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/75" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0C0A09] rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-auto">
          <Dialog.Title className="text-2xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-gray-100">Create New Organization</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-green-400 focus:ring-1 focus:ring-green-100 sm:text-sm px-3 py-2 dark:bg-[#0C0A09] dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-green-400 focus:ring-1 focus:ring-green-100 sm:text-sm px-3 py-2 dark:bg-[#0C0A09] dark:text-gray-100"
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo</label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer dark:bg-[#0C0A09] dark:text-gray-300"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website URL</label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-green-400 focus:ring-1 focus:ring-green-100 sm:text-sm px-3 py-2 dark:bg-[#0C0A09] dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="joinPolicy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Join Policy</label>
              <select
                id="joinPolicy"
                value={joinPolicy}
                onChange={(e) => setJoinPolicy(e.target.value as 'open' | 'request')}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-400 focus:ring-1 focus:ring-green-100 focus:ring-opacity-50 sm:text-sm px-3 py-2 dark:bg-[#0C0A09] dark:text-gray-100"
              >
                <option value="open">Open</option>
                <option value="request">Request to Join</option>
              </select>
            </div>
            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            {success && <p className="text-green-500 dark:text-green-400">{success}</p>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Create
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateOrganizationForm;
