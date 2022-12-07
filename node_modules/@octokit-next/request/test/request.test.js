import fs from "node:fs";
import stream from "node:stream";
import * as url from "node:url";

import { suite } from "uvu";
import * as assert from "uvu/assert";
import { getUserAgent } from "universal-user-agent";
import fetchMock from "fetch-mock";
import sinon from "sinon";

import { request } from "../index.js";

const userAgent = `octokit-request.js/0.0.0-development ${getUserAgent()}`;
import stringToArrayBuffer from "string-to-arraybuffer";

const test = suite("request.request()");

test("is a function", () => {
  assert.instance(request, Function);
});

test("README example", () => {
  const mock = fetchMock
    .sandbox()
    .mock("https://api.github.com/orgs/octokit/repos?type=private", [], {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token 0000000000000000000000000000000000000001",
        "user-agent": userAgent,
      },
    });

  return request("GET /orgs/{org}/repos", {
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    org: "octokit",
    type: "private",
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.data, []);
  });
});

test("README example alternative", () => {
  const mock = fetchMock
    .sandbox()
    .mock("https://api.github.com/orgs/octokit/repos?type=private", []);

  return request({
    method: "GET",
    url: "/orgs/{org}/repos",
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    org: "octokit",
    type: "private",
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.data, []);
  });
});

// TODO: until we migrate @octokit/auth-app to ESM, I'll just use a dummy auth strategy instead
test("README authentication example", async () => {
  const mock = fetchMock.sandbox().mock(
    "https://api.github.com/test",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token 0000000000000000000000000000000000000001",
        "user-agent": userAgent,
      },
    }
  );

  const myAuthHookDummy = (request, endpointOptions) => {
    const options = {
      ...endpointOptions,
      headers: {
        ...endpointOptions.headers,
        authorization: "token 0000000000000000000000000000000000000001",
      },
    };
    return request(options);
  };

  const requestWithAuth = request.defaults({
    request: {
      fetch: mock,
      hook: myAuthHookDummy,
    },
  });
  await requestWithAuth("GET /test");
  assert.ok(mock.done());
});

// test("README authentication example", async () => {
//   const clock = lolex.install({
//     now: 0,
//     toFake: ["Date"],
//   });
//   const APP_ID = 1;
//   const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
// MIIEpAIBAAKCAQEA1c7+9z5Pad7OejecsQ0bu3aozN3tihPmljnnudb9G3HECdnH
// lWu2/a1gB9JW5TBQ+AVpum9Okx7KfqkfBKL9mcHgSL0yWMdjMfNOqNtrQqKlN4kE
// p6RD++7sGbzbfZ9arwrlD/HSDAWGdGGJTSOBM6pHehyLmSC3DJoR/CTu0vTGTWXQ
// rO64Z8tyXQPtVPb/YXrcUhbBp8i72b9Xky0fD6PkEebOy0Ip58XVAn2UPNlNOSPS
// ye+Qjtius0Md4Nie4+X8kwVI2Qjk3dSm0sw/720KJkdVDmrayeljtKBx6AtNQsSX
// gzQbeMmiqFFkwrG1+zx6E7H7jqIQ9B6bvWKXGwIDAQABAoIBAD8kBBPL6PPhAqUB
// K1r1/gycfDkUCQRP4DbZHt+458JlFHm8QL6VstKzkrp8mYDRhffY0WJnYJL98tr4
// 4tohsDbqFGwmw2mIaHjl24LuWXyyP4xpAGDpl9IcusjXBxLQLp2m4AKXbWpzb0OL
// Ulrfc1ZooPck2uz7xlMIZOtLlOPjLz2DuejVe24JcwwHzrQWKOfA11R/9e50DVse
// hnSH/w46Q763y4I0E3BIoUMsolEKzh2ydAAyzkgabGQBUuamZotNfvJoDXeCi1LD
// 8yNCWyTlYpJZJDDXooBU5EAsCvhN1sSRoaXWrlMSDB7r/E+aQyKua4KONqvmoJuC
// 21vSKeECgYEA7yW6wBkVoNhgXnk8XSZv3W+Q0xtdVpidJeNGBWnczlZrummt4xw3
// xs6zV+rGUDy59yDkKwBKjMMa42Mni7T9Fx8+EKUuhVK3PVQyajoyQqFwT1GORJNz
// c/eYQ6VYOCSC8OyZmsBM2p+0D4FF2/abwSPMmy0NgyFLCUFVc3OECpkCgYEA5OAm
// I3wt5s+clg18qS7BKR2DuOFWrzNVcHYXhjx8vOSWV033Oy3yvdUBAhu9A1LUqpwy
// Ma+unIgxmvmUMQEdyHQMcgBsVs10dR/g2xGjMLcwj6kn+xr3JVIZnbRT50YuPhf+
// ns1ScdhP6upo9I0/sRsIuN96Gb65JJx94gQ4k9MCgYBO5V6gA2aMQvZAFLUicgzT
// u/vGea+oYv7tQfaW0J8E/6PYwwaX93Y7Q3QNXCoCzJX5fsNnoFf36mIThGHGiHY6
// y5bZPPWFDI3hUMa1Hu/35XS85kYOP6sGJjf4kTLyirEcNKJUWH7CXY+00cwvTkOC
// S4Iz64Aas8AilIhRZ1m3eQKBgQCUW1s9azQRxgeZGFrzC3R340LL530aCeta/6FW
// CQVOJ9nv84DLYohTVqvVowdNDTb+9Epw/JDxtDJ7Y0YU0cVtdxPOHcocJgdUGHrX
// ZcJjRIt8w8g/s4X6MhKasBYm9s3owALzCuJjGzUKcDHiO2DKu1xXAb0SzRcTzUCn
// 7daCswKBgQDOYPZ2JGmhibqKjjLFm0qzpcQ6RPvPK1/7g0NInmjPMebP0K6eSPx0
// 9/49J6WTD++EajN7FhktUSYxukdWaCocAQJTDNYP0K88G4rtC2IYy5JFn9SWz5oh
// x//0u+zd/R/QRUzLOw4N72/Hu+UG6MNt5iDZFCtapRaKt6OvSBwy8w==
// -----END RSA PRIVATE KEY-----`;
//   // see https://runkit.com/gr2m/reproducable-jwt
//   const BEARER =
//     "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q";
//   const mock = fetchMock
//     .sandbox()
//     .postOnce("https://api.github.com/app/installations/123/access_tokens", {
//       token: "secret123",
//       expires_at: "1970-01-01T01:00:00.000Z",
//       permissions: {
//         metadata: "read",
//       },
//       repository_selection: "all",
//     })
//     .getOnce(
//       "https://api.github.com/app",
//       { id: 123 },
//       {
//         headers: {
//           accept: "application/vnd.github.machine-man-preview+json",
//           "user-agent": userAgent,
//           authorization: `bearer ${BEARER}`,
//         },
//       }
//     )
//     .postOnce(
//       "https://api.github.com/repos/octocat/hello-world/issues",
//       { id: 456 },
//       {
//         headers: {
//           accept: "application/vnd.github.machine-man-preview+json",
//           "user-agent": userAgent,
//           authorization: `token secret123`,
//         },
//       }
//     );
//   const auth = createAppAuth({
//     appId: APP_ID,
//     privateKey: PRIVATE_KEY,
//     installationId: 123,
//   });
//   const requestWithAuth = request.defaults({
//     mediaType: {
//       previews: ["machine-man"],
//     },
//     request: {
//       fetch: mock,
//       hook: auth.hook,
//     },
//   });
//   await requestWithAuth("GET /app");
//   await requestWithAuth("POST /repos/{owner}/{repo}/issues", {
//     owner: "octocat",
//     repo: "hello-world",
//     title: "Hello from the engine room",
//   });
//   assert.ok(mock.done())
//   clock.reset();
// });

test("Request with body", () => {
  const mock = fetchMock
    .sandbox()
    .mock("https://api.github.com/repos/octocat/hello-world/issues", 201, {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });

  request("POST /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "hello-world",
    headers: {
      accept: "text/html;charset=utf-8",
    },
    title: "Found a bug",
    body: "I'm having a problem with this.",
    assignees: ["octocat"],
    milestone: 1,
    labels: ["bug"],
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.status, 201);
  });
});

test("Put without request body", () => {
  const mock = fetchMock
    .sandbox()
    .mock("https://api.github.com/user/starred/octocat/hello-world", 204, {
      body: undefined,
    });

  request("PUT /user/starred/{owner}/{repo}", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    owner: "octocat",
    repo: "hello-world",
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.status, 204);
  });
});

test("HEAD requests (octokit/rest.js#841)", () => {
  const mock = fetchMock
    .sandbox()
    .head("https://api.github.com/repos/whatwg/html/pulls/1", {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": "19137",
      },
    })
    .head("https://api.github.com/repos/whatwg/html/pulls/2", {
      status: 404,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": "120",
      },
    });

  const options = {
    owner: "whatwg",
    repo: "html",
    number: 1,
    request: {
      fetch: mock,
    },
  };

  request(`HEAD /repos/{owner}/{repo}/pulls/{number}`, options)
    .then((response) => {
      assert.equal(response.status, 200);

      return request(
        `HEAD /repos/{owner}/{repo}/pulls/{number}`,
        Object.assign(options, { number: 2 })
      );
    })

    .then(() => {
      throw new Error("should not resolve");
    })

    .catch((error) => {
      assert.equal(error.status, 404);
    });
});

// TODO: 🤔 unclear how to mock fetch redirect properly
test.skip("Binary response with redirect", () => {
  const mock = fetchMock
    .sandbox()
    .get(
      "https://codeload.github.com/octokit-fixture-org/get-archive/legacy.tar.gz/master",
      {
        status: 200,
        body: Buffer.from(
          "1f8b0800000000000003cb4f2ec9cfce2cd14dcbac28292d4ad5cd2f4ad74d4f2dd14d2c4acec82c4bd53580007d060a0050bfb9b9a90203c428741ac2313436343307222320dbc010a8dc5c81c194124b8905a5c525894540a714e5e797e05347481edd734304e41319ff41ae8e2ebeae7ab92964d801d46f66668227fe0d4d51e3dfc8d0c8d808284f75df6201233cfe951590627ba01d330a46c1281805a3806e000024cb59d6000a0000",
          "hex"
        ),
        headers: {
          "content-type": "application/x-gzip",
          "content-length": "172",
        },
      }
    );

  return request("GET /repos/{owner}/{repo}/{archive_format}/{ref}", {
    owner: "octokit-fixture-org",
    repo: "get-archive",
    archive_format: "tarball",
    ref: "master",
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.data.length, 172);
  });
});

test("304 etag", () => {
  const mock = fetchMock.sandbox().get((url, { headers }) => {
    return (
      url === "https://api.github.com/orgs/myorg" &&
      headers["if-none-match"] === "etag"
    );
  }, 304);

  return request("GET /orgs/{org}", {
    org: "myorg",
    headers: { "If-None-Match": "etag" },
    request: {
      fetch: mock,
    },
  })
    .then(() => {
      throw new Error("should not resolve");
    })

    .catch((error) => {
      assert.equal(error.status, 304);
    });
});

test("304 last-modified", () => {
  const mock = fetchMock.sandbox().get((url, { headers }) => {
    return (
      url === "https://api.github.com/orgs/myorg" &&
      headers["if-modified-since"] === "Sun Dec 24 2017 22:00:00 GMT-0600 (CST)"
    );
  }, 304);

  return request("GET /orgs/{org}", {
    org: "myorg",
    headers: {
      "If-Modified-Since": "Sun Dec 24 2017 22:00:00 GMT-0600 (CST)",
    },
    request: {
      fetch: mock,
    },
  })
    .then((response) => {
      throw new Error("should not resolve");
    })
    .catch((error) => {
      assert.equal(error.status, 304);
    });
});

test("Not found", () => {
  const mock = fetchMock.sandbox().get("path:/orgs/nope", 404);

  return request("GET /orgs/{org}", {
    org: "nope",
    request: {
      fetch: mock,
    },
  })
    .then(() => {
      throw new Error("should not resolve");
    })

    .catch((error) => {
      assert.equal(error.status, 404);
      assert.equal(error.request.method, "GET");
      assert.equal(error.request.url, "https://api.github.com/orgs/nope");
    });
});

test("non-JSON response", () => {
  const mock = fetchMock
    .sandbox()
    .get("path:/repos/octokit-fixture-org/hello-world/contents/README.md", {
      status: 200,
      body: "# hello-world",
      headers: {
        "content-length": "13",
        "content-type": "application/vnd.github.v3.raw; charset=utf-8",
      },
    });

  return request("GET /repos/{owner}/{repo}/contents/{path}", {
    headers: {
      accept: "application/vnd.github.v3.raw",
    },
    owner: "octokit-fixture-org",
    repo: "hello-world",
    path: "README.md",
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.data, "# hello-world");
  });
});

test("Request error", () => {
  // port: 8 // officially unassigned port. See https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
  return request("GET https://127.0.0.1:8/")
    .then(() => {
      throw new Error("should not resolve");
    })

    .catch((error) => {
      assert.equal(error.status, 500);
    });
});

test("custom user-agent", () => {
  const mock = fetchMock
    .sandbox()
    .get(
      (url, { headers }) => headers["user-agent"] === "funky boom boom pow",
      200
    );

  return request("GET /", {
    headers: {
      "user-agent": "funky boom boom pow",
    },
    request: {
      fetch: mock,
    },
  });
});

test("passes node-fetch options to fetch only", () => {
  const mock = (url, options) => {
    assert.equal(url, "https://api.github.com/");
    assert.equal(options.timeout, 100);
    return Promise.reject(new Error("ok"));
  };

  return request("GET /", {
    headers: {
      "user-agent": "funky boom boom pow",
    },
    request: {
      timeout: 100,
      fetch: mock,
    },
  }).catch((error) => {
    if (error.message === "ok") {
      return;
    }

    throw error;
  });
});

test("422 error with details", () => {
  const mock = fetchMock
    .sandbox()
    .post("https://api.github.com/repos/octocat/hello-world/labels", {
      status: 422,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Foo": "bar",
      },
      body: {
        message: "Validation Failed",
        errors: [
          {
            resource: "Label",
            code: "invalid",
            field: "color",
          },
        ],
        documentation_url:
          "https://developer.github.com/v3/issues/labels/#create-a-label",
      },
    });

  return request("POST /repos/octocat/hello-world/labels", {
    name: "foo",
    color: "invalid",
    request: {
      fetch: mock,
    },
  }).catch((error) => {
    assert.equal(error.status, 422);
    assert.equal(error.response.headers["x-foo"], "bar");
    assert.equal(
      error.response.data.documentation_url,
      "https://developer.github.com/v3/issues/labels/#create-a-label"
    );
    assert.equal(error.response.data.errors, [
      { resource: "Label", code: "invalid", field: "color" },
    ]);
  });
});

test("redacts credentials from error.request.headers.authorization", () => {
  const mock = fetchMock.sandbox().get("https://api.github.com/", {
    status: 500,
  });

  return request("/", {
    headers: {
      authorization: "token secret123",
    },
    request: {
      fetch: mock,
    },
  }).catch((error) => {
    assert.equal(error.request.headers.authorization, "token [REDACTED]");
  });
});

test("redacts credentials from error.request.url", () => {
  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/?client_id=123&client_secret=secret123", {
      status: 500,
    });

  return request("/", {
    client_id: "123",
    client_secret: "secret123",
    request: {
      fetch: mock,
    },
  }).catch((error) => {
    assert.equal(
      error.request.url,
      "https://api.github.com/?client_id=123&client_secret=[REDACTED]"
    );
  });
});
test("Just URL", () => {
  const mock = fetchMock.sandbox().get("path:/", 200);

  return request("/", {
    request: {
      fetch: mock,
    },
  }).then(({ status }) => {
    assert.equal(status, 200);
  });
});

test("options.request.signal is passed as option to fetch", function () {
  return request("/", {
    request: {
      // We pass a value that is not an `AbortSignal`, and expect `fetch` to
      // throw an exception complaining about the value
      signal: "funk",
    },
  })
    .then(() => {
      throw new Error("Should not resolve");
    })

    .catch((error) => {
      // We can't match on the entire string because the message differs between
      // Node versions.
      assert.match(error.message, /AbortSignal/);
    });
});

test("options.request.fetch", function () {
  return request("/", {
    request: {
      fetch: () =>
        Promise.resolve({
          status: 200,
          headers: new Headers({
            "Content-Type": "application/json; charset=utf-8",
          }),
          url: "http://api.github.com/",
          json() {
            return Promise.resolve("funk");
          },
        }),
    },
  }).then((result) => {
    assert.equal(result.data, "funk");
  });
});

test("options.request.hook", function () {
  const mock = fetchMock.sandbox().mock(
    "https://api.github.com/foo",
    { ok: true },
    {
      headers: {
        "x-foo": "bar",
      },
    }
  );

  const hook = (request, options) => {
    assert.instance(request.endpoint, Function);
    assert.instance(request.defaults, Function);
    assert.equal(options, {
      baseUrl: "https://api.github.com",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
      mediaType: {
        format: "",
        previews: [],
      },
      method: "GET",
      request: {
        fetch: mock,
        hook: hook,
      },
      url: "/",
    });

    return request("/foo", {
      headers: {
        "x-foo": "bar",
      },
      request: {
        fetch: mock,
      },
    });
  };

  return request("/", {
    request: {
      fetch: mock,
      hook,
    },
  }).then((result) => {
    assert.equal(result.data, { ok: true });
  });
});

test("options.mediaType.format", function () {
  const mock = fetchMock
    .sandbox()
    .mock("https://api.github.com/repos/octokit/request.js/issues/1", "ok", {
      headers: {
        accept: "application/vnd.github.v3.raw+json",
        authorization: "token 0000000000000000000000000000000000000001",
        "user-agent": userAgent,
      },
    });

  return request("GET /repos/{owner}/{repo}/issues/{number}", {
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    mediaType: {
      format: "raw+json",
    },
    owner: "octokit",
    repo: "request.js",
    number: 1,
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.data, "ok");
  });
});

test("options.mediaType.previews", function () {
  const mock = fetchMock
    .sandbox()
    .mock("https://api.github.com/repos/octokit/request.js/issues/1", "ok", {
      headers: {
        accept:
          "application/vnd.github.foo-preview+json,application/vnd.github.bar-preview+json",
        authorization: "token 0000000000000000000000000000000000000001",
        "user-agent": userAgent,
      },
    });

  return request("GET /repos/{owner}/{repo}/issues/{number}", {
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    mediaType: {
      previews: ["foo", "bar"],
    },
    owner: "octokit",
    repo: "request.js",
    number: 1,
    request: {
      fetch: mock,
    },
  }).then((response) => {
    assert.equal(response.data, "ok");
  });
});

test("octokit/octokit.js#1497", function () {
  const mock = fetchMock.sandbox().mock(
    "https://request-errors-test.com/repos/gr2m/sandbox/branches/gr2m-patch-1/protection",
    {
      status: 400,
      body: {
        message: "Validation failed",
        errors: [
          "Only organization repositories can have users and team restrictions",
          { resource: "Search", field: "q", code: "invalid" },
        ],
        documentation_url:
          "https://developer.github.com/v3/repos/branches/#update-branch-protection",
      },
    },
    {
      method: "PUT",
      headers: {
        accept: "application/vnd.github.luke-cage-preview+json",
        authorization: "token secret123",
      },
    }
  );

  return request("PUT /repos/{owner}/{repo}/branches/{branch}/protection", {
    baseUrl: "https://request-errors-test.com",
    mediaType: { previews: ["luke-cage"] },
    headers: {
      authorization: "token secret123",
    },
    owner: "gr2m",
    repo: "sandbox",
    branch: "gr2m-patch-1",
    required_status_checks: { strict: true, contexts: ["wip"] },
    enforce_admins: true,
    required_pull_request_reviews: {
      required_approving_review_count: 1,
      dismiss_stale_reviews: true,
      require_code_owner_reviews: true,
      dismissal_restrictions: { users: [], teams: [] },
    },
    restrictions: { users: [], teams: [] },
    request: {
      fetch: mock,
    },
  })
    .then(() => {
      fail("This should return error.");
    })
    .catch((error) => {
      assert.ok(
        "message" in error,
        `Validation failed: "Only organization repositories can have users and team restrictions", {"resource":"Search","field":"q","code":"invalid"}`
      );
    });
});

test("logs deprecation warning if `deprecation` header is present", function () {
  const mock = fetchMock.sandbox().mock(
    "https://api.github.com/teams/123",
    {
      body: {
        id: 123,
      },
      headers: {
        deprecation: "Sat, 01 Feb 2020 00:00:00 GMT",
        sunset: "Mon, 01 Feb 2021 00:00:00 GMT",
        link: '<https://developer.github.com/changes/2020-01-21-moving-the-team-api-endpoints/>; rel="deprecation"; type="text/html", <https://api.github.com/organizations/3430433/team/4177875>; rel="alternate"',
      },
    },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token 0000000000000000000000000000000000000001",
        "user-agent": userAgent,
      },
    }
  );

  const warn = sinon.spy();

  return request("GET /teams/{team_id}", {
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    team_id: 123,
    request: { fetch: mock, log: { warn } },
  }).then((response) => {
    assert.equal(response.data, { id: 123 });
    assert.equal(warn.calledOnce, true);
    assert.ok(
      warn.calledWith(
        '[@octokit/request] "GET https://api.github.com/teams/123" is deprecated. It is scheduled to be removed on Mon, 01 Feb 2021 00:00:00 GMT. See https://developer.github.com/changes/2020-01-21-moving-the-team-api-endpoints/'
      )
    );
  });
});

test("deprecation header without deprecation link", function () {
  const mock = fetchMock.sandbox().mock(
    "https://api.github.com/teams/123",
    {
      body: {
        id: 123,
      },
      headers: {
        deprecation: "Sat, 01 Feb 2020 00:00:00 GMT",
        sunset: "Mon, 01 Feb 2021 00:00:00 GMT",
      },
    },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token 0000000000000000000000000000000000000001",
        "user-agent": userAgent,
      },
    }
  );

  const warn = sinon.spy();

  return request("GET /teams/{team_id}", {
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    team_id: 123,
    request: { fetch: mock, log: { warn } },
  }).then((response) => {
    assert.equal(response.data, { id: 123 });
    assert.equal(warn.calledOnce, true);
    assert.ok(
      warn.calledWith(
        '[@octokit/request] "GET https://api.github.com/teams/123" is deprecated. It is scheduled to be removed on Mon, 01 Feb 2021 00:00:00 GMT'
      )
    );
  });
});

test("404 not found", () => {
  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/repos/octocat/unknown", {
      status: 404,
      headers: {},
      body: {
        message: "Not Found",
        documentation_url:
          "https://docs.github.com/en/rest/reference/repos#get-a-repository",
      },
    });

  return request("GET /repos/octocat/unknown", {
    request: {
      fetch: mock,
    },
  }).catch((error) => {
    assert.equal(error.status, 404);
    assert.equal(error.response.data.message, "Not Found");
    assert.equal(
      error.response.data.documentation_url,
      "https://docs.github.com/en/rest/reference/repos#get-a-repository"
    );
  });
});

test("Request timeout", () => {
  const delay = (millis = 3000) => {
    return new Promise((resolve) => {
      setTimeout(resolve, millis);
    });
  };

  const mock = (url, options) => {
    assert.equal(url, "https://api.github.com/");
    assert.equal(options.timeout, 100);
    return delay().then(() => {
      return {
        status: 200,
        headers: {},
        body: {
          message: "OK",
        },
      };
    });
  };

  return request("GET /", {
    request: {
      timeout: 100,
      fetch: mock,
    },
  })
    .then((response) => {
      throw new Error("should not resolve");
    })
    .catch((error) => {
      assert.equal(error.name, "HttpError");
      assert.equal(error.status, 500);
    });
});

test("validate request with readstream data", () => {
  const currentFilePath = url.fileURLToPath(import.meta.url);
  const size = fs.statSync(currentFilePath).size;
  const mock = fetchMock
    .sandbox()
    .post(
      "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/v1.0.0/assets",
      {
        status: 200,
      }
    );

  return request("POST /repos/{owner}/{repo}/releases/{release_id}/assets", {
    owner: "octokit-fixture-org",
    repo: "release-assets",
    release_id: "v1.0.0",
    request: {
      fetch: mock,
    },
    headers: {
      "content-type": "text/json",
      "content-length": size,
    },
    data: fs.createReadStream(currentFilePath),
    name: "test-upload.txt",
    label: "test",
  }).then((response) => {
    assert.equal(response.status, 200);
    assert.instance(mock.lastOptions()?.body, stream.Readable);
    assert.ok(mock.done());
  });
});

test("validate request with data set to Buffer type", () => {
  const mock = fetchMock
    .sandbox()
    .post(
      "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/tags/v1.0.0",
      {
        status: 200,
      }
    );

  return request("POST /repos/{owner}/{repo}/releases/tags/{tag}", {
    owner: "octokit-fixture-org",
    repo: "release-assets",
    tag: "v1.0.0",
    request: {
      fetch: mock,
    },
    headers: {
      "content-type": "text/plain",
    },
    data: Buffer.from("Hello, world!\n"),
    name: "test-upload.txt",
    label: "test",
  }).then((response) => {
    assert.equal(response.status, 200);
    assert.equal(mock.lastOptions()?.body, Buffer.from("Hello, world!\n"));
    assert.ok(mock.done());
  });
});

test("validate request with data set to ArrayBuffer type", () => {
  const mock = fetchMock
    .sandbox()
    .post(
      "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/tags/v1.0.0",
      {
        status: 200,
      }
    );

  return request("POST /repos/{owner}/{repo}/releases/tags/{tag}", {
    owner: "octokit-fixture-org",
    repo: "release-assets",
    tag: "v1.0.0",
    request: {
      fetch: mock,
    },
    headers: {
      "content-type": "text/plain",
    },
    data: stringToArrayBuffer("Hello, world!\n"),
    name: "test-upload.txt",
    label: "test",
  }).then((response) => {
    assert.equal(response.status, 200);
    assert.equal(
      mock.lastOptions()?.body,
      stringToArrayBuffer("Hello, world!\n")
    );
    assert.ok(mock.done());
  });
});

test("bubbles up AbortError if the request is aborted", () => {
  // AbortSignal and AbortController do not exist on
  // Node < 15. The main parts of their API have been
  // reproduced in the mocks below.
  class AbortSignal {
    abort = () => {
      const e = new Error("");
      e.name = "AbortError";
      throw e;
    };

    addEventListener = () => {};
  }

  class AbortController {
    abort = () => {
      this.signal.abort();
    };
    signal = new AbortSignal();
  }
  const abortController = new AbortController();
  const mock = fetchMock.sandbox().post(
    "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/tags/v1.0.0",
    new Promise(() => {
      abortController.abort();
    })
  );

  return request("POST /repos/{owner}/{repo}/releases/tags/{tag}", {
    owner: "octokit-fixture-org",
    repo: "release-assets",
    tag: "v1.0.0",
    request: {
      fetch: mock,
      signal: abortController.signal,
    },
    headers: {
      "content-type": "text/plain",
    },
    data: stringToArrayBuffer("Hello, world!\n"),
    name: "test-upload.txt",
    label: "test",
  }).catch((error) => {
    assert.equal(error.name, "AbortError");
  });
});

test.run();
