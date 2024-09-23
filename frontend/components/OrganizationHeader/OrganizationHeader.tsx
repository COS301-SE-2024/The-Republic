import React from 'react';
import { Organization } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Globe, Calendar, Star } from 'lucide-react';
import { formatDate } from '@/lib/utils'; 
import UserAvatarWithScore from '@/components/UserAvatarWithScore/UserAvatarWithScore';
import { deleteJoinRequest } from '@/lib/api/deleteJoinRequest';

interface OrganizationHeaderProps {
  organization: Organization;
  isUserMember: boolean;
  onJoinRequest: () => void;
  hasUserRequested: boolean;
  onRemoveRequest: () => void; // Add a new prop for handling remove request
}

const getOrganizationTypeBadge = (orgType: string | undefined) => {
  let badgeText = 'Unknown Type';

  switch (orgType?.toLowerCase()) {
    case 'political':
      badgeText = 'Political';
      break;
    case 'npo':
      badgeText = 'Non-Profit';
      break;
    case 'governmental':
      badgeText = 'Governmental';
      break;
    case 'other':
      badgeText = 'Other';
      break;
  }

  return <Badge>{badgeText}</Badge>;
};

export default function OrganizationHeader({ organization, isUserMember, onJoinRequest, hasUserRequested, onRemoveRequest }: OrganizationHeaderProps) {
  const renderJoinButton = () => {
    if (isUserMember) {
      return null;
    }

    if (hasUserRequested) {
      return (
        <Button onClick={onRemoveRequest}>
          Remove Request
        </Button>
      );
    }

    return (
      <Button onClick={onJoinRequest}>
        {organization.join_policy === 'open' ? 'Join Organization' : 'Request to Join'}
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <UserAvatarWithScore
            imageUrl={organization.profile_photo || ''}
            username={organization.name || 'Unknown'}
            score={organization.points || 0}
            className="h-24 w-24"
          />
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              {organization.name || 'Unknown Organization'}
              {organization.verified_status && (
                <Star className="h-7 w-7 ml-4 text-green-500 fill-current" />
              )}
            </h1>
            <p className="text-gray-500">@{organization.username || 'unknown'}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {organization.totalMembers || 0} members
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {organization.created_at ? formatDate(organization.created_at) : 'Unknown'}
              </span>
              {organization.website_url && (
                <span className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <a href={organization.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Website
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          {renderJoinButton()}
        </div>
      </div>
      {organization.bio && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p>{organization.bio}</p>
        </div>
      )}
      {organization.location && (
        <div className="mt-2 flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>
            {[organization.location.suburb, organization.location.city, organization.location.province]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      )}
      <div className="flex items-center space-x-4">
        {getOrganizationTypeBadge(organization.org_type)}
      </div>
    </div>
  );
}