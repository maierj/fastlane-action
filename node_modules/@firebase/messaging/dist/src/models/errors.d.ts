/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ErrorFactory, ErrorMap } from '@firebase/util';
export declare const enum ErrorCode {
    AVAILABLE_IN_WINDOW = "only-available-in-window",
    AVAILABLE_IN_SW = "only-available-in-sw",
    SHOULD_BE_INHERITED = "should-be-overriden",
    BAD_SENDER_ID = "bad-sender-id",
    PERMISSION_DEFAULT = "permission-default",
    PERMISSION_BLOCKED = "permission-blocked",
    UNSUPPORTED_BROWSER = "unsupported-browser",
    NOTIFICATIONS_BLOCKED = "notifications-blocked",
    FAILED_DEFAULT_REGISTRATION = "failed-serviceworker-registration",
    SW_REGISTRATION_EXPECTED = "sw-registration-expected",
    GET_SUBSCRIPTION_FAILED = "get-subscription-failed",
    INVALID_SAVED_TOKEN = "invalid-saved-token",
    SW_REG_REDUNDANT = "sw-reg-redundant",
    TOKEN_SUBSCRIBE_FAILED = "token-subscribe-failed",
    TOKEN_SUBSCRIBE_NO_TOKEN = "token-subscribe-no-token",
    TOKEN_UNSUBSCRIBE_FAILED = "token-unsubscribe-failed",
    TOKEN_UPDATE_FAILED = "token-update-failed",
    TOKEN_UPDATE_NO_TOKEN = "token-update-no-token",
    USE_SW_BEFORE_GET_TOKEN = "use-sw-before-get-token",
    INVALID_DELETE_TOKEN = "invalid-delete-token",
    DELETE_TOKEN_NOT_FOUND = "delete-token-not-found",
    DELETE_SCOPE_NOT_FOUND = "delete-scope-not-found",
    BG_HANDLER_FUNCTION_EXPECTED = "bg-handler-function-expected",
    NO_WINDOW_CLIENT_TO_MSG = "no-window-client-to-msg",
    UNABLE_TO_RESUBSCRIBE = "unable-to-resubscribe",
    NO_FCM_TOKEN_FOR_RESUBSCRIBE = "no-fcm-token-for-resubscribe",
    FAILED_TO_DELETE_TOKEN = "failed-to-delete-token",
    NO_SW_IN_REG = "no-sw-in-reg",
    BAD_SCOPE = "bad-scope",
    BAD_VAPID_KEY = "bad-vapid-key",
    BAD_SUBSCRIPTION = "bad-subscription",
    BAD_TOKEN = "bad-token",
    FAILED_DELETE_VAPID_KEY = "failed-delete-vapid-key",
    INVALID_PUBLIC_VAPID_KEY = "invalid-public-vapid-key",
    USE_PUBLIC_KEY_BEFORE_GET_TOKEN = "use-public-key-before-get-token",
    PUBLIC_KEY_DECRYPTION_FAILED = "public-vapid-key-decryption-failed"
}
export declare const ERROR_MAP: ErrorMap<ErrorCode>;
interface ErrorParams {
    [ErrorCode.FAILED_DEFAULT_REGISTRATION]: {
        browserErrorMessage: string;
    };
    [ErrorCode.TOKEN_SUBSCRIBE_FAILED]: {
        errorInfo: string;
    };
    [ErrorCode.TOKEN_UNSUBSCRIBE_FAILED]: {
        errorInfo: string;
    };
    [ErrorCode.TOKEN_UPDATE_FAILED]: {
        errorInfo: string;
    };
    [ErrorCode.UNABLE_TO_RESUBSCRIBE]: {
        errorInfo: string;
    };
}
export declare const errorFactory: ErrorFactory<ErrorCode, ErrorParams>;
export {};
