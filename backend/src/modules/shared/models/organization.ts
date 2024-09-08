export interface Organization {
    id: string;
    created_at: string;
    name: string;
    username: string;
    bio: string | null;
    website_url: string | null;
    verified_status: boolean;
    join_policy: string;
    points: number;
    profile_photo?: string;
    org_type: string;
    totalMembers: number;
    location_id?: number;
    location?: {
        suburb?: string;
        city?: string;
        province?: string;
        latitude?: number;
        longitude?: number;
        place_id?: string;
    };
    admins_ids?: string[];
    user_id?: string;
    userRole?: string;
}

export interface OrganizationMember {
    id: number;
    organization_id: string;
    user_id: string;
    role: string;
    joined_at: string;
}

export interface JoinRequest {
    id: number;
    organization_id: string;
    user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface OrganizationPost{
  organization_id: string;
  author_id: string;
  user_id: string;
  image_url: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}