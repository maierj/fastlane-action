"use strict";
/*
 * Copyright 2019, Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const call_1 = require("../call");
const gax_1 = require("../gax");
const longrunning_1 = require("./longrunning");
class LongrunningApiCaller {
    /**
     * Creates an API caller that performs polling on a long running operation.
     *
     * @private
     * @constructor
     * @param {LongRunningDescriptor} longrunningDescriptor - Holds the
     * decoders used for unpacking responses and the operationsClient
     * used for polling the operation.
     */
    constructor(longrunningDescriptor) {
        this.longrunningDescriptor = longrunningDescriptor;
    }
    init(settings, callback) {
        if (callback) {
            return new call_1.OngoingCall(callback);
        }
        return new call_1.OngoingCallPromise(settings.promise);
    }
    wrap(func) {
        return func;
    }
    call(apiCall, argument, settings, canceller) {
        canceller.call((argument, callback) => {
            return this._wrapOperation(apiCall, settings, argument, callback);
        }, argument);
    }
    _wrapOperation(apiCall, settings, argument, callback) {
        let backoffSettings = settings.longrunning;
        if (!backoffSettings) {
            backoffSettings = gax_1.createDefaultBackoffSettings();
        }
        const longrunningDescriptor = this.longrunningDescriptor;
        return apiCall(argument, (err, rawResponse) => {
            if (err) {
                callback(err, null, null, rawResponse);
                return;
            }
            const operation = new longrunning_1.Operation(rawResponse, longrunningDescriptor, backoffSettings, settings);
            callback(null, operation, rawResponse);
        });
    }
    fail(canceller, err) {
        canceller.callback(err);
    }
    result(canceller) {
        return canceller.promise;
    }
}
exports.LongrunningApiCaller = LongrunningApiCaller;
//# sourceMappingURL=longRunningApiCaller.js.map