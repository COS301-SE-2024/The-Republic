interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
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
  user_score: number;
  location_id: number | null;
  location: {
    location_id: number;
    province: string;
    city: string;
    suburb: string;
    district: string;
  } | null;
}

export type { MockUser, MulterFile };
