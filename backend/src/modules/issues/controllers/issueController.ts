import { Request, Response } from "express";
import IssueService from "@/modules/issues/services/issueService";
import { APIResponse, APIError } from "@/types/response";
import { sendResponse } from "@/utilities/response";
import multer from "multer";

const issueService = new IssueService();
const upload = multer({ storage: multer.memoryStorage() });

const handleError = (res: Response, err: unknown) => {
  console.error(err);
  if (err instanceof Error) {
    sendResponse(
      res,
      APIError({
        code: 500,
        success: false,
        error: err.message || "An unexpected error occurred",
      }),
    );
  } else {
    sendResponse(res, err as APIResponse);
  }
};

export const getIssues = async (req: Request, res: Response) => {
  try {
    const response = await issueService.getIssues(req.body);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const response = await issueService.getIssueById(req.body);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const createIssue = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const response = await issueService.createIssue(req.body, file);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  },
];

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.updateIssue(req.body);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.deleteIssue(req.body);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const resolveIssue = async (req: Request, res: Response) => {
  try {
    const { issueId, userId } = req.body;
    const response = await issueService.createSelfResolution(issueId, userId, "Issue resolved by owner");
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserIssues = async (req: Request, res: Response) => {
  try {
    const response = await issueService.getUserIssues(req.body);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserResolvedIssues = async (req: Request, res: Response) => {
  try {
    const response = await issueService.getUserResolvedIssues(req.body);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const createSelfResolution = [
  upload.single("proofImage"),
  async (req: Request, res: Response) => {
    try {
      const { issueId, userId, resolutionText } = req.body;
      const proofImage = req.file ? req.file.buffer.toString('base64') : undefined;
      const response = await issueService.createSelfResolution(issueId, userId, resolutionText, proofImage);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  },
];

export const createExternalResolution = [
  upload.single("proofImage"),
  async (req: Request, res: Response) => {
    try {
      const { issueId, userId, resolutionText, politicalAssociation, stateEntityAssociation, resolvedBy } = req.body;
      const proofImage = req.file ? req.file.buffer.toString('base64') : undefined;
      const response = await issueService.createExternalResolution(
        issueId, 
        userId, 
        resolutionText, 
        proofImage,
        politicalAssociation,
        stateEntityAssociation,
        resolvedBy
      );
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  },
];

export const respondToResolution = async (req: Request, res: Response) => {
  try {
    const { resolutionId, userId, accept } = req.body;
    const response = await issueService.respondToResolution(resolutionId, userId, accept);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};
