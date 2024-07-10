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
}

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
    }
  };
}

interface AnalysisResult {
  category: string;
  severity: number;
}

export type { User, Category, Reaction, Issue, HomeAvatarProps, AnalysisResult,
   SubData, SeriesDataItem, Context, Params, Api, RenderItemResult, Comment, LocationType
};
