import { GRPCCall, GRPCCallOtherArgs, SimpleCallbackFunction } from '../apitypes';
/**
 * Updates func so that it gets called with the timeout as its final arg.
 *
 * This converts a function, func, into another function with updated deadline.
 *
 * @private
 *
 * @param {GRPCCall} func - a function to be updated.
 * @param {number} timeout - to be added to the original function as it final
 *   positional arg.
 * @param {Object} otherArgs - the additional arguments to be passed to func.
 * @param {Object=} abTests - the A/B testing key/value pairs.
 * @return {function(Object, APICallback)}
 *  the function with other arguments and the timeout.
 */
export declare function addTimeoutArg(func: GRPCCall, timeout: number, otherArgs: GRPCCallOtherArgs, abTests?: {}): SimpleCallbackFunction;
