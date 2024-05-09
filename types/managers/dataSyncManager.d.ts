export default class DataSyncManager {
    private scraperManager;
    constructor();
    subscribe(): Promise<void>;
    unSubscribe(): Promise<void>;
    syncTweetsToNostrByUserId(userName: string): Promise<void>;
}
