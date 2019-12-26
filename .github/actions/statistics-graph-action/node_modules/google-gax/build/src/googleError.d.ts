import { Status } from './status';
export declare class GoogleError extends Error {
    code?: Status;
    note?: string;
}
