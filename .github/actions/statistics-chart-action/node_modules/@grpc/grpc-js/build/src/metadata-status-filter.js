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
const constants_1 = require("./constants");
const filter_1 = require("./filter");
class MetadataStatusFilter extends filter_1.BaseFilter {
    async receiveTrailers(status) {
        // tslint:disable-next-line:prefer-const
        let { code, details, metadata } = await status;
        if (code !== constants_1.Status.UNKNOWN) {
            // we already have a known status, so don't assign a new one.
            return { code, details, metadata };
        }
        const metadataMap = metadata.getMap();
        if (typeof metadataMap['grpc-status'] === 'string') {
            const receivedCode = Number(metadataMap['grpc-status']);
            if (receivedCode in constants_1.Status) {
                code = receivedCode;
            }
            metadata.remove('grpc-status');
        }
        if (typeof metadataMap['grpc-message'] === 'string') {
            details = decodeURI(metadataMap['grpc-message']);
            metadata.remove('grpc-message');
        }
        return { code, details, metadata };
    }
}
exports.MetadataStatusFilter = MetadataStatusFilter;
class MetadataStatusFilterFactory {
    constructor(channel) {
        this.channel = channel;
    }
    createFilter(callStream) {
        return new MetadataStatusFilter();
    }
}
exports.MetadataStatusFilterFactory = MetadataStatusFilterFactory;
//# sourceMappingURL=metadata-status-filter.js.map