import { Request, Response } from "express";
import IssueService from "../services/issueService";
import { APIResponse } from "../types/response";

const issueService = new IssueService();

function sendResponse<T>(res: Response, response: APIResponse<T>) {
  res.status(response.code).json(response);
}

export const getIssues = async (req: Request, res: Response) => {
  try {
    const response = await issueService.getIssues(req.body);
    sendResponse(res, response);
  } catch (err) {
    sendResponse(res, err as APIResponse);
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const response = await issueService.getIssueById(req.body);
    sendResponse(res, response);
  } catch (err) {
    sendResponse(res, err as APIResponse);
  }
};

export const createIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.createIssue(req.body);
    sendResponse(res, response);
  } catch (err) {
    sendResponse(res, err as APIResponse);
  }
};

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.updateIssue(req.body);
    sendResponse(res, response);
  } catch (err) {
    sendResponse(res, err as APIResponse);
  }
};

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.deleteIssue(req.body);
    sendResponse(res, response);
  } catch (err) {
    sendResponse(res, err as APIResponse);
  }
};

 export  const resolveIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.resolveIssue(req.body);
    sendResponse(res, response);
  } catch (err) {
    sendResponse(res, err as APIResponse);
  }
};
