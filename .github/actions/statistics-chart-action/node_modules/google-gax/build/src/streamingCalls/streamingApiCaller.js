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
const warnings_1 = require("../warnings");
const streaming_1 = require("./streaming");
class StreamingApiCaller {
    /**
     * An API caller for methods of gRPC streaming.
     * @private
     * @constructor
     * @param {StreamDescriptor} descriptor - the descriptor of the method structure.
     */
    constructor(descriptor) {
        this.descriptor = descriptor;
    }
    init(settings, callback) {
        return new streaming_1.StreamProxy(this.descriptor.type, callback);
    }
    wrap(func) {
        switch (this.descriptor.type) {
            case streaming_1.StreamType.SERVER_STREAMING:
                return (argument, metadata, options) => {
                    return func(argument, metadata, options);
                };
            case streaming_1.StreamType.CLIENT_STREAMING:
                return (argument, metadata, options, callback) => {
                    return func(metadata, options, callback);
                };
            case streaming_1.StreamType.BIDI_STREAMING:
                return (argument, metadata, options) => {
                    return func(metadata, options);
                };
            default:
                warnings_1.warn('streaming_wrap_unknown_stream_type', `Unknown stream type: ${this.descriptor.type}`);
        }
        return func;
    }
    call(apiCall, argument, settings, stream) {
        stream.setStream(apiCall, argument);
    }
    fail(stream, err) {
        stream.emit('error', err);
    }
    result(stream) {
        return stream;
    }
}
exports.StreamingApiCaller = StreamingApiCaller;
//# sourceMappingURL=streamingApiCaller.js.map