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
const stream_1 = require("stream");
const constants_1 = require("./constants");
/**
 * Construct a ServiceError from a StatusObject. This function exists primarily
 * as an attempt to make the error stack trace clearly communicate that the
 * error is not necessarily a problem in gRPC itself.
 * @param status
 */
function callErrorFromStatus(status) {
    const message = `${status.code} ${constants_1.Status[status.code]}: ${status.details}`;
    return Object.assign(new Error(message), status);
}
exports.callErrorFromStatus = callErrorFromStatus;
class ClientUnaryCallImpl extends events_1.EventEmitter {
    constructor(call) {
        super();
        this.call = call;
        call.on('metadata', (metadata) => {
            this.emit('metadata', metadata);
        });
        call.on('status', (status) => {
            this.emit('status', status);
        });
    }
    cancel() {
        this.call.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        return this.call.getPeer();
    }
}
exports.ClientUnaryCallImpl = ClientUnaryCallImpl;
function setUpReadableStream(stream, call, deserialize) {
    let statusEmitted = false;
    call.on('data', (data) => {
        let deserialized;
        try {
            deserialized = deserialize(data);
        }
        catch (e) {
            call.cancelWithStatus(constants_1.Status.INTERNAL, 'Failed to parse server response');
            return;
        }
        if (!stream.push(deserialized)) {
            call.pause();
        }
    });
    call.on('end', () => {
        if (statusEmitted) {
            stream.push(null);
        }
        else {
            call.once('status', () => {
                stream.push(null);
            });
        }
    });
    call.on('status', (status) => {
        if (status.code !== constants_1.Status.OK) {
            stream.emit('error', callErrorFromStatus(status));
        }
        stream.emit('status', status);
        statusEmitted = true;
    });
    call.pause();
}
class ClientReadableStreamImpl extends stream_1.Readable {
    constructor(call, deserialize) {
        super({ objectMode: true });
        this.call = call;
        this.deserialize = deserialize;
        call.on('metadata', (metadata) => {
            this.emit('metadata', metadata);
        });
        setUpReadableStream(this, call, deserialize);
    }
    cancel() {
        this.call.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        return this.call.getPeer();
    }
    _read(_size) {
        this.call.resume();
    }
}
exports.ClientReadableStreamImpl = ClientReadableStreamImpl;
function tryWrite(call, serialize, chunk, encoding, cb) {
    let message;
    const flags = Number(encoding);
    try {
        message = serialize(chunk);
    }
    catch (e) {
        call.cancelWithStatus(constants_1.Status.INTERNAL, 'Serialization failure');
        cb(e);
        return;
    }
    const writeObj = { message };
    if (!Number.isNaN(flags)) {
        writeObj.flags = flags;
    }
    call.write(writeObj, cb);
}
class ClientWritableStreamImpl extends stream_1.Writable {
    constructor(call, serialize) {
        super({ objectMode: true });
        this.call = call;
        this.serialize = serialize;
        call.on('metadata', (metadata) => {
            this.emit('metadata', metadata);
        });
        call.on('status', (status) => {
            this.emit('status', status);
        });
    }
    cancel() {
        this.call.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        return this.call.getPeer();
    }
    _write(chunk, encoding, cb) {
        tryWrite(this.call, this.serialize, chunk, encoding, cb);
    }
    _final(cb) {
        this.call.end();
        cb();
    }
}
exports.ClientWritableStreamImpl = ClientWritableStreamImpl;
class ClientDuplexStreamImpl extends stream_1.Duplex {
    constructor(call, serialize, deserialize) {
        super({ objectMode: true });
        this.call = call;
        this.serialize = serialize;
        this.deserialize = deserialize;
        call.on('metadata', (metadata) => {
            this.emit('metadata', metadata);
        });
        setUpReadableStream(this, call, deserialize);
    }
    cancel() {
        this.call.cancelWithStatus(constants_1.Status.CANCELLED, 'Cancelled on client');
    }
    getPeer() {
        return this.call.getPeer();
    }
    _read(_size) {
        this.call.resume();
    }
    _write(chunk, encoding, cb) {
        tryWrite(this.call, this.serialize, chunk, encoding, cb);
    }
    _final(cb) {
        this.call.end();
        cb();
    }
}
exports.ClientDuplexStreamImpl = ClientDuplexStreamImpl;
//# sourceMappingURL=call.js.map