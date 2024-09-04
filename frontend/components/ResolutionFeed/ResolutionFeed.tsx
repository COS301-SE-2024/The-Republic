import React from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { Resolution as ResolutionType } from "@/lib/types";
import Resolution from "../Resolution/Resolution";
import { FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchUserResolutions } from "@/lib/api/fetchUserResolutions";
import ErrorPage from "@/components/ui/error_page";

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
        <ErrorPage
          message="Failed to load resolutions."
          error="We encountered a problem while trying to load resolutions. Please check your connection and try reloading the page."
        />
      ) : resolutions.length > 0 ? (
        resolutions.map((resolution) => (
          <Resolution key={resolution.resolution_id} resolution={resolution} />
        ))
      ) : (
        <ErrorPage
          message="No resolutions found."
          error="It seems there are no resolutions to display. Please check back later."
        />
      )}
    </div>
  );
};

export default ResolutionFeed;