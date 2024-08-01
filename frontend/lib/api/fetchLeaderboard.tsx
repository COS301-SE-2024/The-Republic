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
      location: any; 
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
      location: any; 
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
   

   

    const leaderboardEntries: LeaderboardEntry[] = leaderboard.map(entry => ({
      username: entry.username,
      userId: entry.user_id,
      country: entry.location?.country || '',
      city: entry.location?.city || '',
      suburb: entry.location?.suburb || '',
      points: entry.user_score,
      countryRanking: 0,
      cityRanking: 0,
      suburbRanking: 0,
      rank: 0, 
    }));
  
    
    leaderboardEntries.sort((a, b) => b.points - a.points);

   
  let countryRank = 0;
  let cityRank = 0;
  let suburbRank = 0;
  let lastCountry = '';
  let lastCity = '';
  let lastSuburb = '';
  let lastPoints = -1;

  leaderboardEntries.forEach((entry, index) => {
    // Country ranking
    if (entry.country !== lastCountry || entry.points !== lastPoints) {
      countryRank = index + 1;
      lastCountry = entry.country;
    }
    entry.countryRanking = countryRank;

    // City ranking
    if (entry.city !== lastCity || entry.points !== lastPoints) {
      cityRank = index + 1;
      lastCity = entry.city;
    }
    entry.cityRanking = cityRank;

    // Suburb ranking
    if (entry.suburb !== lastSuburb || entry.points !== lastPoints) {
      suburbRank = index + 1;
      lastSuburb = entry.suburb;
    }
    entry.suburbRanking = suburbRank;

    lastPoints = entry.points;
  });

  //overall rank
  leaderboardEntries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  const userEntry = leaderboardEntries.find(entry => entry.userId === userId);

  const user: UserAlt = {
    user_id: userPosition.user_id,
    email_address: userPosition.email_address,
    username: userPosition.username,
    fullname: userPosition.fullname,
    image_url: userPosition.image_url,
    bio: userPosition.position || '',
    user_score:userPosition.user_score,
    is_owner: userPosition.is_owner,
    total_issues: userPosition.total_issues,
    resolved_issues: userPosition.resolved_issues,
    access_token: '', 
    location: null,
    location_id: userPosition.location_id || null,
    ranking: userEntry ? userEntry.rank : null,
  countryRanking: userEntry ? userEntry.countryRanking : null,
  cityRanking: userEntry ? userEntry.cityRanking : null,
  suburbRanking: userEntry ? userEntry.suburbRanking : null,
  };

  const topTen = leaderboardEntries.slice(0, 10);

  return { leaderboard: topTen, user };
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    throw error;
  }
};


export default fetchLeaderboard;
