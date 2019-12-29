import { APICallback, RequestType, ResultTuple, SimpleCallbackFunction } from './apitypes';
export declare class OngoingCall {
    callback?: APICallback;
    cancelFunc?: () => void;
    completed: boolean;
    /**
     * OngoingCall manages callback, API calls, and cancellation
     * of the API calls.
     * @param {APICallback=} callback
     *   The callback to be called asynchronously when the API call
     *   finishes.
     * @constructor
     * @property {APICallback} callback
     *   The callback function to be called.
     * @private
     */
    constructor(callback?: APICallback);
    /**
     * Cancels the ongoing promise.
     */
    cancel(): void;
    /**
     * Call calls the specified function. Result will be used to fulfill
     * the promise.
     *
     * @param {SimpleCallbackFunction} func
     *   A function for an API call.
     * @param {Object} argument
     *   A request object.
     */
    call(func: SimpleCallbackFunction, argument: RequestType): void;
}
export interface CancellablePromise<T> extends Promise<T> {
    cancel(): void;
}
export declare class OngoingCallPromise extends OngoingCall {
    promise: CancellablePromise<ResultTuple>;
    /**
     * GaxPromise is GRPCCallbackWrapper, but it holds a promise when
     * the API call finishes.
     * @param {Function} PromiseCtor - A constructor for a promise that implements
     * the ES6 specification of promise.
     * @constructor
     * @private
     */
    constructor(PromiseCtor: PromiseConstructor);
}
