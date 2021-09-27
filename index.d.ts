declare module "trace.moe" {
  interface AccountDetails {
    id: string;
    priority: number;
    concurrency: number;
    quota: number;
    quotaUsed: number;
  }

  interface SearchResponse {
    filename: string;
    episode?: number;
  }

  interface SearchOptions {
    cutBorders: boolean;
    anilistID: number;
    anilistInfo: boolean;
  }

  class Client {
    constructor(apiKey?: string);

    getAccountInfo(): Promise<AccountDetails>;

    getSimilarFromURL(
      url: string,
      options?: SearchOptions
    ): Promise<SearchResponse>;

    getSimilarFromBuffer(
      buffer: buffer,
      options?: SearchOptions
    ): Promise<SearchResponse>;
  }
}

export = Client;
