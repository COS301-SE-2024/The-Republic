import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';
import {fetchLeaderboard} from "@/lib/api/fetchLeaderboard";
import LoadingIndicator from '@/components/ui/loader';

type RankingType = 'country' | 'city' | 'suburb';

interface UserData {
  name: string;
  id: string;
  countryRanking: number;
  cityRanking: number;
  suburbRanking: number;
  city: string;
  suburb: string;
  points: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  userId: string;
  country: string;
  city: string;
  suburb: string;
  points: number;
  countryRanking: number;
  cityRanking: number;
  suburbRanking: number;
}

const Leaderboard: React.FC = () => {
  const { userId } = useParams() satisfies { userId: string };
  const [rankingType, setRankingType] = useState<RankingType>('country');
  const [showDropdown, setShowDropdown] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const userRowRef = useRef<HTMLTableRowElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;
        const data = await fetchLeaderboard(userId, rankingType);
        setLeaderboardData(data.leaderboard);
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchData();
  }, [userId, rankingType]);

  const filteredData = useMemo(() => {
    return leaderboardData
      .filter(user => {
        if (rankingType === 'country') return true;
        if (rankingType === 'city') return user.city === userData?.city;
        if (rankingType === 'suburb') return user.suburb === userData?.suburb;
        return true;
      })
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))
      .slice(0, 10);
  }, [leaderboardData, rankingType, userData?.city, userData?.suburb]);

  useEffect(() => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [rankingType, filteredData]);

  if (!userData) {
    return <LoadingIndicator />;
  }

  return (
    <div className={`min-h-screen p-4 max-w-7xl max-h-8xl mx-auto w-full relative ${theme === 'dark' ? 'bg-[#1a1a1a] text-[#f5f5f5]' : 'bg-white text-gray-800'}`}>
      <div className="flex flex-col items-center mb-6">
        <div className={`w-32 h-32 ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-300'} rounded-full mb-4`}></div>
        <div className="text-center">
          <h2 className="text-4xl font-bold">{userData.name}</h2>
          <p className="text-xl">Points: {userData.points}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm">Your {rankingType.charAt(0).toUpperCase() + rankingType.slice(1)} Ranking</p>
          <p className="text-3xl font-bold text-center">
            {userData[`${rankingType}Ranking` as keyof UserData]}
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
            {filteredData.map(user => (
              <tr 
                key={user.userId} 
                className={`border-b ${user.userId === userData.id ? theme === 'dark' ? 'bg-green-700 text-black' : 'bg-green-100' : ''}`}
                ref={user.userId === userData.id ? userRowRef : null}
              >
                <td className="py-2 px-6">{user.rank}</td>
                <td className="py-2 px-6">{user.username}</td>
                <td className="py-2 px-6">{user.points}</td>
                {rankingType === 'country' && <td className="py-2 px-6">{user.city}</td>}
                {rankingType === 'country' && <td className="py-2 px-6">{user.suburb}</td>}
                {rankingType === 'city' && <td className="py-2 px-6">{user.city}</td>}
                {rankingType === 'suburb' && <td className="py-2 px-6">{user.suburb}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
