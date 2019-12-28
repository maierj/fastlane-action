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
const events_1 = require("events");
const http2 = require("http2");
const stream_1 = require("stream");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
const stream_decoder_1 = require("./stream-decoder");
const GRPC_ACCEPT_ENCODING_HEADER = 'grpc-accept-encoding';
const GRPC_ENCODING_HEADER = 'grpc-encoding';
const GRPC_MESSAGE_HEADER = 'grpc-message';
const GRPC_STATUS_HEADER = 'grpc-status';
const GRPC_TIMEOUT_HEADER = 'grpc-timeout';
const DEADLINE_REGEX = /(\d{1,8})\s*([HMSmun])/;
const deadlineUnitsToMs = {
    H: 3600000,
    M: 60000,
    S: 1000,
    m: 1,
    u: 0.001,
    n: 0.000001,
};
const defaultResponseHeaders = {
    // TODO(cjihrig): Remove these encoding headers from the default response
    // once compression is integrated.
    [GRPC_ACCEPT_ENCODING_HEADER]: 'identity',
    [GRPC_ENCODING_HEADER]: 'identity',
    [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_OK,
    [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/grpc+proto',
};
const defaultResponseOptions = {
    waitForTrailers: true,
};
class ServerUnaryCallImpl extends events_1.EventEmitter {
    constructor(call, metadata) {
        super();
        this.call = call;
        this.metadata = metadata;
        this.cancelled = false;
        this.request = null;
        this.call.setupSurfaceCall(this);
    }
    getPeer() {
        throw new Error('not implemented yet');
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
}
exports.ServerUnaryCallImpl = ServerUnaryCallImpl;
class ServerReadableStreamImpl extends stream_1.Readable {
    constructor(call, metadata, deserialize) {
        super({ objectMode: true });
        this.call = call;
        this.metadata = metadata;
        this.deserialize = deserialize;
        this.cancelled = false;
        this.call.setupSurfaceCall(this);
        this.call.setupReadable(this);
    }
    _read(size) {
        if (!this.call.consumeUnpushedMessages(this)) {
            return;
        }
        this.call.resume();
    }
    getPeer() {
        throw new Error('not implemented yet');
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
}
exports.ServerReadableStreamImpl = ServerReadableStreamImpl;
class ServerWritableStreamImpl extends stream_1.Writable {
    constructor(call, metadata, serialize) {
        super({ objectMode: true });
        this.call = call;
        this.metadata = metadata;
        this.serialize = serialize;
        this.cancelled = false;
        this.request = null;
        this.trailingMetadata = new metadata_1.Metadata();
        this.call.setupSurfaceCall(this);
        this.on('error', err => {
            this.call.sendError(err);
            this.end();
        });
    }
    getPeer() {
        throw new Error('not implemented yet');
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    async _write(chunk, encoding, 
    // tslint:disable-next-line:no-any
    callback) {
        try {
            const response = await this.call.serializeMessage(chunk);
            if (!this.call.write(response)) {
                this.call.once('drain', callback);
                return;
            }
        }
        catch (err) {
            err.code = constants_1.Status.INTERNAL;
            this.emit('error', err);
        }
        callback();
    }
    _final(callback) {
        this.call.sendStatus({
            code: constants_1.Status.OK,
            details: 'OK',
            metadata: this.trailingMetadata,
        });
        callback(null);
    }
    // tslint:disable-next-line:no-any
    end(metadata) {
        if (metadata) {
            this.trailingMetadata = metadata;
        }
        super.end();
    }
}
exports.ServerWritableStreamImpl = ServerWritableStreamImpl;
class ServerDuplexStreamImpl extends stream_1.Duplex {
    constructor(call, metadata, serialize, deserialize) {
        super({ objectMode: true });
        this.call = call;
        this.metadata = metadata;
        this.serialize = serialize;
        this.deserialize = deserialize;
        this.cancelled = false;
        this.trailingMetadata = new metadata_1.Metadata();
        this.call.setupSurfaceCall(this);
        this.call.setupReadable(this);
        this.on('error', err => {
            this.call.sendError(err);
            this.end();
        });
    }
    getPeer() {
        throw new Error('not implemented yet');
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
}
exports.ServerDuplexStreamImpl = ServerDuplexStreamImpl;
ServerDuplexStreamImpl.prototype._read =
    ServerReadableStreamImpl.prototype._read;
ServerDuplexStreamImpl.prototype._write =
    ServerWritableStreamImpl.prototype._write;
ServerDuplexStreamImpl.prototype._final =
    ServerWritableStreamImpl.prototype._final;
ServerDuplexStreamImpl.prototype.end = ServerWritableStreamImpl.prototype.end;
const noopTimer = setTimeout(() => { }, 0);
// Internal class that wraps the HTTP2 request.
class Http2ServerCallStream extends events_1.EventEmitter {
    constructor(stream, handler) {
        super();
        this.stream = stream;
        this.handler = handler;
        this.cancelled = false;
        this.deadline = noopTimer;
        this.wantTrailers = false;
        this.metadataSent = false;
        this.canPush = false;
        this.isPushPending = false;
        this.bufferedMessages = [];
        this.messagesToPush = [];
        this.stream.once('error', (err) => {
            err.code = constants_1.Status.INTERNAL;
            this.sendError(err);
        });
        this.stream.once('close', () => {
            if (this.stream.rstCode === http2.constants.NGHTTP2_CANCEL) {
                this.cancelled = true;
                this.emit('cancelled', 'cancelled');
            }
        });
        this.stream.on('drain', () => {
            this.emit('drain');
        });
    }
    sendMetadata(customMetadata) {
        if (this.metadataSent) {
            return;
        }
        this.metadataSent = true;
        const custom = customMetadata ? customMetadata.toHttp2Headers() : null;
        // TODO(cjihrig): Include compression headers.
        const headers = Object.assign(defaultResponseHeaders, custom);
        this.stream.respond(headers, defaultResponseOptions);
    }
    receiveMetadata(headers) {
        const metadata = metadata_1.Metadata.fromHttp2Headers(headers);
        // TODO(cjihrig): Receive compression metadata.
        const timeoutHeader = metadata.get(GRPC_TIMEOUT_HEADER);
        if (timeoutHeader.length > 0) {
            const match = timeoutHeader[0].toString().match(DEADLINE_REGEX);
            if (match === null) {
                const err = new Error('Invalid deadline');
                err.code = constants_1.Status.OUT_OF_RANGE;
                this.sendError(err);
                return;
            }
            const timeout = (+match[1] * deadlineUnitsToMs[match[2]]) | 0;
            this.deadline = setTimeout(handleExpiredDeadline, timeout, this);
            metadata.remove(GRPC_TIMEOUT_HEADER);
        }
        return metadata;
    }
    receiveUnaryMessage() {
        return new Promise((resolve, reject) => {
            const stream = this.stream;
            const chunks = [];
            let totalLength = 0;
            stream.on('data', (data) => {
                chunks.push(data);
                totalLength += data.byteLength;
            });
            stream.once('end', async () => {
                try {
                    const requestBytes = Buffer.concat(chunks, totalLength);
                    resolve(await this.deserializeMessage(requestBytes));
                }
                catch (err) {
                    err.code = constants_1.Status.INTERNAL;
                    this.sendError(err);
                    resolve();
                }
            });
        });
    }
    serializeMessage(value) {
        const messageBuffer = this.handler.serialize(value);
        // TODO(cjihrig): Call compression aware serializeMessage().
        const byteLength = messageBuffer.byteLength;
        const output = Buffer.allocUnsafe(byteLength + 5);
        output.writeUInt8(0, 0);
        output.writeUInt32BE(byteLength, 1);
        messageBuffer.copy(output, 5);
        return output;
    }
    async deserializeMessage(bytes) {
        // TODO(cjihrig): Call compression aware deserializeMessage().
        const receivedMessage = bytes.slice(5);
        return this.handler.deserialize(receivedMessage);
    }
    async sendUnaryMessage(err, value, metadata, flags) {
        if (!metadata) {
            metadata = new metadata_1.Metadata();
        }
        if (err) {
            err.metadata = metadata;
            this.sendError(err);
            return;
        }
        try {
            const response = await this.serializeMessage(value);
            this.write(response);
            this.sendStatus({ code: constants_1.Status.OK, details: 'OK', metadata });
        }
        catch (err) {
            err.code = constants_1.Status.INTERNAL;
            this.sendError(err);
        }
    }
    sendStatus(statusObj) {
        if (this.cancelled) {
            return;
        }
        clearTimeout(this.deadline);
        if (!this.wantTrailers) {
            this.wantTrailers = true;
            this.stream.once('wantTrailers', () => {
                const trailersToSend = Object.assign({
                    [GRPC_STATUS_HEADER]: statusObj.code,
                    [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details),
                }, statusObj.metadata.toHttp2Headers());
                this.stream.sendTrailers(trailersToSend);
            });
            this.sendMetadata();
            this.stream.end();
        }
    }
    sendError(error) {
        const status = {
            code: constants_1.Status.UNKNOWN,
            details: 'message' in error ? error.message : 'Unknown Error',
            metadata: 'metadata' in error && error.metadata !== undefined
                ? error.metadata
                : new metadata_1.Metadata(),
        };
        if ('code' in error &&
            typeof error.code === 'number' &&
            Number.isInteger(error.code)) {
            status.code = error.code;
            if ('details' in error && typeof error.details === 'string') {
                status.details = error.details;
            }
        }
        this.sendStatus(status);
    }
    write(chunk) {
        if (this.cancelled) {
            return;
        }
        this.sendMetadata();
        return this.stream.write(chunk);
    }
    resume() {
        this.stream.resume();
    }
    setupSurfaceCall(call) {
        this.once('cancelled', reason => {
            call.cancelled = true;
            call.emit('cancelled', reason);
        });
    }
    setupReadable(readable) {
        const decoder = new stream_decoder_1.StreamDecoder();
        this.stream.on('data', async (data) => {
            const messages = decoder.write(data);
            for (const message of messages) {
                this.pushOrBufferMessage(readable, message);
            }
        });
        this.stream.once('end', () => {
            this.pushOrBufferMessage(readable, null);
        });
    }
    consumeUnpushedMessages(readable) {
        this.canPush = true;
        while (this.messagesToPush.length > 0) {
            const nextMessage = this.messagesToPush.shift();
            const canPush = readable.push(nextMessage);
            if (nextMessage === null || canPush === false) {
                this.canPush = false;
                break;
            }
        }
        return this.canPush;
    }
    pushOrBufferMessage(readable, messageBytes) {
        if (this.isPushPending) {
            this.bufferedMessages.push(messageBytes);
        }
        else {
            this.pushMessage(readable, messageBytes);
        }
    }
    async pushMessage(readable, messageBytes) {
        if (messageBytes === null) {
            if (this.canPush) {
                readable.push(null);
            }
            else {
                this.messagesToPush.push(null);
            }
            return;
        }
        this.isPushPending = true;
        try {
            const deserialized = await this.deserializeMessage(messageBytes);
            if (this.canPush) {
                if (!readable.push(deserialized)) {
                    this.canPush = false;
                    this.stream.pause();
                }
            }
            else {
                this.messagesToPush.push(deserialized);
            }
        }
        catch (err) {
            // Ignore any remaining messages when errors occur.
            this.bufferedMessages.length = 0;
            err.code = constants_1.Status.INTERNAL;
            readable.emit('error', err);
        }
        this.isPushPending = false;
        if (this.bufferedMessages.length > 0) {
            this.pushMessage(readable, this.bufferedMessages.shift());
        }
    }
}
exports.Http2ServerCallStream = Http2ServerCallStream;
function handleExpiredDeadline(call) {
    const err = new Error('Deadline exceeded');
    err.code = constants_1.Status.DEADLINE_EXCEEDED;
    call.sendError(err);
    call.cancelled = true;
    call.emit('cancelled', 'deadline');
}
//# sourceMappingURL=server-call.js.map