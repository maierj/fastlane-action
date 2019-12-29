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
const metadata_1 = require("./metadata");
const call_stream_1 = require("./call-stream");
const constants_1 = require("./constants");
/**
 * Error class associated with passing both interceptors and interceptor
 * providers to a client constructor or as call options.
 */
class InterceptorConfigurationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InterceptorConfigurationError';
        Error.captureStackTrace(this, InterceptorConfigurationError);
    }
}
exports.InterceptorConfigurationError = InterceptorConfigurationError;
class ListenerBuilder {
    constructor() {
        this.metadata = undefined;
        this.message = undefined;
        this.status = undefined;
    }
    withOnReceiveMetadata(onReceiveMetadata) {
        this.metadata = onReceiveMetadata;
        return this;
    }
    withOnReceiveMessage(onReceiveMessage) {
        this.message = onReceiveMessage;
        return this;
    }
    withOnReceiveStatus(onReceiveStatus) {
        this.status = onReceiveStatus;
        return this;
    }
    build() {
        return {
            onReceiveMetadata: this.metadata,
            onReceiveMessage: this.message,
            onReceiveStatus: this.status,
        };
    }
}
exports.ListenerBuilder = ListenerBuilder;
class RequesterBuilder {
    constructor() {
        this.start = undefined;
        this.message = undefined;
        this.halfClose = undefined;
        this.cancel = undefined;
    }
    withStart(start) {
        this.start = start;
        return this;
    }
    withSendMessage(sendMessage) {
        this.message = sendMessage;
        return this;
    }
    withHalfClose(halfClose) {
        this.halfClose = halfClose;
        return this;
    }
    withCancel(cancel) {
        this.cancel = cancel;
        return this;
    }
    build() {
        return {
            start: this.start,
            sendMessage: this.message,
            halfClose: this.halfClose,
            cancel: this.cancel,
        };
    }
}
exports.RequesterBuilder = RequesterBuilder;
/**
 * A Listener with a default pass-through implementation of each method. Used
 * for filling out Listeners with some methods omitted.
 */
const defaultListener = {
    onReceiveMetadata: (metadata, next) => {
        next(metadata);
    },
    onReceiveMessage: (message, next) => {
        next(message);
    },
    onReceiveStatus: (status, next) => {
        next(status);
    },
};
/**
 * A Requester with a default pass-through implementation of each method. Used
 * for filling out Requesters with some methods omitted.
 */
const defaultRequester = {
    start: (metadata, listener, next) => {
        next(metadata, listener);
    },
    sendMessage: (message, next) => {
        next(message);
    },
    halfClose: next => {
        next();
    },
    cancel: next => {
        next();
    },
};
class InterceptingCall {
    constructor(nextCall, requester) {
        var _a, _b, _c, _d;
        this.nextCall = nextCall;
        /**
         * Indicates that a message has been passed to the listener's onReceiveMessage
         * method it has not been passed to the corresponding next callback
         */
        this.processingMessage = false;
        /**
         * Indicates that a status was received but could not be propagated because
         * a message was still being processed.
         */
        this.pendingHalfClose = false;
        if (requester) {
            this.requester = {
                start: (_a = requester.start, (_a !== null && _a !== void 0 ? _a : defaultRequester.start)),
                sendMessage: (_b = requester.sendMessage, (_b !== null && _b !== void 0 ? _b : defaultRequester.sendMessage)),
                halfClose: (_c = requester.halfClose, (_c !== null && _c !== void 0 ? _c : defaultRequester.halfClose)),
                cancel: (_d = requester.cancel, (_d !== null && _d !== void 0 ? _d : defaultRequester.cancel)),
            };
        }
        else {
            this.requester = defaultRequester;
        }
    }
    cancelWithStatus(status, details) {
        this.requester.cancel(() => {
            this.nextCall.cancelWithStatus(status, details);
        });
    }
    getPeer() {
        return this.nextCall.getPeer();
    }
    start(metadata, interceptingListener) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const fullInterceptingListener = {
            onReceiveMetadata: (_c = (_b = (_a = interceptingListener) === null || _a === void 0 ? void 0 : _a.onReceiveMetadata) === null || _b === void 0 ? void 0 : _b.bind(interceptingListener), (_c !== null && _c !== void 0 ? _c : (metadata => { }))),
            onReceiveMessage: (_f = (_e = (_d = interceptingListener) === null || _d === void 0 ? void 0 : _d.onReceiveMessage) === null || _e === void 0 ? void 0 : _e.bind(interceptingListener), (_f !== null && _f !== void 0 ? _f : (message => { }))),
            onReceiveStatus: (_j = (_h = (_g = interceptingListener) === null || _g === void 0 ? void 0 : _g.onReceiveStatus) === null || _h === void 0 ? void 0 : _h.bind(interceptingListener), (_j !== null && _j !== void 0 ? _j : (status => { }))),
        };
        this.requester.start(metadata, fullInterceptingListener, (md, listener) => {
            var _a, _b, _c;
            let finalInterceptingListener;
            if (call_stream_1.isInterceptingListener(listener)) {
                finalInterceptingListener = listener;
            }
            else {
                const fullListener = {
                    onReceiveMetadata: (_a = listener.onReceiveMetadata, (_a !== null && _a !== void 0 ? _a : defaultListener.onReceiveMetadata)),
                    onReceiveMessage: (_b = listener.onReceiveMessage, (_b !== null && _b !== void 0 ? _b : defaultListener.onReceiveMessage)),
                    onReceiveStatus: (_c = listener.onReceiveStatus, (_c !== null && _c !== void 0 ? _c : defaultListener.onReceiveStatus)),
                };
                finalInterceptingListener = new call_stream_1.InterceptingListenerImpl(fullListener, fullInterceptingListener);
            }
            this.nextCall.start(md, finalInterceptingListener);
        });
    }
    // tslint:disable-next-line no-any
    sendMessageWithContext(context, message) {
        this.processingMessage = true;
        this.requester.sendMessage(message, finalMessage => {
            this.processingMessage = false;
            this.nextCall.sendMessageWithContext(context, finalMessage);
            if (this.pendingHalfClose) {
                this.nextCall.halfClose();
            }
        });
    }
    // tslint:disable-next-line no-any
    sendMessage(message) {
        this.sendMessageWithContext({}, message);
    }
    startRead() {
        this.nextCall.startRead();
    }
    halfClose() {
        this.requester.halfClose(() => {
            if (this.processingMessage) {
                this.pendingHalfClose = true;
            }
            else {
                this.nextCall.halfClose();
            }
        });
    }
    setCredentials(credentials) {
        this.nextCall.setCredentials(credentials);
    }
}
exports.InterceptingCall = InterceptingCall;
function getCall(channel, path, options) {
    let deadline;
    let host;
    const parent = null;
    let propagateFlags;
    let credentials;
    if (options) {
        deadline = options.deadline;
        host = options.host;
        propagateFlags = options.propagate_flags;
        credentials = options.credentials;
    }
    if (deadline === undefined) {
        deadline = Infinity;
    }
    const call = channel.createCall(path, deadline, host, parent, propagateFlags);
    if (credentials) {
        call.setCredentials(credentials);
    }
    return call;
}
/**
 * InterceptingCall implementation that directly owns the underlying Call
 * object and handles serialization and deseraizliation.
 */
class BaseInterceptingCall {
    // tslint:disable-next-line no-any
    constructor(call, methodDefinition) {
        this.call = call;
        this.methodDefinition = methodDefinition;
    }
    cancelWithStatus(status, details) {
        this.call.cancelWithStatus(status, details);
    }
    getPeer() {
        return this.call.getPeer();
    }
    setCredentials(credentials) {
        this.call.setCredentials(credentials);
    }
    // tslint:disable-next-line no-any
    sendMessageWithContext(context, message) {
        let serialized;
        try {
            serialized = this.methodDefinition.requestSerialize(message);
            this.call.sendMessageWithContext(context, serialized);
        }
        catch (e) {
            this.call.cancelWithStatus(constants_1.Status.INTERNAL, 'Serialization failure');
        }
    }
    // tslint:disable-next-line no-any
    sendMessage(message) {
        this.sendMessageWithContext({}, message);
    }
    start(metadata, interceptingListener) {
        let readError = null;
        this.call.start(metadata, {
            onReceiveMetadata: metadata => {
                var _a, _b, _c;
                (_c = (_a = interceptingListener) === null || _a === void 0 ? void 0 : (_b = _a).onReceiveMetadata) === null || _c === void 0 ? void 0 : _c.call(_b, metadata);
            },
            onReceiveMessage: message => {
                var _a, _b, _c;
                // tslint:disable-next-line no-any
                let deserialized;
                try {
                    deserialized = this.methodDefinition.responseDeserialize(message);
                    (_c = (_a = interceptingListener) === null || _a === void 0 ? void 0 : (_b = _a).onReceiveMessage) === null || _c === void 0 ? void 0 : _c.call(_b, deserialized);
                }
                catch (e) {
                    readError = {
                        code: constants_1.Status.INTERNAL,
                        details: 'Failed to parse server response',
                        metadata: new metadata_1.Metadata(),
                    };
                    this.call.cancelWithStatus(readError.code, readError.details);
                }
            },
            onReceiveStatus: status => {
                var _a, _b, _c, _d, _e, _f;
                if (readError) {
                    (_c = (_a = interceptingListener) === null || _a === void 0 ? void 0 : (_b = _a).onReceiveStatus) === null || _c === void 0 ? void 0 : _c.call(_b, readError);
                }
                else {
                    (_f = (_d = interceptingListener) === null || _d === void 0 ? void 0 : (_e = _d).onReceiveStatus) === null || _f === void 0 ? void 0 : _f.call(_e, status);
                }
            },
        });
    }
    startRead() {
        this.call.startRead();
    }
    halfClose() {
        this.call.halfClose();
    }
}
/**
 * BaseInterceptingCall with special-cased behavior for methods with unary
 * responses.
 */
class BaseUnaryInterceptingCall extends BaseInterceptingCall {
    // tslint:disable-next-line no-any
    constructor(call, methodDefinition) {
        super(call, methodDefinition);
    }
    start(metadata, listener) {
        var _a, _b, _c;
        let receivedMessage = false;
        const wrapperListener = {
            onReceiveMetadata: (_c = (_b = (_a = listener) === null || _a === void 0 ? void 0 : _a.onReceiveMetadata) === null || _b === void 0 ? void 0 : _b.bind(listener), (_c !== null && _c !== void 0 ? _c : (metadata => { }))),
            // tslint:disable-next-line no-any
            onReceiveMessage: (message) => {
                var _a, _b, _c;
                receivedMessage = true;
                (_c = (_a = listener) === null || _a === void 0 ? void 0 : (_b = _a).onReceiveMessage) === null || _c === void 0 ? void 0 : _c.call(_b, message);
            },
            onReceiveStatus: (status) => {
                var _a, _b, _c, _d, _e, _f;
                if (!receivedMessage) {
                    (_c = (_a = listener) === null || _a === void 0 ? void 0 : (_b = _a).onReceiveMessage) === null || _c === void 0 ? void 0 : _c.call(_b, null);
                }
                (_f = (_d = listener) === null || _d === void 0 ? void 0 : (_e = _d).onReceiveStatus) === null || _f === void 0 ? void 0 : _f.call(_e, status);
            },
        };
        super.start(metadata, wrapperListener);
        this.call.startRead();
    }
}
/**
 * BaseInterceptingCall with special-cased behavior for methods with streaming
 * responses.
 */
class BaseStreamingInterceptingCall extends BaseInterceptingCall {
}
// tslint:disable-next-line no-any
function getBottomInterceptingCall(channel, path, options, methodDefinition) {
    const call = getCall(channel, path, options);
    if (methodDefinition.responseStream) {
        return new BaseStreamingInterceptingCall(call, methodDefinition);
    }
    else {
        return new BaseUnaryInterceptingCall(call, methodDefinition);
    }
}
// tslint:disable-next-line no-any
function getInterceptingCall(interceptorArgs, methodDefinition, options, channel) {
    if (interceptorArgs.clientInterceptors.length > 0 &&
        interceptorArgs.clientInterceptorProviders.length > 0) {
        throw new InterceptorConfigurationError('Both interceptors and interceptor_providers were passed as options ' +
            'to the client constructor. Only one of these is allowed.');
    }
    if (interceptorArgs.callInterceptors.length > 0 &&
        interceptorArgs.callInterceptorProviders.length > 0) {
        throw new InterceptorConfigurationError('Both interceptors and interceptor_providers were passed as call ' +
            'options. Only one of these is allowed.');
    }
    let interceptors = [];
    // Interceptors passed to the call override interceptors passed to the client constructor
    if (interceptorArgs.callInterceptors.length > 0 ||
        interceptorArgs.callInterceptorProviders.length > 0) {
        interceptors = []
            .concat(interceptorArgs.callInterceptors, interceptorArgs.callInterceptorProviders.map(provider => provider(methodDefinition)))
            .filter(interceptor => interceptor);
        // Filter out falsy values when providers return nothing
    }
    else {
        interceptors = []
            .concat(interceptorArgs.clientInterceptors, interceptorArgs.clientInterceptorProviders.map(provider => provider(methodDefinition)))
            .filter(interceptor => interceptor);
        // Filter out falsy values when providers return nothing
    }
    const interceptorOptions = Object.assign({}, options, {
        method_definition: methodDefinition,
    });
    /* For each interceptor in the list, the nextCall function passed to it is
     * based on the next interceptor in the list, using a nextCall function
     * constructed with the following interceptor in the list, and so on. The
     * initialValue, which is effectively at the end of the list, is a nextCall
     * function that invokes getBottomInterceptingCall, the result of which
     * handles (de)serialization and also gets the underlying call from the
     * channel. */
    const getCall = interceptors.reduceRight((nextCall, nextInterceptor) => {
        return currentOptions => nextInterceptor(currentOptions, nextCall);
    }, (finalOptions) => getBottomInterceptingCall(channel, methodDefinition.path, finalOptions, methodDefinition));
    return getCall(interceptorOptions);
}
exports.getInterceptingCall = getInterceptingCall;
//# sourceMappingURL=client-interceptors.js.map