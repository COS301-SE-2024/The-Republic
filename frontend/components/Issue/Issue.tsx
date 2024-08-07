import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import UserAvatarWithScore from '@/components/UserAvatarWithScore/UserAvatarWithScore';
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bell, Loader2 } from "lucide-react";
import MoreMenu from "../MoreMenu/MoreMenu";
import { IssueProps, User , Resolution} from "@/lib/types";
import { timeSince } from "@/lib/utils";
import Reaction from "../Reaction/Reaction";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/lib/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { deleteIssue } from "@/lib/api/deleteIssue";
import { SubsParams } from "@/lib/types";
import Image from "next/image";

import { subscribe } from "@/lib/api/subscription";
import { createSelfResolution } from "@/lib/api/createSelfResolution";
import { createExternalResolution } from "@/lib/api/createExternalResolution";
import { respondToResolution } from "@/lib/api/respondToResolution";
import ResolutionModal from '@/components/ResolutionModal/ResolutionModal';
import ResolutionResponseModal from '@/components/ResolutionResponseModal/ResolutionResponseModal';
import { fetchResolutionsForIssue } from "@/lib/api/fetchResolutionsForIssue";
import { checkUserIssuesInCluster } from "@/lib/api/checkUserIssuesInCluster";
import { fetchUserIssueInCluster } from "@/lib/api/fetchUserIssueInCluster";
import MapModal from "@/components/MapModal/MapModal";
import { Sparkles as Star } from "lucide-react";
import { fetchRelatedIssues } from "@/lib/api/fetchRelatedIssues";
import RelatedIssuesModal from "@/components/RelatedIssuesModal/RelatedIssuesModal";


const Issue: React.FC<IssueProps> = ({
  issue,
  id,
  onDeleteIssue,
  onResolveIssue,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [type, setType] = useState("");
  const queryClient = useQueryClient();
  const [showSubscribeDropdown, setShowSubscribeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isResolutionResponseModalOpen, setIsResolutionResponseModalOpen] = useState(false);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [canRespond, setCanRespond] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [resolutionTime, setResolutionTime] = useState<Date | null>(issue.resolved_at ? new Date(issue.resolved_at) : null);
  const [isResolutionResponseLoading, setIsResolutionResponseLoading] = useState(false);
  const [isResolutionSubmitLoading, setIsResolutionSubmitLoading] = useState(false);
  const [isRelatedIssuesModalOpen, setIsRelatedIssuesModalOpen] = useState(false);
  const [relatedIssues, setRelatedIssues] = useState<IssueProps['issue'][]>([]);
  const [hasRelatedIssues, setHasRelatedIssues] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(true);

  const fetchRelatedIssuesData = async () => {
    if (user && issue.cluster_id) {
      try {
        const fetchedIssues = await fetchRelatedIssues(user, issue.issue_id);
        const filteredIssues = fetchedIssues.filter(relatedIssue => relatedIssue.issue_id !== issue.issue_id);
        setRelatedIssues(filteredIssues);
        setHasRelatedIssues(filteredIssues.length > 0);
      } catch (error) {
        console.error("Failed to fetch related issues:", error);
        toast({ variant: "destructive", description: "Failed to fetch related issues" });
      }
    }
  };

  useEffect(() => {
    fetchRelatedIssuesData();
  }, []);

  useEffect(() => {
    const fetchResolutions = async () => {
      try {
        const fetchedResolutions = await fetchResolutionsForIssue(user!, issue.issue_id);
        setResolutions(fetchedResolutions);
      } catch (error) {
        console.error("Failed to fetch resolutions:", error);
        toast({ variant: "destructive", description: "Failed to fetch resolutions" });
      }
    };

    if (user && issue.issue_id) {
      fetchResolutions();
    }
  }, [user, issue.issue_id]);

  const selfResolutionMutation = useMutation({
    mutationFn: (data: { resolutionText: string; proofImage?: File }) =>
      createSelfResolution(user!, issue.issue_id, data.resolutionText, data.proofImage),
    onSuccess: (response) => {
      const resolvedIssue = response;
      queryClient.invalidateQueries({ queryKey: ['issue', issue.issue_id] });
      if (resolvedIssue) {
        onResolveIssue!(issue, resolvedIssue);
        setResolutionTime(new Date());
      }
      toast({ description: "Self-resolution submitted successfully" });
      setIsResolutionModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to submit self-resolution" });
    }
  });

  const externalResolutionMutation = useMutation({
    mutationFn: (data: {
      resolutionText: string;
      resolutionSource: 'unknown' | 'other';
      resolvedBy?: string;
      politicalAssociation?: string;
      stateEntityAssociation?: string;
      proofImage?: File;
    }) => createExternalResolution(
      user!,
      issue.issue_id,
      data.resolutionText,
      data.resolutionSource,
      data.resolvedBy,
      data.politicalAssociation,
      data.stateEntityAssociation,
      data.proofImage
    ),
    onSuccess: (response) => {
      const resolvedIssue = response;
      queryClient.invalidateQueries({ queryKey: ['issue', issue.issue_id] });
      if (resolvedIssue) {
        onResolveIssue!(issue, resolvedIssue);
      }
      toast({ description: "External resolution submitted successfully" });
      setIsResolutionModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to submit external resolution" });
    }
  });


  const handleResolutionSubmit = async (resolutionData: {
    resolutionText: string;
    proofImage: File | null;
    resolutionSource: 'self' | 'unknown' | 'other';
    resolvedBy?: string;
    politicalAssociation?: string;
    stateEntityAssociation?: string;
  }) => {
    setIsResolutionSubmitLoading(true);
    try {
      if (resolutionData.resolutionSource === 'self') {
        await selfResolutionMutation.mutateAsync({
          resolutionText: resolutionData.resolutionText,
          proofImage: resolutionData.proofImage || undefined,
        });
      } else {
        await externalResolutionMutation.mutateAsync({
          resolutionText: resolutionData.resolutionText,
          resolutionSource: resolutionData.resolutionSource as 'unknown' | 'other',
          resolvedBy: resolutionData.resolvedBy,
          politicalAssociation: resolutionData.politicalAssociation,
          stateEntityAssociation: resolutionData.stateEntityAssociation,
          proofImage: resolutionData.proofImage || undefined,
        });
      }
      setIsResolutionModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to submit resolution" });
    } finally {
      setIsResolutionSubmitLoading(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await deleteIssue(user!, issue.issue_id);
    },
    onSuccess: () => {
      toast({
        description: "Succesfully deleted issue",
      });

      onDeleteIssue!(issue);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "Failed to delete issue",
      });

      console.error(error);
    }
  });

  const subscriptionMutation = useMutation({
    mutationFn: async ({ data, url }: { data: SubsParams; url: string }) => {
      return await subscribe(user, data, url);
    },
    onSuccess: (apiResponse) => {
      toast({
        variant: "success",
        description: `${type} ${apiResponse}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "Failed to Subscribe to Issue",
      });

      console.error(error);
    }
  });

  const handleCommentClick = () => {
    router.push(`/issues/${issue.issue_id}`);
  };

  const handleAvatarClick = () => {
    if (!issue.is_anonymous) {
      router.push(`/profile/${issue.user?.user_id}`);
    }
  };

  const handleSubscribe = (type: string) => {
    setShowSubscribeDropdown(false);
    setType(type);

    if (type === "Category") {
      subscriptionMutation.mutate({ data: {
        user_id: `${user?.user_id}`,
        category_id: `${issue?.category_id}`,
      }, url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/category` });
    } else if (type === "Location") {
      subscriptionMutation.mutate({ data: {
        user_id: `${user?.user_id}`,
        location_id: `${issue?.location_id}`,
      }, url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/location` });
    } else {
      subscriptionMutation.mutate({ data: {
        user_id: `${user?.user_id}`,
        issue_id: `${issue?.issue_id}`,
      }, url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/issue` });
    }
  };

  // const handleMapModalOpen = () => {
  //   setIsMapModalOpen(true);
  // };

  const handleMapModalClose = () => {
    setIsMapModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSubscribeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const isOwner = user ? user.user_id === issue.user_id : false;
  const isLoading = deleteMutation.isPending || selfResolutionMutation.isPending || externalResolutionMutation.isPending;

  const userHasIssueInCluster = async (user: User | null, clusterId: string): Promise<boolean> => {
    if (!user || !clusterId) {
      return false;
    }

    try {
      return await checkUserIssuesInCluster(user, clusterId);
    } catch (error) {
      console.error("Failed to check user issues in cluster:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkCanRespond = async () => {
      const canRespond = isOwner || (user && issue.cluster_id && await userHasIssueInCluster(user, issue.cluster_id)) || false;
      setCanRespond(canRespond);
    };

    checkCanRespond();
  }, [isOwner, user, issue.cluster_id]);

  useEffect(() => {
    if (resolutionTime && !isOwner) {
      setShowMoreMenu(false);
    } else {
      setShowMoreMenu(true);
    }
  }, [resolutionTime, isOwner]);

  const menuItems = isOwner ? ["Delete"] : [];
  if (!resolutionTime && !issue.hasPendingResolution) {
    menuItems.push("Resolve Issue");
  }

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "Delete":
        if (isOwner) {
          deleteMutation.mutate();
        }
        break;
      case "Resolve Issue":
        setIsResolutionModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleResolutionResponse = async (accept: boolean) => {
    setIsResolutionResponseLoading(true);
    try {
      if (isOwner && issue.pendingResolutionId) {
        await respondToResolution(user!, issue.pendingResolutionId, accept);
      } else if (user && issue.cluster_id) {
        const userIssue = await fetchUserIssueInCluster(user, issue.cluster_id);
        if (userIssue && userIssue.pendingResolutionId) {
          await respondToResolution(user, userIssue.pendingResolutionId, accept);
        }
      }

      // Optimistically update the UI
      if (accept) {
        setResolutionTime(new Date());
        issue.hasPendingResolution = false;
      }

      // Refetch the issue data
      await queryClient.refetchQueries({ queryKey: ['issue', issue.issue_id] });

      toast({ description: accept ? "Resolution accepted" : "Resolution rejected" });
      setIsResolutionResponseModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to respond to resolution" });
    } finally {
      setIsResolutionResponseLoading(false);
    }
  };




  return (
    <>
      <Card className="mb-4" id={id}>
        <CardHeader className="place-content-stretch">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start sm:items-center">
              <div
                className="pr-2"
                onClick={handleAvatarClick}
                style={{ cursor: issue.is_anonymous ? "default" : "pointer" }}
              >
                <UserAvatarWithScore
                  imageUrl={issue.user.image_url}
                  username={issue.user.fullname}
                  score={issue.user.user_score}
                  className="w-12 h-12"
                  isAnonymous={issue.is_anonymous}
                />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="font-bold">{issue.user?.fullname}</div>
                  <div className="hidden sm:block mx-1 text-sm text-gray-500">·</div>
                  <div className="text-sm text-gray-500">
                    {timeSince(issue.created_at)}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{issue.user?.username}</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              {hasRelatedIssues && (
                <button
                  type="button"
                  className="inline-flex justify-center items-center p-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white hover:from-purple-500 hover:via-pink-600 hover:to-red-600 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => setIsRelatedIssuesModalOpen(true)}
                  title="View Related Issues"
                >
                  <Star className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center items-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none"
                    id="subscribe-menu"
                    onClick={() => setShowSubscribeDropdown(!showSubscribeDropdown)}
                    title="Subscribe"
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                {showSubscribeDropdown && (
                  <div
                    ref={dropdownRef}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="subscribe-menu"
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={() => handleSubscribe("Issue")}
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Subscribe to Issue
                      </button>
                      <button
                        onClick={() => handleSubscribe("Category")}
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Subscribe to Category
                      </button>
                      <button
                        onClick={() => handleSubscribe("Location")}
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Subscribe to Location
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {!isLoading && showMoreMenu && menuItems.length > 0 && (
                <MoreMenu
                  menuItems={menuItems}
                  isOwner={isOwner}
                  onAction={handleMenuAction}
                  onSubscribe={handleSubscribe}
                />
              )}
              {isLoading && <Loader2 className="h-6 w-6 animate-spin text-green-400" />}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">
              {issue.category?.name}
            </Badge>
            <Badge variant="outline" className="hidden sm:inline-flex">
              {issue?.sentiment}
            </Badge>
            {issue.location && (
              <Badge
                variant="outline"
                className={issue.location.latitude && issue.location.longitude ? "cursor-pointer" : ""}
                onClick={() => {
                  if (issue.location?.latitude && issue.location?.longitude) {
                    setIsMapModalOpen(true);
                  }
                }}
              >
                {issue.location.suburb
                  ? `${issue.location.suburb}, ${issue.location.city}, ${issue.location.province}`
                  : `${issue.location.city}, ${issue.location.province}`}
              </Badge>
            )}
            {issue.hasPendingResolution && (
              <Badge
                variant="destructive"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsResolutionResponseModalOpen(true);
                }}
              >
                Resolution Pending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{issue?.content}</p>
          {issue?.image_url && (
            <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-auto mt-4">
              <Image
                src={issue?.image_url}
                alt="Issue"
                layout="responsive"
                width={100}
                height={100}
                className="rounded-lg" />
            </div>
          )}
          {(issue?.resolved_at || resolutionTime) && (
            <div className="flex space-x-2 pt-2">
              <Badge className="">
                Resolved {timeSince(issue.resolved_at || resolutionTime?.toISOString() || '')}
              </Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center cursor-pointer" onClick={handleCommentClick}>
            <MessageCircle className="mr-1" />
            <span>{issue.comment_count}</span>
          </div>
          <Reaction
            issueId={String(issue.issue_id)}
            initialReactions={issue.reactions}
            userReaction={issue.user_reaction} />
        </CardFooter>
      </Card>

      <ResolutionModal
        isOpen={isResolutionModalOpen}
        onClose={() => setIsResolutionModalOpen(false)}
        isSelfResolution={isOwner}
        onSubmit={handleResolutionSubmit}
        isLoading={isResolutionSubmitLoading}
      />
      <ResolutionResponseModal
        isOpen={isResolutionResponseModalOpen}
        onClose={() => setIsResolutionResponseModalOpen(false)}
        onRespond={handleResolutionResponse}
        resolution={resolutions[0]}
        canRespond={canRespond}
        isLoading={isResolutionResponseLoading}
      />
      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          onClose={handleMapModalClose}
          defaultLocation={issue.location
            ? {
                label: issue.location.suburb,
                value: {
                  place_id: "",
                  province: issue.location.province,
                  city: issue.location.city,
                  suburb: issue.location.suburb,
                  district: "",
                  lat: parseFloat(issue.location.latitude),
                  lng: parseFloat(issue.location.longitude)
                }
              }
            : null
          }
        />
      )}
      <RelatedIssuesModal
        isOpen={isRelatedIssuesModalOpen}
        onClose={() => setIsRelatedIssuesModalOpen(false)}
        relatedIssues={relatedIssues}
      />
    </>
  );
};

export default Issue;
