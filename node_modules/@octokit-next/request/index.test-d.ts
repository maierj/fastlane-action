import { Octokit } from "@octokit-next/types";
import { expectType } from "tsd";

import { request } from "./index.js";

declare module "@octokit-next/types" {
  namespace Octokit {
    interface Endpoints {
      /**
       * Dummy endpoint for testing purposes
       */
      "GET /endpoint-test/{id}": {
        parameters: {
          id: string;
        };
        request: {
          method: "GET";
          // the resulting `.url` property will replace the `{}` placeholders, so the type must be a generic string
          url: string;
        };
        response: Octokit.Response<
          {
            test: 1;
          },
          200
        >;
      };
    }

    interface ApiVersions {
      "endpoint-test": {
        Endpoints: Octokit.Endpoints & {
          "POST /endpoint-test/{id}/version-test": {
            parameters: {
              id: string;
              test: string;
            };
            request: {
              method: "POST";
              url: string;
              data: {
                test: string;
              };
            };
            response: Octokit.Response<
              {
                test: 2;
              },
              201
            >;
          };
        };
      };
    }
  }
}

export async function readmeExample() {
  const response = await request("GET /endpoint-test/{id}", {
    id: "id",
  });
  expectType<200>(response.status);
  expectType<1>(response.data.test);
  expectType<string>(response.url);
  expectType<Octokit.ResponseHeaders>(response.headers);
}

export async function ghesExample() {
  const response = await request("POST /endpoint-test/{id}/version-test", {
    request: {
      version: "endpoint-test",
    },
    id: "id",
    test: "test",
  });

  expectType<201>(response.status);
  expectType<2>(response.data.test);
}

export async function objectExample() {
  // @ts-expect-error - TODO: endpoint(options) is an alternative API to endpoint(route, parameters)
  const response = await endpoint({
    method: "GET",
    url: "/endpoint-test/{id}",
    id: "id",
  });

  // expectType<200>(response.status);
  // expectType<1>(response.data.test);
  // expectType<string>(response.url);
  // expectType<Octokit.ResponseHeaders>(response.headers);
}

export async function apiWithDefaults() {
  const myRequest = request.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    headers: {
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
  });

  const response = await myRequest(`GET /endpoint-test/{id}`, {
    id: "id",
  });

  expectType<200>(response.status);
  expectType<1>(response.data.test);
}

export function apiDEFAULTS() {
  expectType<"https://api.github.com">(request.endpoint.DEFAULTS.baseUrl);
  const myRequest = request.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
  });

  myRequest.endpoint.DEFAULTS;

  expectType<"https://github-enterprise.acme-inc.com/api/v3">(
    // @ts-expect-error - TODO: fix this
    myRequest.endpoint.DEFAULTS.baseUrl
  );
}
