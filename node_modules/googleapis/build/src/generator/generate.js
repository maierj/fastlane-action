"use strict";
/**
 * Copyright 2014 Google Inc. All Rights Reserved.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const path = require("path");
const rimraf = require("rimraf");
const source_map_support_1 = require("source-map-support");
const util = require("util");
const generator_1 = require("./generator");
// enable source map support
source_map_support_1.install();
const argv = minimist(process.argv.slice(2));
const DEFAULT_DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis/';
const discoveryUrl = argv['discovery-url'];
const debug = true;
const gen = new generator_1.Generator({ debug, includePrivate: false });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!discoveryUrl && argv._.length > 0) {
            argv._.forEach((url) => __awaiter(this, void 0, void 0, function* () {
                yield gen.generateAPI(url);
                console.log('Generated API for ' + url);
            }));
        }
        else {
            console.log('Removing old APIs...');
            const apiPath = path.join(__dirname, '../../../src/apis');
            yield util.promisify(rimraf)(apiPath);
            console.log('Generating APIs...');
            yield gen.generateAllAPIs(discoveryUrl || DEFAULT_DISCOVERY_URL);
            console.log('Finished generating APIs!');
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=generate.js.map