import { checkImageFileAndToast } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { User, ProfileUpdate } from "@/lib/types";

const updateUserProfile = async (
  user: User,
  updatedUser: ProfileUpdate,
  file: File | null,
) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (!session || !session.user) {
    throw new Error("User ID not found in session");
  }

  const formData = new FormData();

  if (updatedUser.fullname) formData.append("fullname", updatedUser.fullname);
  if (updatedUser.username) formData.append("username", updatedUser.username);
  if (updatedUser.bio) formData.append("bio", updatedUser.bio);
  if (updatedUser.location) {
    formData.append("location", JSON.stringify(updatedUser.location));
  }
  if (file) {
    if (!(await checkImageFileAndToast(file, toast))) {
      throw new Error("Invalid image file");
    }
    formData.append("profile_picture", file);
  }

  // Don't send the request if there's nothing to update
  if (formData.entries().next().done) {
    return user; // Return the original user if no updates
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user.user_id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.error || "Failed to update profile");
  }

  return response.json();
};

export { updateUserProfile };

const updateUsername = async (newUsername: string) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (!session || !session.user) {
    throw new Error("User ID not found in session");
  }

  const { data: existingUsers, error: checkError } = await supabase
    .from("user")
    .select("user_id")
    .ilike("username", newUsername)
    .neq("user_id", session.user.id);

  if (checkError) {
    console.error("Error checking username:", checkError);
    throw new Error("An error occurred while checking username availability");
  }

  if (existingUsers && existingUsers.length > 0) {
    throw new Error("Username already exists");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${session.user.id}/username`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: newUsername }),
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.error || "Failed to update username");
  }

  return response.json();
};

export { updateUsername };


export const changePassword = async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (!session || !session.user) {
    throw new Error("User ID not found in session");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${session.user.id}/password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error("Password change error:", responseData);
    throw new Error(responseData.error || "An error occurred while changing the password");
  }

  await supabase.auth.signOut();

  window.location.href = '/login';

  return responseData;
};