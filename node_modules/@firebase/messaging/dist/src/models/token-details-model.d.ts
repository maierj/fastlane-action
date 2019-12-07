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
import { TokenDetails } from '../interfaces/token-details';
import { DbInterface } from './db-interface';
import { FirebaseInternalServices } from '../interfaces/internal-services';
export declare class TokenDetailsModel extends DbInterface {
    private readonly services;
    protected readonly dbName: string;
    protected readonly dbVersion: number;
    protected readonly objectStoreName: string;
    constructor(services: FirebaseInternalServices);
    protected onDbUpgrade(request: IDBOpenDBRequest, event: IDBVersionChangeEvent): void;
    /**
     * Given a token, this method will look up the details in indexedDB.
     */
    getTokenDetailsFromToken(fcmToken: string): Promise<TokenDetails | undefined>;
    /**
     * Given a service worker scope, this method will look up the details in
     * indexedDB.
     * @return The details associated with that token.
     */
    getTokenDetailsFromSWScope(swScope: string): Promise<TokenDetails | undefined>;
    /**
     * Save the details for the fcm token for re-use at a later date.
     * @param input A plain js object containing args to save.
     */
    saveTokenDetails(tokenDetails: TokenDetails): Promise<void>;
    /**
     * This method deletes details of the current FCM token.
     * It's returning a promise in case we need to move to an async
     * method for deleting at a later date.
     *
     * @return Resolves once the FCM token details have been deleted and returns
     * the deleted details.
     */
    deleteToken(token: string): Promise<TokenDetails>;
}
