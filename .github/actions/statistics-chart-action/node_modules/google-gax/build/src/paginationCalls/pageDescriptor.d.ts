/// <reference types="node" />
import { Transform } from 'stream';
import { APICaller } from '../apiCaller';
import { GaxCall } from '../apitypes';
import { Descriptor } from '../descriptor';
import { CallSettings } from '../gax';
/**
 * A descriptor for methods that support pagination.
 */
export declare class PageDescriptor implements Descriptor {
    requestPageTokenField: string;
    responsePageTokenField: string;
    requestPageSizeField?: string;
    resourceField: string;
    constructor(requestPageTokenField: string, responsePageTokenField: string, resourceField: string);
    /**
     * Creates a new object Stream which emits the resource on 'data' event.
     */
    createStream(apiCall: GaxCall, request: {}, options: CallSettings): Transform;
    getApiCaller(settings: CallSettings): APICaller;
}
