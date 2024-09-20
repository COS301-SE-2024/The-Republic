interface User {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
  bio: string;
  user_score: number;
  total_issues: number;
  resolved_issues: number;
  access_token: string;
  location?: LocationType | null;
  location_id?: number | null;
  suspended_until?: number | null;
  isAdmin?: boolean;
}

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
  location?: {
      suburb?: string;
      city?: string;
      province?: string;
      latitude?: number | string;
      longitude?: number | string;
      place_id?: string;
  };
  admins_ids?: string[];
  isAdmin?: boolean;
  isMember?: boolean;
  averageSatisfactionRating?: number | null;
}

export interface JoinRequest {
  id: number;
  userId: number;
  name: string;
  username: string;
  imageUrl?: string;
  requestDate: string;
}

export interface CreateOrganizationData {
  name: string;
  description: string;
  logo: File | null;
  website: string;
  joinPolicy: 'open' | 'request';
}

export interface OrganizationPost {
  post_id: string;
  organization_id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at?: string; // Make this optional if not always present
  author: {
    bio: string;
    role_id: number;
    user_id: string;
    fullname: string;
    username: string;
    image_url: string;
    is_blocked: boolean;
    user_score: number;
    location_id: number;
    email_address: string;
    suspended_until: string | null;
  };
  reactions: {
    counts: {
      [key: string]: number;
    };
    userReaction: string | null;
  };
  comment_count: number;
}

export type ActionType = 
  | 'UPDATE_ORGANIZATION'
  | 'CREATE_POST'
  | 'DELETE_POST'
  | 'ACCEPT_JOIN_REQUEST'
  | 'REJECT_JOIN_REQUEST'
  | 'REMOVE_MEMBER'
  | 'ASSIGN_ADMIN';

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

export type AssignAdminDetails = {
  newAdminId: string;
};

export type ActionDetails = 
  | { type: 'UPDATE_ORGANIZATION', details: UpdateOrganizationDetails }
  | { type: 'CREATE_POST', details: CreatePostDetails }
  | { type: 'DELETE_POST', details: DeletePostDetails }
  | { type: 'ACCEPT_JOIN_REQUEST', details: HandleJoinRequestDetails }
  | { type: 'REJECT_JOIN_REQUEST', details: HandleJoinRequestDetails }
  | { type: 'REMOVE_MEMBER', details: RemoveMemberDetails }
  | { type: 'ASSIGN_ADMIN', details: AssignAdminDetails };

export interface ActivityLog {
  id: number;
  organization_id: string;
  admin_id: string;
  action_type: ActionType;
  action_details: string;
  created_at: string;
  admin: {
    user_id: string;
    username: string;
    fullname: string;
    image_url: string | null;
  };
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  total: number;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  username: string;
  imageUrl?: string;
  isAdmin: boolean;
}

export interface AnalyticsData {
  date: string;
  issuesResolved: number;
  interactions: number;
}

interface UserData {
  name: string;
  id: string;
  countryRanking: number;
  provinceRanking: number;
  cityRanking: number;
  suburbRanking: number;
  city: string;
  suburb: string;
  points: number;
}

interface LeaderboardEntry {
  username: string;
  userId: string;
  province: string;
  city: string;
  suburb: string;
  points: number;
  countryRanking: number;
  provinceRanking: number;
  cityRanking: number;
  suburbRanking: number;
  rank: number;
}

interface UserAlt {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
  user_score: number;
  bio: string;
  is_owner: boolean;
  isAdmin?: boolean; 
  total_issues: number;
  resolved_issues: number;
  access_token: string;
  location: LocationType | null;
  location_id: number | null;
  ranking?: number | null;
  countryRanking: number | null;
  provinceRanking: number | null;
  cityRanking?: number | null;
  suburbRanking?: number | null;
}

interface MockUser {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
  bio: string;
  is_owner: boolean;
  total_issues: number;
  resolved_issues: number;
  access_token: string;
}

interface UserContextType {
  user: UserAlt | null;
}

interface ProfileStatsProps {
  userId: string;
  totalIssues: number;
  resolvedIssues: number;
  totalResolutions: number;
  selectedTab: "issues" | "resolved" | "resolutions";
  setSelectedTab: (tab: "issues" | "resolved" | "resolutions") => void;
}

interface IssueInputBoxProps {
  user: UserAlt | null;
  onAddIssue: (issue: Issue) => void;
}

interface Category {
  name: string;
}

interface Reaction {
  emoji: string;
  count: number;
}

interface LocationType {
  label: string;
  value: {
    place_id: string;
    province: string;
    city: string;
    suburb: string;
    district: string;
    lat: number;
    lng: number;
  };
}

interface ReactionNotification {
  created_at: string;
  emoji: string;
  issue_id: number;
  reaction_id: number;
  user_id: string;
}

interface CommentNotification {
  comment_id: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  issue_id: string;
  parent_id: string | null;
  user_id: string;
}

interface NotificationType {
  type: string;
  content: string;
  issue_id?: string;
  category?: string;
  location?: string;
  created_at: string;
}

interface Issue {
  issue_id: number;
  user_id: string;
  location_id: number | null;
  category_id: number;
  content: string;
  image_url: string | null;
  is_anonymous: boolean;
  created_at: string;
  forecast: string | null;
  resolved_at: string | null;
  user: User;
  category: Category;
  reactions: Reaction[];
  location: {
    province: string;
    city: string;
    suburb: string;
    latitude: string;
    longitude: string;
  } | null;
  comment_count: number;
  is_owner: boolean;
  profile_user_id: string;
  user_reaction: string;
  hasPendingResolution: boolean;
  pendingResolutionId: string | null;
  cluster_id?: string;
  resolutions: Resolution[];
  relatedIssues?: Issue[];
  relatedIssuesCount: number;
  userHasIssueInCluster: boolean;
}

interface IssueProps {
  issue: Issue;
  id?: string;
  onDeleteIssue?: (issue: Issue) => void;
  onResolveIssue?: (issue: Issue, resolution: Resolution) => void;
}

interface Comment {
  comment_id: string;
  issue_id?: string;
  post_id?: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  user: User;
  is_owner: boolean;
  is_anonymous: boolean;
}

interface HomeAvatarProps {
  username: string;
  fullname: string;
  imageUrl: string;
}

type SubData<T = unknown> = {
  $count?: number;
  [key: string]: T | SubData<T> | number | undefined;
};

interface SeriesDataItem {
  id: string;
  value: number;
  population: number;
  issueRate: number;
  depth: number;
  index: number;
}

interface Context {
  nodes: { [key: string]: d3.HierarchyCircularNode<SeriesDataItem> };
  layout?: boolean;
}

interface Params {
  context: Context;
}

interface Api {
  getWidth: () => number;
  getHeight: () => number;
  value: (key: string) => string;
  visual: (key: string) => string;
}

interface RenderItemResult {
  type: string;
  focus: Uint32Array;
  shape: {
    cx: number;
    cy: number;
    r: number;
  };
  transition: string[];
  z2: number;
  textContent: {
    type: string;
    style: {
      transition?: string[];
      text: string;
      fontFamily: string;
      width: number;
      overflow: string;
      fontSize: number;
    };
    emphasis: {
      style: {
        overflow: string | null;
        fontSize: number;
      };
    };
  };
  textConfig: {
    position: string;
  };
  style: {
    fill: string;
  };
  emphasis: {
    style: {
      fontFamily: string;
      fontSize: number;
      shadowBlur: number;
      shadowOffsetX: number;
      shadowOffsetY: number;
      shadowColor: string;
    };
  };
  blur: {
    style: {
      opacity: number;
    };
  };
}

interface AnalysisResult {
  category: string;
  severity: number;
}

interface Location {
  location_id: string;
  province?: string;
  city?: string;
  suburb?: string;
  district?: string;
}

interface RequestBody {
  from: number;
  amount: number;
  order_by: string;
  ascending: boolean;
  category?: string;
  location?: Location;
}

interface FeedProps {
  userId?: string;
  showInputBox?: boolean;
}

interface AddCommentFormProps {
  issueId: string;
  parentCommentId?: string;
  onCommentAdded: (comment: Comment) => void;
}

interface CommentListProps {
  itemId: string;
  itemType: 'issue' | 'post';
  parentCommentId?: string | null;
  showAddComment?: boolean;
  showComments?: boolean;
}

interface ReactionProps {
  itemId: string;
  itemType: 'issue' | 'post';
  initialReactions: Reaction[]; // Replace 'any[]' with 'Reaction[]'
  userReaction: string | null;
}

interface EditProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onCancel: () => void;
}

interface ProfileUpdate {
  fullname: string;
  username: string;
  bio: string;
  location?: LocationType | null | undefined;
}

interface ProfileFeedProps {
  userId: string;
  selectedTab: "issues" | "resolved" | "resolutions";
}

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: 
  Buffer;
}

interface SubsParams {
  user_id: string;
  issue_id?: string;
  category_id?: string;
  location_id?: string;
}

interface Resolution {
  resolution_id: string;
  issue_id: number;
  resolver_id: string;
  resolution_text: string;
  proof_image: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  num_cluster_members: number;
  num_cluster_members_accepted: number;
  num_cluster_members_rejected: number;
  political_association: string | null;
  state_entity_association: string | null;
  resolution_source: 'self' | 'unknown' | 'other';
  resolved_by: string | null;
  organization_id: string | null;
}

// TODO: Update extracted type to match this and use it
interface CommentListProps2 {
  issueId: number;
  parentCommentId: number | null;
  showAddComment?: boolean;
  showComments?: boolean;
}

interface ErrorDisplayProps {
  title: string;
  message: string;
  linkHref: string;
  linkText: string;
}

interface UserExists {
  username: string;
  user_id?: string;
}

export type {
  UserExists,
  AnalysisResult,
  FeedProps,
  RequestBody,
  UserAlt,
  UserData,
  LeaderboardEntry,
  IssueProps,
  IssueInputBoxProps,
  ProfileStatsProps,
  User,
  Category,
  Reaction,
  Issue,
  HomeAvatarProps,
  SubData,
  SeriesDataItem,
  Context,
  Params,
  Api,
  RenderItemResult,
  Comment,
  LocationType,
  AddCommentFormProps,
  CommentListProps,
  CommentListProps2,
  EditProfileProps,
  ProfileUpdate,
  UserContextType,
  ProfileFeedProps,
  ReactionProps,
  MockUser,
  MulterFile,
  Location,
  SubsParams,
  Resolution,
  ReactionNotification,
  CommentNotification,
  NotificationType,
  ErrorDisplayProps
};
