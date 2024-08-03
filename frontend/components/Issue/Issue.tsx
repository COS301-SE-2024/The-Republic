import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { deleteIssue } from "@/lib/api/deleteIssue";
import { createSelfResolution } from "@/lib/api/createSelfResolution";
import { createExternalResolution } from "@/lib/api/createExternalResolution";
import { respondToResolution } from "@/lib/api/respondToResolution";
import ResolutionModal from '@/components/ResolutionModal/ResolutionModal';
import ResolutionResponseModal from '@/components/ResolutionResponseModal/ResolutionResponseModal';
import { fetchResolutionsForIssue } from "@/lib/api/fetchResolutionsForIssue";
import { checkUserIssuesInCluster } from "@/lib/api/checkUserIssuesInCluster";
import { fetchUserIssueInCluster } from "@/lib/api/fetchUserIssueInCluster";
import MapModal from "@/components/MapModal/MapModal";

const Issue: React.FC<IssueProps> = ({
  issue,
  id,
  onDeleteIssue,
  onResolveIssue,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSubscribeDropdown, setShowSubscribeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isResolutionResponseModalOpen, setIsResolutionResponseModalOpen] = useState(false);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [canRespond, setCanRespond] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [resolutionTime, setResolutionTime] = useState<Date | null>(issue.resolved_at ? new Date(issue.resolved_at) : null);

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
      //console.log(resolvedIssue);
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
      const resolvedIssue = response; // Assuming response has the structure you shared
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
  

  const handleResolutionSubmit = (resolutionData: {
    resolutionText: string;
    proofImage: File | null;
    resolutionSource: 'self' | 'unknown' | 'other';
    resolvedBy?: string;
    politicalAssociation?: string;
    stateEntityAssociation?: string;
  }) => {
    if (resolutionData.resolutionSource === 'self') {
      selfResolutionMutation.mutate({
        resolutionText: resolutionData.resolutionText,
        proofImage: resolutionData.proofImage || undefined,
      });
    } else {
      externalResolutionMutation.mutate({
        resolutionText: resolutionData.resolutionText,
        resolutionSource: resolutionData.resolutionSource as 'unknown' | 'other',
        resolvedBy: resolutionData.resolvedBy,
        politicalAssociation: resolutionData.politicalAssociation,
        stateEntityAssociation: resolutionData.stateEntityAssociation,
        proofImage: resolutionData.proofImage || undefined,
      });
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

  const handleCommentClick = () => {
    router.push(`/issues/${issue.issue_id}`);
  };

  const handleAvatarClick = () => {
    if (!issue.is_anonymous) {
      router.push(`/profile/${issue.user.user_id}`);
    }
  };

  const handleSubscribe = (type: string) => {
    setShowSubscribeDropdown(false);
    console.log("Subscribed to:", type);
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
    try {
      if (isOwner && issue.pendingResolutionId) {
        // Owner is responding to the resolution for their own issue
        await respondToResolution(user!, issue.pendingResolutionId, accept);
        queryClient.invalidateQueries({ queryKey: ['issue', issue.issue_id] });
        toast({ description: accept ? "Resolution accepted" : "Resolution rejected" });
        setIsResolutionResponseModalOpen(false);
      } else if (user && issue.cluster_id) {
        // Non-owner user is responding to the resolution for their issue in the same cluster
        const userIssue = await fetchUserIssueInCluster(user, issue.cluster_id);
  
        if (userIssue && userIssue.pendingResolutionId) {
          await respondToResolution(user, userIssue.pendingResolutionId, accept);
          queryClient.invalidateQueries({ queryKey: ['issue', userIssue.issue_id] });
          toast({ description: accept ? "Resolution accepted for your issue" : "Resolution rejected for your issue" });
          setIsResolutionResponseModalOpen(false);
        } else {
          //console.log("No pending resolution found for the user's issue in the cluster.");
        }
      } else {
        //console.log("User cannot respond to the resolution.");
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to respond to resolution" });
    }
  };

  return (
    <><Card className="mb-4" id={id}>
      <CardHeader className="place-content-stretch">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div
              className="pr-2"
              onClick={handleAvatarClick}
              style={{ cursor: issue.is_anonymous ? "default" : "pointer" }}
            >
              <Avatar>
                <AvatarImage src={issue.user.image_url} />
                <AvatarFallback>{issue.user.fullname[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="flex items-center">
                <div className="font-bold">{issue.user.fullname}</div>
                <div className="mx-1 text-sm text-gray-500">·</div>
                <div className="text-sm text-gray-500">
                  {timeSince(issue.created_at)}
                </div>
              </div>
              <div className="text-sm text-gray-600">{issue.user.username}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
            {!isLoading && (
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
        <div className="flex space-x-2 pt-2">
          <Badge variant="outline" className="">
            {issue.category.name}
          </Badge>
          <Badge variant="outline" className="">
            {issue.sentiment}
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
              onClick={() => setIsResolutionResponseModalOpen(true)}
            >
              Resolution Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{issue.content}</p>
        {issue.image_url && (
          <div className="relative w-1/4 h-auto mt-4">
            <Image
              src={issue.image_url}
              alt="Issue"
              layout="responsive"
              width={100}
              height={100}
              className="rounded-lg" />
          </div>
        )}
        {(issue.resolved_at || resolutionTime) && (
          <div className="flex space-x-2 pt-2">
            <Badge className="">
              Resolved {timeSince(issue.resolved_at || resolutionTime?.toISOString() || '')}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex space-x-2 items-center">
        <div className="flex items-center" onClick={handleCommentClick}>
          <MessageCircle className="mr-1 cursor-pointer" />
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
      />
    <ResolutionResponseModal
      isOpen={isResolutionResponseModalOpen}
      onClose={() => setIsResolutionResponseModalOpen(false)}
      onRespond={handleResolutionResponse}
      resolution={resolutions[0]}
      canRespond={canRespond}
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

      </>
  );
};

export default Issue;
