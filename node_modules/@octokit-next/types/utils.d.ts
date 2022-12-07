import { SetRequired } from "type-fest";

import { Octokit } from "./index.js";

/**
 * optimized type to lookup all known routes and the versions they are supported in.
 *
 * @example
 *
 * ```ts
 * // import REST API types for github.com, GHES 3.2 and GHES 3.1
 * import "@octokit-next/types-rest-api-ghes-3.1";
 * ```
 *
 * The `Octokit.ApiVersions` interface is now looking like this (simplified)
 *
 * ```ts
 * {
 *   "github.com": { "GET /": { … } },
 *   "ghes-3.1": { "GET /": { … }, "GET /admin/tokens": { … } },
 *   "ghes-3.2": { "GET /": { … }, "GET /admin/tokens": { … } }
 * }
 * ```
 *
 * The `VersionsByRoute` as a result looks like this
 *
 * ```ts
 * {
 *   "GET /": "github.com" | "ghes-3.1" | "ghes-3.2",
 *   "GET /admin/tokens": "ghes-3.1" | "ghes-3.2"
 * }
 * ```
 */
export type VersionsByRoute = Remap<EndpointsByVersion>;

// types to improve performance of type lookups

/**
 * All known routes across all defined API versions for fast lookup
 */
export type AllKnownRoutes = keyof VersionsByRoute;

/**
 * turn
 *
 * ```ts
 * { [version]: { Endpoints: { [route]: Endpoint } } }
 * ```
 *
 * into
 *
 * ```ts
 * { [version]: { [route]: Endpoint } }
 * ```
 */
export type EndpointsByVersion = {
  [Version in keyof Octokit.ApiVersions]: "Endpoints" extends keyof Octokit.ApiVersions[Version]
    ? Octokit.ApiVersions[Version]["Endpoints"]
    : never;
};

/**
 * turn
 *
 * ```ts
 * { [version]: { [route]: { parameters: Parameters } } }
 * ```
 *
 * into
 *
 * ```ts
 * { [version]: { [route]: Parameters } }
 * ```
 */
export type ParametersByVersionAndRoute = {
  [Version in keyof EndpointsByVersion]: {
    [Route in keyof EndpointsByVersion[Version]]: "parameters" extends keyof EndpointsByVersion[Version][Route]
      ? EndpointsByVersion[Version][Route]["parameters"] & {
          headers?: Octokit.RequestHeaders;
        }
      : never;
  };
};

/**
 * turn
 *
 * ```ts
 * { [version]: { [route]: { request: Request } } }
 * ```
 *
 * into
 *
 * ```ts
 * { [version]: { [route]: Request } }
 * ```
 */
export type RequestByVersionAndRoute = {
  [Version in keyof EndpointsByVersion]: {
    [Route in keyof EndpointsByVersion[Version]]: "request" extends keyof EndpointsByVersion[Version][Route]
      ? EndpointsByVersion[Version][Route]["request"] & {
          headers: SetRequired<Octokit.RequestHeaders, "accept" | "user-agent">;
        }
      : never;
  };
};

/**
 * turn
 *
 * ```ts
 * { [version]: { [route]: { response: Response } } }
 * ```
 *
 * into
 *
 * ```ts
 * { [version]: { [route]: Response } }
 * ```
 */
export type ResponseByVersionAndRoute = {
  [Version in keyof EndpointsByVersion]: {
    [Route in keyof EndpointsByVersion[Version]]: "response" extends keyof EndpointsByVersion[Version][Route]
      ? EndpointsByVersion[Version][Route]["response"]
      : never;
  };
};

export type ArgumentsTypesForRoute<
  Route extends string,
  Parameters extends Record<string, unknown>
> = NonOptionalKeys<Parameters> extends undefined
  ? [Route, Parameters?]
  : [Route, Parameters];

// helpers

/**
 * Generic type to remap
 *
 * ```ts
 * { k1: { k2: v }}
 * ```
 *
 * ```ts
 * { k2: k1[]}
 * ```
 */
type Remap<T extends EndpointsByVersion> = {
  [P in keyof T as keyof T[P]]: P;
};

/**
 * Generic to find out if an object type has any required keys
 */
type NonOptionalKeys<Obj> = {
  [K in keyof Obj]: {} extends Pick<Obj, K> ? undefined : K;
}[keyof Obj];
