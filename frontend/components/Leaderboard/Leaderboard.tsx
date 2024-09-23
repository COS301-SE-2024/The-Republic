"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import fetchLeaderboard from "@/lib/api/fetchLeaderboard";
import { fetchUserLocation } from "@/lib/api/fetchUserLocation";
import { useUser } from "@/lib/contexts/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ErrorDisplay from '@/components/ui/error_display';
import { useQuery } from '@tanstack/react-query';

type RankingType = 'country' | 'province' |'city' | 'suburb';

const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-6 w-6 animate-spin text-green-400" />
  </div>
);

const Leaderboard: React.FC = () => {
  const { user } = useUser();
  const [rankingType, setRankingType] = useState<RankingType>('country');
  const [showDropdown, setShowDropdown] = useState(false);
  const userRowRef = useRef<HTMLTableRowElement>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const { data: locationData } = useQuery({
    queryKey: ["user-location"],
    queryFn: async () => {
      if (user?.location_id) {
        return await fetchUserLocation(user.location_id);
      } else {
        return null;
      }
    }
  });
  const { data, error, isPending, isFetching } = useQuery({
    queryKey: ["leaderboard", rankingType],
    queryFn: async () => {
      if (!user) {
        throw 'No user data available';
      }
  
      try {
        let filterData = {};
        if (locationData && locationData.value) {
          filterData = {
            province: locationData.value.province,
            city: locationData.value.city,
            suburb: locationData.value.suburb,
          };
        }
  
        const data = await fetchLeaderboard(user.user_id, rankingType, filterData);

        return {
          leaderboardData: data.leaderboard,
          userData: data.user
        };
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw 'Failed to load leaderboard data';
      }
    },
    enabled: locationData !== undefined
  });

  const handleUsernameClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  useEffect(() => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [rankingType]);

  if (isPending || isFetching) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Leaderboard data unavailable"
        message="Please check your internet connection. Reload the page if the issue persists or try logging in again."
        linkHref="/login"
        linkText="Login Here"
      />
    );
  }

  const { leaderboardData, userData } = data!;
  
  if (!userData) {
    return (
      <ErrorDisplay
        title="No user data available"
        message="You need to be logged in to view leaderboard information. Create an account or log in to an existing account."
        linkHref="/login"
        linkText="Login Here"
      />
    );
  }  

  const userHasLocation = !!locationData;

  return (
    <div className={`min-h-screen p-4 max-w-7xl mx-auto w-full relative ${theme === 'dark' ? 'bg-[#0C0A09] text-[#f5f5f5]' : 'bg-white text-gray-800'}`}>
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4 sm:w-32 sm:h-32">
          <AvatarImage src={userData.image_url} alt={userData.fullname} />
          <AvatarFallback>{userData.fullname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-4xl">{userData.fullname}</h2>
          <p className="text-lg sm:text-xl">Points: {userData.user_score}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm">Your {rankingType.charAt(0).toUpperCase() + rankingType.slice(1)} Ranking</p>
          <p className="text-2xl font-bold text-center sm:text-3xl">
            {userData.ranking !== null ? `${userData.ranking}` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="mb-4 relative z-10">
        <button
          className={`border rounded p-2 flex items-center ${theme === 'dark' ? 'bg-[#262626] text-[#f5f5f5]' : 'bg-white text-gray-800'}`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <SlidersHorizontal className="mr-2" /> Filter
        </button>
        {showDropdown && (
          <div className={`absolute mt-2 border rounded shadow-lg z-20 ${theme === 'dark' ? 'bg-[#1a1a1a] text-[#f5f5f5]' : 'bg-white text-gray-800'}`}>
            <button
              className="block px-4 py-2 hover:bg-gray-200 text-left w-full"
              onClick={() => { setRankingType('country'); setShowDropdown(false); }}
            >
              Country Ranking
            </button>
            {userHasLocation && (
              <>
                <button
                  className="block px-4 py-2 hover:bg-gray-200 text-left w-full"
                  onClick={() => { setRankingType('province'); setShowDropdown(false); }}
                >
                  Province Ranking
                </button>
                <button
                  className="block px-4 py-2 hover:bg-gray-200 text-left w-full"
                  onClick={() => { setRankingType('city'); setShowDropdown(false); }}
                >
                  City Ranking
                </button>
                <button
                  className="block px-4 py-2 hover:bg-gray-200 text-left w-full"
                  onClick={() => { setRankingType('suburb'); setShowDropdown(false); }}
                >
                  Suburb Ranking
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {!userHasLocation && rankingType !== 'country' && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          <p className="mb-2">Set your location to see more detailed ranking information.</p>
          <Button
            onClick={() => router.push('/profile')}
            className="bg-yellow-500 text-white w-full sm:w-auto"
          >
            Set Location
          </Button>
        </div>
      )}

      <div className={`border rounded overflow-x-auto relative z-0 ${theme === 'dark' ? 'bg-[#0C0A09]' : 'bg-white'}`}>
        <table className="w-full table-auto">
          <thead className={theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'}>
            <tr className={`text-left ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
              <th className="py-2 px-2 sm:px-6">Rank</th>
              <th className="py-2 px-2 sm:px-6">User</th>
              <th className="py-2 px-2 sm:px-6">Points</th>
              {rankingType === 'country' && <th className="py-2 px-2 sm:px-6 hidden md:table-cell">Province</th>}
              {rankingType === 'country' && <th className="py-2 px-2 sm:px-6 hidden lg:table-cell">City</th>}
              {rankingType === 'country' && <th className="py-2 px-2 sm:px-6 hidden xl:table-cell">Suburb</th>}
              {rankingType === 'city' && <th className="py-2 px-2 sm:px-6">City</th>}
              {rankingType === 'suburb' && <th className="py-2 px-2 sm:px-6">Suburb</th>}
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map(entry => (
              <tr
                key={entry.userId}
                className={`border-b ${entry.userId === userData.user_id ? theme === 'dark' ? 'bg-green-700 text-black' : 'bg-green-100' : ''}`}
                ref={entry.userId === userData.user_id ? userRowRef : null}
              >
                <td className="py-2 px-2 sm:px-6">{entry.rank}</td>
                <td 
                  className="py-2 px-2 sm:px-6 cursor-pointer"
                  onClick={() => handleUsernameClick(entry.userId)}
                >
                  {entry.username}
                </td>
                <td className="py-2 px-2 sm:px-6">{entry.points}</td>
                {rankingType === 'country' && <td className="py-2 px-2 sm:px-6 hidden md:table-cell">{entry.province || 'N/A'}</td>}
                {rankingType === 'country' && <td className="py-2 px-2 sm:px-6 hidden lg:table-cell">{entry.city || 'N/A'}</td>}
                {rankingType === 'country' && <td className="py-2 px-2 sm:px-6 hidden xl:table-cell">{entry.suburb || 'N/A'}</td>}
                {rankingType === 'city' && <td className="py-2 px-2 sm:px-6">{entry.city || 'N/A'}</td>}
                {rankingType === 'suburb' && <td className="py-2 px-2 sm:px-6">{entry.suburb || 'N/A'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;