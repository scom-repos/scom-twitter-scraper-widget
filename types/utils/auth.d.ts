import Cookie from "./cookie";
export default class Auth {
    private cookie;
    constructor(cookie: Cookie);
    private guestToken;
    updateGuestToken(): Promise<any>;
    getGuestToken(): string;
    login(username: string, password: string, email?: string, twoFactorSecret?: string): Promise<void>;
    logout(): Promise<void>;
    isLoggedIn(): Promise<boolean>;
    private initLogin;
    private handleJsInstrumentationSubtask;
    private handleEnterUserIdentifierSSO;
    private handleEnterPassword;
    private handleAccountDuplicationCheck;
    private handleEnterAlternateIdentifierSubtask;
    private handleAcid;
    private handleSuccessSubtask;
    private executeFlowTask;
    private installCsrfToken;
}
