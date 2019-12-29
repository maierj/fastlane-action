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
const status_1 = require("../status");
const googleError_1 = require("../googleError");
const timeout_1 = require("./timeout");
/**
 * Creates a function equivalent to func, but that retries on certain
 * exceptions.
 *
 * @private
 *
 * @param {GRPCCall} func - A function.
 * @param {RetryOptions} retry - Configures the exceptions upon which the
 *   function eshould retry, and the parameters to the exponential backoff retry
 *   algorithm.
 * @param {GRPCCallOtherArgs} otherArgs - the additional arguments to be passed to func.
 * @return {SimpleCallbackFunction} A function that will retry.
 */
function retryable(func, retry, otherArgs) {
    const delayMult = retry.backoffSettings.retryDelayMultiplier;
    const maxDelay = retry.backoffSettings.maxRetryDelayMillis;
    const timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
    const maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;
    let delay = retry.backoffSettings.initialRetryDelayMillis;
    let timeout = retry.backoffSettings.initialRpcTimeoutMillis;
    /**
     * Equivalent to ``func``, but retries upon transient failure.
     *
     * Retrying is done through an exponential backoff algorithm configured
     * by the options in ``retry``.
     * @param {RequestType} argument The request object.
     * @param {APICallback} callback The callback.
     * @return {GRPCCall}
     */
    return (argument, callback) => {
        let canceller;
        let timeoutId;
        let now = new Date();
        let deadline;
        if (retry.backoffSettings.totalTimeoutMillis) {
            deadline = now.getTime() + retry.backoffSettings.totalTimeoutMillis;
        }
        let retries = 0;
        const maxRetries = retry.backoffSettings.maxRetries;
        // TODO: define A/B testing values for retry behaviors.
        /** Repeat the API call as long as necessary. */
        function repeat() {
            timeoutId = null;
            if (deadline && now.getTime() >= deadline) {
                const error = new googleError_1.GoogleError('Retry total timeout exceeded before any response was received');
                error.code = status_1.Status.DEADLINE_EXCEEDED;
                callback(error);
                return;
            }
            if (retries && retries >= maxRetries) {
                const error = new googleError_1.GoogleError('Exceeded maximum number of retries before any ' +
                    'response was received');
                error.code = status_1.Status.DEADLINE_EXCEEDED;
                callback(error);
                return;
            }
            retries++;
            const toCall = timeout_1.addTimeoutArg(func, timeout, otherArgs);
            canceller = toCall(argument, (err, response, next, rawResponse) => {
                if (!err) {
                    callback(null, response, next, rawResponse);
                    return;
                }
                canceller = null;
                if (retry.retryCodes.indexOf(err.code) < 0) {
                    err.note =
                        'Exception occurred in retry method that was ' +
                            'not classified as transient';
                    callback(err);
                }
                else {
                    const toSleep = Math.random() * delay;
                    // @ts-ignore
                    timeoutId = setTimeout(() => {
                        now = new Date();
                        delay = Math.min(delay * delayMult, maxDelay);
                        timeout = Math.min(timeout * timeoutMult, maxTimeout, deadline - now.getTime());
                        repeat();
                    }, toSleep);
                }
            });
        }
        if (maxRetries && deadline) {
            const error = new googleError_1.GoogleError('Cannot set both totalTimeoutMillis and maxRetries ' +
                'in backoffSettings.');
            error.code = status_1.Status.INVALID_ARGUMENT;
            callback(error);
        }
        else {
            repeat();
        }
        return {
            cancel() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (canceller) {
                    canceller.cancel();
                }
                else {
                    const error = new googleError_1.GoogleError('cancelled');
                    error.code = status_1.Status.CANCELLED;
                    callback(error);
                }
            },
        };
    };
}
exports.retryable = retryable;
//# sourceMappingURL=retries.js.map