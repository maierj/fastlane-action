import { LoadBalancer, ChannelControlHelper } from './load-balancer';
import { LoadBalancingConfig } from './load-balancing-config';
export declare class RoundRobinLoadBalancer implements LoadBalancer {
    private channelControlHelper;
    private subchannels;
    private currentState;
    private subchannelStateListener;
    private subchannelStateCounts;
    private currentReadyPicker;
    constructor(channelControlHelper: ChannelControlHelper);
    private calculateAndUpdateState;
    private updateState;
    private resetSubchannelList;
    updateAddressList(addressList: string[], lbConfig: LoadBalancingConfig | null): void;
    exitIdle(): void;
    resetBackoff(): void;
    destroy(): void;
    getTypeName(): string;
    replaceChannelControlHelper(channelControlHelper: ChannelControlHelper): void;
}
export declare function setup(): void;
