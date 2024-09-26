import { useState, useRef, useEffect } from 'react';
import { LocationType, Organization, ActivityLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateOrganization } from '@/lib/api/updateOrganization';
import { deleteOrganization } from '@/lib/api/deleteOrganization';
import { getActivityLogs } from '@/lib/api/getActivityLogs';
import { useUser } from '@/lib/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import TypedDeleteConfirmation from '@/components/DeleteConfirmation/TypedDeleteConfirmation';
import LocationModal from '@/components/LocationModal/LocationModal';
import Link from 'next/link';
import { checkContentAppropriateness } from "@/lib/api/checkContentAppropriateness";

interface SettingsTabProps {
  organization: Organization;
  onOrganizationUpdate: (updatedOrg: Organization) => void;
}

const formatLogDetails = (log: ActivityLog) => {
  try {
    const details = JSON.parse(log.action_details);
    switch (log.action_type) {
      case 'CREATE_POST':
        return (
          <span>
            Created a new post. <Link href={`/organization/${log.organization_id}/posts/${details.details.postId}`} className="text-blue-500 hover:underline">View post</Link>
          </span>
        );
      case 'DELETE_POST':
        return "Deleted a post";
      case 'UPDATE_ORGANIZATION':
        return `Updated organization details: ${Object.keys(details.details).join(', ')}`;
      case 'ACCEPT_JOIN_REQUEST':
      case 'REJECT_JOIN_REQUEST':
        return `${log.action_type === 'ACCEPT_JOIN_REQUEST' ? 'Accepted' : 'Rejected'} join request for user ID: ${details.details.requestId}`;
      case 'REMOVE_MEMBER':
        return `Removed member with user ID: ${details.details.removedUserId}`;
      case 'ASSIGN_ADMIN':
        return `Assigned admin role to user ID: ${details.details.newAdminId}`;
      default:
        return JSON.stringify(details);
    }
  } catch (e) {
    return String(log.action_details);
  }
};

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
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    setIsLoadingLogs(true);
    setLogsError(null);
    try {
      if (!user) throw new Error('User not found');
      const logs = await getActivityLogs(user, organization.id);
      setActivityLogs(logs);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setLogsError("Failed to fetch activity logs");
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

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

      const fieldsToCheck: (keyof typeof formData)[] = ['name', 'username', 'bio'];
      for (const field of fieldsToCheck) {
        const value = formData[field];
        if (typeof value === 'string') {
        const isContentAppropriate = await checkContentAppropriateness(value);
        if (!isContentAppropriate) {
          setLoading(false);
          toast({
            variant: "destructive",
            description: `Please use appropriate language in the ${field} field.`,
          });
          return;
        }
      }
      }

      const updateData = new FormData();
      let hasChanges = false;

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'location') {
          const newLocation = JSON.stringify(value);
          const oldLocation = JSON.stringify(organization.location);
          if (newLocation !== oldLocation) {
            updateData.append(key, newLocation);
            hasChanges = true;
          }
        } else if (organization[key as keyof Organization] !== value) {
          updateData.append(key, value as string);
          hasChanges = true;
        }
      });

      if (profilePhoto) {
        updateData.append('profilePhoto', profilePhoto);
        hasChanges = true;
      }

      if (!hasChanges) {
        setSuccess('No changes to update');
        return;
      }

      const updatedOrg = await updateOrganization(user, organization.id, updateData, organization);
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
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account Management</TabsTrigger>
        <TabsTrigger value="activityLog">Activity Log</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
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
      </TabsContent>
      <TabsContent value="activityLog">
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              This log shows all administrative actions taken within the organization. It helps maintain transparency and accountability among admins.
            </p>
            {isLoadingLogs ? (
              <div className="text-center">Loading...</div>
            ) : logsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{logsError}</AlertDescription>
              </Alert>
            ) : activityLogs.length === 0 ? (
              <p className="text-center text-gray-500">No activity logs found.</p>
            ) : (
              <div className="space-y-4">
                {activityLogs.map((log) => (
                 <div key={log.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-transparent mb-4 rounded-lg">
                 <Avatar className="h-10 w-10">
                   <AvatarImage src={log.admin.image_url || undefined} />
                   <AvatarFallback>{log.admin.fullname.charAt(0)}</AvatarFallback>
                 </Avatar>
                 <div>
                   <p className="font-semibold">{log.admin.fullname} (@{log.admin.username})</p>
                   <p className="text-sm text-gray-600 dark:text-gray-300">
                     {formatLogDetails(log)}
                   </p>
                   <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
                 </div>
               </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}