"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const resolver_1 = require("./resolver");
function getUdsName(target) {
    /* Due to how this resolver is registered, it should only be constructed
     * with strings that start with 'unix:'. Other strings may result in
     * nonsensical output. If the string starts with 'unix://' that entire
     * prefix needs to be ignored */
    if (target.startsWith('unix://')) {
        return target.substring(7);
    }
    else {
        return target.substring(5);
    }
}
class UdsResolver {
    constructor(target, listener) {
        this.listener = listener;
        this.addresses = [];
        this.addresses = [getUdsName(target)];
    }
    updateResolution() {
        process.nextTick(this.listener.onSuccessfulResolution, this.addresses, null, null);
    }
    static getDefaultAuthority(target) {
        return 'localhost';
    }
}
function setup() {
    resolver_1.registerResolver('unix:', UdsResolver);
}
exports.setup = setup;
//# sourceMappingURL=resolver-uds.js.map