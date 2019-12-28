import { RequestType } from '../apitypes';
/**
 * Compute the identifier of the `obj`. The objects of the same ID
 * will be bundled together.
 *
 * @param {RequestType} obj - The request object.
 * @param {String[]} discriminatorFields - The array of field names.
 *   A field name may include '.' as a separator, which is used to
 *   indicate object traversal.
 * @return {String|undefined} - the identifier string, or undefined if any
 *   discriminator fields do not exist.
 */
export declare function computeBundleId(obj: RequestType, discriminatorFields: string[]): string | undefined;
