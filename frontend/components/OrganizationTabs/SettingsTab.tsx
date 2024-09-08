import { useState, useRef } from 'react';
import { LocationType, Organization } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrganization } from '@/lib/api/updateOrganization';
import { deleteOrganization } from '@/lib/api/deleteOrganization';
import { useUser } from '@/lib/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import TypedDeleteConfirmation from '@/components/DeleteConfirmation/TypedDeleteConfirmation';
import LocationModal from '@/components/LocationModal/LocationModal';

interface SettingsTabProps {
  organization: Organization;
  onOrganizationUpdate: (updatedOrg: Organization) => void;
}

export default function SettingsTab({ organization, onOrganizationUpdate }: SettingsTabProps) {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: organization.name,
    username: organization.username,
    bio: organization.bio || '',
    website_url: organization.website_url || '',
    join_policy: organization.join_policy,
    org_type: organization.org_type || '',
    location: {
      suburb: organization.location?.suburb || '',
      city: organization.location?.city || '',
      province: organization.location?.province || '',
      latitude: organization.location?.latitude || '',
      longitude: organization.location?.longitude || '',
      place_id: organization.location?.place_id || '',
    },
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleLocationSet = (location: LocationType) => {
    setFormData(prev => ({
      ...prev,
      location: {
        suburb: location.value.suburb || '',
        city: location.value.city || '',
        province: location.value.province || '',
        latitude: location.value.lat || '',
        longitude: location.value.lng || '',
        place_id: location.value.place_id || '',
      }
    }));
  };

  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'location') {
      const [suburb = '', city = '', province = ''] = value.split(',').map(item => item.trim());
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, suburb, city, province },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleUpdateOrganization = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      if (!user || !user.user_id) {
        throw new Error('User not found or user ID is missing');
      }
      
      const updateData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'location') {
          updateData.append(key, JSON.stringify(value));
        } else {
          updateData.append(key, value as string);
        }
      });
      if (profilePhoto) {
        updateData.append('profilePhoto', profilePhoto);
      }
  
      const updatedOrg = await updateOrganization(user, organization.id, updateData);
      setSuccess('Organization updated successfully');
      
      const mergedOrg = { ...organization, ...updatedOrg };
      onOrganizationUpdate(mergedOrg);
    } catch (err) {
      console.error("Error updating organization:", err);
      setError(err instanceof Error ? err.message : 'Failed to update organization');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update organization',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganization = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user) throw new Error('User not found');
      await deleteOrganization(user, organization.id);
      router.push('/organization');
    } catch (err) {
      console.error("Error deleting organization:", err);
      setError('Failed to delete organization');
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={organization.profile_photo || (profilePhoto ? URL.createObjectURL(profilePhoto) : undefined)} />
                <AvatarFallback>{organization.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button onClick={() => fileInputRef.current?.click()}>
                Change Profile Picture
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">Website URL</label>
              <Input id="website_url" name="website_url" value={formData.website_url} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="join_policy" className="block text-sm font-medium text-gray-700">Join Policy</label>
              <Select value={formData.join_policy} onValueChange={(value) => handleSelectChange('join_policy', value)}>
                <SelectTrigger id="join_policy">
                  <SelectValue placeholder="Select join policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="request">Request to Join</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="org_type" className="block text-sm font-medium text-gray-700">Organization Type</label>
              <Select value={formData.org_type} onValueChange={(value) => handleSelectChange('org_type', value)}>
                <SelectTrigger id="org_type">
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
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <div className="flex items-center space-x-2">
                <Input
                  id="location"
                  name="location"
                  value={[formData.location.suburb, formData.location.city, formData.location.province].filter(Boolean).join(', ')}
                  readOnly
                  placeholder="Click to set location"
                />
                <Button onClick={openLocationModal} type="button">
                  Set Location
                </Button>
              </div>
            </div>
            <Button onClick={handleUpdateOrganization} disabled={loading}>
              {loading ? 'Updating...' : 'Update Organization'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDeleteOrganization} disabled={loading}>
            Delete Organization
          </Button>
        </CardContent>
      </Card>

      <TypedDeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={organization.name}
        itemType="Organization"
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSet={handleLocationSet}
        defaultLocation={
          formData.location.suburb || formData.location.city || formData.location.province
            ? {
                label: [formData.location.suburb, formData.location.city, formData.location.province].filter(Boolean).join(', '),
                value: {
                  suburb: formData.location.suburb,
                  city: formData.location.city,
                  province: formData.location.province,
                  district: "",
                  lat: Number(formData.location.latitude) || 0,
                  lng: Number(formData.location.longitude) || 0,
                  place_id: formData.location.place_id, 
                },
              }
            : null
        }
      />
    </div>
  );
}