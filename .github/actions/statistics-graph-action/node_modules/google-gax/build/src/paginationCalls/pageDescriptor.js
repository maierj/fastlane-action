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
const ended = require("is-stream-ended");
const stream_1 = require("stream");
const normalApiCaller_1 = require("../normalCalls/normalApiCaller");
const pagedApiCaller_1 = require("./pagedApiCaller");
/**
 * A descriptor for methods that support pagination.
 */
class PageDescriptor {
    constructor(requestPageTokenField, responsePageTokenField, resourceField) {
        this.requestPageTokenField = requestPageTokenField;
        this.responsePageTokenField = responsePageTokenField;
        this.resourceField = resourceField;
    }
    /**
     * Creates a new object Stream which emits the resource on 'data' event.
     */
    createStream(apiCall, request, options) {
        const stream = new stream_1.PassThrough({ objectMode: true });
        options = Object.assign({}, options, { autoPaginate: false });
        const maxResults = 'maxResults' in options ? options.maxResults : -1;
        let pushCount = 0;
        let started = false;
        function callback(err, resources, next) {
            if (err) {
                stream.emit('error', err);
                return;
            }
            for (let i = 0; i < resources.length; ++i) {
                if (ended(stream)) {
                    return;
                }
                if (resources[i] === null) {
                    continue;
                }
                stream.push(resources[i]);
                pushCount++;
                if (pushCount === maxResults) {
                    stream.end();
                }
            }
            if (ended(stream)) {
                return;
            }
            if (!next) {
                stream.end();
                return;
            }
            // When pageToken is specified in the original options, it will overwrite
            // the page token field in the next request. Therefore it must be cleared.
            if ('pageToken' in options) {
                delete options.pageToken;
            }
            if (stream.isPaused()) {
                request = next;
                started = false;
            }
            else {
                setImmediate(apiCall, next, options, callback);
            }
        }
        stream.on('resume', () => {
            if (!started) {
                started = true;
                apiCall(request, options, callback);
            }
        });
        return stream;
    }
    getApiCaller(settings) {
        if (!settings.autoPaginate) {
            return new normalApiCaller_1.NormalApiCaller();
        }
        return new pagedApiCaller_1.PagedApiCaller(this);
    }
}
exports.PageDescriptor = PageDescriptor;
//# sourceMappingURL=pageDescriptor.js.map