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
  isMember?: boolean;
  averageSatisfactionRating?: number | null;
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
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface OrganizationPost {
  post_id: string;
  organization_id: string;
  author_id: string;
  user_id: string;
  image_url: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    user_id: string;
    fullname: string;
    username: string;
    image_url: string | null;
  };
  reactions: {
    counts: {
      "😠": number;
      "😃": number;
      "😢": number;
      "😟": number;
    };
    userReaction: string | null;
  };
}

export type AssignAdminDetails = {
  newAdminId: string;
};

export type UpdateOrganizationDetails = {
  name?: string;
  username?: string;
  bio?: string;
  website_url?: string;
  join_policy?: string;
  org_type?: string;
};

export type CreatePostDetails = {
  postId: string;
};

export type DeletePostDetails = {
  postId: string;
};

export type HandleJoinRequestDetails = {
  requestId: number;
};

export type RemoveMemberDetails = {
  removedUserId: string;
};

export type ActionType =
  | "UPDATE_ORGANIZATION"
  | "CREATE_POST"
  | "DELETE_POST"
  | "ACCEPT_JOIN_REQUEST"
  | "REJECT_JOIN_REQUEST"
  | "REMOVE_MEMBER"
  | "ASSIGN_ADMIN"; // New action type

export type ActionDetails =
  | { type: "UPDATE_ORGANIZATION"; details: UpdateOrganizationDetails }
  | { type: "CREATE_POST"; details: CreatePostDetails }
  | { type: "DELETE_POST"; details: DeletePostDetails }
  | { type: "ACCEPT_JOIN_REQUEST"; details: HandleJoinRequestDetails }
  | { type: "REJECT_JOIN_REQUEST"; details: HandleJoinRequestDetails }
  | { type: "REMOVE_MEMBER"; details: RemoveMemberDetails }
  | { type: "ASSIGN_ADMIN"; details: AssignAdminDetails }; // New action details

export interface ActivityLog {
  id: number;
  organization_id: string;
  admin_id: string;
  action_type: ActionType;
  action_details: ActionDetails;
  created_at: string;
  admin: {
    user_id: string;
    username: string;
    fullname: string;
    image_url: string | null;
  };
}
