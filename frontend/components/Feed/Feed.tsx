import React, { useRef, useState, useEffect } from "react";
import Issue from "@/components/Issue/Issue";

const IssueInputBox = React.lazy(() => import("@/components/IssueInputBox/IssueInputBox"));
const MobileIssueInput = React.lazy(() => import("@/components/MobileIssueInput/MobileIssueInput"));
const RightSidebar = React.lazy(() => import('@/components/RightSidebar/RightSidebar'));

import {
  Issue as IssueType,
  RequestBody,
  Resolution,
  Location,
  UserContextType,
} from "@/lib/types";

import styles from '@/styles/Feed.module.css';
import { ArrowLeft, Filter, Loader2, Plus } from "lucide-react";
import { LazyList, LazyListRef } from "@/components/LazyList/LazyList";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUserLocation } from "@/lib/api/fetchUserLocation";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/ui/error_page";
import FilterModal from "@/components/FilterModal/FilterModal";

const FETCH_SIZE = 10;

let lastSortBy: string;
let lastFilter: string;
let lastLocation: Location | null;

const Feed: React.FC<UserContextType> = ({ user }) => {
  const lazyRef = useRef<LazyListRef<IssueType>>(null);
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(lastSortBy ?? "newest");
  const [filter, setFilter] = useState(lastFilter ?? searchParams.get("category") ?? "All");
  const [location, setLocation] = useState<Location | null>(lastLocation ?? null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(lastLocation === undefined);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isMobileIssueInputOpen, setIsMobileIssueInputOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const locationString = searchParams.get("location");
    if (locationString) {
      const locationParts = locationString.split(", ").slice(1);
      const locationObject: Location = {
        location_id: "",
        province: locationParts[0],
        city: "",
        suburb: "",
        district: locationParts.slice(-1)[0],
      };

      if (locationParts.length >= 3) {
        locationObject.city = locationParts[1];
      }

      if (locationParts.length === 4) {
        locationObject.suburb = locationParts[2];
      }

      setLocation(locationObject);
      setIsLoadingLocation(false);
      return;
    }

    const loadLocation = async () => {
      setIsLoadingLocation(true);

      if (user && user.location_id) {
        try {
          const userLocation = await fetchUserLocation(user.location_id);
          if (userLocation) {
            lastLocation = { ...userLocation.value, location_id: "" };
            setLocation({...lastLocation});
          }
        } catch (error) {
          console.error("Error fetching user location:", error);
        }
      }

      setIsLoadingLocation(false);
    };

    if (lastLocation === undefined) {
      loadLocation();
    }
  }, [user, searchParams]);

  const fetchIssues = async (from: number, amount: number) => {
    if (isLoadingLocation) {
      return [];
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // if (user) {
    //   headers.Authorization = `Bearer ${user.access_token}`;
    // }

    const requestBody: RequestBody = {
      from,
      amount,
      order_by: (() => {
        switch (sortBy) {
          case "newest":
          case "oldest":
            return "created_at";
          default:
            return "comment_count";
        }
      })(),
      ascending: sortBy === "oldest",
    };

    if (filter !== "All") {
      requestBody.category = filter;
    }

    if (location) {
      requestBody.location = location;
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    const apiResponse = await response.json();

    if (apiResponse.success) {
      return apiResponse.data as IssueType[];
    } else {
      throw new Error(apiResponse.error);
    }
  };

  const handleAddIssue = (issue: IssueType) => {
    lazyRef.current?.add(issue);
    setIsMobileIssueInputOpen(false);
  };

  const handleDeleteIssue = (issue: IssueType) => {
    lazyRef.current?.remove(issue);
  };

  const handleResolveIssue = (issue: IssueType, resolution: Resolution) => {
    const updatedIssue = {
      ...issue,
      hasPendingResolution: true,
      resolutionId: resolution.resolution_id,
    };

    lazyRef.current?.update(issue, updatedIssue);
  };

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <Loader2 className="h-6 w-6 animate-spin text-green-400" />
    </div>
  );

  const EmptyIndicator = () => (
    <ErrorPage
      message="No reports available in this area."
      error="It looks like there are no recent reports for your selected location. Feel free to submit a report if you’re experiencing any issues, or check back later for updates."
      showReloadButton={true}
    />
  );
  
  // const FailedIndicator = () => (
  //   <ErrorPage
  //     message="Failed to fetch issues."
  //     error="It seems there are no issues to display. Please refresh the page or try login."
  //     showReloadButton={true}
  //   />
  // );

  const FailedLazyIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <h3 className="text-muted-foreground">Failed to fetch issues</h3>
    </div>
  );

  const scrollId = "issues_scroll";

  useEffect(() => {
    const feed = document.querySelector(`#${scrollId}`) as HTMLDivElement;
    if (!feed) {
      return;
    }

    const savedFeedScroll = sessionStorage.getItem("feedScroll");
    if (savedFeedScroll) {
      feed.scroll({
        top: Number.parseFloat(savedFeedScroll),
        behavior: "instant"
      });
    }

    let isHandling: boolean;
    feed.onscroll = () => {
      if (isHandling) {
        return;
      }

      isHandling = true;
      setTimeout(() => {
        sessionStorage.setItem("feedScroll", feed.scrollTop.toString());
        isHandling = false;
      }, 250);
    };
  }, [isLoadingLocation]);

  if (isLoadingLocation) {
    return <LoadingIndicator />;
  }

  const isVizFiltering = !!searchParams.get("location");

  return (
    <div className="flex h-full relative">
      <div
        className={`flex-1 px-6 overflow-y-scroll ${styles['feed-scroll']}`}
        id={scrollId}
      >
        <div className="flex justify-end items-center mb-4">
          {!isDesktop && (
            <Button
              variant="outline"
              className="flex-shrink-0"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
        {user && isDesktop && <IssueInputBox user={user} onAddIssue={handleAddIssue} />}
        {isVizFiltering && (
          <div className="mx-auto w-max max-w-[80vw] mb-2 text-center">
            <Button 
              variant="ghost" 
              className="text-green-300 inline mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="inline scale-90"/> Back
            </Button>
            <p className="inline text-muted-foreground">
              Viewing {filter.toLowerCase()} issues in {location?.suburb || location?.city} from Visualization
            </p>
          </div>
        )}
        <LazyList
          pageSize={FETCH_SIZE}
          fetcher={fetchIssues}
          fetchKey={[
            "feed-issues",
            sortBy,
            filter,
            location
          ]}
          Item={({ data }) => (
            <Issue
              issue={data}
              onDeleteIssue={handleDeleteIssue}
              onResolveIssue={handleResolveIssue}
            />
          )}
          Failed={FailedLazyIndicator}
          Loading={LoadingIndicator}
          Empty={EmptyIndicator}
          parentId={scrollId}
          controlRef={lazyRef}
          uniqueId="feed-issues"
          adFrequency={10}
        />
      </div>
      {isDesktop && (
        <RightSidebar
          sortBy={sortBy}
          setSortBy={(sortBy) => {
            lastSortBy = sortBy;
            setSortBy(lastSortBy);
          }}
          filter={filter}
          setFilter={(filter) => {
            lastFilter = filter;
            setFilter(lastFilter);
          }}
          location={location}
          setLocation={(location) => {
            lastLocation = location;
            setLocation(lastLocation && {...lastLocation});
          }}
        />
      )}
      {!isDesktop && (
        <>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg"
            onClick={() => setIsMobileIssueInputOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
          {isMobileIssueInputOpen && (
            <MobileIssueInput user={user}
              onClose={() => setIsMobileIssueInputOpen(false)}
              onAddIssue={handleAddIssue}
            />
          )}
          {isFilterModalOpen && (
            <FilterModal
              sortBy={sortBy}
              setSortBy={(sortBy) => {
                lastSortBy = sortBy;
                setSortBy(lastSortBy);
              }}
              filter={filter}
              setFilter={(filter) => {
                lastFilter = filter;
                setFilter(lastFilter);
              }}
              location={location}
              setLocation={(location) => {
                lastLocation = location;
                setLocation(lastLocation && {...lastLocation});
              }}
              onClose={() => setIsFilterModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
