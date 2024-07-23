import { useRef, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import {
  Issue as IssueType,
  RequestBody,
} from "@/lib/types";
import styles from './Feed.module.css';
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/contexts/UserContext";
import { LazyList, LazyListRef } from "../LazyList/LazyList";

const FETCH_SIZE = 2;

const Feed: React.FC = () => {
  const { user } = useUser();
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("All");
  const lazyRef = useRef<LazyListRef<IssueType>>(null);

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
      // Should throw or return null here
      return [];
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
          Item={({ data }) => (
            <Issue
              issue={data}
              onDeleteIssue={handleDeleteIssue}
              onResolveIssue={handleResolveIssue}
            />
          )}
          Loading={LoadingIndicator}
          Empty={EmptyIndicator}
          parentId={scrollId}
          controlRef={lazyRef}
        />
      </div>
      <RightSidebar
        sortBy={sortBy}
        setSortBy={(_sortyBy) => {
          lazyRef.current?.reload();
          setSortBy(_sortyBy);
        }}
        filter={filter}
        setFilter={(_filter) => {
          lazyRef.current?.reload();
          setFilter(_filter);
        }}
      />
    </div>
  );
};

export default Feed;
