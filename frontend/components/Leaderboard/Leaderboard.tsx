import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from 'next-themes';
import fetchLeaderboard from "@/lib/api/fetchLeaderboard";
import { fetchUserLocation } from "@/lib/api/fetchUserLocation"; // Import the location fetching function
import LoadingIndicator from '@/components/ui/loader';
import { UserAlt, LeaderboardEntry, LocationType } from "@/lib/types";
import { useUser } from "@/lib/contexts/UserContext";

type RankingType = 'country' | 'city' | 'suburb';

const Leaderboard: React.FC = () => {
  const { user } = useUser();
  const [rankingType, setRankingType] = useState<RankingType>('country');
  const [showDropdown, setShowDropdown] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userData, setUserData] = useState<UserAlt | null>(null);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRowRef = useRef<HTMLTableRowElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('No user data available');
        setIsLoading(false);
        return;
      }
  
      try {
        setIsLoading(true);
        setError(null);
  
        const locationData = user.location_id ? await fetchUserLocation(user.location_id) : null;
  
        console.log('Sending request with data:', {
          userId: user.user_id,
          ...locationData ? locationData.value : {},
        });
  
        const data = await fetchLeaderboard(user.user_id, rankingType, locationData ? locationData.value : {});
  
        console.log('Fetched leaderboard data:', data);
  
        setLeaderboardData(data.leaderboard);
        setUserData(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Failed to load leaderboard data');
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [user, rankingType]);
  

  const filteredData = useMemo(() => {
    if (!userData || !userLocation) return [];

    return leaderboardData
      .filter(entry => {
        if (rankingType === 'country') return true;
        if (rankingType === 'city') return entry.city === userLocation.value.city;
        if (rankingType === 'suburb') return entry.suburb === userLocation.value.suburb;
        return true;
      })
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))
      .slice(0, 10);
  }, [leaderboardData, rankingType, userLocation]);

  useEffect(() => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [rankingType, filteredData]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className={`min-h-screen p-4 max-w-7xl max-h-8xl mx-auto w-full relative ${theme === 'dark' ? 'bg-[#1a1a1a] text-[#f5f5f5]' : 'bg-white text-gray-800'}`}>
      {/* User Data Display */}
      <div className="flex flex-col items-center mb-6">
        <div className={`w-32 h-32 ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-300'} rounded-full mb-4`}></div>
        <div className="text-center">
          <h2 className="text-4xl font-bold">{userData.fullname}</h2>
          <p className="text-xl">Points: {userData.total_issues}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm">Your {rankingType.charAt(0).toUpperCase() + rankingType.slice(1)} Ranking</p>
          <p className="text-3xl font-bold text-center">
            {userLocation ? userLocation.label || 'N/A' : 'N/A'}
          </p>
        </div>
      </div>

      {/* Filter Dropdown */}
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
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className={`border rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 relative z-0 ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
        <table className="w-full table-auto">
          <thead className={theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'}>
            <tr className={`text-left ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
              <th className="py-2 px-6">Ranking</th>
              <th className="py-2 px-6">Username</th>
              <th className="py-2 px-6">Points</th>
              {rankingType === 'country' && <th className="py-2 px-6">City</th>}
              {rankingType === 'country' && <th className="py-2 px-6">Suburb</th>}
              {rankingType === 'city' && <th className="py-2 px-6">City</th>}
              {rankingType === 'suburb' && <th className="py-2 px-6">Suburb</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map(entry => (
              <tr 
                key={entry.userId} 
                className={`border-b ${entry.userId === userData.user_id ? theme === 'dark' ? 'bg-green-700 text-black' : 'bg-green-100' : ''}`}
                ref={entry.userId === userData.user_id ? userRowRef : null}
              >
                <td className="py-2 px-6">{entry.rank}</td>
                <td className="py-2 px-6">{entry.username}</td>
                <td className="py-2 px-6">{entry.points}</td>
                {rankingType === 'country' && <td className="py-2 px-6">{entry.city}</td>}
                {rankingType === 'country' && <td className="py-2 px-6">{entry.suburb}</td>}
                {rankingType === 'city' && <td className="py-2 px-6">{entry.city}</td>}
                {rankingType === 'suburb' && <td className="py-2 px-6">{entry.suburb}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
