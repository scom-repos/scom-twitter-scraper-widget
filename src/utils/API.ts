import Auth from "../utils/auth";
import Cookie from "./cookie";
import {BEARER_TOKEN} from "../const";

type API_METHOD = 'GET' | 'POST';

export default class API {
    constructor(private auth: Auth, private cookie: Cookie) {}

    async fetch(url: string, method: API_METHOD, params: any): Promise<any> {
        const headers = {
            authorization: `Bearer ${BEARER_TOKEN}`,
            cookie: this.cookie.getCookieExtensionStr()
        };
        this.installCsrfToken(headers);
        const urlParams = new URLSearchParams();
        for(const key in params) {
            urlParams.set(key, encodeURIComponent(JSON.stringify([key])));
        }
        const response = await fetch(`${url}?${urlParams.toString()}`, {
            method,
            headers
        });
        if(!response.ok) {
            console.log('failed to fetch', await response.text());
        }
        return response.json();
    }

    async fetchAnonymous(url: string, method: API_METHOD, params: any): Promise<any> {
        const headers = {
            authorization: `Bearer ${BEARER_TOKEN}`,
            'x-guest-token': this.auth.getGuestToken()
        };
        const urlParams = new URLSearchParams();
        for(const key in params) {
            urlParams.set(key, encodeURIComponent(JSON.stringify(params[key])));
        }
        console.log('urlParams', urlParams)
        const response = await fetch(`${url}?${urlParams.toString()}`, {
            method,
            headers
        });
        if(!response.ok) {
            console.log('failed to fetch', await response.text());
        }
        return response.json();
    }

    private installCsrfToken(headers) {
        const ct0 = this.cookie.getExtByKey('ct0');
        if (ct0) {
            headers['x-csrf-token'] = ct0;
        }
    }
}
