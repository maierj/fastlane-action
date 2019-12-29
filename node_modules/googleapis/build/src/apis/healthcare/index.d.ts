/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { healthcare_v1alpha } from './v1alpha';
import { healthcare_v1alpha2 } from './v1alpha2';
import { healthcare_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    'v1alpha': typeof healthcare_v1alpha.Healthcare;
    'v1alpha2': typeof healthcare_v1alpha2.Healthcare;
    'v1beta1': typeof healthcare_v1beta1.Healthcare;
};
export declare function healthcare(version: 'v1alpha'): healthcare_v1alpha.Healthcare;
export declare function healthcare(options: healthcare_v1alpha.Options): healthcare_v1alpha.Healthcare;
export declare function healthcare(version: 'v1alpha2'): healthcare_v1alpha2.Healthcare;
export declare function healthcare(options: healthcare_v1alpha2.Options): healthcare_v1alpha2.Healthcare;
export declare function healthcare(version: 'v1beta1'): healthcare_v1beta1.Healthcare;
export declare function healthcare(options: healthcare_v1beta1.Options): healthcare_v1beta1.Healthcare;
declare const auth: AuthPlus;
export { auth };
