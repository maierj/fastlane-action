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
const normalApiCaller_1 = require("../normalCalls/normalApiCaller");
const bundleApiCaller_1 = require("./bundleApiCaller");
const bundleExecutor_1 = require("./bundleExecutor");
/**
 * A descriptor for calls that can be bundled into one call.
 */
class BundleDescriptor {
    /**
     * Describes the structure of bundled call.
     *
     * requestDiscriminatorFields may include '.' as a separator, which is used to
     * indicate object traversal. This allows fields in nested objects to be used
     * to determine what request to bundle.
     *
     * @property {String} bundledField
     * @property {String} requestDiscriminatorFields
     * @property {String} subresponseField
     * @property {Function} byteLengthFunction
     *
     * @param {String} bundledField - the repeated field in the request message
     *   that will have its elements aggregated by bundling.
     * @param {String} requestDiscriminatorFields - a list of fields in the
     *   target request message class that are used to detemrine which request
     *   messages should be bundled together.
     * @param {String} subresponseField - an optional field, when present it
     *   indicates the field in the response message that should be used to
     *   demultiplex the response into multiple response messages.
     * @param {Function} byteLengthFunction - a function to obtain the byte
     *   length to be consumed for the bundled field messages. Because Node.JS
     *   protobuf.js/gRPC uses builtin Objects for the user-visible data and
     *   internally they are encoded/decoded in protobuf manner, this function
     *   is actually necessary to calculate the byte length.
     * @constructor
     */
    constructor(bundledField, requestDiscriminatorFields, subresponseField, byteLengthFunction) {
        if (!byteLengthFunction && typeof subresponseField === 'function') {
            byteLengthFunction = subresponseField;
            subresponseField = null;
        }
        this.bundledField = bundledField;
        this.requestDiscriminatorFields = requestDiscriminatorFields;
        this.subresponseField = subresponseField;
        this.byteLengthFunction = byteLengthFunction;
    }
    getApiCaller(settings) {
        if (settings.isBundling === false) {
            return new normalApiCaller_1.NormalApiCaller();
        }
        return new bundleApiCaller_1.BundleApiCaller(new bundleExecutor_1.BundleExecutor(settings.bundleOptions, this));
    }
}
exports.BundleDescriptor = BundleDescriptor;
//# sourceMappingURL=bundleDescriptor.js.map