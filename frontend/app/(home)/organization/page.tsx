'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/contexts/UserContext';
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import CreateOrganizationForm from '@/components/CreateOrganizationForm/CreateOrganizationForm';
import OrganizationCard from '@/components/OrganizationCard/OrganizationCard';
import { Organization, Location } from '@/lib/types';
import { getOrganizations } from '@/lib/api/getOrganizations';
import { searchOrganizations } from '@/lib/api/searchOrganizations';
import { createOrganization } from '@/lib/api/createOrganization';
import { dotVisualization } from "@/lib/api/dotVisualization";
import CompactDropdown from '@/components/Dropdown/CompactDropdown';
import { useToast } from "@/components/ui/use-toast";

export default function OrganizationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchResults, setSearchResults] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const [orgTypeFilter, setOrgTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [nearMeActive, setNearMeActive] = useState(false);
  const { toast } = useToast();

  const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations`;

  const { data: locations, isLoading: isLocationsLoading } = useQuery<Location[]>({
    queryKey: ["locations", user],
    queryFn: () => dotVisualization(url),
    enabled: !!user,
  });

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const result = await getOrganizations(user!, { 
        orgType: orgTypeFilter === "all" ? null : orgTypeFilter,
        locationId: locationFilter
      });
      setOrganizations(result.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleNearMeToggle = async () => {
    if (!nearMeActive) {
      if (user && user.location_id) {
        setLocationFilter(null);
        setNearMeActive(true);
        await handleFilter();
      } else {
        toast({
          title: "Something Went Wrong",
          description: "Please set your location in your profile to use this feature.",
          variant: "destructive",
        });
      }
    } else {
      setNearMeActive(false);
      if (user && user.location_id){
        setLocationFilter(user.location_id.toString());
        await handleFilter();
      } else {
        toast({
          title: "Something Went Wrong",
          description: "Please set your location in your profile to use this feature.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setHasSearched(false);
      await handleFilter();
      return;
    }

    try {
      setSearching(true);
      const result = await searchOrganizations(user!, searchTerm, {
        orgType: orgTypeFilter === "all" ? null : orgTypeFilter,
        locationId: locationFilter
      });
      setSearchResults(result.data);
      setError(null);
      setHasSearched(true);
    } catch (err) {
      console.error("Error searching organizations:", err);
      setError('Failed to search organizations');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const result = await getOrganizations(user!, {
        orgType: orgTypeFilter === "all" ? null : orgTypeFilter,
        locationId: locationFilter
      });
      setOrganizations(result.data);
      setError(null);
      setHasSearched(false);
    } catch (err) {
      console.error("Error filtering organizations:", err);
      setError('Failed to filter organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationClick = (id: string) => {
    router.push(`/organization/${id}`);
  };

  const handleCreateOrganization = async (formData: FormData) => {
    try {
      if (user) {
        const createdOrg = await createOrganization(user, formData);
        setShowCreateForm(false);
        router.push(`/organization/${createdOrg.id}`);
        return createdOrg;
      }
    } catch (err) {
      setError('Failed to create organization');
    }
  };

  const myOrganizations = organizations.filter(org => org.isMember);
  const discoverOrganizations = organizations.filter(org => !org.isMember);
  const displayedOrganizations = hasSearched ? searchResults : discoverOrganizations;

  const orgTypeOptions = {
    group: "Organization Type",
    items: [
      { value: "all", label: "All Types" },
      { value: "political", label: "Political" },
      { value: "npo", label: "Non-Profit" },
      { value: "governmental", label: "Governmental" },
      { value: "other", label: "Other" },
    ],
  };

  const locationOptions = {
    group: "Location",
    items: [
      { value: "all", label: "All Locations" },
      ...(locations?.map(loc => ({
        value: loc.location_id?.toString() ?? '',
        label: `${loc.suburb ? loc.suburb + ", " : ""}${loc.city ?? ''}, ${loc.province ?? ''}`,
      })) || []),
    ],
  };

  const handleLocationDropdownChange = (value: string) => {
    if (value === "all") {
      setLocationFilter(null);
    } else {
      setLocationFilter(value);
    }
    setNearMeActive(false);
    handleFilter();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold mr-2">Organizations</h1>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="bg-green-600 hover:bg-green-800 rounded-full w-8 h-8 p-0"
            title="Create Organization"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex-grow min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 w-full"
            />
          </div>
        </div>
        <CompactDropdown
          options={orgTypeOptions}
          value={orgTypeFilter}
          onChange={(value) => {
            setOrgTypeFilter(value);
            handleFilter();
          }}
          placeholder="All Types"
        />
        <CompactDropdown
          options={locationOptions}
          value={locationFilter || "all"}
          onChange={handleLocationDropdownChange}
          disabled={isLocationsLoading || nearMeActive}
          placeholder="All Locations"
        />
        <Toggle
          pressed={nearMeActive}
          onPressedChange={handleNearMeToggle}
          className="bg-green-100 data-[state=on]:bg-green-600 text-black data-[state=on]:text-white"
        >
          Near Me
        </Toggle>
        <Button onClick={handleSearch} className="bg-green-400 hover:bg-green-900">
          Search
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            </div>
          ) : myOrganizations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myOrganizations.map(org => (
                <OrganizationCard
                  key={org.id}
                  organization={org}
                  onClick={() => handleOrganizationClick(org.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              You are not a member of any organizations yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{hasSearched ? 'Search Results' : 'Discover Organizations'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading || searching ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            </div>
          ) : displayedOrganizations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedOrganizations.map(org => (
                <OrganizationCard
                  key={org.id}
                  organization={org}
                  onClick={() => handleOrganizationClick(org.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {hasSearched ? 'No organizations found. Try adjusting your search or filters.' : 'No organizations to discover at the moment.'}
            </p>
          )}
        </CardContent>
      </Card>

      <CreateOrganizationForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={handleCreateOrganization}
      />
    </div>
  );
}
