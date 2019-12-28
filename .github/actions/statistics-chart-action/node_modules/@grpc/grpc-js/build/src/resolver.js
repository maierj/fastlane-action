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
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const resolver_dns = require("./resolver-dns");
const resolver_uds = require("./resolver-uds");
const registeredResolvers = {};
let defaultResolver = null;
/**
 * Register a resolver class to handle target names prefixed with the `prefix`
 * string. This prefix should correspond to a URI scheme name listed in the
 * [gRPC Name Resolution document](https://github.com/grpc/grpc/blob/master/doc/naming.md)
 * @param prefix
 * @param resolverClass
 */
function registerResolver(prefix, resolverClass) {
    registeredResolvers[prefix] = resolverClass;
}
exports.registerResolver = registerResolver;
/**
 * Register a default resolver to handle target names that do not start with
 * any registered prefix.
 * @param resolverClass
 */
function registerDefaultResolver(resolverClass) {
    defaultResolver = resolverClass;
}
exports.registerDefaultResolver = registerDefaultResolver;
/**
 * Create a name resolver for the specified target, if possible. Throws an
 * error if no such name resolver can be created.
 * @param target
 * @param listener
 */
function createResolver(target, listener) {
    for (const prefix of Object.keys(registeredResolvers)) {
        if (target.startsWith(prefix)) {
            return new registeredResolvers[prefix](target, listener);
        }
    }
    if (defaultResolver !== null) {
        return new defaultResolver(target, listener);
    }
    throw new Error(`No resolver could be created for target ${target}`);
}
exports.createResolver = createResolver;
/**
 * Get the default authority for the specified target, if possible. Throws an
 * error if no registered name resolver can parse that target string.
 * @param target
 */
function getDefaultAuthority(target) {
    for (const prefix of Object.keys(registeredResolvers)) {
        if (target.startsWith(prefix)) {
            return registeredResolvers[prefix].getDefaultAuthority(target);
        }
    }
    if (defaultResolver !== null) {
        return defaultResolver.getDefaultAuthority(target);
    }
    throw new Error(`Invalid target ${target}`);
}
exports.getDefaultAuthority = getDefaultAuthority;
function registerAll() {
    resolver_dns.setup();
    resolver_uds.setup();
}
exports.registerAll = registerAll;
//# sourceMappingURL=resolver.js.map