import { useRef, useState, useEffect } from "react";
import { useUser } from "@/lib/contexts/UserContext";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import {
  Issue as IssueType,
  RequestBody,
  Resolution,
} from "@/lib/types";
import styles from '@/styles/Feed.module.css';
import { Filter, Loader2, Plus } from "lucide-react";
import { LazyList, LazyListRef } from "../LazyList/LazyList";
import { Location } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { fetchUserLocation } from "@/lib/api/fetchUserLocation";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import FilterModal from "@/components/FilterModal/FilterModal";

const FETCH_SIZE = 2;

const Feed: React.FC = () => {
  const { user } = useUser();
  const lazyRef = useRef<LazyListRef<IssueType>>(null);
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState(searchParams.get("category") ?? "All");
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const loadLocation = async () => {
      setIsLoadingLocation(true);

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
      } else if (user && user.location_id) {
        try {
          const userLocation = await fetchUserLocation(user.location_id);
          if (userLocation) {
            setLocation(() => {
              return { ...userLocation.value, location_id: "" };
            });
          }
        } catch (error) {
          console.error("Error fetching user location:", error);
        }
      }

      setIsLoadingLocation(false);
    };

    if (user !== null) {
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

    if (user) {
      headers.Authorization = `Bearer ${user.access_token}`;
    }

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
    setIsInputModalOpen(false);
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
    <div className="flex justify-center items-center h-32">
      <h3 className="text-lg">No issues</h3>
    </div>
  );

  const FailedIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <h3 className="text-muted-foreground">Failed to fetch issues</h3>
    </div>
  );

  const scrollId = "issues_scroll";

  if (isLoadingLocation) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex h-full">
      <div
        className={`flex-1 px-6 overflow-y-scroll ${styles['feed-scroll']}`}
        id={scrollId}
      >
        <div className="flex justify-between items-center mb-4">
          {user && !isDesktop && (
            <Dialog open={isInputModalOpen} onOpenChange={setIsInputModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 mr-2">
                  <Plus className="mr-2 h-4 w-4" /> Report an Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <IssueInputBox onAddIssue={handleAddIssue} />
              </DialogContent>
            </Dialog>
          )}
          {!isDesktop && (
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FilterModal
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  filter={filter}
                  setFilter={setFilter}
                  location={location}
                  setLocation={setLocation}
                  onClose={() => setIsFilterModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        {user && isDesktop && <IssueInputBox onAddIssue={handleAddIssue} />}
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
          Failed={FailedIndicator}
          Loading={LoadingIndicator}
          Empty={EmptyIndicator}
          parentId={scrollId}
          controlRef={lazyRef}
        />
      </div>
      {isDesktop && (
        <RightSidebar
          sortBy={sortBy}
          setSortBy={setSortBy}
          filter={filter}
          setFilter={setFilter}
          location={location}
          setLocation={setLocation}
        />
      )}
      </div>
  );
};

export default Feed;
