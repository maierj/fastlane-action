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
const warnings_1 = require("../warnings");
const bundlingUtils_1 = require("./bundlingUtils");
const task_1 = require("./task");
function noop() { }
/**
 * BundleExecutor stores several timers for each bundle (calls are bundled based
 * on the options passed, each bundle has unique ID that is calculated based on
 * field values). Each timer fires and sends a call after certain amount of
 * time, and if a new request comes to the same bundle, the timer can be
 * restarted.
 */
class BundleExecutor {
    /**
     * Organizes requests for an api service that requires to bundle them.
     *
     * @param {BundleOptions} bundleOptions - configures strategy this instance
     *   uses when executing bundled functions.
     * @param {BundleDescriptor} bundleDescriptor - the description of the bundling.
     * @constructor
     */
    constructor(bundleOptions, bundleDescriptor) {
        this._options = bundleOptions;
        this._descriptor = bundleDescriptor;
        this._tasks = {};
        this._timers = {};
        this._invocations = {};
        this._invocationId = 0;
    }
    /**
     * Schedule a method call.
     *
     * @param {function} apiCall - the function for an API call.
     * @param {Object} request - the request object to be bundled with others.
     * @param {APICallback} callback - the callback to be called when the method finished.
     * @return {function()} - the function to cancel the scheduled invocation.
     */
    schedule(apiCall, request, callback) {
        const bundleId = bundlingUtils_1.computeBundleId(request, this._descriptor.requestDiscriminatorFields);
        callback = (callback || noop);
        if (bundleId === undefined) {
            warnings_1.warn('bundling_schedule_bundleid_undefined', 'The request does not have enough information for request bundling. ' +
                `Invoking immediately. Request: ${JSON.stringify(request)} ` +
                `discriminator fields: ${this._descriptor.requestDiscriminatorFields}`);
            return apiCall(request, callback);
        }
        if (request[this._descriptor.bundledField] === undefined) {
            warnings_1.warn('bundling_no_bundled_field', `Request does not contain field ${this._descriptor.bundledField} that must present for bundling. ` +
                `Invoking immediately. Request: ${JSON.stringify(request)}`);
            return apiCall(request, callback);
        }
        if (!(bundleId in this._tasks)) {
            this._tasks[bundleId] = new task_1.Task(apiCall, request, this._descriptor.bundledField, this._descriptor.subresponseField);
        }
        let task = this._tasks[bundleId];
        callback.id = String(this._invocationId++);
        this._invocations[callback.id] = bundleId;
        const bundledField = request[this._descriptor.bundledField];
        const elementCount = bundledField.length;
        let requestBytes = 0;
        const self = this;
        bundledField.forEach(obj => {
            requestBytes += this._descriptor.byteLengthFunction(obj);
        });
        const countLimit = this._options.elementCountLimit || 0;
        const byteLimit = this._options.requestByteLimit || 0;
        if ((countLimit > 0 && elementCount > countLimit) ||
            (byteLimit > 0 && requestBytes >= byteLimit)) {
            let message;
            if (countLimit > 0 && elementCount > countLimit) {
                message =
                    'The number of elements ' +
                        elementCount +
                        ' exceeds the limit ' +
                        this._options.elementCountLimit;
            }
            else {
                message =
                    'The required bytes ' +
                        requestBytes +
                        ' exceeds the limit ' +
                        this._options.requestByteLimit;
            }
            const error = new googleError_1.GoogleError(message);
            error.code = status_1.Status.INVALID_ARGUMENT;
            callback(error);
            return {
                cancel: noop,
            };
        }
        const existingCount = task.getElementCount();
        const existingBytes = task.getRequestByteSize();
        if ((countLimit > 0 && elementCount + existingCount >= countLimit) ||
            (byteLimit > 0 && requestBytes + existingBytes >= byteLimit)) {
            this._runNow(bundleId);
            this._tasks[bundleId] = new task_1.Task(apiCall, request, this._descriptor.bundledField, this._descriptor.subresponseField);
            task = this._tasks[bundleId];
        }
        task.extend(bundledField, requestBytes, callback);
        const ret = {
            cancel() {
                self._cancel(callback.id);
            },
        };
        const countThreshold = this._options.elementCountThreshold || 0;
        const sizeThreshold = this._options.requestByteThreshold || 0;
        if ((countThreshold > 0 && task.getElementCount() >= countThreshold) ||
            (sizeThreshold > 0 && task.getRequestByteSize() >= sizeThreshold)) {
            this._runNow(bundleId);
            return ret;
        }
        if (!(bundleId in this._timers) && this._options.delayThreshold > 0) {
            this._timers[bundleId] = setTimeout(() => {
                delete this._timers[bundleId];
                this._runNow(bundleId);
            }, this._options.delayThreshold);
        }
        return ret;
    }
    /**
     * Clears scheduled timeout if it exists.
     *
     * @param {String} bundleId - the id for the task whose timeout needs to be
     *   cleared.
     * @private
     */
    _maybeClearTimeout(bundleId) {
        if (bundleId in this._timers) {
            const timerId = this._timers[bundleId];
            delete this._timers[bundleId];
            clearTimeout(timerId);
        }
    }
    /**
     * Cancels an event.
     *
     * @param {String} id - The id for the event in the task.
     * @private
     */
    _cancel(id) {
        if (!(id in this._invocations)) {
            return;
        }
        const bundleId = this._invocations[id];
        if (!(bundleId in this._tasks)) {
            return;
        }
        const task = this._tasks[bundleId];
        delete this._invocations[id];
        if (task.cancel(id)) {
            this._maybeClearTimeout(bundleId);
            delete this._tasks[bundleId];
        }
    }
    /**
     * Invokes a task.
     *
     * @param {String} bundleId - The id for the task.
     * @private
     */
    _runNow(bundleId) {
        if (!(bundleId in this._tasks)) {
            warnings_1.warn('bundle_runnow_bundleid_unknown', `No such bundleid: ${bundleId}`);
            return;
        }
        this._maybeClearTimeout(bundleId);
        const task = this._tasks[bundleId];
        delete this._tasks[bundleId];
        task.run().forEach(id => {
            delete this._invocations[id];
        });
    }
}
exports.BundleExecutor = BundleExecutor;
//# sourceMappingURL=bundleExecutor.js.map