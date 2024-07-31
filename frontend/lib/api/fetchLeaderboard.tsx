import { UserAlt, LeaderboardEntry } from "@/lib/types";


interface ApiResponse {
  success: boolean;
  data: {
    userPosition: {
      user_id: string;
      username: string;
      fullname: string;
      email_address: string;
      image_url: string;
      user_score: number;
      location_id: number | null;
      location: any; // Use a more specific type if available
      is_owner: boolean;
      total_issues: number;
      resolved_issues: number;
      position: string | null;
      message: string;
    };
    leaderboard: Array<{
      user_id: string;
      username: string;
      fullname: string;
      image_url: string;
      user_score: number;
      location: any; // Use a more specific type if available
    }>;
  };
}

const fetchLeaderboard = async (
  userId: string,
  rankingType: 'country' | 'city' | 'suburb',
  locationData?: { province?: string; city?: string; suburb?: string }
): Promise<{ leaderboard: LeaderboardEntry[]; user: UserAlt }> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/points/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...locationData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const responseData: ApiResponse = await response.json();

    console.log('API Response Data:', responseData);

    if (!responseData.success || !responseData.data) {
      throw new Error("Invalid data structure");
    }

    const userPosition = responseData.data.userPosition;
    const leaderboard = responseData.data.leaderboard;

    const user: UserAlt = {
      user_id: userPosition.user_id,
      email_address: userPosition.email_address,
      username: userPosition.username,
      fullname: userPosition.fullname,
      image_url: userPosition.image_url,
      bio: userPosition.position || '',
      is_owner: userPosition.is_owner,
      total_issues: userPosition.total_issues,
      resolved_issues: userPosition.resolved_issues,
      access_token: '', // Set appropriate token if available
      location: null,
      location_id: userPosition.location_id || null,
    };

    const leaderboardEntries: LeaderboardEntry[] = leaderboard.map(entry => ({
      rank: 0, // Adjust if needed
      username: entry.username,
      userId: entry.user_id,
      country: '', // Adjust if country is available
      city: '', // Adjust if city is available
      suburb: '', // Adjust if suburb is available
      points: entry.user_score,
      countryRanking: 0, // Adjust if country ranking is available
      cityRanking: 0, // Adjust if city ranking is available
      suburbRanking: 0, // Adjust if suburb ranking is available
    }));

    return { leaderboard: leaderboardEntries, user };
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    throw error;
  }
};


export default fetchLeaderboard;
