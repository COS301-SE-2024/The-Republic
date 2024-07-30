import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';

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
  const [rankingType, setRankingType] = useState<RankingType>('country');
  const [showDropdown, setShowDropdown] = useState(false);
  const userRowRef = useRef<HTMLTableRowElement>(null);

  // Mock data for current user
  const userData: UserData = {
    name: "Rocko Shely",
    id: "#21345",
    countryRanking: 248,
    cityRanking: 15,
    suburbRanking: 3,
    city: "Cape Town",
    suburb: "Green Point",
    points: 1234 
  };

  // Generate mock data
  const generateMockData = (): LeaderboardEntry[] => {
    const data: LeaderboardEntry[] = [];
    for (let i = 1; i <= 300; i++) {
      const entry: LeaderboardEntry = {
        rank: i,
        username: i === userData.countryRanking ? userData.name : `user${i}`,
        userId: i === userData.countryRanking ? userData.id : `id${i}`,
        country: "South Africa",
        city: i % 20 === 0 ? userData.city : `City${i % 10 + 1}`,
        suburb: i % 50 === 0 ? userData.suburb : `Suburb${i % 20 + 1}`,
        points: Math.floor(Math.random() * 2000),
        countryRanking: i,
        cityRanking: i % 20 === 0 ? (i / 20) : Math.floor(Math.random() * 50) + 1,
        suburbRanking: i % 50 === 0 ? (i / 50) : Math.floor(Math.random() * 20) + 1
      };
      if (i === userData.countryRanking) {
        entry.city = userData.city;
        entry.suburb = userData.suburb;
        entry.cityRanking = userData.cityRanking;
        entry.suburbRanking = userData.suburbRanking;
        entry.points = userData.points;
      }
      data.push(entry);
    }
    return data;
  };

  const leaderboardData = useMemo(() => generateMockData(), []);

  const filteredData = useMemo(() => {
    return leaderboardData
      .filter(user => {
        if (rankingType === 'country') return true;
        if (rankingType === 'city') return user.city === userData.city;
        if (rankingType === 'suburb') return user.suburb === userData.suburb;
        return true;
      })
      .sort((a, b) => b.points - a.points);
  }, [leaderboardData, rankingType, userData.city, userData.suburb]);

  useEffect(() => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [rankingType]);

  return (
    <div className="p-4 bg-white text-gray-800 max-w-7xl max-h-8xl mx-auto w-full">
     
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
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

      <div className="mb-4 relative">
        <button 
          className="border rounded p-2 flex items-center"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <SlidersHorizontal className="mr-2" /> Filter
        </button>
        {showDropdown && (
          <div className="absolute mt-2 border rounded bg-white shadow-lg">
            <button 
              className="block px-4 py-2 hover:bg-gray-200"
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

      <div className="h-96 overflow-y-auto border rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white">
            <tr className="text-left bg-gray-100">
              <th className="py-2 px-6">Ranking</th>
              <th className="py-2 px-6">Username</th>
              <th className="py-2 px-6">Points</th>
              {rankingType === 'city' && <th className="py-2 px-6">City</th>}
              {(rankingType === 'suburb' || rankingType === 'country') && <th className="py-2 px-6">Suburb</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr 
                key={user.userId} 
                className={`border-b ${user.userId === userData.id ? 'bg-green-100' : ''}`}
                ref={user.userId === userData.id ? userRowRef : null}
              >
                <td className="py-2 px-6">{user.rank}</td>
                <td className="py-2 px-6">{user.username}</td>
                <td className="py-2 px-6">{user.points}</td>
                {rankingType === 'city' && <td className="py-2 px-6">{user.city}</td>}
                {(rankingType === 'suburb' || rankingType === 'country') && <td className="py-2 px-6">{user.suburb}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
