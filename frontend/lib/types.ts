interface User {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
  bio: string;
  is_owner: boolean;
  total_issues: number;
  resolved_issues: number;
}

interface UserAlt {
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

interface ProfileStatsProps {
  userId: string;
  totalIssues: number | null;
  resolvedIssues: number | null;
  selectedTab: "issues" | "resolved";
  setSelectedTab: (tab: "issues" | "resolved") => void;
}

interface IssueInputBoxProps {
  user: {
    user_id: string;
    email_address: string;
    username: string;
    fullname: string;
    image_url: string;
    bio: string;
    is_owner: boolean;
    total_issues: number;
    resolved_issues: number;
  } | null;
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
  };
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
  resolved_at: string | null;
  sentiment: string;
  user: User;
  category: Category;
  reactions: Reaction[];
  location: {
    province: string;
    city: string;
    suburb: string;
  } | null;
  comment_count: number;
  is_owner: boolean;
  profile_user_id: string;
  user_reaction: string;
}
interface IssueProps {
  issue: Issue;
}

interface Comment {
  comment_id: string;
  issue_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  user: User;
  is_owner: boolean;
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
  location? : Location;
}

interface FeedProps {
  userId?: string;
  showInputBox?: boolean;
}

export type {
  AnalysisResult,
  FeedProps,
  RequestBody,
  UserAlt,
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
  Location
};
