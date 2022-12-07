import { suite } from "uvu";
import * as assert from "uvu/assert";
import fetchMock from "fetch-mock";

import { graphql, GraphqlResponseError } from "../index.js";

const test = suite("errors");

test("Invalid query", () => {
  const query = `{
  viewer {
    bioHtml
  }
}`;
  const mockResponse = {
    data: null,
    errors: [
      {
        locations: [
          {
            column: 5,
            line: 3,
          },
        ],
        message: "Field 'bioHtml' doesn't exist on type 'User'",
      },
    ],
  };

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", mockResponse),
    },
  })
    .then((result) => {
      throw new Error("Should not resolve");
    })

    .catch((error) => {
      assert.equal(
        error.message,
        "Request failed due to following response errors:\n" +
          " - Field 'bioHtml' doesn't exist on type 'User'"
      );
      assert.equal(error.errors, mockResponse.errors);
      assert.equal(error.request.query, query);
    });
});

test("Should be able check if an error is instance of a GraphQL response error", () => {
  const query = `{
      repository {
        name
      }
    }`;

  const mockResponse = {
    data: null,
    errors: [
      {
        locations: [
          {
            column: 5,
            line: 3,
          },
        ],
        message: "Some error message",
      },
    ],
  };

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", mockResponse),
    },
  })
    .then((result) => {
      throw new Error("Should not resolve");
    })

    .catch((error) => {
      assert.instance(error, GraphqlResponseError);
    });
});

test("Should throw an error for a partial response accompanied by errors", () => {
  const query = `{
      repository(name: "probot", owner: "probot") {
        name
        ref(qualifiedName: "master") {
          target {
            ... on Commit {
              history(first: 25, after: "invalid cursor") {
                nodes {
                  message
                }
              }
            }
          }
        }
      }
    }`;

  const mockResponse = {
    data: {
      repository: {
        name: "probot",
        ref: null,
      },
    },
    errors: [
      {
        locations: [
          {
            column: 11,
            line: 7,
          },
        ],
        message: "`invalid cursor` does not appear to be a valid cursor.",
        path: ["repository", "ref", "target", "history"],
        type: "INVALID_CURSOR_ARGUMENTS",
      },
    ],
  };

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post("https://api.github.com/graphql", {
        body: mockResponse,
        headers: {
          "x-github-request-id": "C5E6:259A:1351B40:2E88B87:5F1F9C41",
        },
      }),
    },
  })
    .then((result) => {
      throw new Error("Should not resolve");
    })
    .catch((error) => {
      assert.equal(
        error.message,
        "Request failed due to following response errors:\n" +
          " - `invalid cursor` does not appear to be a valid cursor."
      );
      assert.equal(error.errors, mockResponse.errors);
      assert.equal(error.request.query, query);
      assert.equal(error.data, mockResponse.data);
      assert.ok(
        "x-github-request-id" in error.headers,
        '"x-github-request-id" header is set'
      );
      assert.equal(
        error.headers["x-github-request-id"],
        "C5E6:259A:1351B40:2E88B87:5F1F9C41"
      );
    });
});

test("Should throw for server error", () => {
  const query = `{
      viewer {
        login
      }
    }`;

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post("https://api.github.com/graphql", 500),
    },
  })
    .then((result) => {
      throw new Error("Should not resolve");
    })
    .catch((error) => {
      assert.equal(error.status, 500);
    });
});

test.run();
