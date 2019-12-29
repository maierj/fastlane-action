"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_common_1 = require("googleapis-common");
// tslint:disable: no-any
// tslint:disable: class-name
// tslint:disable: variable-name
// tslint:disable: jsdoc-format
// tslint:disable: no-namespace
var bigtableadmin_v1;
(function (bigtableadmin_v1) {
    /**
     * Cloud Bigtable Admin API
     *
     * Administer your Cloud Bigtable tables and instances.
     *
     * @example
     * const {google} = require('googleapis');
     * const bigtableadmin = google.bigtableadmin('v1');
     *
     * @namespace bigtableadmin
     * @type {Function}
     * @version v1
     * @variation v1
     * @param {object=} options Options for Bigtableadmin
     */
    class Bigtableadmin {
        constructor(options, google) {
            this.context = { _options: options || {}, google };
            this.projects = new Resource$Projects(this.context);
        }
    }
    bigtableadmin_v1.Bigtableadmin = Bigtableadmin;
    class Resource$Projects {
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Projects$Locations(this.context);
        }
    }
    bigtableadmin_v1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Locations {
        constructor(context) {
            this.context = context;
        }
        get(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback || {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://bigtableadmin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET'
                }, options),
                params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: this.context
            };
            if (callback) {
                googleapis_common_1.createAPIRequest(parameters, callback);
            }
            else {
                return googleapis_common_1.createAPIRequest(parameters);
            }
        }
        list(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback || {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://bigtableadmin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+name}/locations')
                        .replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET'
                }, options),
                params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: this.context
            };
            if (callback) {
                googleapis_common_1.createAPIRequest(parameters, callback);
            }
            else {
                return googleapis_common_1.createAPIRequest(parameters);
            }
        }
    }
    bigtableadmin_v1.Resource$Projects$Locations = Resource$Projects$Locations;
})(bigtableadmin_v1 = exports.bigtableadmin_v1 || (exports.bigtableadmin_v1 = {}));
//# sourceMappingURL=v1.js.map