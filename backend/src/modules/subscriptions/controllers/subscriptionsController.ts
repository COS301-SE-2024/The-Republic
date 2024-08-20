import { Request, Response } from "express";
import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import SubscriptionsService from "@/modules/subscriptions/services/subscriptionsService";

const subscriptionsService = new SubscriptionsService();

export const issueSubscriptions = async (
  req: Request,
  res: Response,
) => {
  try {
    const response = await subscriptionsService.issueSubscriptions(
      req.body,
    );
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const categorySubscriptions = async (
  req: Request,
  res: Response,
) => {
  try {
    const response =
      await subscriptionsService.categorySubscriptions(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const locationSubscriptions = async (
  req: Request,
  res: Response,
) => {
  try {
    const response =
      await subscriptionsService.locationSubscriptions(
        req.body,
      );
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const getSubscriptions = async (
  req: Request,
  res: Response,
) => {
  try {
    const response = await subscriptionsService.getSubscriptions(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};


export const getNotifications = async (
  req: Request,
  res: Response,
) => {
  try {
    const response = await subscriptionsService.getNotifications(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};
