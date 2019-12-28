/**
 * Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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
/// <reference types="node" />
import { Duplex, DuplexOptions, Readable, Stream, Writable } from 'stream';
import { APICallback, CancellableStream, GRPCCallResult, SimpleCallbackFunction } from '../apitypes';
declare const duplexify: DuplexifyConstructor;
export interface DuplexifyOptions extends DuplexOptions {
    autoDestroy?: boolean;
    end?: boolean;
}
export interface Duplexify extends Duplex {
    readonly destroyed: boolean;
    setWritable(writable: Writable | false | null): void;
    setReadable(readable: Readable | false | null): void;
}
export interface DuplexifyConstructor {
    obj(writable?: Writable | false | null, readable?: Readable | false | null, options?: DuplexifyOptions): Duplexify;
    new (writable?: Writable | false | null, readable?: Readable | false | null, options?: DuplexifyOptions): Duplexify;
    (writable?: Writable | false | null, readable?: Readable | false | null, options?: DuplexifyOptions): Duplexify;
}
/**
 * The type of gRPC streaming.
 * @enum {number}
 */
export declare enum StreamType {
    /** Client sends a single request, server streams responses. */
    SERVER_STREAMING = 1,
    /** Client streams requests, server returns a single response. */
    CLIENT_STREAMING = 2,
    /** Both client and server stream objects. */
    BIDI_STREAMING = 3
}
export declare class StreamProxy extends duplexify implements GRPCCallResult {
    type: StreamType;
    private _callback;
    private _isCancelCalled;
    stream?: CancellableStream;
    /**
     * StreamProxy is a proxy to gRPC-streaming method.
     *
     * @private
     * @constructor
     * @param {StreamType} type - the type of gRPC stream.
     * @param {ApiCallback} callback - the callback for further API call.
     */
    constructor(type: StreamType, callback: APICallback);
    cancel(): void;
    /**
     * Forward events from an API request stream to the user's stream.
     * @param {Stream} stream - The API request stream.
     */
    forwardEvents(stream: Stream): void;
    /**
     * Specifies the target stream.
     * @param {ApiCall} apiCall - the API function to be called.
     * @param {Object} argument - the argument to be passed to the apiCall.
     */
    setStream(apiCall: SimpleCallbackFunction, argument: {}): void;
}
export {};
