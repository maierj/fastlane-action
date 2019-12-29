import { SimpleCallbackFunction } from '../apitypes';
import { BundleDescriptor } from './bundleDescriptor';
import { Task, TaskCallback } from './task';
export interface BundleOptions {
    elementCountLimit: number;
    requestByteLimit: number;
    elementCountThreshold: number;
    requestByteThreshold: number;
    delayThreshold: number;
}
/**
 * BundleExecutor stores several timers for each bundle (calls are bundled based
 * on the options passed, each bundle has unique ID that is calculated based on
 * field values). Each timer fires and sends a call after certain amount of
 * time, and if a new request comes to the same bundle, the timer can be
 * restarted.
 */
export declare class BundleExecutor {
    _options: BundleOptions;
    _descriptor: BundleDescriptor;
    _tasks: {
        [index: string]: Task;
    };
    _timers: {
        [index: string]: ReturnType<typeof setTimeout>;
    };
    _invocations: {
        [index: string]: string;
    };
    _invocationId: number;
    /**
     * Organizes requests for an api service that requires to bundle them.
     *
     * @param {BundleOptions} bundleOptions - configures strategy this instance
     *   uses when executing bundled functions.
     * @param {BundleDescriptor} bundleDescriptor - the description of the bundling.
     * @constructor
     */
    constructor(bundleOptions: BundleOptions, bundleDescriptor: BundleDescriptor);
    /**
     * Schedule a method call.
     *
     * @param {function} apiCall - the function for an API call.
     * @param {Object} request - the request object to be bundled with others.
     * @param {APICallback} callback - the callback to be called when the method finished.
     * @return {function()} - the function to cancel the scheduled invocation.
     */
    schedule(apiCall: SimpleCallbackFunction, request: {
        [index: string]: Array<{}> | string;
    }, callback?: TaskCallback): import("../apitypes").GRPCCallResult;
    /**
     * Clears scheduled timeout if it exists.
     *
     * @param {String} bundleId - the id for the task whose timeout needs to be
     *   cleared.
     * @private
     */
    private _maybeClearTimeout;
    /**
     * Cancels an event.
     *
     * @param {String} id - The id for the event in the task.
     * @private
     */
    private _cancel;
    /**
     * Invokes a task.
     *
     * @param {String} bundleId - The id for the task.
     * @private
     */
    _runNow(bundleId: string): void;
}
