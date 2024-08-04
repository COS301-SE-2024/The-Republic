import { useRef, useState } from "react";
import { useUser } from "@/lib/contexts/UserContext";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import {
  Issue as IssueType,
  RequestBody,
} from "@/lib/types";
import styles from '@/styles/Feed.module.css';
import { Loader2 } from "lucide-react";
import { LazyList, LazyListRef } from "../LazyList/LazyList";
import { Location } from "@/lib/types";
import { useSearchParams } from "next/navigation";

const FETCH_SIZE = 2;

const Feed: React.FC = () => {
  const { user } = useUser();
  const lazyRef = useRef<LazyListRef<IssueType>>(null);
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState(searchParams.get("category") ?? "All");
  const [location, setLocation] = useState<Location | null>(() => {
    const locationString = searchParams.get("location");

    if (!locationString) {
      return null;
    }

    const locationParts = locationString?.split(", ").slice(1);

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

    return locationObject;
  });

  const fetchIssues = async (from: number, amount: number) => {
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
  };

  const handleDeleteIssue = (issue: IssueType) => {
    lazyRef.current?.remove(issue);
  };

  const handleResolveIssue = (issue: IssueType, resolvedIssue: IssueType) => {
    lazyRef.current?.update(issue, resolvedIssue);
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

  return (
    <div className="flex h-full">
      <div
        className={`flex-1  px-6  overflow-y-scroll ${styles['feed-scroll']}`}
        id={scrollId}
      >
        { user && <IssueInputBox onAddIssue={handleAddIssue}/>}
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
      <RightSidebar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filter={filter}
        setFilter={setFilter}
        location={location}
        setLocation={setLocation}
      />
    </div>
  );
};

export default Feed;
