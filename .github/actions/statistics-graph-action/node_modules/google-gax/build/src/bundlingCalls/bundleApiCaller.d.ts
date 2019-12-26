import { APICaller, ApiCallerSettings } from '../apiCaller';
import { APICallback, GRPCCall, SimpleCallbackFunction } from '../apitypes';
import { OngoingCall, OngoingCallPromise } from '../call';
import { CallSettings } from '../gax';
import { GoogleError } from '../googleError';
import { BundleExecutor } from './bundleExecutor';
/**
 * An implementation of APICaller for bundled calls.
 * Uses BundleExecutor to do bundling.
 */
export declare class BundleApiCaller implements APICaller {
    bundler: BundleExecutor;
    constructor(bundler: BundleExecutor);
    init(settings: ApiCallerSettings, callback?: APICallback): OngoingCallPromise | OngoingCall;
    wrap(func: GRPCCall): GRPCCall;
    call(apiCall: SimpleCallbackFunction, argument: {}, settings: CallSettings, status: OngoingCallPromise): void;
    fail(canceller: OngoingCallPromise, err: GoogleError): void;
    result(canceller: OngoingCallPromise): import("../call").CancellablePromise<[import("../apitypes").ResponseType, {
        [index: string]: string;
    } | null | undefined, {} | import("..").Operation | undefined]>;
}
