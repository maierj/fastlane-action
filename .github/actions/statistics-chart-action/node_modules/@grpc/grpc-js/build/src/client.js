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
const call_1 = require("./call");
const channel_1 = require("./channel");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
const CHANNEL_SYMBOL = Symbol();
/**
 * A generic gRPC client. Primarily useful as a base class for all generated
 * clients.
 */
class Client {
    constructor(address, credentials, options = {}) {
        if (options.channelOverride) {
            this[CHANNEL_SYMBOL] = options.channelOverride;
        }
        else if (options.channelFactoryOverride) {
            this[CHANNEL_SYMBOL] = options.channelFactoryOverride(address, credentials, options);
        }
        else {
            this[CHANNEL_SYMBOL] = new channel_1.ChannelImplementation(address, credentials, options);
        }
    }
    close() {
        this[CHANNEL_SYMBOL].close();
    }
    getChannel() {
        return this[CHANNEL_SYMBOL];
    }
    waitForReady(deadline, callback) {
        const checkState = (err) => {
            if (err) {
                callback(new Error('Failed to connect before the deadline'));
                return;
            }
            let newState;
            try {
                newState = this[CHANNEL_SYMBOL].getConnectivityState(true);
            }
            catch (e) {
                callback(new Error('The channel has been closed'));
                return;
            }
            if (newState === channel_1.ConnectivityState.READY) {
                callback();
            }
            else {
                try {
                    this[CHANNEL_SYMBOL].watchConnectivityState(newState, deadline, checkState);
                }
                catch (e) {
                    callback(new Error('The channel has been closed'));
                }
            }
        };
        setImmediate(checkState);
    }
    handleUnaryResponse(call, deserialize, callback) {
        let responseMessage = null;
        call.on('data', (data) => {
            if (responseMessage != null) {
                call.cancelWithStatus(constants_1.Status.INTERNAL, 'Too many responses received');
            }
            try {
                responseMessage = deserialize(data);
            }
            catch (e) {
                call.cancelWithStatus(constants_1.Status.INTERNAL, 'Failed to parse server response');
            }
        });
        call.on('status', (status) => {
            /* We assume that call emits status after it emits end, and that it
             * accounts for any cancelWithStatus calls up until it emits status.
             * Therefore, considering the above event handlers, status.code should be
             * OK if and only if we have a non-null responseMessage */
            if (status.code === constants_1.Status.OK) {
                callback(null, responseMessage);
            }
            else {
                callback(call_1.callErrorFromStatus(status));
            }
        });
    }
    checkOptionalUnaryResponseArguments(arg1, arg2, arg3) {
        if (arg1 instanceof Function) {
            return { metadata: new metadata_1.Metadata(), options: {}, callback: arg1 };
        }
        else if (arg2 instanceof Function) {
            if (arg1 instanceof metadata_1.Metadata) {
                return { metadata: arg1, options: {}, callback: arg2 };
            }
            else {
                return { metadata: new metadata_1.Metadata(), options: arg1, callback: arg2 };
            }
        }
        else {
            if (!(arg1 instanceof metadata_1.Metadata &&
                arg2 instanceof Object &&
                arg3 instanceof Function)) {
                throw new Error('Incorrect arguments passed');
            }
            return { metadata: arg1, options: arg2, callback: arg3 };
        }
    }
    makeUnaryRequest(method, serialize, deserialize, argument, metadata, options, callback) {
        ({ metadata, options, callback } = this.checkOptionalUnaryResponseArguments(metadata, options, callback));
        const call = this[CHANNEL_SYMBOL].createCall(method, options.deadline, options.host, null, options.propagate_flags);
        if (options.credentials) {
            call.setCredentials(options.credentials);
        }
        const message = serialize(argument);
        const writeObj = { message };
        call.sendMetadata(metadata);
        call.write(writeObj);
        call.end();
        this.handleUnaryResponse(call, deserialize, callback);
        return new call_1.ClientUnaryCallImpl(call);
    }
    makeClientStreamRequest(method, serialize, deserialize, metadata, options, callback) {
        ({ metadata, options, callback } = this.checkOptionalUnaryResponseArguments(metadata, options, callback));
        const call = this[CHANNEL_SYMBOL].createCall(method, options.deadline, options.host, null, options.propagate_flags);
        if (options.credentials) {
            call.setCredentials(options.credentials);
        }
        call.sendMetadata(metadata);
        this.handleUnaryResponse(call, deserialize, callback);
        return new call_1.ClientWritableStreamImpl(call, serialize);
    }
    checkMetadataAndOptions(arg1, arg2) {
        let metadata;
        let options;
        if (arg1 instanceof metadata_1.Metadata) {
            metadata = arg1;
            if (arg2) {
                options = arg2;
            }
            else {
                options = {};
            }
        }
        else {
            if (arg1) {
                options = arg1;
            }
            else {
                options = {};
            }
            metadata = new metadata_1.Metadata();
        }
        return { metadata, options };
    }
    makeServerStreamRequest(method, serialize, deserialize, argument, metadata, options) {
        ({ metadata, options } = this.checkMetadataAndOptions(metadata, options));
        const call = this[CHANNEL_SYMBOL].createCall(method, options.deadline, options.host, null, options.propagate_flags);
        if (options.credentials) {
            call.setCredentials(options.credentials);
        }
        const message = serialize(argument);
        const writeObj = { message };
        call.sendMetadata(metadata);
        call.write(writeObj);
        call.end();
        return new call_1.ClientReadableStreamImpl(call, deserialize);
    }
    makeBidiStreamRequest(method, serialize, deserialize, metadata, options) {
        ({ metadata, options } = this.checkMetadataAndOptions(metadata, options));
        const call = this[CHANNEL_SYMBOL].createCall(method, options.deadline, options.host, null, options.propagate_flags);
        if (options.credentials) {
            call.setCredentials(options.credentials);
        }
        call.sendMetadata(metadata);
        return new call_1.ClientDuplexStreamImpl(call, serialize, deserialize);
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map