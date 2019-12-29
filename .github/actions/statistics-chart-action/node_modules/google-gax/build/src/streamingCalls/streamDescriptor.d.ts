import { APICaller } from '../apiCaller';
import { Descriptor } from '../descriptor';
import { CallSettings } from '../gax';
import { StreamType } from './streaming';
/**
 * A descriptor for streaming calls.
 */
export declare class StreamDescriptor implements Descriptor {
    type: StreamType;
    streaming: boolean;
    constructor(streamType: StreamType);
    getApiCaller(settings: CallSettings): APICaller;
}
