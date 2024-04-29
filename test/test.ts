import ScraperManager from "../src/managers/scraperManager";

(async () => {
    const scraperManager = new ScraperManager();
    var args = process.argv.slice(2);
    const action = args[0];
    switch(action) {
        case 'get-userid-by-name': {
            const username = args[1];
            const userId = await scraperManager.getUserIdByUserName(username);
            console.log('User ID: ', userId);
            break;
        }
        case 'get-tweets': {
            const username = args[1];
            const maxTweets = args[2] ? parseInt(args[2]) : 200;
            const tweets = await scraperManager.getTweetsByUserName(username, maxTweets);
            break;
        }
        case 'sync-tweets-to-nostr': {
            // const username = args[1];
            // const tweets = await getTweetsByUsername(username);
            break;
        }
        default:
            break;
    }
})();
