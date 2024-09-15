import React from 'react';
import { Organization } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserAvatarWithScore from '@/components/UserAvatarWithScore/UserAvatarWithScore';
import { Star } from 'lucide-react';

interface OrganizationCardProps {
  organization: Organization;
  onClick: () => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, onClick }) => {
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

  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <UserAvatarWithScore
            imageUrl={organization.profile_photo || ''}
            username={organization.name}
            score={organization.points || 0}
            className="h-12 w-12"
          />
          <div>
            <CardTitle className="flex items-center">
              {organization.name}
              {organization.verified_status && (
                <Star className="h-5 w-5 ml-2 text-green-500 fill-current" />
              )}
            </CardTitle>
            <p className="text-sm text-gray-500">@{organization.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{organization.bio}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{organization.totalMembers} members</span>
          {getOrganizationTypeBadge(organization.org_type)}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;