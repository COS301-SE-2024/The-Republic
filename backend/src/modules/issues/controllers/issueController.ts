import { Request, Response } from "express";
import IssueService from "@/modules/issues/services/issueService";
import { APIResponse, APIError } from "@/types/response";
import { sendResponse } from "@/utils/response";
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
    const response = await issueService.resolveIssue(req.body);
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
