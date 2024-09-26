import SubscriptionsRepository from "@/modules/subscriptions/repositories/subscriptionsRepository";
import { APIResponse, APIError } from "@/types/response";
import {
  SubsParams,
  NotificationData,
  Notification,
} from "@/types/subscriptions";
export default class SubscriptionsService {
  private SubscriptionsRepository: SubscriptionsRepository;

  constructor() {
    this.SubscriptionsRepository = new SubscriptionsRepository();
  }

  setSubscriptionsRepository(SubscriptionsRepository: SubscriptionsRepository) {
    this.SubscriptionsRepository = SubscriptionsRepository;
  }

  async issueSubscriptions(
    params: Partial<SubsParams>,
  ): Promise<APIResponse<string>> {
    try {
      const data =
        await this.SubscriptionsRepository.issueSubscriptions(params);
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "Issue: Something Went wrong",
      });
    }
  }

  async categorySubscriptions(
    params: Partial<SubsParams>,
  ): Promise<APIResponse<string>> {
    try {
      const data =
        await this.SubscriptionsRepository.categorySubscriptions(params);
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "Category: Something Went wrong",
      });
    }
  }

  async locationSubscriptions(
    params: Partial<SubsParams>,
  ): Promise<APIResponse<string>> {
    try {
      const data =
        await this.SubscriptionsRepository.locationSubscriptions(params);
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "Location: Something Went wrong",
      });
    }
  }

  async getSubscriptions(
    params: Partial<SubsParams>,
  ): Promise<APIResponse<NotificationData>> {
    try {
      const data = await this.SubscriptionsRepository.getSubscriptions(params);
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "Notifications: Something Went wrong",
      });
    }
  }

  async getNotifications(
    params: Partial<SubsParams>,
  ): Promise<APIResponse<Notification[]>> {
    try {
      const data = await this.SubscriptionsRepository.getNotifications(params);
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "Notifications: Something Went wrong",
      });
    }
  }
}
