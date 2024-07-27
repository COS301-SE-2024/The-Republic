import React, { useState, useMemo } from 'react';

type RankingType = 'country' | 'city' | 'suburb';

interface UserData {
  name: string;
  id: string;
  countryRanking: number;
  cityRanking: number;
  suburbRanking: number;
  city: string;
  suburb: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  userId: string;
  country: string;
  city: string;
  suburb: string;
  countryRanking: number;
  cityRanking: number;
  suburbRanking: number;
}

const Leaderboard: React.FC = () => {
  const [rankingType, setRankingType] = useState<RankingType>('country');

  // Mock data for current user
  const userData: UserData = {
    name: "Rocko Shely",
    id: "#21345",
    countryRanking: 248,
    cityRanking: 15,
    suburbRanking: 3,
    city: "Cape Town",
    suburb: "Green Point"
  };

  // Generate 50 mock users
  const generateMockData = (): LeaderboardEntry[] => {
    return Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      username: `user${i + 1}`,
      userId: i === 24 ? userData.id : `id${i + 1}`, // Make the 25th user the current user
      country: "South Africa",
      city: i % 5 === 0 ? userData.city : `City${i % 10 + 1}`,
      suburb: i % 10 === 0 ? userData.suburb : `Suburb${i % 20 + 1}`,
      countryRanking: i + 1,
      cityRanking: i % 10 + 1,
      suburbRanking: i % 20 + 1
    }));
  };

  const leaderboardData = useMemo(() => generateMockData(), []);

  const filteredData = useMemo(() => {
    return leaderboardData.filter(user => {
      if (rankingType === 'country') return true;
      if (rankingType === 'city') return user.city === userData.city;
      if (rankingType === 'suburb') return user.suburb === userData.suburb;
      return true;
    }).sort((a, b) => a[`${rankingType}Ranking`] - b[`${rankingType}Ranking`]);
  }, [leaderboardData, rankingType, userData.city, userData.suburb]);

  const getRankingValue = (user: LeaderboardEntry): number => {
    return user[`${rankingType}Ranking`];
  };

  return (
    <div className="p-4 bg-white text-gray-800 max-w-4xl mx-auto">
     
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{userData.name}</h2>
          <p className="text-gray-600">{userData.id}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm">Your {rankingType.charAt(0).toUpperCase() + rankingType.slice(1)} Ranking</p>
          <p className="text-3xl font-bold text-center">
            {userData[`${rankingType}Ranking` as keyof UserData]}
          </p>
        </div>
      </div>

      
      <div className="mb-4">
        <select 
          className="border rounded p-2"
          value={rankingType}
          onChange={(e) => setRankingType(e.target.value as RankingType)}
        >
          <option value="country">Country Ranking</option>
          <option value="city">City Ranking</option>
          <option value="suburb">Suburb Ranking</option>
        </select>
      </div>

      
      <div className="h-96 overflow-y-auto border rounded">
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr className="text-left bg-gray-100">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">User ID</th>
              <th className="py-2 px-4">Country</th>
              <th className="py-2 px-4">City</th>
              <th className="py-2 px-4">Suburb</th>
              <th className="py-2 px-4">Ranking</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr 
                key={user.userId} 
                className={`border-b ${user.userId === userData.id ? 'bg-yellow-100' : ''}`}
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.userId}</td>
                <td className="py-2 px-4">{user.country}</td>
                <td className="py-2 px-4">{user.city}</td>
                <td className="py-2 px-4">{user.suburb}</td>
                <td className="py-2 px-4">{getRankingValue(user)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default Leaderboard;