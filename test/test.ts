import { TwitterManager } from "../src/managers/scraperManager";
import { twitterAccounts } from "./data/config";

(async () => {
    const scraperManager = new TwitterManager({
        twitterAccounts
    });
    await scraperManager.init();
    var args = process.argv.slice(2);
    const action = args[0];
    switch (action) {
        case 'get-tweets': {
            let curtime = +new Date();
            const username = args[1];
            const since = args[2] ? parseInt(args[2]) : 0;
            const maxTweets = args[3] ? parseInt(args[3]) : 200;
            const tweets = await scraperManager.getTweetsByUserName(username);
            console.log('Tweets count: ', tweets.length);
            console.log('Time lapsed', `${(+new Date() - curtime) / 1000}s`);
            break;
        }
        default:
            break;
    }
})();
