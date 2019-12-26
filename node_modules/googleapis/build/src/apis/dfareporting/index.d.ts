/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { dfareporting_v3_1 } from './v3.1';
import { dfareporting_v3_2 } from './v3.2';
import { dfareporting_v3_3 } from './v3.3';
export declare const VERSIONS: {
    'v3.1': typeof dfareporting_v3_1.Dfareporting;
    'v3.2': typeof dfareporting_v3_2.Dfareporting;
    'v3.3': typeof dfareporting_v3_3.Dfareporting;
};
export declare function dfareporting(version: 'v3.1'): dfareporting_v3_1.Dfareporting;
export declare function dfareporting(options: dfareporting_v3_1.Options): dfareporting_v3_1.Dfareporting;
export declare function dfareporting(version: 'v3.2'): dfareporting_v3_2.Dfareporting;
export declare function dfareporting(options: dfareporting_v3_2.Options): dfareporting_v3_2.Dfareporting;
export declare function dfareporting(version: 'v3.3'): dfareporting_v3_3.Dfareporting;
export declare function dfareporting(options: dfareporting_v3_3.Options): dfareporting_v3_3.Dfareporting;
declare const auth: AuthPlus;
export { auth };
