import { supabase } from "@/lib/globals";
import { fetchUserData } from "./fetchUserData"; // Ensure this path is correct

const fetchLeaderboard = async (userId: string, rankingType: string) => {
  // Fetch user data
  const userData = await fetchUserData(userId);

  if (!userData) {
    throw new Error('Failed to fetch user data');
  }

  const requestBody = {
    userId,
    ...(rankingType === 'city' && { city: userData.city }),
    ...(rankingType === 'suburb' && { suburb: userData.suburb }),
  };

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error('Failed to retrieve session');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/points/leaderboard`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  const data = await response.json();
  return { leaderboard: data, user: userData };
};

export default fetchLeaderboard;
