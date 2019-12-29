import { Compute, GoogleAuth, JWT, OAuth2Client } from 'google-auth-library';
export declare class AuthPlus extends GoogleAuth {
    JWT: typeof JWT;
    Compute: typeof Compute;
    OAuth2: typeof OAuth2Client;
}
