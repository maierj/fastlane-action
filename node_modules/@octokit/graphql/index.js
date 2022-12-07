import { request } from "@octokit-next/request";
import { getUserAgent } from "universal-user-agent";

import { VERSION } from "./version.js";

import { withDefaults } from "./with-defaults.js";

export const graphql = withDefaults(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${getUserAgent()}`,
  },
  method: "POST",
  url: "/graphql",
});

export { GraphqlResponseError } from "./error.js";

export function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql",
  });
}
