import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import {
  Issue as IssueType,
  UserAlt,
  RequestBody,
  FeedProps,
} from "@/lib/types";
import { supabase } from "@/lib/globals";
import styles from './Feed.module.css';
import { Loader2 } from "lucide-react";

const FETCH_SIZE = 2;

const Feed: React.FC<FeedProps> = ({ showInputBox = true }) => {
  const [issues, setIssues] = useState<(IssueType | "Loading")[]>(["Loading"]);
  const [user, setUser] = useState<UserAlt | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // TODO: Check this in user context
    const fetchUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (!error && sessionData.session) {
        const session = sessionData.session;
        const userDetailsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${session.user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );

        if (userDetailsResponse.ok) {
          const userDetails = await userDetailsResponse.json();
          const user: UserAlt = {
            user_id: session.user.id,
            fullname: userDetails.data.fullname,
            image_url: userDetails.data.image_url,
            email_address: session.user.email as string,
            username: userDetails.data.username,
            bio: userDetails.data.bio,
            is_owner: false,
            total_issues: 0,
            resolved_issues: 0,
            access_token: session.access_token,
          };
          setUser(user);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (issues[issues.length - 1] === "Loading") {
      const loadFrom = issues.length - FETCH_SIZE;

      let ignoreResult = false;
      const fetchIssues = async () => {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (user) {
          headers.Authorization = `Bearer ${user.access_token}`;
        }

        const requestBody: RequestBody = {
          from: loadFrom <= 0 ? 0 : (loadFrom - 1) + FETCH_SIZE,
          amount: FETCH_SIZE,
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

        if (ignoreResult) return;

        if (apiResponse.success) {
          const apiIssues = apiResponse.data as IssueType[];

          issues.pop();
          if (apiIssues.length > 0) {
            setIssues([...issues, ...apiIssues, "Loading"]);
          } else {
            setIssues([...issues]);
          }
        }
      };

      let observer: IntersectionObserver | null = null;

      if (loadFrom > 0) {
        const handleIntersection = (
          [entry]: IntersectionObserverEntry[],
          observer: IntersectionObserver
        )  => {
          if (!entry.isIntersecting) return;

          observer.unobserve(entry.target);
          fetchIssues();
        };

        const loadFromElement = document.querySelector(`#issue_${loadFrom}`);
        const rootElement = document.querySelector("#issues_scroll");

        observer = new IntersectionObserver(handleIntersection, {
          root: rootElement,
        });

        observer.observe(loadFromElement!);
      } else {
        fetchIssues();
      }

      return () => {
        ignoreResult = true;
        observer?.disconnect();
      };
    }
  });

  const LoadingIndicator = ({ id }: { id: string}) => (
    <div className="flex justify-center items-center h-32" id={id}>
      <Loader2 className="h-6 w-6 animate-spin text-green-400" />
    </div>
  );

  return (
    <div className="flex h-full">
      <div
        className={`flex-1 overflow-y-auto px-6 ${styles['feed-scroll']}`}
        id="issues_scroll"
      >
        {showInputBox && user && <IssueInputBox user={user} />}
        { issues.length > 0
          ? issues.map((issue, index) => {
            const id = `issue_${index + 1}`;

            if (issue === "Loading") {
              return <LoadingIndicator id={id}/>;
            } else {
              return <Issue issue={issue} id={id}/>;
            }
          })
          : (
            <div className="flex justify-center items-center h-32">
              <h3 className="text-lg">No issues</h3>
            </div>
          )
        }
      </div>
      <RightSidebar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
};

export default Feed;
