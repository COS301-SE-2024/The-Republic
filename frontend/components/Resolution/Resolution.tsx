import React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Resolution as ResolutionType } from "@/lib/types";
import { timeSince } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResolution } from "@/lib/api/deleteResolution";
import { toast } from "@/components/ui/use-toast";

interface ResolutionProps {
  resolution: ResolutionType;
}

const Resolution: React.FC<ResolutionProps> = ({ resolution }) => {
  const router = useRouter();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteResolution(user!, resolution.resolution_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_resolutions", user?.user_id] });
      toast({ description: "Resolution deleted successfully" });
    },
    onError: () => {
      toast({ variant: "destructive", description: "Failed to delete resolution" });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this resolution?")) {
      deleteMutation.mutate();
    }
  };

  const handleSeeIssue = () => {
    router.push(`/issues/${resolution.issue_id}`);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Badge variant={resolution.status === 'accepted' ? "default" : "outline"}>
              {resolution.status.charAt(0).toUpperCase() + resolution.status.slice(1)}
            </Badge>
            <span className="ml-2 text-sm text-gray-500">
              {timeSince(resolution.created_at)}
            </span>
          </div>
          {resolution.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p>{resolution.resolution_text}</p>
        {resolution.proof_image && (
          <div className="relative w-1/4 h-auto mt-4">
            <Image
              src={(resolution.proof_image)}
              alt="Proof"
              layout="responsive"
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleSeeIssue}>
          <ExternalLink className="h-4 w-4 mr-2" />
          See Related Issue
        </Button>
        {resolution.proof_image && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => resolution.proof_image && window.open(resolution.proof_image, '_blank')}
          >
            <ImageIcon className="h-2 w-2 mr-1" />
            View Full Image
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Resolution;
