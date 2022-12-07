import { expectType } from "tsd";

import { graphql } from "./index.js";

export async function readmeExampleSimple() {
  const result = await graphql<{
    repository: { issues: { nodes: { title: string }[] } };
  }>(
    `
      {
        repository(owner: "octokit", name: "graphql.js") {
          issues(last: 3) {
            nodes {
              title
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token secret123`,
      },
    }
  );
  expectType<string>(result.repository.issues.nodes[0].title);
}

export async function readmeExampleAuthentication() {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token secret123`,
    },
  });

  const result = await graphqlWithAuth(`
    {
      repository(owner: "octokit", name: "graphql.js") {
        issues(last: 3) {
          nodes {
            title
          }
        }
      }
    }
  `);

  expectType<Record<string, unknown>>(result);
  expectType<string>(graphqlWithAuth.endpoint.DEFAULTS.headers.authorization);
}

export async function readmeExampleVariables() {
  const result = await graphql(
    `
      query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
        repository(owner: $owner, name: $repo) {
          issues(last: $num) {
            nodes {
              title
            }
          }
        }
      }
    `,
    {
      owner: "octokit",
      repo: "graphql.js",
      headers: {
        authorization: `token secret123`,
      },
    }
  );

  expectType<Record<string, unknown>>(result);
}

export async function readmeExampleQueryWithHeadersAndVariables() {
  const result = await graphql({
    query: `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner:$owner, name:$repo) {
        issues(last:$num) {
          nodes {
            title
          }
        }
      }
    }`,
    owner: "octokit",
    repo: "graphql.js",
    headers: {
      authorization: `token secret123`,
    },
  });

  expectType<Record<string, unknown>>(result);
}

// TOOD: add tests for "Use with GitHub Enterprise" and "Use custom `@octokit-next/request` instance"
