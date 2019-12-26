"use strict";
/*
 * Copyright 2019 Google LLC
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
const status_1 = require("./status");
const googleError_1 = require("./googleError");
class OngoingCall {
    /**
     * OngoingCall manages callback, API calls, and cancellation
     * of the API calls.
     * @param {APICallback=} callback
     *   The callback to be called asynchronously when the API call
     *   finishes.
     * @constructor
     * @property {APICallback} callback
     *   The callback function to be called.
     * @private
     */
    constructor(callback) {
        this.callback = callback;
        this.completed = false;
    }
    /**
     * Cancels the ongoing promise.
     */
    cancel() {
        if (this.completed) {
            return;
        }
        this.completed = true;
        if (this.cancelFunc) {
            this.cancelFunc();
        }
        else {
            const error = new googleError_1.GoogleError('cancelled');
            error.code = status_1.Status.CANCELLED;
            this.callback(error);
        }
    }
    /**
     * Call calls the specified function. Result will be used to fulfill
     * the promise.
     *
     * @param {SimpleCallbackFunction} func
     *   A function for an API call.
     * @param {Object} argument
     *   A request object.
     */
    call(func, argument) {
        if (this.completed) {
            return;
        }
        // tslint:disable-next-line no-any
        const canceller = func(argument, (...args) => {
            this.completed = true;
            setImmediate(this.callback, ...args);
        });
        this.cancelFunc = () => canceller.cancel();
    }
}
exports.OngoingCall = OngoingCall;
class OngoingCallPromise extends OngoingCall {
    /**
     * GaxPromise is GRPCCallbackWrapper, but it holds a promise when
     * the API call finishes.
     * @param {Function} PromiseCtor - A constructor for a promise that implements
     * the ES6 specification of promise.
     * @constructor
     * @private
     */
    // tslint:disable-next-line variable-name
    constructor(PromiseCtor) {
        super();
        this.promise = new PromiseCtor((resolve, reject) => {
            this.callback = (err, response, next, rawResponse) => {
                if (err) {
                    reject(err);
                }
                else if (response !== undefined) {
                    resolve([response, next, rawResponse]);
                }
                else {
                    throw new googleError_1.GoogleError('Neither error nor response are defined');
                }
            };
        });
        this.promise.cancel = () => {
            this.cancel();
        };
    }
}
exports.OngoingCallPromise = OngoingCallPromise;
//# sourceMappingURL=call.js.map