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