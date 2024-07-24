import { UserAlt } from "@/lib/types";
import { supabase } from "@/lib/globals";

const fetchUserData = async (): Promise<UserAlt | null> => {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
        console.error("Failed to retrieve session:", sessionError);
        return null;
    }

    if (session) {
        const {
            data: { user: authUser },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            console.error("Failed to retrieve user:", userError);
            return null;
        }
    
        if (authUser) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${authUser.id}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                            "Content-Type": "application/json",
                        },
                    },
                );
    
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
    
                const apiResponse = await response.json();
        
                if ((apiResponse.success || response.ok) && apiResponse.data) {
                    return {...apiResponse.data, access_token: session.access_token  };
                } else {
                    throw new Error(apiResponse.error || 'Failed to fetch issue details');
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
    }

    return null;
};

export { fetchUserData };