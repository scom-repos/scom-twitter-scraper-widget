import {ScraperManager} from "../src/managers/scraperManager";
import { TWITTER_EMAIL_ADDRESS } from "./data/config";

const CONFIG = require('./data/config');

(async () => {
    const scraperManager = new ScraperManager({
        SCRAPER_API_KEY: CONFIG.SCRAPER_API_KEY,
        TWITTER_USERNAME: CONFIG.TWITTER_USERNAME,
        TWITTER_PASSWORD: CONFIG.TWITTER_PASSWORD,
        TWITTER_EMAIL_ADDRESS: CONFIG.TWITTER_EMAIL_ADDRESS
    });
    var args = process.argv.slice(2);
    const action = args[0];
    switch(action) {
        case 'get-profile-by-username': {
            const username = args[1];
            const profile = await scraperManager.getProfile(username);
            console.log('profile', profile)
            break;
        }
        case 'get-userid-by-name': {
            const username = args[1];
            const userId = await scraperManager.getUserIdByScreenName(username);
            console.log('User ID: ', userId);
            break;
        }
        case 'get-tweets': {
            const username = args[1];
            const maxTweets = args[2] ? parseInt(args[2]) : 200;
            const tweets = await scraperManager.getTweetsByUserName2(username);
            console.log('tweets', tweets);
            break;
        }
        case 'get-tweet-by-id': {
            const tweetId = args[1];
            const tweet = await scraperManager.getTweetByTweetId(tweetId);
            console.log(tweet);
            break;
        }
        case 'get-followers': {
            const username = args[1];
            const configs = process.argv.slice(3);
            const credentials: any = {};
            for(let i = 0; i < configs.length; i++) {
                if(configs[i] === '-u' && !!configs[i+1]) {
                    credentials.username = configs[i+1];
                }
                else if(configs[i] === '-p' && !!configs[i+1]) {
                    credentials.password = configs[i+1];
                }
            }
            const followers = await scraperManager.getFollowersByUserName(credentials, username);
            console.log('followers', followers);
            break;
        }
        case 'get-following': {
            const username = args[1];
            const configs = process.argv.slice(3);
            const credentials: any = {};
            for(let i = 0; i < configs.length; i++) {
                if(configs[i] === '-u' && !!configs[i+1]) {
                    credentials.username = configs[i+1];
                }
                else if(configs[i] === '-p' && !!configs[i+1]) {
                    credentials.password = configs[i+1];
                }
            }
            const following = await scraperManager.getFollowingByUserName(credentials, username);
            console.log('following', following);
            break;
        }
        case 'search-tweets': {
            const query = args[1];
            const configs = process.argv.slice(3);
            const credentials: any = {};
            for(let i = 0; i < configs.length; i++) {
                if(configs[i] === '-u' && !!configs[i+1]) {
                    credentials.username = configs[i+1];
                }
                else if(configs[i] === '-p' && !!configs[i+1]) {
                    credentials.password = configs[i+1];
                }
            }
            const tweets = await scraperManager.searchTweets(credentials, query, 50);
            console.log('tweets', tweets);
            break;
        }
        default:
            break;
    }
})();
