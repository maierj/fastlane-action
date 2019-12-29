/// <reference types="node" />
import { Duplex } from 'stream';
import { CancellablePromise } from './call';
import { CallOptions } from './gax';
import { GoogleError } from './googleError';
import { Operation } from './longRunningCalls/longrunning';
export interface GRPCCallResult {
    cancel(): void;
}
export interface RequestType {
}
export declare type ResponseType = {} | null;
export declare type NextPageRequestType = {
    [index: string]: string;
} | null;
export declare type RawResponseType = Operation | {};
export declare type ResultTuple = [ResponseType, NextPageRequestType | undefined, RawResponseType | undefined];
export interface SimpleCallbackFunction {
    (argument: RequestType, callback: APICallback): GRPCCallResult;
}
export declare type APICallback = (err: GoogleError | null, response?: ResponseType, next?: NextPageRequestType, rawResponse?: RawResponseType) => void;
export declare type UnaryCall = (argument: {}, metadata: {}, options: {}, callback: APICallback) => GRPCCallResult;
export declare type ServerStreamingCall = (argument: {}, metadata: {}, options: {}) => Duplex & GRPCCallResult;
export declare type ClientStreamingCall = (metadata: {}, options: {}, callback?: APICallback) => Duplex & GRPCCallResult;
export declare type BiDiStreamingCall = (metadata: {}, options: {}) => Duplex & GRPCCallResult;
export declare type GRPCCall = UnaryCall | ServerStreamingCall | ClientStreamingCall | BiDiStreamingCall;
export declare type CancellableStream = Duplex & GRPCCallResult;
export declare type GaxCallResult = CancellablePromise<ResultTuple> | CancellableStream;
export interface GaxCallPromise {
    (argument: {}, callOptions?: CallOptions, callback?: APICallback): CancellablePromise<ResultTuple>;
}
export interface GaxCallStream {
    (argument: {}, callOptions?: CallOptions, callback?: APICallback): CancellableStream;
}
export interface GaxCall {
    (argument: {}, callOptions?: CallOptions, callback?: APICallback): GaxCallResult;
}
export interface GRPCCallOtherArgs {
    options?: {
        deadline?: Date;
    };
    headers?: {};
    metadataBuilder: (abTests?: {}, headers?: {}) => {};
}
