export { EndpointInterface, KnownEndpointParameters } from "./endpoint";
import { RequestInterface } from "./request";
export { RequestInterface } from "./request";

interface AuthStrategyInterface {
  (options?: any): AuthInterface;
}
interface AuthInterface {
  (options?: any): Promise<unknown>;
}

type AuthStrategyAndOptions<
  AuthStrategy extends AuthStrategyInterface | undefined = undefined
> = AuthStrategy extends undefined
  ? { auth?: string }
  : AuthStrategy extends AuthStrategyInterface
  ? {
      authStrategy: AuthStrategy;
      auth: Parameters<AuthStrategy>[0];
    }
  : never;

/**
 * Global Octokit interfaces that can be extended as needed.
 */
export namespace Octokit {
  interface Options<
    TVersion extends keyof Octokit.ApiVersions = "github.com",
    TAuthStrategy extends AuthStrategyInterface | undefined = undefined
  > {
    /**
     * API version. Defaults to `"github.com"`.
     *
     * In order to set it a GitHub Enterprise Version such as "ghes-3.1",
     * install the according `@octokit-next/types-rest-api-ghes-*` package,
     * such as `@octokit-next/types-rest-api-ghes-3.1`.
     */
    version?: TVersion;

    /**
     * GitHub's REST API base URL. Defaults to https://api.github.com
     *
     * TODO: make it a required option if TVersion != "github.com"
     */
    baseUrl?: string;

    /**
     * Custom User Agent String. Defaults to "octokit-next/[version]"
     *
     * @example "my-app/1.2.3"
     */
    userAgent?: string;

    /**
     * Auth strategy function
     *
     * @see https://github.com/octokit/auth.js
     */
    authStrategy?: TAuthStrategy;

    /**
     * Auth strategy options. Can be set to an access token. If `authStrategy`
     * option is set, the auth option must be set to the authentication strategy options.
     */
    auth?: TAuthStrategy extends undefined
      ? string
      : TAuthStrategy extends AuthStrategyInterface
      ? Parameters<TAuthStrategy>[0]
      : never;

    /**
     * Request options passed as default `{ request }` options to every request.
     */
    request?: RequestOptions;
  }

  type RequestMethod = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";

  /**
   * Generic request options as they are returned by the `endpoint()` method
   */
  interface EndpointOptions {
    method: RequestMethod;
    url: string;
    headers: RequestHeaders;
    baseUrl?: string;
    mediaType?: {
      previews?: string[];
      format?: string;
    };
    data?: unknown;
    request?: RequestOptions;
  }

  interface RequestOptions<
    TVersion extends keyof Octokit.ApiVersions = "github.com"
  > {
    /**
     * Override API version on a per-request basis.
     */
    version?: TVersion;

    /**
     * Custom replacement for built-in fetch method. Useful for testing or request hooks.
     */
    fetch?: (resource: unknown, init?: unknown) => Promise<unknown>;

    /**
     * Node only. Useful for custom proxy, certificate, or dns lookup.
     *
     * @see https://nodejs.org/api/http.html#http_class_http_agent
     */
    agent?: unknown;

    /**
     * Use an `AbortController` instance to cancel a request. In node you can only cancel streamed requests.
     */
    signal?: unknown;

    /**
     * Node only. Request/response timeout in ms, it resets on redirect. 0 to disable (OS limit applies). `options.request.signal` is recommended instead.
     */
    timeout?: number;

    [option: string]: unknown;
  }

  interface RequestHeaders {
    /**
     * Avoid setting `headers.accept`, use `mediaType.{format|previews}` option instead.
     */
    accept?: string;
    /**
     * `user-agent` is set do a default and can be overwritten as needed.
     */
    "user-agent"?: string;
    /**
     * Use `authorization` to send authenticated request, remember `token ` / `bearer ` prefixes. Example: `token 1234567890abcdef1234567890abcdef12345678`
     */
    authorization?: string;

    [header: string]: string | number | undefined;
  }

  interface ResponseHeaders {
    "cache-control": string;
    "content-length": number;
    "content-type": string;
    date: string;
    etag: string;
    "last-modified"?: string;
    link?: string;
    location?: string;
    server: string;
    vary: string;
    "x-github-mediatype": string;
    "x-github-request-id": string;
    "x-oauth-scopes"?: string;
    "x-ratelimit-limit": string;
    "x-ratelimit-remaining": string;
    "x-ratelimit-reset": string;

    [header: string]: string | number | undefined;
  }

  interface Response<
    TData,
    TStatus extends number,
    TResponseHeaders = Octokit.ResponseHeaders
  > {
    headers: TResponseHeaders;
    /**
     * http response code
     */
    status: TStatus;
    /**
     * URL of response after all redirects
     */
    url: string;
    /**
     * Response data as documented in the REST API reference documentation at https://docs.github.com/rest/reference
     */
    data: TData;
  }

  /**
   * Extendable interface for all of GitHub's REST API endpoints.
   *
   * Do not extend this interface in order to use it with GitHub Enterprise Server or AE. Extend ApiVersions[version] instead.
   *
   * @example
   *
   * ```ts
   * "GET /": {
   *   parameters: {};
   *   request: {
   *     method: "GET";
   *     url: "/";
   *     headers: Octokit.RequestHeaders;
   *     request: Octokit.RequestOptions;
   *   };
   *   response: Octokit.Response<
   *     {
   *       current_user_url: string;
   *       current_user_authorizations_html_url: string;
   *       authorizations_url: string;
   *       code_search_url: string;
   *       commit_search_url: string;
   *       emails_url: string;
   *       emojis_url: string;
   *       events_url: string;
   *       feeds_url: string;
   *       followers_url: string;
   *       following_url: string;
   *       gists_url: string;
   *       hub_url: string;
   *       issue_search_url: string;
   *       issues_url: string;
   *       keys_url: string;
   *       label_search_url: string;
   *       notifications_url: string;
   *       organization_url: string;
   *       organization_repositories_url: string;
   *       organization_teams_url: string;
   *       public_gists_url: string;
   *       rate_limit_url: string;
   *       repository_url: string;
   *       repository_search_url: string;
   *       current_user_repositories_url: string;
   *       starred_url: string;
   *       starred_gists_url: string;
   *       topic_search_url?: string;
   *       user_url: string;
   *       user_organizations_url: string;
   *       user_repositories_url: string;
   *       user_search_url: string;
   *     },
   *     200
   *   >;
   * };
   * ```
   */
  interface Endpoints {}

  /**
   * The API Versions interface is meant with types for the target platform.
   * Each key must export an object with `ResponseHeaders` and `Endpoints`.
   * GitHub Enterprise Server (GHES) versions may build upon each other.
   *
   * For example, if the latest GHES version is 3.1, then it should define
   * all resopnse headers and endpoints that are only available to GHES and
   * set all endpoints and response keys that don't exist on GHES to never
   * with an explanatory comment.
   *
   * GHES 3.0 can then inherit the types from GHES 3.1 and implement the changes, etc.
   *
   * The types for the target platform-specific APIs can become quite big and will
   * most likely live in their own packages.
   */
  interface ApiVersions {
    "github.com": {
      ResponseHeaders: Octokit.ResponseHeaders;
      RequestHeaders: Octokit.RequestHeaders;
      Endpoints: Octokit.Endpoints;
    };
  }
}

export declare class Octokit<
  TVersion extends keyof Octokit.ApiVersions = "github.com",
  TAuthStrategy extends AuthStrategyInterface | undefined = undefined,
  TOptions extends Octokit.Options<TVersion, TAuthStrategy> = Octokit.Options<
    TVersion,
    TAuthStrategy
  >
> {
  /**
   * Pass one or multiple plugin functions to extend the `Octokit` class.
   * The instance of the new class will be extended with any keys returned by the passed plugins.
   * Pass one argument per plugin function.
   *
   * ```js
   * export function helloWorld() {
   *   return {
   *     helloWorld () {
   *       console.log('Hello world!');
   *     }
   *   };
   * }
   *
   * const MyOctokit = Octokit.withPlugins([helloWorld]);
   * const base = new MyOctokit();
   * base.helloWorld(); // `base.helloWorld` is typed as function
   * ```
   */
  static withPlugins<
    Class extends ClassWithPlugins,
    Plugins extends [Plugin, ...Plugin[]]
  >(
    this: Class,
    plugins: Plugins
  ): Class & {
    plugins: [...Class["plugins"], ...Plugins];
  } & Constructor<UnionToIntersection<ReturnTypeOf<Plugins>>>;

  /**
   * Set defaults for the constructor
   *
   * ```js
   * const MyOctokit = Octokit.withDefaults({ version: '1.0.0', otherDefault: 'value' });
   * const base = new MyOctokit({ option: 'value' }); // `version` option is not required
   * base.options // typed as `{ version: string, otherDefault: string, option: string }`
   * ```
   * @remarks
   * Ideally, we would want to make this infinitely recursive: allowing any number of
   * .withDefaults({ ... }).withDefaults({ ... }).withDefaults({ ... }).withDefaults({ ... })...
   * However, we don't see a clean way in today's TypeScript syntax to do so.
   * We instead artificially limit accurate type inference to just three levels,
   * since users are unlikely to go past that.
   * @see https://github.com/gr2m/javascript-plugin-architecture-with-typescript-definitions/pull/57
   */
  static withDefaults<
    PredefinedOptionsOne extends Record<string, unknown>,
    ClassOne extends Constructor<
      Octokit<
        TVersion,
        TAuthStrategy,
        Octokit.Options<TVersion, TAuthStrategy> & PredefinedOptionsOne
      >
    > &
      ClassWithPlugins,
    TVersion extends keyof Octokit.ApiVersions = "github.com",
    TAuthStrategy extends AuthStrategyInterface | undefined = undefined
  >(
    this: ClassOne,
    defaults: PredefinedOptionsOne & {
      version?: TVersion;
      authStrategy?: TAuthStrategy;
    }
  ): ConstructorRequiringOptionsIfNeeded<ClassOne, PredefinedOptionsOne> & {
    withDefaults<PredefinedOptionsTwo, ClassTwo>(
      this: ClassTwo,
      defaults: PredefinedOptionsTwo & {
        version?: TVersion;
        authStrategy?: TAuthStrategy;
      }
    ): ConstructorRequiringOptionsIfNeeded<
      ClassOne & ClassTwo,
      PredefinedOptionsOne & PredefinedOptionsTwo
    > & {
      withDefaults<PredefinedOptionsThree, ClassThree>(
        this: ClassThree,
        defaults: PredefinedOptionsThree & {
          version?: TVersion;
          authStrategy?: TAuthStrategy;
        }
      ): ConstructorRequiringOptionsIfNeeded<
        ClassOne & ClassTwo & ClassThree,
        PredefinedOptionsOne & PredefinedOptionsTwo & PredefinedOptionsThree
      > &
        ClassOne &
        ClassTwo &
        ClassThree;
    } & ClassOne &
      ClassTwo;
  } & ClassOne;

  /**
   * List of plugins that will be applied to all instances
   */
  static plugins: Plugin[];

  /**
   * Default options that will be applied to all instances
   */
  static defaults: {
    baseUrl: string;
  };

  /**
   * Constructor with optional `authStrategy`.
   */
  constructor(
    ...options: NonOptionalKeys<TOptions> extends undefined
      ? // If `authStrategy` is not set,
        // `options.auth` can be set to an access token string in order
        // to authenticate requests.
        [
          ({ version?: TVersion } & AuthStrategyAndOptions<TAuthStrategy> &
            TOptions)?
        ]
      : // If `authStrategy` is set, `options.auth` must be
        // set to whatever options the `authStrategy` expects.
        [
          { version?: TVersion } & AuthStrategyAndOptions<TAuthStrategy> &
            TOptions
        ]
  );

  /**
   * Options passed to the constructor combined with the constructor defaults
   */
  options: TOptions;

  /**
   * Send a request, with type support for GitHub's REST API.
   */
  request: RequestInterface<TVersion>;
}

/**
 * Extend `Octokit` or a derived class with custom defaults and plugins
 *
 * @example
 *
 * ```ts
 * export const MyOctokit: ExtendOctokitWith<
 *   Octokit,
 *   {
 *     defaults: {
 *       myPluginOption: string;
 *     };
 *     plugins: [typeof myPlugin];
 *   }
 * >;
 *
 * // support import to be used as a class instance type
 * export type MyOctokit = typeof MyOctokit;
 * ```
 */
export type ExtendOctokitWith<
  OctokitClass extends AbstractOctokit,
  OctokitExtensions extends Extensions
> = OctokitClass &
  ConstructorRequiringOptionsIfNeeded<
    OctokitClass & ApplyPlugins<OctokitExtensions["plugins"]>,
    OrObject<OctokitClass["options"], unknown>,
    OctokitClass["options"]["version"]
  > &
  ApplyPlugins<OctokitExtensions["plugins"]> & {
    defaults: OrObject<OctokitExtensions["defaults"], undefined>;
  };

export declare type Plugin = (
  instance: Octokit,
  options: Octokit.Options
) => ApiExtension | void;

declare type ApiExtension = {
  [key: string]: unknown;
};

// helpers

declare type Constructor<T> = new (...args: any[]) => T;

/**
 * @author https://stackoverflow.com/users/2887218/jcalz
 * @see https://stackoverflow.com/a/50375286/10325032
 */
declare type UnionToIntersection<Union> = (
  Union extends any ? (argument: Union) => void : never
) extends (argument: infer Intersection) => void
  ? Intersection
  : never;
declare type AnyFunction = (...args: any) => any;
declare type ReturnTypeOf<T extends AnyFunction | AnyFunction[]> =
  T extends AnyFunction
    ? ReturnType<T>
    : T extends AnyFunction[]
    ? UnionToIntersection<Exclude<ReturnType<T[number]>, void>>
    : never;

type ClassWithPlugins = Constructor<any> & {
  plugins: Plugin[];
};

type RemainingRequirements<
  PredefinedOptions extends { version?: keyof Octokit.ApiVersions }
> = "authStrategy" extends keyof PredefinedOptions
  ? // if authStrategy is set and it's a valid auth strategy
    PredefinedOptions["authStrategy"] extends AuthStrategyInterface
    ? // then `options.auth` is required to be set to the strategy options
      {
        auth: Parameters<PredefinedOptions["authStrategy"]>[0];
      } & Omit<Octokit.Options, keyof PredefinedOptions | "auth">
    : // otherwise return all keys from `Octokit.Options` that are not set in `defaults.*`
      Omit<Octokit.Options, keyof PredefinedOptions>
  : Omit<Octokit.Options, keyof PredefinedOptions>;

type NonOptionalKeys<Obj> = {
  [K in keyof Obj]: {} extends Pick<Obj, K> ? undefined : K;
}[keyof Obj];

type RequiredIfRemaining<
  PredefinedOptions extends { version?: keyof Octokit.ApiVersions },
  NowProvided,
  TRemainingRequirements = RemainingRequirements<PredefinedOptions>
> = NonOptionalKeys<TRemainingRequirements> extends undefined
  ? [(Partial<Octokit.Options> & NowProvided)?]
  : [
      Omit<
        Partial<Octokit.Options>,
        keyof RemainingRequirements<PredefinedOptions>
        // | keyof NonOptionalKeys<NowProvided>
      > &
        RemainingRequirements<PredefinedOptions> &
        NowProvided
    ];

type ConstructorRequiringOptionsIfNeeded<
  Class,
  PredefinedOptions extends { version?: keyof Octokit.ApiVersions },
  TVersion extends keyof Octokit.ApiVersions = PredefinedOptions["version"] extends keyof Octokit.ApiVersions
    ? PredefinedOptions["version"]
    : "github.com"
> = {
  defaults: PredefinedOptions;
} & {
  new <NowProvided>(
    ...options: RequiredIfRemaining<PredefinedOptions, NowProvided>
  ): Class & {
    options: NowProvided & Omit<PredefinedOptions, keyof NowProvided>;
    request: RequestInterface<TVersion>;
  };
};

type Extensions = {
  defaults?: {};
  plugins?: Plugin[];
};

type OrObject<T, Extender> = T extends Extender ? {} : T;

type ApplyPlugins<Plugins extends Plugin[] | undefined> =
  Plugins extends Plugin[]
    ? UnionToIntersection<ReturnType<Plugins[number]>>
    : {};

declare class AbstractOctokit {
  constructor(options: any);
  options: any;
}
