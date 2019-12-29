import { APICaller, ApiCallerSettings } from '../apiCaller';
import { APICallback, CancellableStream, GRPCCall, SimpleCallbackFunction } from '../apitypes';
import { StreamDescriptor } from './streamDescriptor';
import { StreamProxy } from './streaming';
export declare class StreamingApiCaller implements APICaller {
    descriptor: StreamDescriptor;
    /**
     * An API caller for methods of gRPC streaming.
     * @private
     * @constructor
     * @param {StreamDescriptor} descriptor - the descriptor of the method structure.
     */
    constructor(descriptor: StreamDescriptor);
    init(settings: ApiCallerSettings, callback: APICallback): StreamProxy;
    wrap(func: GRPCCall): GRPCCall;
    call(apiCall: SimpleCallbackFunction, argument: {}, settings: {}, stream: StreamProxy): void;
    fail(stream: CancellableStream, err: Error): void;
    result(stream: CancellableStream): CancellableStream;
}
