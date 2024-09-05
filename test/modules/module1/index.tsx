import { Module, customModule, Container } from '@ijstech/components';
import { ImportTweetsModule, ITweet } from '@scom/scom-twitter-scraper-widget';

@customModule
export default class Module1 extends Module {

    private importTweetsModule: ImportTweetsModule;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
        this.importTweetsModule.scraperBotApiBaseUrl = 'http://localhost:8200';
        this.importTweetsModule.onSubmit = this.onSubmit;
        this.importTweetsModule.refreshPosts = this.refreshPosts;
    }

    private async onSubmit(tweets: ITweet[]) {
        console.log('tweets', tweets);
    }

    private async refreshPosts() {
        console.log('refreshPosts');
    }

    render() {
        return <i-panel height={'100%'} width={'100%'}>
            <i-scom-import-tweets-module id="importTweetsModule"></i-scom-import-tweets-module>
        </i-panel>
    }
}