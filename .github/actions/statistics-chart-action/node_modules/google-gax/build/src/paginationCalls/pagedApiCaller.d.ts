import { APICaller, ApiCallerSettings } from '../apiCaller';
import { GRPCCall, SimpleCallbackFunction } from '../apitypes';
import { APICallback } from '../apitypes';
import { OngoingCall, OngoingCallPromise } from '../call';
import { CallOptions } from '../gax';
import { GoogleError } from '../googleError';
import { PageDescriptor } from './pageDescriptor';
export declare class PagedApiCaller implements APICaller {
    pageDescriptor: PageDescriptor;
    /**
     * Creates an API caller that returns a stream to performs page-streaming.
     *
     * @private
     * @constructor
     * @param {PageDescriptor} pageDescriptor - indicates the structure
     *   of page streaming to be performed.
     */
    constructor(pageDescriptor: PageDescriptor);
    private createActualCallback;
    wrap(func: GRPCCall): GRPCCall;
    init(settings: ApiCallerSettings, callback?: APICallback): OngoingCall;
    call(apiCall: SimpleCallbackFunction, argument: {
        [index: string]: {};
    }, settings: CallOptions, canceller: OngoingCall): void;
    fail(canceller: OngoingCallPromise, err: GoogleError): void;
    result(canceller: OngoingCallPromise): import("../call").CancellablePromise<[import("../apitypes").ResponseType, {
        [index: string]: string;
    } | null | undefined, {} | import("..").Operation | undefined]>;
}
