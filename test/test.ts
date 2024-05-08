import ScraperManager from "../src/managers/scraperManager";

(async () => {
    const scraperManager = new ScraperManager();
    var args = process.argv.slice(2);
    const action = args[0];
    switch(action) {
        case 'get-userid-by-name': {
            const username = args[1];
            const userId = await scraperManager.getUserIdByScreenName(username);
            console.log('User ID: ', userId);
            break;
        }
        case 'get-tweets': {
            const username = args[1];
            const maxTweets = args[2] ? parseInt(args[2]) : 200;
            const tweets = await scraperManager.getTweetsByUserName(username, maxTweets);
            console.log(tweets);
            break;
        }
        case 'get-tweet': {
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
            const followers = await scraperManager.getFollowersByUserName(username, {username: 'CheukJohnn835', password: 'Since1994'});
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
            const following = await scraperManager.getFollowingByUserName(username, {username: 'CheukJohnn835', password: 'Since1994'});
            console.log('following', following);
            break;
        }
        case 'search-tweets': {
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
            const tweets = await scraperManager.searchTweets({username: 'CheukJohnn835', password: 'Since1994'}, '#hiking', 50);
            console.log('tweets', tweets);
            break;
        }
        default:
            break;
    }
})();
