/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { GaxiosPromise } from 'gaxios';
import { Compute, JWT, OAuth2Client, UserRefreshClient } from 'google-auth-library';
import { APIRequestContext, BodyResponseCallback, GlobalOptions, GoogleConfigurable, MethodOptions } from 'googleapis-common';
export declare namespace identitytoolkit_v3 {
    interface Options extends GlobalOptions {
        version: 'v3';
    }
    interface StandardParameters {
        /**
         * Data format for the response.
         */
        alt?: string;
        /**
         * Selector specifying which fields to include in a partial response.
         */
        fields?: string;
        /**
         * API key. Your API key identifies your project and provides you with API
         * access, quota, and reports. Required unless you provide an OAuth 2.0
         * token.
         */
        key?: string;
        /**
         * OAuth 2.0 token for the current user.
         */
        oauth_token?: string;
        /**
         * Returns response with indentations and line breaks.
         */
        prettyPrint?: boolean;
        /**
         * An opaque string that represents a user for quota purposes. Must not
         * exceed 40 characters.
         */
        quotaUser?: string;
        /**
         * Deprecated. Please use quotaUser instead.
         */
        userIp?: string;
    }
    /**
     * Google Identity Toolkit API
     *
     * Help the third party sites to implement federated login.
     *
     * @example
     * const {google} = require('googleapis');
     * const identitytoolkit = google.identitytoolkit('v3');
     *
     * @namespace identitytoolkit
     * @type {Function}
     * @version v3
     * @variation v3
     * @param {object=} options Options for Identitytoolkit
     */
    class Identitytoolkit {
        context: APIRequestContext;
        relyingparty: Resource$Relyingparty;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Response of creating the IDP authentication URL.
     */
    interface Schema$CreateAuthUriResponse {
        /**
         * all providers the user has once used to do federated login
         */
        allProviders?: string[];
        /**
         * The URI used by the IDP to authenticate the user.
         */
        authUri?: string;
        /**
         * True if captcha is required.
         */
        captchaRequired?: boolean;
        /**
         * True if the authUri is for user&#39;s existing provider.
         */
        forExistingProvider?: boolean;
        /**
         * The fixed string identitytoolkit#CreateAuthUriResponse&quot;.
         */
        kind?: string;
        /**
         * The provider ID of the auth URI.
         */
        providerId?: string;
        /**
         * Whether the user is registered if the identifier is an email.
         */
        registered?: boolean;
        /**
         * Session ID which should be passed in the following verifyAssertion
         * request.
         */
        sessionId?: string;
        /**
         * All sign-in methods this user has used.
         */
        signinMethods?: string[];
    }
    /**
     * Respone of deleting account.
     */
    interface Schema$DeleteAccountResponse {
        /**
         * The fixed string &quot;identitytoolkit#DeleteAccountResponse&quot;.
         */
        kind?: string;
    }
    /**
     * Response of downloading accounts in batch.
     */
    interface Schema$DownloadAccountResponse {
        /**
         * The fixed string &quot;identitytoolkit#DownloadAccountResponse&quot;.
         */
        kind?: string;
        /**
         * The next page token. To be used in a subsequent request to return the
         * next page of results.
         */
        nextPageToken?: string;
        /**
         * The user accounts data.
         */
        users?: Schema$UserInfo[];
    }
    /**
     * Response of email signIn.
     */
    interface Schema$EmailLinkSigninResponse {
        /**
         * The user&#39;s email.
         */
        email?: string;
        /**
         * Expiration time of STS id token in seconds.
         */
        expiresIn?: string;
        /**
         * The STS id token to login the newly signed in user.
         */
        idToken?: string;
        /**
         * Whether the user is new.
         */
        isNewUser?: boolean;
        /**
         * The fixed string &quot;identitytoolkit#EmailLinkSigninResponse&quot;.
         */
        kind?: string;
        /**
         * The RP local ID of the user.
         */
        localId?: string;
        /**
         * The refresh token for the signed in user.
         */
        refreshToken?: string;
    }
    /**
     * Template for an email template.
     */
    interface Schema$EmailTemplate {
        /**
         * Email body.
         */
        body?: string;
        /**
         * Email body format.
         */
        format?: string;
        /**
         * From address of the email.
         */
        from?: string;
        /**
         * From display name.
         */
        fromDisplayName?: string;
        /**
         * Reply-to address.
         */
        replyTo?: string;
        /**
         * Subject of the email.
         */
        subject?: string;
    }
    /**
     * Response of getting account information.
     */
    interface Schema$GetAccountInfoResponse {
        /**
         * The fixed string &quot;identitytoolkit#GetAccountInfoResponse&quot;.
         */
        kind?: string;
        /**
         * The info of the users.
         */
        users?: Schema$UserInfo[];
    }
    /**
     * Response of getting a code for user confirmation (reset password, change
     * email etc.).
     */
    interface Schema$GetOobConfirmationCodeResponse {
        /**
         * The email address that the email is sent to.
         */
        email?: string;
        /**
         * The fixed string
         * &quot;identitytoolkit#GetOobConfirmationCodeResponse&quot;.
         */
        kind?: string;
        /**
         * The code to be send to the user.
         */
        oobCode?: string;
    }
    /**
     * Response of getting recaptcha param.
     */
    interface Schema$GetRecaptchaParamResponse {
        /**
         * The fixed string &quot;identitytoolkit#GetRecaptchaParamResponse&quot;.
         */
        kind?: string;
        /**
         * Site key registered at recaptcha.
         */
        recaptchaSiteKey?: string;
        /**
         * The stoken field for the recaptcha widget, used to request captcha
         * challenge.
         */
        recaptchaStoken?: string;
    }
    /**
     * Request to get the IDP authentication URL.
     */
    interface Schema$IdentitytoolkitRelyingpartyCreateAuthUriRequest {
        /**
         * The app ID of the mobile app, base64(CERT_SHA1):PACKAGE_NAME for Android,
         * BUNDLE_ID for iOS.
         */
        appId?: string;
        /**
         * Explicitly specify the auth flow type. Currently only support
         * &quot;CODE_FLOW&quot; type. The field is only used for Google provider.
         */
        authFlowType?: string;
        /**
         * The relying party OAuth client ID.
         */
        clientId?: string;
        /**
         * The opaque value used by the client to maintain context info between the
         * authentication request and the IDP callback.
         */
        context?: string;
        /**
         * The URI to which the IDP redirects the user after the federated login
         * flow.
         */
        continueUri?: string;
        /**
         * The query parameter that client can customize by themselves in auth url.
         * The following parameters are reserved for server so that they cannot be
         * customized by clients: client_id, response_type, scope, redirect_uri,
         * state, oauth_token.
         */
        customParameter?: {
            [key: string]: string;
        };
        /**
         * The hosted domain to restrict sign-in to accounts at that domain for
         * Google Apps hosted accounts.
         */
        hostedDomain?: string;
        /**
         * The email or federated ID of the user.
         */
        identifier?: string;
        /**
         * The developer&#39;s consumer key for OpenId OAuth Extension
         */
        oauthConsumerKey?: string;
        /**
         * Additional oauth scopes, beyond the basid user profile, that the user
         * would be prompted to grant
         */
        oauthScope?: string;
        /**
         * Optional realm for OpenID protocol. The sub string
         * &quot;scheme://domain:port&quot; of the param &quot;continueUri&quot; is
         * used if this is not set.
         */
        openidRealm?: string;
        /**
         * The native app package for OTA installation.
         */
        otaApp?: string;
        /**
         * The IdP ID. For white listed IdPs it&#39;s a short domain name e.g.
         * google.com, aol.com, live.net and yahoo.com. For other OpenID IdPs
         * it&#39;s the OP identifier.
         */
        providerId?: string;
        /**
         * The session_id passed by client.
         */
        sessionId?: string;
        /**
         * For multi-tenant use cases, in order to construct sign-in URL with the
         * correct IDP parameters, Firebear needs to know which Tenant to retrieve
         * IDP configs from.
         */
        tenantId?: string;
        /**
         * Tenant project number to be used for idp discovery.
         */
        tenantProjectNumber?: string;
    }
    /**
     * Request to delete account.
     */
    interface Schema$IdentitytoolkitRelyingpartyDeleteAccountRequest {
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * The GITKit token or STS id token of the authenticated user.
         */
        idToken?: string;
        /**
         * The local ID of the user.
         */
        localId?: string;
    }
    /**
     * Request to download user account in batch.
     */
    interface Schema$IdentitytoolkitRelyingpartyDownloadAccountRequest {
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * The max number of results to return in the response.
         */
        maxResults?: number;
        /**
         * The token for the next page. This should be taken from the previous
         * response.
         */
        nextPageToken?: string;
        /**
         * Specify which project (field value is actually project id) to operate.
         * Only used when provided credential.
         */
        targetProjectId?: string;
    }
    /**
     * Request to sign in with email.
     */
    interface Schema$IdentitytoolkitRelyingpartyEmailLinkSigninRequest {
        /**
         * The email address of the user.
         */
        email?: string;
        /**
         * Token for linking flow.
         */
        idToken?: string;
        /**
         * The confirmation code.
         */
        oobCode?: string;
    }
    /**
     * Request to get the account information.
     */
    interface Schema$IdentitytoolkitRelyingpartyGetAccountInfoRequest {
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * The list of emails of the users to inquiry.
         */
        email?: string[];
        /**
         * The GITKit token of the authenticated user.
         */
        idToken?: string;
        /**
         * The list of local ID&#39;s of the users to inquiry.
         */
        localId?: string[];
        /**
         * Privileged caller can query users by specified phone number.
         */
        phoneNumber?: string[];
    }
    /**
     * Response of getting the project configuration.
     */
    interface Schema$IdentitytoolkitRelyingpartyGetProjectConfigResponse {
        /**
         * Whether to allow password user sign in or sign up.
         */
        allowPasswordUser?: boolean;
        /**
         * Browser API key, needed when making http request to Apiary.
         */
        apiKey?: string;
        /**
         * Authorized domains.
         */
        authorizedDomains?: string[];
        /**
         * Change email template.
         */
        changeEmailTemplate?: Schema$EmailTemplate;
        dynamicLinksDomain?: string;
        /**
         * Whether anonymous user is enabled.
         */
        enableAnonymousUser?: boolean;
        /**
         * OAuth2 provider configuration.
         */
        idpConfig?: Schema$IdpConfig[];
        /**
         * Legacy reset password email template.
         */
        legacyResetPasswordTemplate?: Schema$EmailTemplate;
        /**
         * Project ID of the relying party.
         */
        projectId?: string;
        /**
         * Reset password email template.
         */
        resetPasswordTemplate?: Schema$EmailTemplate;
        /**
         * Whether to use email sending provided by Firebear.
         */
        useEmailSending?: boolean;
        /**
         * Verify email template.
         */
        verifyEmailTemplate?: Schema$EmailTemplate;
    }
    /**
     * Respone of getting public keys.
     */
    interface Schema$IdentitytoolkitRelyingpartyGetPublicKeysResponse {
    }
    /**
     * Request to reset the password.
     */
    interface Schema$IdentitytoolkitRelyingpartyResetPasswordRequest {
        /**
         * The email address of the user.
         */
        email?: string;
        /**
         * The new password inputted by the user.
         */
        newPassword?: string;
        /**
         * The old password inputted by the user.
         */
        oldPassword?: string;
        /**
         * The confirmation code.
         */
        oobCode?: string;
    }
    /**
     * Request for Identitytoolkit-SendVerificationCode
     */
    interface Schema$IdentitytoolkitRelyingpartySendVerificationCodeRequest {
        /**
         * Receipt of successful app token validation with APNS.
         */
        iosReceipt?: string;
        /**
         * Secret delivered to iOS app via APNS.
         */
        iosSecret?: string;
        /**
         * The phone number to send the verification code to in E.164 format.
         */
        phoneNumber?: string;
        /**
         * Recaptcha solution.
         */
        recaptchaToken?: string;
    }
    /**
     * Response for Identitytoolkit-SendVerificationCode
     */
    interface Schema$IdentitytoolkitRelyingpartySendVerificationCodeResponse {
        /**
         * Encrypted session information
         */
        sessionInfo?: string;
    }
    /**
     * Request to set the account information.
     */
    interface Schema$IdentitytoolkitRelyingpartySetAccountInfoRequest {
        /**
         * The captcha challenge.
         */
        captchaChallenge?: string;
        /**
         * Response to the captcha.
         */
        captchaResponse?: string;
        /**
         * The timestamp when the account is created.
         */
        createdAt?: string;
        /**
         * The custom attributes to be set in the user&#39;s id token.
         */
        customAttributes?: string;
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * The attributes users request to delete.
         */
        deleteAttribute?: string[];
        /**
         * The IDPs the user request to delete.
         */
        deleteProvider?: string[];
        /**
         * Whether to disable the user.
         */
        disableUser?: boolean;
        /**
         * The name of the user.
         */
        displayName?: string;
        /**
         * The email of the user.
         */
        email?: string;
        /**
         * Mark the email as verified or not.
         */
        emailVerified?: boolean;
        /**
         * The GITKit token of the authenticated user.
         */
        idToken?: string;
        /**
         * Instance id token of the app.
         */
        instanceId?: string;
        /**
         * Last login timestamp.
         */
        lastLoginAt?: string;
        /**
         * The local ID of the user.
         */
        localId?: string;
        /**
         * The out-of-band code of the change email request.
         */
        oobCode?: string;
        /**
         * The new password of the user.
         */
        password?: string;
        /**
         * Privileged caller can update user with specified phone number.
         */
        phoneNumber?: string;
        /**
         * The photo url of the user.
         */
        photoUrl?: string;
        /**
         * The associated IDPs of the user.
         */
        provider?: string[];
        /**
         * Whether return sts id token and refresh token instead of gitkit token.
         */
        returnSecureToken?: boolean;
        /**
         * Mark the user to upgrade to federated login.
         */
        upgradeToFederatedLogin?: boolean;
        /**
         * Timestamp in seconds for valid login token.
         */
        validSince?: string;
    }
    /**
     * Request to set the project configuration.
     */
    interface Schema$IdentitytoolkitRelyingpartySetProjectConfigRequest {
        /**
         * Whether to allow password user sign in or sign up.
         */
        allowPasswordUser?: boolean;
        /**
         * Browser API key, needed when making http request to Apiary.
         */
        apiKey?: string;
        /**
         * Authorized domains for widget redirect.
         */
        authorizedDomains?: string[];
        /**
         * Change email template.
         */
        changeEmailTemplate?: Schema$EmailTemplate;
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * Whether to enable anonymous user.
         */
        enableAnonymousUser?: boolean;
        /**
         * Oauth2 provider configuration.
         */
        idpConfig?: Schema$IdpConfig[];
        /**
         * Legacy reset password email template.
         */
        legacyResetPasswordTemplate?: Schema$EmailTemplate;
        /**
         * Reset password email template.
         */
        resetPasswordTemplate?: Schema$EmailTemplate;
        /**
         * Whether to use email sending provided by Firebear.
         */
        useEmailSending?: boolean;
        /**
         * Verify email template.
         */
        verifyEmailTemplate?: Schema$EmailTemplate;
    }
    /**
     * Response of setting the project configuration.
     */
    interface Schema$IdentitytoolkitRelyingpartySetProjectConfigResponse {
        /**
         * Project ID of the relying party.
         */
        projectId?: string;
    }
    /**
     * Request to sign out user.
     */
    interface Schema$IdentitytoolkitRelyingpartySignOutUserRequest {
        /**
         * Instance id token of the app.
         */
        instanceId?: string;
        /**
         * The local ID of the user.
         */
        localId?: string;
    }
    /**
     * Response of signing out user.
     */
    interface Schema$IdentitytoolkitRelyingpartySignOutUserResponse {
        /**
         * The local ID of the user.
         */
        localId?: string;
    }
    /**
     * Request to signup new user, create anonymous user or anonymous user reauth.
     */
    interface Schema$IdentitytoolkitRelyingpartySignupNewUserRequest {
        /**
         * The captcha challenge.
         */
        captchaChallenge?: string;
        /**
         * Response to the captcha.
         */
        captchaResponse?: string;
        /**
         * Whether to disable the user. Only can be used by service account.
         */
        disabled?: boolean;
        /**
         * The name of the user.
         */
        displayName?: string;
        /**
         * The email of the user.
         */
        email?: string;
        /**
         * Mark the email as verified or not. Only can be used by service account.
         */
        emailVerified?: boolean;
        /**
         * The GITKit token of the authenticated user.
         */
        idToken?: string;
        /**
         * Instance id token of the app.
         */
        instanceId?: string;
        /**
         * Privileged caller can create user with specified user id.
         */
        localId?: string;
        /**
         * The new password of the user.
         */
        password?: string;
        /**
         * Privileged caller can create user with specified phone number.
         */
        phoneNumber?: string;
        /**
         * The photo url of the user.
         */
        photoUrl?: string;
        /**
         * For multi-tenant use cases, in order to construct sign-in URL with the
         * correct IDP parameters, Firebear needs to know which Tenant to retrieve
         * IDP configs from.
         */
        tenantId?: string;
        /**
         * Tenant project number to be used for idp discovery.
         */
        tenantProjectNumber?: string;
    }
    /**
     * Request to upload user account in batch.
     */
    interface Schema$IdentitytoolkitRelyingpartyUploadAccountRequest {
        /**
         * Whether allow overwrite existing account when user local_id exists.
         */
        allowOverwrite?: boolean;
        blockSize?: number;
        /**
         * The following 4 fields are for standard scrypt algorithm.
         */
        cpuMemCost?: number;
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        dkLen?: number;
        /**
         * The password hash algorithm.
         */
        hashAlgorithm?: string;
        /**
         * Memory cost for hash calculation. Used by scrypt similar algorithms.
         */
        memoryCost?: number;
        parallelization?: number;
        /**
         * Rounds for hash calculation. Used by scrypt and similar algorithms.
         */
        rounds?: number;
        /**
         * The salt separator.
         */
        saltSeparator?: string;
        /**
         * If true, backend will do sanity check(including duplicate email and
         * federated id) when uploading account.
         */
        sanityCheck?: boolean;
        /**
         * The key for to hash the password.
         */
        signerKey?: string;
        /**
         * Specify which project (field value is actually project id) to operate.
         * Only used when provided credential.
         */
        targetProjectId?: string;
        /**
         * The account info to be stored.
         */
        users?: Schema$UserInfo[];
    }
    /**
     * Request to verify the IDP assertion.
     */
    interface Schema$IdentitytoolkitRelyingpartyVerifyAssertionRequest {
        /**
         * When it&#39;s true, automatically creates a new account if the user
         * doesn&#39;t exist. When it&#39;s false, allows existing user to sign in
         * normally and throws exception if the user doesn&#39;t exist.
         */
        autoCreate?: boolean;
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * The GITKit token of the authenticated user.
         */
        idToken?: string;
        /**
         * Instance id token of the app.
         */
        instanceId?: string;
        /**
         * The GITKit token for the non-trusted IDP pending to be confirmed by the
         * user.
         */
        pendingIdToken?: string;
        /**
         * The post body if the request is a HTTP POST.
         */
        postBody?: string;
        /**
         * The URI to which the IDP redirects the user back. It may contain
         * federated login result params added by the IDP.
         */
        requestUri?: string;
        /**
         * Whether return 200 and IDP credential rather than throw exception when
         * federated id is already linked.
         */
        returnIdpCredential?: boolean;
        /**
         * Whether to return refresh tokens.
         */
        returnRefreshToken?: boolean;
        /**
         * Whether return sts id token and refresh token instead of gitkit token.
         */
        returnSecureToken?: boolean;
        /**
         * Session ID, which should match the one in previous createAuthUri request.
         */
        sessionId?: string;
        /**
         * For multi-tenant use cases, in order to construct sign-in URL with the
         * correct IDP parameters, Firebear needs to know which Tenant to retrieve
         * IDP configs from.
         */
        tenantId?: string;
        /**
         * Tenant project number to be used for idp discovery.
         */
        tenantProjectNumber?: string;
    }
    /**
     * Request to verify a custom token
     */
    interface Schema$IdentitytoolkitRelyingpartyVerifyCustomTokenRequest {
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * Instance id token of the app.
         */
        instanceId?: string;
        /**
         * Whether return sts id token and refresh token instead of gitkit token.
         */
        returnSecureToken?: boolean;
        /**
         * The custom token to verify
         */
        token?: string;
    }
    /**
     * Request to verify the password.
     */
    interface Schema$IdentitytoolkitRelyingpartyVerifyPasswordRequest {
        /**
         * The captcha challenge.
         */
        captchaChallenge?: string;
        /**
         * Response to the captcha.
         */
        captchaResponse?: string;
        /**
         * GCP project number of the requesting delegated app. Currently only
         * intended for Firebase V1 migration.
         */
        delegatedProjectNumber?: string;
        /**
         * The email of the user.
         */
        email?: string;
        /**
         * The GITKit token of the authenticated user.
         */
        idToken?: string;
        /**
         * Instance id token of the app.
         */
        instanceId?: string;
        /**
         * The password inputed by the user.
         */
        password?: string;
        /**
         * The GITKit token for the non-trusted IDP, which is to be confirmed by the
         * user.
         */
        pendingIdToken?: string;
        /**
         * Whether return sts id token and refresh token instead of gitkit token.
         */
        returnSecureToken?: boolean;
        /**
         * For multi-tenant use cases, in order to construct sign-in URL with the
         * correct IDP parameters, Firebear needs to know which Tenant to retrieve
         * IDP configs from.
         */
        tenantId?: string;
        /**
         * Tenant project number to be used for idp discovery.
         */
        tenantProjectNumber?: string;
    }
    /**
     * Request for Identitytoolkit-VerifyPhoneNumber
     */
    interface Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberRequest {
        code?: string;
        idToken?: string;
        operation?: string;
        phoneNumber?: string;
        /**
         * The session info previously returned by
         * IdentityToolkit-SendVerificationCode.
         */
        sessionInfo?: string;
        temporaryProof?: string;
        verificationProof?: string;
    }
    /**
     * Response for Identitytoolkit-VerifyPhoneNumber
     */
    interface Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberResponse {
        expiresIn?: string;
        idToken?: string;
        isNewUser?: boolean;
        localId?: string;
        phoneNumber?: string;
        refreshToken?: string;
        temporaryProof?: string;
        temporaryProofExpiresIn?: string;
        verificationProof?: string;
        verificationProofExpiresIn?: string;
    }
    /**
     * Template for a single idp configuration.
     */
    interface Schema$IdpConfig {
        /**
         * OAuth2 client ID.
         */
        clientId?: string;
        /**
         * Whether this IDP is enabled.
         */
        enabled?: boolean;
        /**
         * Percent of users who will be prompted/redirected federated login for this
         * IDP.
         */
        experimentPercent?: number;
        /**
         * OAuth2 provider.
         */
        provider?: string;
        /**
         * OAuth2 client secret.
         */
        secret?: string;
        /**
         * Whitelisted client IDs for audience check.
         */
        whitelistedAudiences?: string[];
    }
    /**
     * Request of getting a code for user confirmation (reset password, change
     * email etc.)
     */
    interface Schema$Relyingparty {
        /**
         * whether or not to install the android app on the device where the link is
         * opened
         */
        androidInstallApp?: boolean;
        /**
         * minimum version of the app. if the version on the device is lower than
         * this version then the user is taken to the play store to upgrade the app
         */
        androidMinimumVersion?: string;
        /**
         * android package name of the android app to handle the action code
         */
        androidPackageName?: string;
        /**
         * whether or not the app can handle the oob code without first going to web
         */
        canHandleCodeInApp?: boolean;
        /**
         * The recaptcha response from the user.
         */
        captchaResp?: string;
        /**
         * The recaptcha challenge presented to the user.
         */
        challenge?: string;
        /**
         * The url to continue to the Gitkit app
         */
        continueUrl?: string;
        /**
         * The email of the user.
         */
        email?: string;
        /**
         * The user&#39;s Gitkit login token for email change.
         */
        idToken?: string;
        /**
         * iOS app store id to download the app if it&#39;s not already installed
         */
        iOSAppStoreId?: string;
        /**
         * the iOS bundle id of iOS app to handle the action code
         */
        iOSBundleId?: string;
        /**
         * The fixed string &quot;identitytoolkit#relyingparty&quot;.
         */
        kind?: string;
        /**
         * The new email if the code is for email change.
         */
        newEmail?: string;
        /**
         * The request type.
         */
        requestType?: string;
        /**
         * The IP address of the user.
         */
        userIp?: string;
    }
    /**
     * Response of resetting the password.
     */
    interface Schema$ResetPasswordResponse {
        /**
         * The user&#39;s email. If the out-of-band code is for email recovery, the
         * user&#39;s original email.
         */
        email?: string;
        /**
         * The fixed string &quot;identitytoolkit#ResetPasswordResponse&quot;.
         */
        kind?: string;
        /**
         * If the out-of-band code is for email recovery, the user&#39;s new email.
         */
        newEmail?: string;
        /**
         * The request type.
         */
        requestType?: string;
    }
    /**
     * Respone of setting the account information.
     */
    interface Schema$SetAccountInfoResponse {
        /**
         * The name of the user.
         */
        displayName?: string;
        /**
         * The email of the user.
         */
        email?: string;
        /**
         * If email has been verified.
         */
        emailVerified?: boolean;
        /**
         * If idToken is STS id token, then this field will be expiration time of
         * STS id token in seconds.
         */
        expiresIn?: string;
        /**
         * The Gitkit id token to login the newly sign up user.
         */
        idToken?: string;
        /**
         * The fixed string &quot;identitytoolkit#SetAccountInfoResponse&quot;.
         */
        kind?: string;
        /**
         * The local ID of the user.
         */
        localId?: string;
        /**
         * The new email the user attempts to change to.
         */
        newEmail?: string;
        /**
         * The user&#39;s hashed password.
         */
        passwordHash?: string;
        /**
         * The photo url of the user.
         */
        photoUrl?: string;
        /**
         * The user&#39;s profiles at the associated IdPs.
         */
        providerUserInfo?: Array<{
            displayName?: string;
            federatedId?: string;
            photoUrl?: string;
            providerId?: string;
        }>;
        /**
         * If idToken is STS id token, then this field will be refresh token.
         */
        refreshToken?: string;
    }
    /**
     * Response of signing up new user, creating anonymous user or anonymous user
     * reauth.
     */
    interface Schema$SignupNewUserResponse {
        /**
         * The name of the user.
         */
        displayName?: string;
        /**
         * The email of the user.
         */
        email?: string;
        /**
         * If idToken is STS id token, then this field will be expiration time of
         * STS id token in seconds.
         */
        expiresIn?: string;
        /**
         * The Gitkit id token to login the newly sign up user.
         */
        idToken?: string;
        /**
         * The fixed string &quot;identitytoolkit#SignupNewUserResponse&quot;.
         */
        kind?: string;
        /**
         * The RP local ID of the user.
         */
        localId?: string;
        /**
         * If idToken is STS id token, then this field will be refresh token.
         */
        refreshToken?: string;
    }
    /**
     * Respone of uploading accounts in batch.
     */
    interface Schema$UploadAccountResponse {
        /**
         * The error encountered while processing the account info.
         */
        error?: Array<{
            index?: number;
            message?: string;
        }>;
        /**
         * The fixed string &quot;identitytoolkit#UploadAccountResponse&quot;.
         */
        kind?: string;
    }
    /**
     * Template for an individual account info.
     */
    interface Schema$UserInfo {
        /**
         * User creation timestamp.
         */
        createdAt?: string;
        /**
         * The custom attributes to be set in the user&#39;s id token.
         */
        customAttributes?: string;
        /**
         * Whether the user is authenticated by the developer.
         */
        customAuth?: boolean;
        /**
         * Whether the user is disabled.
         */
        disabled?: boolean;
        /**
         * The name of the user.
         */
        displayName?: string;
        /**
         * The email of the user.
         */
        email?: string;
        /**
         * Whether the email has been verified.
         */
        emailVerified?: boolean;
        /**
         * last login timestamp.
         */
        lastLoginAt?: string;
        /**
         * The local ID of the user.
         */
        localId?: string;
        /**
         * The user&#39;s hashed password.
         */
        passwordHash?: string;
        /**
         * The timestamp when the password was last updated.
         */
        passwordUpdatedAt?: number;
        /**
         * User&#39;s phone number.
         */
        phoneNumber?: string;
        /**
         * The URL of the user profile photo.
         */
        photoUrl?: string;
        /**
         * The IDP of the user.
         */
        providerUserInfo?: Array<{
            displayName?: string;
            email?: string;
            federatedId?: string;
            phoneNumber?: string;
            photoUrl?: string;
            providerId?: string;
            rawId?: string;
            screenName?: string;
        }>;
        /**
         * The user&#39;s plain text password.
         */
        rawPassword?: string;
        /**
         * The user&#39;s password salt.
         */
        salt?: string;
        /**
         * User&#39;s screen name at Twitter or login name at Github.
         */
        screenName?: string;
        /**
         * Timestamp in seconds for valid login token.
         */
        validSince?: string;
        /**
         * Version of the user&#39;s password.
         */
        version?: number;
    }
    /**
     * Response of verifying the IDP assertion.
     */
    interface Schema$VerifyAssertionResponse {
        /**
         * The action code.
         */
        action?: string;
        /**
         * URL for OTA app installation.
         */
        appInstallationUrl?: string;
        /**
         * The custom scheme used by mobile app.
         */
        appScheme?: string;
        /**
         * The opaque value used by the client to maintain context info between the
         * authentication request and the IDP callback.
         */
        context?: string;
        /**
         * The birth date of the IdP account.
         */
        dateOfBirth?: string;
        /**
         * The display name of the user.
         */
        displayName?: string;
        /**
         * The email returned by the IdP. NOTE: The federated login user may not own
         * the email.
         */
        email?: string;
        /**
         * It&#39;s true if the email is recycled.
         */
        emailRecycled?: boolean;
        /**
         * The value is true if the IDP is also the email provider. It means the
         * user owns the email.
         */
        emailVerified?: boolean;
        /**
         * Client error code.
         */
        errorMessage?: string;
        /**
         * If idToken is STS id token, then this field will be expiration time of
         * STS id token in seconds.
         */
        expiresIn?: string;
        /**
         * The unique ID identifies the IdP account.
         */
        federatedId?: string;
        /**
         * The first name of the user.
         */
        firstName?: string;
        /**
         * The full name of the user.
         */
        fullName?: string;
        /**
         * The ID token.
         */
        idToken?: string;
        /**
         * It&#39;s the identifier param in the createAuthUri request if the
         * identifier is an email. It can be used to check whether the user input
         * email is different from the asserted email.
         */
        inputEmail?: string;
        /**
         * True if it&#39;s a new user sign-in, false if it&#39;s a returning user.
         */
        isNewUser?: boolean;
        /**
         * The fixed string &quot;identitytoolkit#VerifyAssertionResponse&quot;.
         */
        kind?: string;
        /**
         * The language preference of the user.
         */
        language?: string;
        /**
         * The last name of the user.
         */
        lastName?: string;
        /**
         * The RP local ID if it&#39;s already been mapped to the IdP account
         * identified by the federated ID.
         */
        localId?: string;
        /**
         * Whether the assertion is from a non-trusted IDP and need account linking
         * confirmation.
         */
        needConfirmation?: boolean;
        /**
         * Whether need client to supply email to complete the federated login flow.
         */
        needEmail?: boolean;
        /**
         * The nick name of the user.
         */
        nickName?: string;
        /**
         * The OAuth2 access token.
         */
        oauthAccessToken?: string;
        /**
         * The OAuth2 authorization code.
         */
        oauthAuthorizationCode?: string;
        /**
         * The lifetime in seconds of the OAuth2 access token.
         */
        oauthExpireIn?: number;
        /**
         * The OIDC id token.
         */
        oauthIdToken?: string;
        /**
         * The user approved request token for the OpenID OAuth extension.
         */
        oauthRequestToken?: string;
        /**
         * The scope for the OpenID OAuth extension.
         */
        oauthScope?: string;
        /**
         * The OAuth1 access token secret.
         */
        oauthTokenSecret?: string;
        /**
         * The original email stored in the mapping storage. It&#39;s returned when
         * the federated ID is associated to a different email.
         */
        originalEmail?: string;
        /**
         * The URI of the public accessible profiel picture.
         */
        photoUrl?: string;
        /**
         * The IdP ID. For white listed IdPs it&#39;s a short domain name e.g.
         * google.com, aol.com, live.net and yahoo.com. If the
         * &quot;providerId&quot; param is set to OpenID OP identifer other than the
         * whilte listed IdPs the OP identifier is returned. If the
         * &quot;identifier&quot; param is federated ID in the createAuthUri
         * request. The domain part of the federated ID is returned.
         */
        providerId?: string;
        /**
         * Raw IDP-returned user info.
         */
        rawUserInfo?: string;
        /**
         * If idToken is STS id token, then this field will be refresh token.
         */
        refreshToken?: string;
        /**
         * The screen_name of a Twitter user or the login name at Github.
         */
        screenName?: string;
        /**
         * The timezone of the user.
         */
        timeZone?: string;
        /**
         * When action is &#39;map&#39;, contains the idps which can be used for
         * confirmation.
         */
        verifiedProvider?: string[];
    }
    /**
     * Response from verifying a custom token
     */
    interface Schema$VerifyCustomTokenResponse {
        /**
         * If idToken is STS id token, then this field will be expiration time of
         * STS id token in seconds.
         */
        expiresIn?: string;
        /**
         * The GITKit token for authenticated user.
         */
        idToken?: string;
        /**
         * True if it&#39;s a new user sign-in, false if it&#39;s a returning user.
         */
        isNewUser?: boolean;
        /**
         * The fixed string &quot;identitytoolkit#VerifyCustomTokenResponse&quot;.
         */
        kind?: string;
        /**
         * If idToken is STS id token, then this field will be refresh token.
         */
        refreshToken?: string;
    }
    /**
     * Request of verifying the password.
     */
    interface Schema$VerifyPasswordResponse {
        /**
         * The name of the user.
         */
        displayName?: string;
        /**
         * The email returned by the IdP. NOTE: The federated login user may not own
         * the email.
         */
        email?: string;
        /**
         * If idToken is STS id token, then this field will be expiration time of
         * STS id token in seconds.
         */
        expiresIn?: string;
        /**
         * The GITKit token for authenticated user.
         */
        idToken?: string;
        /**
         * The fixed string &quot;identitytoolkit#VerifyPasswordResponse&quot;.
         */
        kind?: string;
        /**
         * The RP local ID if it&#39;s already been mapped to the IdP account
         * identified by the federated ID.
         */
        localId?: string;
        /**
         * The OAuth2 access token.
         */
        oauthAccessToken?: string;
        /**
         * The OAuth2 authorization code.
         */
        oauthAuthorizationCode?: string;
        /**
         * The lifetime in seconds of the OAuth2 access token.
         */
        oauthExpireIn?: number;
        /**
         * The URI of the user&#39;s photo at IdP
         */
        photoUrl?: string;
        /**
         * If idToken is STS id token, then this field will be refresh token.
         */
        refreshToken?: string;
        /**
         * Whether the email is registered.
         */
        registered?: boolean;
    }
    class Resource$Relyingparty {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * identitytoolkit.relyingparty.createAuthUri
         * @desc Creates the URI used by the IdP to authenticate the user.
         * @alias identitytoolkit.relyingparty.createAuthUri
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyCreateAuthUriRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        createAuthUri(params?: Params$Resource$Relyingparty$Createauthuri, options?: MethodOptions): GaxiosPromise<Schema$CreateAuthUriResponse>;
        createAuthUri(params: Params$Resource$Relyingparty$Createauthuri, options: MethodOptions | BodyResponseCallback<Schema$CreateAuthUriResponse>, callback: BodyResponseCallback<Schema$CreateAuthUriResponse>): void;
        createAuthUri(params: Params$Resource$Relyingparty$Createauthuri, callback: BodyResponseCallback<Schema$CreateAuthUriResponse>): void;
        createAuthUri(callback: BodyResponseCallback<Schema$CreateAuthUriResponse>): void;
        /**
         * identitytoolkit.relyingparty.deleteAccount
         * @desc Delete user account.
         * @alias identitytoolkit.relyingparty.deleteAccount
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyDeleteAccountRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        deleteAccount(params?: Params$Resource$Relyingparty$Deleteaccount, options?: MethodOptions): GaxiosPromise<Schema$DeleteAccountResponse>;
        deleteAccount(params: Params$Resource$Relyingparty$Deleteaccount, options: MethodOptions | BodyResponseCallback<Schema$DeleteAccountResponse>, callback: BodyResponseCallback<Schema$DeleteAccountResponse>): void;
        deleteAccount(params: Params$Resource$Relyingparty$Deleteaccount, callback: BodyResponseCallback<Schema$DeleteAccountResponse>): void;
        deleteAccount(callback: BodyResponseCallback<Schema$DeleteAccountResponse>): void;
        /**
         * identitytoolkit.relyingparty.downloadAccount
         * @desc Batch download user accounts.
         * @alias identitytoolkit.relyingparty.downloadAccount
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyDownloadAccountRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        downloadAccount(params?: Params$Resource$Relyingparty$Downloadaccount, options?: MethodOptions): GaxiosPromise<Schema$DownloadAccountResponse>;
        downloadAccount(params: Params$Resource$Relyingparty$Downloadaccount, options: MethodOptions | BodyResponseCallback<Schema$DownloadAccountResponse>, callback: BodyResponseCallback<Schema$DownloadAccountResponse>): void;
        downloadAccount(params: Params$Resource$Relyingparty$Downloadaccount, callback: BodyResponseCallback<Schema$DownloadAccountResponse>): void;
        downloadAccount(callback: BodyResponseCallback<Schema$DownloadAccountResponse>): void;
        /**
         * identitytoolkit.relyingparty.emailLinkSignin
         * @desc Reset password for a user.
         * @alias identitytoolkit.relyingparty.emailLinkSignin
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyEmailLinkSigninRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        emailLinkSignin(params?: Params$Resource$Relyingparty$Emaillinksignin, options?: MethodOptions): GaxiosPromise<Schema$EmailLinkSigninResponse>;
        emailLinkSignin(params: Params$Resource$Relyingparty$Emaillinksignin, options: MethodOptions | BodyResponseCallback<Schema$EmailLinkSigninResponse>, callback: BodyResponseCallback<Schema$EmailLinkSigninResponse>): void;
        emailLinkSignin(params: Params$Resource$Relyingparty$Emaillinksignin, callback: BodyResponseCallback<Schema$EmailLinkSigninResponse>): void;
        emailLinkSignin(callback: BodyResponseCallback<Schema$EmailLinkSigninResponse>): void;
        /**
         * identitytoolkit.relyingparty.getAccountInfo
         * @desc Returns the account info.
         * @alias identitytoolkit.relyingparty.getAccountInfo
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyGetAccountInfoRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getAccountInfo(params?: Params$Resource$Relyingparty$Getaccountinfo, options?: MethodOptions): GaxiosPromise<Schema$GetAccountInfoResponse>;
        getAccountInfo(params: Params$Resource$Relyingparty$Getaccountinfo, options: MethodOptions | BodyResponseCallback<Schema$GetAccountInfoResponse>, callback: BodyResponseCallback<Schema$GetAccountInfoResponse>): void;
        getAccountInfo(params: Params$Resource$Relyingparty$Getaccountinfo, callback: BodyResponseCallback<Schema$GetAccountInfoResponse>): void;
        getAccountInfo(callback: BodyResponseCallback<Schema$GetAccountInfoResponse>): void;
        /**
         * identitytoolkit.relyingparty.getOobConfirmationCode
         * @desc Get a code for user action confirmation.
         * @alias identitytoolkit.relyingparty.getOobConfirmationCode
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().Relyingparty} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getOobConfirmationCode(params?: Params$Resource$Relyingparty$Getoobconfirmationcode, options?: MethodOptions): GaxiosPromise<Schema$GetOobConfirmationCodeResponse>;
        getOobConfirmationCode(params: Params$Resource$Relyingparty$Getoobconfirmationcode, options: MethodOptions | BodyResponseCallback<Schema$GetOobConfirmationCodeResponse>, callback: BodyResponseCallback<Schema$GetOobConfirmationCodeResponse>): void;
        getOobConfirmationCode(params: Params$Resource$Relyingparty$Getoobconfirmationcode, callback: BodyResponseCallback<Schema$GetOobConfirmationCodeResponse>): void;
        getOobConfirmationCode(callback: BodyResponseCallback<Schema$GetOobConfirmationCodeResponse>): void;
        /**
         * identitytoolkit.relyingparty.getProjectConfig
         * @desc Get project configuration.
         * @alias identitytoolkit.relyingparty.getProjectConfig
         * @memberOf! ()
         *
         * @param {object=} params Parameters for request
         * @param {string=} params.delegatedProjectNumber Delegated GCP project number of the request.
         * @param {string=} params.projectNumber GCP project number of the request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getProjectConfig(params?: Params$Resource$Relyingparty$Getprojectconfig, options?: MethodOptions): GaxiosPromise<Schema$IdentitytoolkitRelyingpartyGetProjectConfigResponse>;
        getProjectConfig(params: Params$Resource$Relyingparty$Getprojectconfig, options: MethodOptions | BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetProjectConfigResponse>, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetProjectConfigResponse>): void;
        getProjectConfig(params: Params$Resource$Relyingparty$Getprojectconfig, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetProjectConfigResponse>): void;
        getProjectConfig(callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetProjectConfigResponse>): void;
        /**
         * identitytoolkit.relyingparty.getPublicKeys
         * @desc Get token signing public key.
         * @alias identitytoolkit.relyingparty.getPublicKeys
         * @memberOf! ()
         *
         * @param {object=} params Parameters for request
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getPublicKeys(params?: Params$Resource$Relyingparty$Getpublickeys, options?: MethodOptions): GaxiosPromise<Schema$IdentitytoolkitRelyingpartyGetPublicKeysResponse>;
        getPublicKeys(params: Params$Resource$Relyingparty$Getpublickeys, options: MethodOptions | BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetPublicKeysResponse>, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetPublicKeysResponse>): void;
        getPublicKeys(params: Params$Resource$Relyingparty$Getpublickeys, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetPublicKeysResponse>): void;
        getPublicKeys(callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyGetPublicKeysResponse>): void;
        /**
         * identitytoolkit.relyingparty.getRecaptchaParam
         * @desc Get recaptcha secure param.
         * @alias identitytoolkit.relyingparty.getRecaptchaParam
         * @memberOf! ()
         *
         * @param {object=} params Parameters for request
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getRecaptchaParam(params?: Params$Resource$Relyingparty$Getrecaptchaparam, options?: MethodOptions): GaxiosPromise<Schema$GetRecaptchaParamResponse>;
        getRecaptchaParam(params: Params$Resource$Relyingparty$Getrecaptchaparam, options: MethodOptions | BodyResponseCallback<Schema$GetRecaptchaParamResponse>, callback: BodyResponseCallback<Schema$GetRecaptchaParamResponse>): void;
        getRecaptchaParam(params: Params$Resource$Relyingparty$Getrecaptchaparam, callback: BodyResponseCallback<Schema$GetRecaptchaParamResponse>): void;
        getRecaptchaParam(callback: BodyResponseCallback<Schema$GetRecaptchaParamResponse>): void;
        /**
         * identitytoolkit.relyingparty.resetPassword
         * @desc Reset password for a user.
         * @alias identitytoolkit.relyingparty.resetPassword
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyResetPasswordRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        resetPassword(params?: Params$Resource$Relyingparty$Resetpassword, options?: MethodOptions): GaxiosPromise<Schema$ResetPasswordResponse>;
        resetPassword(params: Params$Resource$Relyingparty$Resetpassword, options: MethodOptions | BodyResponseCallback<Schema$ResetPasswordResponse>, callback: BodyResponseCallback<Schema$ResetPasswordResponse>): void;
        resetPassword(params: Params$Resource$Relyingparty$Resetpassword, callback: BodyResponseCallback<Schema$ResetPasswordResponse>): void;
        resetPassword(callback: BodyResponseCallback<Schema$ResetPasswordResponse>): void;
        /**
         * identitytoolkit.relyingparty.sendVerificationCode
         * @desc Send SMS verification code.
         * @alias identitytoolkit.relyingparty.sendVerificationCode
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartySendVerificationCodeRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        sendVerificationCode(params?: Params$Resource$Relyingparty$Sendverificationcode, options?: MethodOptions): GaxiosPromise<Schema$IdentitytoolkitRelyingpartySendVerificationCodeResponse>;
        sendVerificationCode(params: Params$Resource$Relyingparty$Sendverificationcode, options: MethodOptions | BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySendVerificationCodeResponse>, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySendVerificationCodeResponse>): void;
        sendVerificationCode(params: Params$Resource$Relyingparty$Sendverificationcode, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySendVerificationCodeResponse>): void;
        sendVerificationCode(callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySendVerificationCodeResponse>): void;
        /**
         * identitytoolkit.relyingparty.setAccountInfo
         * @desc Set account info for a user.
         * @alias identitytoolkit.relyingparty.setAccountInfo
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartySetAccountInfoRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        setAccountInfo(params?: Params$Resource$Relyingparty$Setaccountinfo, options?: MethodOptions): GaxiosPromise<Schema$SetAccountInfoResponse>;
        setAccountInfo(params: Params$Resource$Relyingparty$Setaccountinfo, options: MethodOptions | BodyResponseCallback<Schema$SetAccountInfoResponse>, callback: BodyResponseCallback<Schema$SetAccountInfoResponse>): void;
        setAccountInfo(params: Params$Resource$Relyingparty$Setaccountinfo, callback: BodyResponseCallback<Schema$SetAccountInfoResponse>): void;
        setAccountInfo(callback: BodyResponseCallback<Schema$SetAccountInfoResponse>): void;
        /**
         * identitytoolkit.relyingparty.setProjectConfig
         * @desc Set project configuration.
         * @alias identitytoolkit.relyingparty.setProjectConfig
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartySetProjectConfigRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        setProjectConfig(params?: Params$Resource$Relyingparty$Setprojectconfig, options?: MethodOptions): GaxiosPromise<Schema$IdentitytoolkitRelyingpartySetProjectConfigResponse>;
        setProjectConfig(params: Params$Resource$Relyingparty$Setprojectconfig, options: MethodOptions | BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySetProjectConfigResponse>, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySetProjectConfigResponse>): void;
        setProjectConfig(params: Params$Resource$Relyingparty$Setprojectconfig, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySetProjectConfigResponse>): void;
        setProjectConfig(callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySetProjectConfigResponse>): void;
        /**
         * identitytoolkit.relyingparty.signOutUser
         * @desc Sign out user.
         * @alias identitytoolkit.relyingparty.signOutUser
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartySignOutUserRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        signOutUser(params?: Params$Resource$Relyingparty$Signoutuser, options?: MethodOptions): GaxiosPromise<Schema$IdentitytoolkitRelyingpartySignOutUserResponse>;
        signOutUser(params: Params$Resource$Relyingparty$Signoutuser, options: MethodOptions | BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySignOutUserResponse>, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySignOutUserResponse>): void;
        signOutUser(params: Params$Resource$Relyingparty$Signoutuser, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySignOutUserResponse>): void;
        signOutUser(callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartySignOutUserResponse>): void;
        /**
         * identitytoolkit.relyingparty.signupNewUser
         * @desc Signup new user.
         * @alias identitytoolkit.relyingparty.signupNewUser
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartySignupNewUserRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        signupNewUser(params?: Params$Resource$Relyingparty$Signupnewuser, options?: MethodOptions): GaxiosPromise<Schema$SignupNewUserResponse>;
        signupNewUser(params: Params$Resource$Relyingparty$Signupnewuser, options: MethodOptions | BodyResponseCallback<Schema$SignupNewUserResponse>, callback: BodyResponseCallback<Schema$SignupNewUserResponse>): void;
        signupNewUser(params: Params$Resource$Relyingparty$Signupnewuser, callback: BodyResponseCallback<Schema$SignupNewUserResponse>): void;
        signupNewUser(callback: BodyResponseCallback<Schema$SignupNewUserResponse>): void;
        /**
         * identitytoolkit.relyingparty.uploadAccount
         * @desc Batch upload existing user accounts.
         * @alias identitytoolkit.relyingparty.uploadAccount
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyUploadAccountRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        uploadAccount(params?: Params$Resource$Relyingparty$Uploadaccount, options?: MethodOptions): GaxiosPromise<Schema$UploadAccountResponse>;
        uploadAccount(params: Params$Resource$Relyingparty$Uploadaccount, options: MethodOptions | BodyResponseCallback<Schema$UploadAccountResponse>, callback: BodyResponseCallback<Schema$UploadAccountResponse>): void;
        uploadAccount(params: Params$Resource$Relyingparty$Uploadaccount, callback: BodyResponseCallback<Schema$UploadAccountResponse>): void;
        uploadAccount(callback: BodyResponseCallback<Schema$UploadAccountResponse>): void;
        /**
         * identitytoolkit.relyingparty.verifyAssertion
         * @desc Verifies the assertion returned by the IdP.
         * @alias identitytoolkit.relyingparty.verifyAssertion
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyVerifyAssertionRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        verifyAssertion(params?: Params$Resource$Relyingparty$Verifyassertion, options?: MethodOptions): GaxiosPromise<Schema$VerifyAssertionResponse>;
        verifyAssertion(params: Params$Resource$Relyingparty$Verifyassertion, options: MethodOptions | BodyResponseCallback<Schema$VerifyAssertionResponse>, callback: BodyResponseCallback<Schema$VerifyAssertionResponse>): void;
        verifyAssertion(params: Params$Resource$Relyingparty$Verifyassertion, callback: BodyResponseCallback<Schema$VerifyAssertionResponse>): void;
        verifyAssertion(callback: BodyResponseCallback<Schema$VerifyAssertionResponse>): void;
        /**
         * identitytoolkit.relyingparty.verifyCustomToken
         * @desc Verifies the developer asserted ID token.
         * @alias identitytoolkit.relyingparty.verifyCustomToken
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyVerifyCustomTokenRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        verifyCustomToken(params?: Params$Resource$Relyingparty$Verifycustomtoken, options?: MethodOptions): GaxiosPromise<Schema$VerifyCustomTokenResponse>;
        verifyCustomToken(params: Params$Resource$Relyingparty$Verifycustomtoken, options: MethodOptions | BodyResponseCallback<Schema$VerifyCustomTokenResponse>, callback: BodyResponseCallback<Schema$VerifyCustomTokenResponse>): void;
        verifyCustomToken(params: Params$Resource$Relyingparty$Verifycustomtoken, callback: BodyResponseCallback<Schema$VerifyCustomTokenResponse>): void;
        verifyCustomToken(callback: BodyResponseCallback<Schema$VerifyCustomTokenResponse>): void;
        /**
         * identitytoolkit.relyingparty.verifyPassword
         * @desc Verifies the user entered password.
         * @alias identitytoolkit.relyingparty.verifyPassword
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyVerifyPasswordRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        verifyPassword(params?: Params$Resource$Relyingparty$Verifypassword, options?: MethodOptions): GaxiosPromise<Schema$VerifyPasswordResponse>;
        verifyPassword(params: Params$Resource$Relyingparty$Verifypassword, options: MethodOptions | BodyResponseCallback<Schema$VerifyPasswordResponse>, callback: BodyResponseCallback<Schema$VerifyPasswordResponse>): void;
        verifyPassword(params: Params$Resource$Relyingparty$Verifypassword, callback: BodyResponseCallback<Schema$VerifyPasswordResponse>): void;
        verifyPassword(callback: BodyResponseCallback<Schema$VerifyPasswordResponse>): void;
        /**
         * identitytoolkit.relyingparty.verifyPhoneNumber
         * @desc Verifies ownership of a phone number and creates/updates the user
         * account accordingly.
         * @alias identitytoolkit.relyingparty.verifyPhoneNumber
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().IdentitytoolkitRelyingpartyVerifyPhoneNumberRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        verifyPhoneNumber(params?: Params$Resource$Relyingparty$Verifyphonenumber, options?: MethodOptions): GaxiosPromise<Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberResponse>;
        verifyPhoneNumber(params: Params$Resource$Relyingparty$Verifyphonenumber, options: MethodOptions | BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberResponse>, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberResponse>): void;
        verifyPhoneNumber(params: Params$Resource$Relyingparty$Verifyphonenumber, callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberResponse>): void;
        verifyPhoneNumber(callback: BodyResponseCallback<Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberResponse>): void;
    }
    interface Params$Resource$Relyingparty$Createauthuri extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyCreateAuthUriRequest;
    }
    interface Params$Resource$Relyingparty$Deleteaccount extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyDeleteAccountRequest;
    }
    interface Params$Resource$Relyingparty$Downloadaccount extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyDownloadAccountRequest;
    }
    interface Params$Resource$Relyingparty$Emaillinksignin extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyEmailLinkSigninRequest;
    }
    interface Params$Resource$Relyingparty$Getaccountinfo extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyGetAccountInfoRequest;
    }
    interface Params$Resource$Relyingparty$Getoobconfirmationcode extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Relyingparty;
    }
    interface Params$Resource$Relyingparty$Getprojectconfig extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Delegated GCP project number of the request.
         */
        delegatedProjectNumber?: string;
        /**
         * GCP project number of the request.
         */
        projectNumber?: string;
    }
    interface Params$Resource$Relyingparty$Getpublickeys extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
    }
    interface Params$Resource$Relyingparty$Getrecaptchaparam extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
    }
    interface Params$Resource$Relyingparty$Resetpassword extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyResetPasswordRequest;
    }
    interface Params$Resource$Relyingparty$Sendverificationcode extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartySendVerificationCodeRequest;
    }
    interface Params$Resource$Relyingparty$Setaccountinfo extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartySetAccountInfoRequest;
    }
    interface Params$Resource$Relyingparty$Setprojectconfig extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartySetProjectConfigRequest;
    }
    interface Params$Resource$Relyingparty$Signoutuser extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartySignOutUserRequest;
    }
    interface Params$Resource$Relyingparty$Signupnewuser extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartySignupNewUserRequest;
    }
    interface Params$Resource$Relyingparty$Uploadaccount extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyUploadAccountRequest;
    }
    interface Params$Resource$Relyingparty$Verifyassertion extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyVerifyAssertionRequest;
    }
    interface Params$Resource$Relyingparty$Verifycustomtoken extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyVerifyCustomTokenRequest;
    }
    interface Params$Resource$Relyingparty$Verifypassword extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyVerifyPasswordRequest;
    }
    interface Params$Resource$Relyingparty$Verifyphonenumber extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$IdentitytoolkitRelyingpartyVerifyPhoneNumberRequest;
    }
}
