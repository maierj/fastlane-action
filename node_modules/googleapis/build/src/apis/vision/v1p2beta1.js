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
var vision_v1p2beta1;
(function (vision_v1p2beta1) {
    /**
     * Cloud Vision API
     *
     * Integrates Google Vision features, including image labeling, face, logo,
     * and landmark detection, optical character recognition (OCR), and detection
     * of explicit content, into applications.
     *
     * @example
     * const {google} = require('googleapis');
     * const vision = google.vision('v1p2beta1');
     *
     * @namespace vision
     * @type {Function}
     * @version v1p2beta1
     * @variation v1p2beta1
     * @param {object=} options Options for Vision
     */
    class Vision {
        constructor(options, google) {
            this.context = { _options: options || {}, google };
            this.files = new Resource$Files(this.context);
            this.images = new Resource$Images(this.context);
        }
    }
    vision_v1p2beta1.Vision = Vision;
    class Resource$Files {
        constructor(context) {
            this.context = context;
        }
        asyncBatchAnnotate(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://vision.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1p2beta1/files:asyncBatchAnnotate')
                        .replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST'
                }, options),
                params,
                requiredParams: [],
                pathParams: [],
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
    vision_v1p2beta1.Resource$Files = Resource$Files;
    class Resource$Images {
        constructor(context) {
            this.context = context;
        }
        annotate(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://vision.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1p2beta1/images:annotate')
                        .replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST'
                }, options),
                params,
                requiredParams: [],
                pathParams: [],
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
    vision_v1p2beta1.Resource$Images = Resource$Images;
})(vision_v1p2beta1 = exports.vision_v1p2beta1 || (exports.vision_v1p2beta1 = {}));
//# sourceMappingURL=v1p2beta1.js.map