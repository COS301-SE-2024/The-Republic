import { SubsParams, UserAlt as User } from "@/lib/types";

const subscribe = async (user: User | null, data: SubsParams, url: string) => {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user?.access_token}`
        },
    });
  
    const apiResponse = await response.json();
    console.log("Response: ", response);
    
    if (apiResponse.success && apiResponse.data) {
        return apiResponse.data;
    } else {
        throw new Error(apiResponse.error || "Error fetching Data");
    }
};

export { subscribe };
  