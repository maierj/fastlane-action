"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf = require("protobufjs");
class FallbackErrorDecoder {
    constructor() {
        const errorProtoJson = require('../../protos/status.json');
        this.root = protobuf.Root.fromJSON(errorProtoJson);
        this.anyType = this.root.lookupType('google.protobuf.Any');
        this.statusType = this.root.lookupType('google.rpc.Status');
    }
    decodeProtobufAny(anyValue) {
        const match = anyValue.type_url.match(/^type.googleapis.com\/(.*)/);
        if (!match) {
            throw new Error(`Unknown type encoded in google.protobuf.any: ${anyValue.type_url}`);
        }
        const typeName = match[1];
        const type = this.root.lookupType(typeName);
        if (!type) {
            throw new Error(`Cannot lookup type ${typeName}`);
        }
        return type.decode(anyValue.value);
    }
    // Decodes gRPC-fallback error which is an instance of google.rpc.Status.
    decodeRpcStatus(buffer) {
        const uint8array = new Uint8Array(buffer);
        const status = this.statusType.decode(uint8array);
        // google.rpc.Status contains an array of google.protobuf.Any
        // which need a special treatment
        const result = {
            code: status.code,
            message: status.message,
            details: status.details.map(detail => this.decodeProtobufAny(detail)),
        };
        return result;
    }
}
exports.FallbackErrorDecoder = FallbackErrorDecoder;
//# sourceMappingURL=fallbackError.js.map