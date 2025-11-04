export interface FetchCountResponse {
  data: number;
}

export const fetchCount = (amount = 1): Promise<FetchCountResponse> =>
  new Promise((resolve) => setTimeout(() => resolve({ data: amount }), 500));
