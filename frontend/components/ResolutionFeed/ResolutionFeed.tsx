import React from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { Resolution as ResolutionType } from "@/lib/types";
import Resolution from "@/components/Resolution/Resolution";
import { FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchUserResolutions } from "@/lib/api/fetchUserResolutions";

interface ResolutionFeedProps {
  userId: string;
}

const ResolutionFeed: React.FC<ResolutionFeedProps> = ({ userId }) => {
  const { user } = useUser();

  const {
    data: resolutions = [],
    isLoading,
    isError,
  } = useQuery<ResolutionType[]>({
    queryKey: ["user_resolutions", userId],
    queryFn: () => fetchUserResolutions(user!, userId),
    enabled: Boolean(user?.access_token),
  });

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-24">
      <FaSpinner className="animate-spin text-4xl text-green-500" />
    </div>
  );

  return (
    <div className="w-full px-6">
      {isLoading ? (
        <LoadingIndicator />
      ) : isError ? (
        <p className="text-center text-red-500 mt-4">Failed to load resolutions.</p>
      ) : resolutions.length > 0 ? (
        resolutions.map((resolution) => (
          <Resolution key={resolution.resolution_id} resolution={resolution} />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No resolutions found.</p>
      )}
    </div>
  );
};

export default ResolutionFeed;