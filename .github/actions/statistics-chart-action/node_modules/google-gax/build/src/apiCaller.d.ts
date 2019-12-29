import { APICallback, CancellableStream, GRPCCall, ResultTuple, SimpleCallbackFunction } from './apitypes';
import { CancellablePromise, OngoingCall, OngoingCallPromise } from './call';
import { Descriptor } from './descriptor';
import { CallSettings } from './gax';
import { GoogleError } from './googleError';
import { StreamProxy } from './streamingCalls/streaming';
export interface ApiCallerSettings {
    promise: PromiseConstructor;
}
/**
 * An interface for all kinds of API callers (normal, that just calls API, and
 * all special ones: long-running, paginated, bundled, streaming).
 */
export interface APICaller {
    init(settings: ApiCallerSettings, callback?: APICallback): OngoingCallPromise | OngoingCall | StreamProxy;
    wrap(func: GRPCCall): GRPCCall;
    call(apiCall: SimpleCallbackFunction, argument: {}, settings: {}, canceller: OngoingCallPromise | OngoingCall | StreamProxy): void;
    fail(canceller: OngoingCallPromise | OngoingCall | CancellableStream, err: GoogleError): void;
    result(canceller: OngoingCallPromise | OngoingCall | CancellableStream): CancellablePromise<ResultTuple> | CancellableStream;
}
export declare function createAPICaller(settings: CallSettings, descriptor: Descriptor | undefined): APICaller;
