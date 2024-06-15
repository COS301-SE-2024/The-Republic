export interface APIResponse<T = never> {
  code: number;
  success: boolean;
  error?: string;
  data?: T;
}

export function APIError(error: APIResponse) {
  return error;
}

export function APIData<T>(data: APIResponse<T>) {
  return data;
}
