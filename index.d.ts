declare module "trace.moe" {
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

  class MediaPreview {
    constructor(url: string);

    muted: boolean;
    size: "large" | "medium" | "small";
    url: string;

    mute(): this;

    setSize(size: "large" | "medium" | "small"): this;
  }
}

declare interface AccountDetails {
  id: string;
  priority: number;
  concurrency: number;
  quota: number;
  quotaUsed: number;
}

declare interface SearchResponse {
  anilist: number | AniListInfo;
  filename: string;
  episode?: number;
  from: number;
  to: number;
  similarity: number;
  video: string | MediaPreview;
  image: string | MediaPreview;
}

declare interface SearchOptions {
  cutBorders: boolean;
  anilistID: number;
  anilistInfo: boolean;
  useAdvancedPreviews: boolean;
}

declare interface AniListInfo {
  id: number;
  idMal: number;
  title: { native?: string; romanji?: string; english?: string };
  synonyms: string[];
  isAdult: boolean;
}
