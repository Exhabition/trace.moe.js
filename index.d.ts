interface AccountDetails {
  id: string;
  priority: number;
  concurrency: number;
  quota: number;
  quotaUsed: number;
}

declare class Client {
  constructor(key?: string);

  getAccountInfo(): Promise<AccountDetails>;
}

export = Client;
