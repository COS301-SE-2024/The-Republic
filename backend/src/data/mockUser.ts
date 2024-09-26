import { MockUser } from "@/types/users";

const mockUser: MockUser = {
  user_id: "user123",
  email_address: "user@example.com",
  username: "user123",
  fullname: "User Fullname",
  image_url: "http://example.com/image.jpg",
  bio: "User biography",
  is_owner: true,
  total_issues: 10,
  resolved_issues: 5,
  access_token: "access_token_value",
  user_score: 0,
  location_id: null,
  location: null,
};

export default mockUser;
