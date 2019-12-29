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
const googleError_1 = require("../googleError");
class PagedApiCaller {
    /**
     * Creates an API caller that returns a stream to performs page-streaming.
     *
     * @private
     * @constructor
     * @param {PageDescriptor} pageDescriptor - indicates the structure
     *   of page streaming to be performed.
     */
    constructor(pageDescriptor) {
        this.pageDescriptor = pageDescriptor;
    }
    createActualCallback(request, callback) {
        const self = this;
        return function fetchNextPageToken(err, response) {
            if (err) {
                callback(err);
                return;
            }
            if (!response) {
                callback(new googleError_1.GoogleError('Undefined response in pagination method callback.'));
                return;
            }
            const resources = response[self.pageDescriptor.resourceField];
            const pageToken = response[self.pageDescriptor.responsePageTokenField];
            if (pageToken) {
                request[self.pageDescriptor.requestPageTokenField] = pageToken;
                callback(err, resources, request, response);
            }
            else {
                callback(err, resources, null, response);
            }
        };
    }
    wrap(func) {
        const self = this;
        return function wrappedCall(argument, metadata, options, callback) {
            return func(argument, metadata, options, self.createActualCallback(argument, callback));
        };
    }
    init(settings, callback) {
        if (callback) {
            return new call_1.OngoingCall(callback);
        }
        return new call_1.OngoingCallPromise(settings.promise);
    }
    call(apiCall, argument, settings, canceller) {
        argument = Object.assign({}, argument);
        if (settings.pageToken) {
            argument[this.pageDescriptor.requestPageTokenField] = settings.pageToken;
        }
        if (settings.pageSize) {
            argument[this.pageDescriptor.requestPageSizeField] = settings.pageSize;
        }
        if (!settings.autoPaginate) {
            // they don't want auto-pagination this time - okay, just call once
            canceller.call(apiCall, argument);
            return;
        }
        const maxResults = settings.maxResults || -1;
        const allResources = [];
        function pushResources(err, resources, next) {
            if (err) {
                canceller.callback(err);
                return;
            }
            for (let i = 0; i < resources.length; ++i) {
                allResources.push(resources[i]);
                if (allResources.length === maxResults) {
                    next = null;
                    break;
                }
            }
            if (!next) {
                canceller.callback(null, allResources);
                return;
            }
            setImmediate(apiCall, next, pushResources);
        }
        setImmediate(apiCall, argument, pushResources);
    }
    fail(canceller, err) {
        canceller.callback(err);
    }
    result(canceller) {
        return canceller.promise;
    }
}
exports.PagedApiCaller = PagedApiCaller;
//# sourceMappingURL=pagedApiCaller.js.map