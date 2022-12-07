import { suite } from "uvu";
import * as assert from "uvu/assert";
import fetchMock from "fetch-mock";
import { getUserAgent } from "universal-user-agent";

import { graphql } from "../index.js";
import { VERSION } from "../version.js";

const userAgent = `octokit-graphql.js/${VERSION} ${getUserAgent()}`;

const test = suite("graphql()");

test("is a function", () => {
  assert.instance(graphql, Function);
});

test("README simple query example", () => {
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

  return graphql(
    `
      {
        repository(owner: "octokit", name: "graphql.js") {
          issues(last: 3) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token secret123`,
      },
      request: {
        fetch: fetchMock.sandbox().post(
          "https://api.github.com/graphql",
          { data: mockData },
          {
            headers: {
              accept: "application/vnd.github.v3+json",
              authorization: "token secret123",
              "user-agent": userAgent,
            },
          }
        ),
      },
    }
  ).then((result) => {
    assert.equal(result, mockData);
  });
});

test("Variables", () => {
  const query = `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner:$owner, name:$repo) {
        issues(last:$num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`;

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    owner: "octokit",
    repo: "graphql.js",
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          assert.equal(body.query, query);
          assert.equal(body.variables, {
            owner: "octokit",
            repo: "graphql.js",
          });

          return { data: {} };
        }),
    },
  });
});

test("Pass headers together with variables as 2nd argument", () => {
  const query = `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner:$owner, name:$repo) {
        issues(last:$num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`;

  const options = {
    headers: {
      authorization: `token secret123`,
      "x-custom": "value",
    },
    owner: "octokit",
    repo: "graphql.js",
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          assert.equal(body.query, query);
          assert.equal(body.variables, {
            owner: "octokit",
            repo: "graphql.js",
          });
          assert.equal(options.headers["authorization"], "token secret123");
          assert.equal(options.headers["x-custom"], "value");

          return { data: {} };
        }),
    },
  };

  return graphql(query, options);
});

test("Pass query together with headers and variables", () => {
  const query = `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner:$owner, name:$repo) {
        issues(last:$num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`;

  const options = {
    headers: {
      authorization: `token secret123`,
    },
    owner: "octokit",
    query,
    repo: "graphql.js",
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          assert.equal(body.query, query);
          assert.equal(body.variables, {
            owner: "octokit",
            repo: "graphql.js",
          });

          return { data: {} };
        }),
    },
  };

  return graphql(options);
});

test("Don’t send empty variables object", () => {
  const query = "{ viewer { login } }";

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          assert.equal(body.query, query);
          assert.equal(body.variables, undefined);

          return { data: {} };
        }),
    },
  });
});

test("MediaType previews are added to header", () => {
  const query = `{ viewer { login } }`;

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    owner: "octokit",
    repo: "graphql.js",
    mediaType: { previews: ["antiope", "testpkg"] },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          assert.match(options.headers.accept, /antiope-preview/);
          assert.match(options.headers.accept, /testpkg-preview/);
          return { data: {} };
        }),
    },
  });
});

test("query variable (#166)", () => {
  const query = `query search($query: String!) {
      search(query: $query, first: 10, type: ISSUE) {
        edges {
          node {
            ... on PullRequest {
              title
            }
          }
        }
      }
    }`;

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    query: "test",
  })
    .then(() => {
      assert.unreachable("should not resolve");
    })
    .catch((error) => {
      assert.equal(
        error.message,
        `[@octokit/graphql] "query" cannot be used as variable name`
      );
    });
});

test("url variable (#264)", () => {
  const query = `query GetCommitStatus($url: URI!) {
      resource(url: $url) {
        ... on Commit {
          status {
            state
          }
        }
      }
    }`;

  return graphql(query, {
    url: "https://example.com",
  })
    .then(() => {
      assert.unreachable("should not resolve");
    })
    .catch((error) => {
      assert.equal(
        error.message,
        `[@octokit/graphql] "url" cannot be used as variable name`
      );
    });
});

test("method variable", () => {
  const query = `query($method:String!){
      search(query:$method,type:ISSUE) {
        codeCount
      }
    }`;

  return graphql(query, {
    method: "test",
  })
    .then(() => {
      assert.unreachable("should not resolve");
    })
    .catch((error) => {
      assert.equal(
        error.message,
        `[@octokit/graphql] "method" cannot be used as variable name`
      );
    });
});

test.run();
