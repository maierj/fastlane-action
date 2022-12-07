import { Octokit } from "@octokit-next/types";
import { endpoint } from "@octokit-next/endpoint";
import {
  EndpointInterface,
  RequestInterface,
  KnownEndpointParameters,
} from "@octokit-next/types";

type GLOBAL_ENDPOINT_DEFAULTS = typeof endpoint.DEFAULTS;
type GRAPHQL_DEFAULTS = Omit<GLOBAL_ENDPOINT_DEFAULTS, "method"> & {
  method: "POST";
  url: "/graphql";
};

export declare const graphql: GraphqlInterface;
interface GraphqlInterface<
  TVersion extends keyof Octokit.ApiVersions = "github.com",
  TDefaults extends KnownEndpointParameters<TVersion> = GRAPHQL_DEFAULTS
> {
  /**
   * Sends a GraphQL query request based on endpoint options
   * The GraphQL query must be specified in `options`.
   *
   * @param {object} endpoint must set `query` and can optionally set additional variables. It can also set default request options, such as `method`, `url`, `baseUrl`, `headers`, and `request`
   */
  <TResponseData extends GraphQlQueryResponseData = GraphQlQueryResponseData>(
    options: GraphQlEndpointOptions
  ): GraphQlResponse<TResponseData>;

  /**
   * Sends a GraphQL query request based on endpoint options
   *
   * @param {string} query GraphQL query. Example: `'query { viewer { login } }'`.
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <TResponseData extends GraphQlQueryResponseData = GraphQlQueryResponseData>(
    query: Query,
    parameters?: Partial<Octokit.EndpointOptions> & Record<string, unknown>
  ): GraphQlResponse<TResponseData>;

  /**
   /**
   * Override or set default options
   *
   * @todo implement inheriting the request version and .DEFAULTS from the options passed
   */
  defaults<TOptions extends KnownEndpointParameters<TVersion>>(
    options: TOptions
  ): GraphqlInterface<TVersion, TDefaults & TOptions>;

  /**
   * Octokit endpoint API, see {@link https://github.com/octokit/endpoint.js|@octokit/endpoint}
   */
  endpoint: EndpointInterface<TVersion, TDefaults>;
}

export declare type GraphQlQueryResponseData = Record<string, unknown>;

export declare function withCustomRequest(
  customRequest: RequestInterface
): GraphqlInterface;

export declare class GraphqlResponseError<
  TResponseData extends GraphQlQueryResponseData = GraphQlQueryResponseData
> extends Error {
  readonly request: Octokit.EndpointOptions;
  readonly headers: Octokit.ResponseHeaders;
  readonly response: ServerResponseData<TResponseData>;
  name: string;
  readonly errors: GraphQlQueryResponse<never>["errors"];
  readonly data: TResponseData;

  constructor(
    request: Octokit.EndpointOptions,
    headers: Octokit.ResponseHeaders,
    response: ServerResponseData<TResponseData>
  );
}

declare type Variables = Record<string, unknown>;
declare type GraphQlEndpointOptions = Partial<Octokit.EndpointOptions> & {
  query: string;
  variables?: Variables;
  [key: string]: unknown;
};

declare type Query = string;

declare type GraphQlResponse<ResponseData> = Promise<ResponseData>;

declare type GraphQlQueryResponse<ResponseData> = {
  data: ResponseData;
  errors?: [
    {
      type: string;
      message: string;
      path: [string];
      extensions: {
        [key: string]: unknown;
      };
      locations: [
        {
          line: number;
          column: number;
        }
      ];
    }
  ];
};

declare type ServerResponseData<T> = Required<GraphQlQueryResponse<T>>;
