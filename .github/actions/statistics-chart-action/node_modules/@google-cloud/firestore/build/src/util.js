"use strict";
/*!
 * Copyright 2018 Google Inc. All Rights Reserved.
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
/**
 * A Promise implementation that supports deferred resolution.
 * @private
 */
class Deferred {
    constructor() {
        this.resolve = () => { };
        this.reject = () => { };
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.Deferred = Deferred;
/**
 * Generate a unique client-side identifier.
 *
 * Used for the creation of new documents.
 *
 * @private
 * @returns {string} A unique 20-character wide identifier.
 */
function autoId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
}
exports.autoId = autoId;
/**
 * Generate a short and semi-random client-side identifier.
 *
 * Used for the creation of request tags.
 *
 * @private
 * @returns {string} A random 5-character wide identifier.
 */
function requestTag() {
    return autoId().substr(0, 5);
}
exports.requestTag = requestTag;
/**
 * Determines whether `value` is a JavaScript object.
 *
 * @private
 */
function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
exports.isObject = isObject;
/**
 * Returns whether `value` has no custom properties.
 *
 * @private
 */
function isEmpty(value) {
    return Object.keys(value).length === 0;
}
exports.isEmpty = isEmpty;
/**
 * Determines whether `value` is a JavaScript function.
 *
 * @private
 */
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=util.js.map