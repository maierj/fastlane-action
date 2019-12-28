import { APICaller, ApiCallerSettings } from '../apiCaller';
import { APICallback, GRPCCall, SimpleCallbackFunction } from '../apitypes';
import { OngoingCall, OngoingCallPromise } from '../call';
import { GoogleError } from '../googleError';
/**
 * Creates an API caller for regular unary methods.
 */
export declare class NormalApiCaller implements APICaller {
    init(settings: ApiCallerSettings, callback?: APICallback): OngoingCallPromise | OngoingCall;
    wrap(func: GRPCCall): GRPCCall;
    call(apiCall: SimpleCallbackFunction, argument: {}, settings: {}, canceller: OngoingCallPromise): void;
    fail(canceller: OngoingCallPromise, err: GoogleError): void;
    result(canceller: OngoingCallPromise): import("../call").CancellablePromise<[import("../apitypes").ResponseType, {
        [index: string]: string;
    } | null | undefined, {} | import("..").Operation | undefined]>;
}
