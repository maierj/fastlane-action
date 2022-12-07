import { suite } from "uvu";
import * as assert from "uvu/assert";

import fetchMock from "fetch-mock";
import { getUserAgent } from "universal-user-agent";

import { VERSION } from "../version.js";
import { graphql } from "../index.js";

const userAgent = `octokit-graphql.js/${VERSION} ${getUserAgent()}`;

const test = suite("graphql.defaults()");

test("is a function", () => {
  assert.instance(graphql.defaults, Function);
});

test("README example", () => {
  const mockData = {
    repository: {
      issues: {
        edges: [
          {
            node: {
              title: "Foo",
            },
          },
          {
            node: {
              title: "Bar",
            },
          },
          {
            node: {
              title: "Baz",
            },
          },
        ],
      },
    },
  };

  const authenticatedGraphql = graphql.defaults({
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://api.github.com/graphql",
        { data: mockData },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });
  return authenticatedGraphql(`{
      repository(owner:"octokit", name:"graphql.js") {
        issues(last:3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`).then((result) => {
    assert.equal(result, mockData);
  });
});

test("repeated defaults", () => {
  const mockData = {
    repository: {
      issues: {
        edges: [
          {
            node: {
              title: "Foo",
            },
          },
          {
            node: {
              title: "Bar",
            },
          },
          {
            node: {
              title: "Baz",
            },
          },
        ],
      },
    },
  };

  const authenticatedGraphql = graphql.defaults({
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://github.acme-inc.com/api/graphql",
        { data: mockData },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });
  const acmeGraphql = authenticatedGraphql.defaults({
    baseUrl: "https://github.acme-inc.com/api",
  });
  return acmeGraphql(`{
      repository(owner:"octokit", name:"graphql.js") {
        issues(last:3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`).then((result) => {
    assert.equal(result, mockData);
  });
});

test("handle baseUrl set with /api/v3 suffix", () => {
  const ghesGraphQl = graphql.defaults({
    baseUrl: "https://github.acme-inc.com/api/v3",
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://github.acme-inc.com/api/graphql",
        { data: { ok: true } },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });

  return ghesGraphQl(`query {
      viewer {
        login
      }
    }`);
});

test("set defaults on .endpoint", () => {
  const mockData = {
    repository: {
      issues: {
        edges: [
          {
            node: {
              title: "Foo",
            },
          },
          {
            node: {
              title: "Bar",
            },
          },
          {
            node: {
              title: "Baz",
            },
          },
        ],
      },
    },
  };

  const authenticatedGraphql = graphql.defaults({
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://github.acme-inc.com/api/graphql",
        { data: mockData },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });

  const { request: _request, ...requestOptions } =
    // @ts-expect-error - TODO: expects to set { url } but it really shouldn't
    authenticatedGraphql.endpoint();
  assert.equal(requestOptions, {
    method: "POST",
    url: "https://api.github.com/graphql",
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: "token secret123",
      "user-agent": userAgent,
      "content-length": 0,
    },
  });
});

test.run();
