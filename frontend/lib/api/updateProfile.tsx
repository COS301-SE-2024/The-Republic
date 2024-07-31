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
  formData.append("fullname", updatedUser.fullname);
  formData.append("username", updatedUser.username);
  formData.append("bio", updatedUser.bio);
  if (updatedUser.location) {
    formData.append("location", JSON.stringify(updatedUser.location));
  }
  if (file) {
    if (!(await checkImageFileAndToast(file, toast))) {
      throw new Error("Invalid image file");
    }
    formData.append("profile_picture", file);
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user.user_id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  console.log(response);

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.error || "Failed to update profile");
  }

  return response.json();
};

export { updateUserProfile };
