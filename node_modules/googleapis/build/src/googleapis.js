"use strict";
// Copyright 2012-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const googleapis_common_1 = require("googleapis-common");
const apis = require("./apis");
class AuthPlus extends google_auth_library_1.GoogleAuth {
    constructor() {
        super(...arguments);
        // tslint:disable-next-line: variable-name
        this.JWT = google_auth_library_1.JWT;
        // tslint:disable-next-line: variable-name
        this.Compute = google_auth_library_1.Compute;
        // tslint:disable-next-line: variable-name
        this.OAuth2 = google_auth_library_1.OAuth2Client;
    }
}
exports.AuthPlus = AuthPlus;
class GoogleApis extends apis.GeneratedAPIs {
    /**
     * GoogleApis constructor.
     *
     * @example
     * const GoogleApis = require('googleapis').GoogleApis;
     * const google = new GoogleApis();
     *
     * @class GoogleApis
     * @param {Object} [options] Configuration options.
     */
    constructor(options) {
        super();
        this._discovery = new googleapis_common_1.Discovery({ debug: false, includePrivate: false });
        this.auth = new AuthPlus();
        this._options = {};
        this.options(options);
    }
    /**
     * Obtain a Map of supported APIs, along with included API versions.
     */
    getSupportedAPIs() {
        const apiMap = {};
        Object.keys(apis.APIS).forEach(a => {
            apiMap[a] = Object.keys(apis.APIS[a]);
        });
        return apiMap;
    }
    /**
     * Set options.
     *
     * @param  {Object} [options] Configuration options.
     */
    options(options) {
        this._options = options || {};
    }
    /**
     * Add APIs endpoints to googleapis object
     * E.g. googleapis.drive and googleapis.datastore
     *
     * @name GoogleApis#addAPIs
     * @method
     * @param {Object} apis Apis to be added to this GoogleApis instance.
     * @private
     */
    addAPIs(apisToAdd) {
        for (const apiName in apisToAdd) {
            if (apisToAdd.hasOwnProperty(apiName)) {
                // tslint:disable-next-line: no-any
                this[apiName] = apisToAdd[apiName].bind(this);
            }
        }
    }
    discover(url, callback) {
        if (callback) {
            this.discoverAsync(url).then(() => callback()).catch(callback);
        }
        else {
            return this.discoverAsync(url);
        }
    }
    discoverAsync(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const allApis = yield this._discovery.discoverAllAPIs(url);
            this.addAPIs(allApis);
        });
    }
    /**
     * Dynamically generate an Endpoint object from a discovery doc.
     *
     * @param path Url or file path to discover doc for a single API.
     * @param Options to configure the Endpoint object generated from the
     * discovery doc.
     * @returns A promise that resolves with the configured endpoint.
     */
    discoverAPI(apiPath, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpointCreator = yield this._discovery.discoverAPI(apiPath);
            const ep = endpointCreator(options, this);
            ep.google = this; // for drive.google.transporter
            return Object.freeze(ep);
        });
    }
}
exports.GoogleApis = GoogleApis;
//# sourceMappingURL=googleapis.js.map