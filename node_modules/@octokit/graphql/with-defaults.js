import { graphql } from "./graphql.js";

export function withDefaults(oldRequest, newDefaults) {
  const newRequest = oldRequest.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: newRequest.endpoint,
  });
}
