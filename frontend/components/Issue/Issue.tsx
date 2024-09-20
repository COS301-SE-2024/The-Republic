import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import InfoPopover from "@/components/ui/resolution-popover";
import UserAvatarWithScore from '@/components/UserAvatarWithScore/UserAvatarWithScore';
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bell, Loader2, Sparkles as Star } from "lucide-react";
import MoreMenu from "@/components/MoreMenu/MoreMenu";
import { timeSince } from "@/lib/utils";
import Reaction from "@/components/Reaction/Reaction";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useUser } from "@/lib/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";
import { deleteIssue } from "@/lib/api/deleteIssue";
import { SubsParams, IssueProps } from "@/lib/types";
import Image from "next/image";

import { subscribe } from "@/lib/api/subscription";
import { createSelfResolution } from "@/lib/api/createSelfResolution";
import { createExternalResolution } from "@/lib/api/createExternalResolution";
import { respondToResolution } from "@/lib/api/respondToResolution";
import ResolutionModal from '@/components/ResolutionModal/ResolutionModal';
import ResolutionResponseModal from '@/components/ResolutionResponseModal/ResolutionResponseModal';
import MapModal from "@/components/MapModal/MapModal";
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
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isRelatedIssuesModalOpen, setIsRelatedIssuesModalOpen] = useState(false);
  const [isResolutionResponseLoading, setIsResolutionResponseLoading] = useState(false);
  const [isResolutionSubmitLoading, setIsResolutionSubmitLoading] = useState(false);

  const isOwner = user ? user.user_id === issue.user_id : false;
  const canRespond = isOwner || issue.userHasIssueInCluster;
  const hasRelatedIssues = issue.relatedIssues && issue.relatedIssues.length > 0;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await deleteIssue(user!, issue.issue_id);
    },
    onSuccess: () => {
      toast({
        description: "Successfully deleted issue",
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

  const selfResolutionMutation = useMutation({
    mutationFn: (data: { resolutionText: string; proofImage?: File; organizationId?: string }) =>
      createSelfResolution(user!, issue.issue_id, data.resolutionText, data.proofImage, data.organizationId),
    onSuccess: (response) => {
      const resolvedIssue = response;
      queryClient.invalidateQueries({ queryKey: ['issue', issue.issue_id] });
      if (resolvedIssue) {
        onResolveIssue!(issue, resolvedIssue);
        issue.resolved_at = new Date().toISOString();
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
      organizationId?: string;
    }) => createExternalResolution(
      user!,
      issue.issue_id,
      data.resolutionText,
      data.resolutionSource,
      data.resolvedBy,
      data.politicalAssociation,
      data.stateEntityAssociation,
      data.proofImage,
      data.organizationId
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
    organizationIds?: string[];
  }) => {
    setIsResolutionSubmitLoading(true);
    try {
      if (resolutionData.resolutionSource === 'self') {
        await selfResolutionMutation.mutateAsync({
          resolutionText: resolutionData.resolutionText,
          proofImage: resolutionData.proofImage || undefined,
          organizationId: resolutionData.organizationIds?.[0],
        });
      } else {
        await externalResolutionMutation.mutateAsync({
          resolutionText: resolutionData.resolutionText,
          resolutionSource: resolutionData.resolutionSource,
          resolvedBy: resolutionData.resolvedBy,
          proofImage: resolutionData.proofImage || undefined,
          organizationId: resolutionData.organizationIds?.[0],
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

  const handleResolutionResponse = async (accept: boolean, rating?: number) => {
    setIsResolutionResponseLoading(true);
    try {
      await respondToResolution(user!, issue.pendingResolutionId!, accept, rating);

      // Optimistically update the UI
      if (accept) {
        issue.resolved_at = new Date().toISOString();
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

  const handleMapModalClose = () => {
    setIsMapModalOpen(false);
  };

  const isLoading = deleteMutation.isPending || selfResolutionMutation.isPending || externalResolutionMutation.isPending;

  const [showMoreMenu, setShowMoreMenu] = useState(true);

  useEffect(() => {
    if (issue.resolved_at && !isOwner) {
      setShowMoreMenu(false);
    } else {
      setShowMoreMenu(true);
    }
  }, [issue.resolved_at, isOwner]);

  const menuItems = isOwner ? ["Delete"] : [];
  if (!issue.resolved_at && !issue.hasPendingResolution) {
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

  return (
    <>
      <Card className="mb-4" id={id} data-testid="issue-item">
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
              <InfoPopover message={issue.forecast}/>
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
          {issue?.resolved_at && (
            <div className="flex space-x-2 pt-2">
              <Badge className="">
                Resolved {timeSince(issue.resolved_at)}
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
            itemId={String(issue.issue_id)}
            itemType={"issue"}
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
        resolution={issue.resolutions && issue.resolutions.length > 0 ? issue.resolutions[0] : null}
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
        issues={issue.relatedIssues || []}
      />
    </>
  );
};

export default Issue;
