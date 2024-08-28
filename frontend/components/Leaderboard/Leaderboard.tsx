"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Loader2 } from "lucide-react";
import fetchLeaderboard from "@/lib/api/fetchLeaderboard";
import { fetchUserLocation } from "@/lib/api/fetchUserLocation";
import { UserAlt, LeaderboardEntry } from "@/lib/types";
import { useUser } from "@/lib/contexts/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ErrorDisplay from '@/components/ui/error_display';

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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userData, setUserData] = useState<UserAlt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRowRef = useRef<HTMLTableRowElement>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const [userHasLocation, setUserHasLocation] = useState(false);

  const handleUsernameClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (!user) {
        setError('No user data available');
        setIsLoading(false);
        return;
      }
  
      try {
        setIsLoading(true);
        setError(null);
  
        const locationData = user.location_id ? await fetchUserLocation(user.location_id) : null;
        setUserHasLocation(!!locationData);
  
        let filterData = {};
        if (locationData && locationData.value) {
          filterData = {
            province: locationData.value.province,
            city: locationData.value.city,
            suburb: locationData.value.suburb,
          };
        }
  
        const data = await fetchLeaderboard(user.user_id, rankingType, filterData);
  
        setLeaderboardData(data.leaderboard);
        setUserData(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Failed to load leaderboard data');
        setIsLoading(false);
      } finally {
        setIsLoading(false); 
      }
    };
  
    fetchData();
  }, [user, rankingType]);

  useEffect(() => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [rankingType]);

  if (isLoading) {
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

  return (
    <div className={`min-h-screen p-4 max-w-7xl max-h-8xl mx-auto w-full relative ${theme === 'dark' ? 'bg-[#0C0A09] text-[#f5f5f5]' : 'bg-white text-gray-800'}`}>
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarImage src={userData.image_url} alt={userData.fullname} />
          <AvatarFallback>{userData.fullname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-4xl font-bold">{userData.fullname}</h2>
          <p className="text-xl">Points: {userData.user_score}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm">Your {rankingType.charAt(0).toUpperCase() + rankingType.slice(1)} Ranking</p>
          <p className="text-3xl font-bold text-center">
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
            className="block px-4 py-2 hover:bg-gray-200 text"
            onClick={() => { setRankingType('country'); setShowDropdown(false); }}
          >
            Country Ranking
          </button>
          {userHasLocation && (
            <>
              <button
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => { setRankingType('province'); setShowDropdown(false); }}
              >
                Province Ranking
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => { setRankingType('city'); setShowDropdown(false); }}
              >
                City Ranking
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-200"
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
          Set your location to see more detailed ranking information.
          <Button
            onClick={() => router.push('/profile')}
            className="ml-4 bg-yellow-500 text-white"
          >
            Set Location
          </Button>
        </div>
      )}

      <div className={`border rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 relative z-0 ${theme === 'dark' ? 'bg-[#0C0A09]' : 'bg-white'}`}>
        <table className="w-full table-auto">
          <thead className={theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'}>
            <tr className={`text-left ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
              <th className="py-2 px-6">Ranking</th>
              <th className="py-2 px-6">Username</th>
              <th className="py-2 px-6">Points</th>
              {rankingType === 'country' && <th className="py-2 px-6">Province</th>}
              {rankingType === 'country' && <th className="py-2 px-6">City</th>}
              {rankingType === 'country' && <th className="py-2 px-6">Suburb</th>}
              {rankingType === 'city' && <th className="py-2 px-6">City</th>}
              {rankingType === 'suburb' && <th className="py-2 px-6">Suburb</th>}
            </tr>
          </thead>
           <tbody>
        {leaderboardData.map(entry => (
          <tr
            key={entry.userId}
            className={`border-b ${entry.userId === userData.user_id ? theme === 'dark' ? 'bg-green-700 text-black' : 'bg-green-100' : ''}`}
            ref={entry.userId === userData.user_id ? userRowRef : null}
          >
            <td className="py-2 px-6">{entry.rank}</td>
            <td 
              className="py-2 px-6"
              onClick={() => handleUsernameClick(entry.userId)}
              style={{ cursor: "pointer" }}
            >
              {entry.username}
            </td>
            <td className="py-2 px-6">{entry.points}</td>
            {rankingType === 'country' && <td className="py-2 px-6">{entry.province || 'N/A'}</td>}
            {rankingType === 'country' && <td className="py-2 px-6">{entry.city || 'N/A'}</td>}
            {rankingType === 'country' && <td className="py-2 px-6">{entry.suburb || 'N/A'}</td>}
            {rankingType === 'city' && <td className="py-2 px-6">{entry.city || 'N/A'}</td>}
            {rankingType === 'suburb' && <td className="py-2 px-6">{entry.suburb || 'N/A'}</td>}
          </tr>
        ))}
      </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
