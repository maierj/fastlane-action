import { APICaller, ApiCallerSettings } from '../apiCaller';
import { APICallback, GRPCCall, SimpleCallbackFunction } from '../apitypes';
import { OngoingCall, OngoingCallPromise } from '../call';
import { CallOptions } from '../gax';
import { GoogleError } from '../googleError';
import { Operation } from './longrunning';
import { LongRunningDescriptor } from './longRunningDescriptor';
export declare class LongrunningApiCaller implements APICaller {
    longrunningDescriptor: LongRunningDescriptor;
    /**
     * Creates an API caller that performs polling on a long running operation.
     *
     * @private
     * @constructor
     * @param {LongRunningDescriptor} longrunningDescriptor - Holds the
     * decoders used for unpacking responses and the operationsClient
     * used for polling the operation.
     */
    constructor(longrunningDescriptor: LongRunningDescriptor);
    init(settings: ApiCallerSettings, callback?: APICallback): OngoingCallPromise | OngoingCall;
    wrap(func: GRPCCall): GRPCCall;
    call(apiCall: SimpleCallbackFunction, argument: {}, settings: CallOptions, canceller: OngoingCallPromise): void;
    private _wrapOperation;
    fail(canceller: OngoingCallPromise, err: GoogleError): void;
    result(canceller: OngoingCallPromise): import("../call").CancellablePromise<[import("../apitypes").ResponseType, {
        [index: string]: string;
    } | null | undefined, {} | Operation | undefined]>;
}
