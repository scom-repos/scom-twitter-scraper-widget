import {ACTIVATE_GUEST_API, BEARER_TOKEN} from "../const";
import Cookie from "./cookie";

export default class Auth {
    constructor(private cookie: Cookie) {}

    private guestToken: string;

    async updateGuestToken() {
        const response = await fetch(ACTIVATE_GUEST_API, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
            }
        });
        if (response.ok) {
            this.cookie.updateCookie(response.headers.get('set-cookie'));
            const result = await response.json();
            this.guestToken = result['guest_token'];
        } else return null;
    }

    getGuestToken(): string {
        return this.guestToken;
    }
}
