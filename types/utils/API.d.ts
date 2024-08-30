import Auth from "./auth";
import Cookie from "./cookie";
type API_METHOD = 'GET' | 'POST';
export default class API {
    private auth;
    private cookie;
    constructor(auth: Auth, cookie: Cookie);
    fetch(url: string, method: API_METHOD, params: any): Promise<any>;
    fetchAnonymous(url: string, method: API_METHOD, params: any): Promise<any>;
    private installCsrfToken;
}
export {};
