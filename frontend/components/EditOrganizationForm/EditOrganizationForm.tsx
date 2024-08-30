import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Organization } from '../../lib/types';

interface EditOrganizationFormProps {
  isOpen: boolean;
  initialOrganization: Organization;
  onSave: (organization: Organization) => void;
  onClose: () => void;
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({
  isOpen,
  initialOrganization,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialOrganization.name);
  const [description, setDescription] = useState(initialOrganization.description);
  const [website, setWebsite] = useState(initialOrganization.website);
  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  useEffect(() => {
    const words = description.trim().split(/\s+/);
  }, [description]);

  

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Please enter an organization name.');
      return;
    }

    const updatedOrganization: Organization = {
      ...initialOrganization,
      name,
      description,
      website,
      logo: logo ? URL.createObjectURL(logo) : initialOrganization.logo,
    };

    try {
      // Simulate API call
      onSave(updatedOrganization);
      setSuccess('Organization updated successfully!');
      onClose();
    } catch (err) {
      setError('Failed to update organization. Please try again.');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/75" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0C0A09] rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-auto">
      <Dialog.Title className="text-2xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-gray-100">Edit Organization</Dialog.Title>
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
                className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer dark:bg-[#0C0A09] dark:text-gray-300 cursoer-pointer"
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
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditOrganizationForm;
