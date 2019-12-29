/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { GaxiosPromise } from 'gaxios';
import { Compute, JWT, OAuth2Client, UserRefreshClient } from 'google-auth-library';
import { APIRequestContext, BodyResponseCallback, GlobalOptions, GoogleConfigurable, MethodOptions } from 'googleapis-common';
export declare namespace sourcerepo_v1 {
    interface Options extends GlobalOptions {
        version: 'v1';
    }
    interface StandardParameters {
        /**
         * V1 error format.
         */
        '$.xgafv'?: string;
        /**
         * OAuth access token.
         */
        access_token?: string;
        /**
         * Data format for response.
         */
        alt?: string;
        /**
         * JSONP
         */
        callback?: string;
        /**
         * Selector specifying which fields to include in a partial response.
         */
        fields?: string;
        /**
         * API key. Your API key identifies your project and provides you with API
         * access, quota, and reports. Required unless you provide an OAuth 2.0
         * token.
         */
        key?: string;
        /**
         * OAuth 2.0 token for the current user.
         */
        oauth_token?: string;
        /**
         * Returns response with indentations and line breaks.
         */
        prettyPrint?: boolean;
        /**
         * Available to use for quota purposes for server-side applications. Can be
         * any arbitrary string assigned to a user, but should not exceed 40
         * characters.
         */
        quotaUser?: string;
        /**
         * Legacy upload protocol for media (e.g. "media", "multipart").
         */
        uploadType?: string;
        /**
         * Upload protocol for media (e.g. "raw", "multipart").
         */
        upload_protocol?: string;
    }
    /**
     * Cloud Source Repositories API
     *
     * Accesses source code repositories hosted by Google.
     *
     * @example
     * const {google} = require('googleapis');
     * const sourcerepo = google.sourcerepo('v1');
     *
     * @namespace sourcerepo
     * @type {Function}
     * @version v1
     * @variation v1
     * @param {object=} options Options for Sourcerepo
     */
    class Sourcerepo {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Specifies the audit configuration for a service. The configuration
     * determines which permission types are logged, and what identities, if any,
     * are exempted from logging. An AuditConfig must have one or more
     * AuditLogConfigs.  If there are AuditConfigs for both `allServices` and a
     * specific service, the union of the two AuditConfigs is used for that
     * service: the log_types specified in each AuditConfig are enabled, and the
     * exempted_members in each AuditLogConfig are exempted.  Example Policy with
     * multiple AuditConfigs:      {       &quot;audit_configs&quot;: [         {
     * &quot;service&quot;: &quot;allServices&quot; &quot;audit_log_configs&quot;:
     * [             {               &quot;log_type&quot;: &quot;DATA_READ&quot;,
     * &quot;exempted_members&quot;: [ &quot;user:foo@gmail.com&quot; ] }, {
     * &quot;log_type&quot;: &quot;DATA_WRITE&quot;,             },             {
     * &quot;log_type&quot;: &quot;ADMIN_READ&quot;,             }           ] },
     * {           &quot;service&quot;: &quot;fooservice.googleapis.com&quot;
     * &quot;audit_log_configs&quot;: [             { &quot;log_type&quot;:
     * &quot;DATA_READ&quot;,             },             { &quot;log_type&quot;:
     * &quot;DATA_WRITE&quot;,               &quot;exempted_members&quot;: [
     * &quot;user:bar@gmail.com&quot;               ]             }           ] }
     * ]     }  For fooservice, this policy enables DATA_READ, DATA_WRITE and
     * ADMIN_READ logging. It also exempts foo@gmail.com from DATA_READ logging,
     * and bar@gmail.com from DATA_WRITE logging.
     */
    interface Schema$AuditConfig {
        /**
         * The configuration for logging of each type of permission.
         */
        auditLogConfigs?: Schema$AuditLogConfig[];
        /**
         * Specifies a service that will be enabled for audit logging. For example,
         * `storage.googleapis.com`, `cloudsql.googleapis.com`. `allServices` is a
         * special value that covers all services.
         */
        service?: string;
    }
    /**
     * Provides the configuration for logging a type of permissions. Example: {
     * &quot;audit_log_configs&quot;: [         {           &quot;log_type&quot;:
     * &quot;DATA_READ&quot;,           &quot;exempted_members&quot;: [
     * &quot;user:foo@gmail.com&quot;           ]         },         {
     * &quot;log_type&quot;: &quot;DATA_WRITE&quot;,         }       ]     }  This
     * enables &#39;DATA_READ&#39; and &#39;DATA_WRITE&#39; logging, while
     * exempting foo@gmail.com from DATA_READ logging.
     */
    interface Schema$AuditLogConfig {
        /**
         * Specifies the identities that do not cause logging for this type of
         * permission. Follows the same format of Binding.members.
         */
        exemptedMembers?: string[];
        /**
         * The log type that this config enables.
         */
        logType?: string;
    }
    /**
     * Associates `members` with a `role`.
     */
    interface Schema$Binding {
        /**
         * Unimplemented. The condition that is associated with this binding. NOTE:
         * an unsatisfied condition will not allow user access via current binding.
         * Different bindings, including their conditions, are examined
         * independently.
         */
        condition?: Schema$Expr;
        /**
         * Specifies the identities requesting access for a Cloud Platform resource.
         * `members` can have the following values:  * `allUsers`: A special
         * identifier that represents anyone who is    on the internet; with or
         * without a Google account.  * `allAuthenticatedUsers`: A special
         * identifier that represents anyone    who is authenticated with a Google
         * account or a service account.  * `user:{emailid}`: An email address that
         * represents a specific Google    account. For example, `alice@gmail.com` .
         * * `serviceAccount:{emailid}`: An email address that represents a service
         * account. For example, `my-other-app@appspot.gserviceaccount.com`.  *
         * `group:{emailid}`: An email address that represents a Google group. For
         * example, `admins@example.com`.   * `domain:{domain}`: The G Suite domain
         * (primary) that represents all the    users of that domain. For example,
         * `google.com` or `example.com`.
         */
        members?: string[];
        /**
         * Role that is assigned to `members`. For example, `roles/viewer`,
         * `roles/editor`, or `roles/owner`.
         */
        role?: string;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated
     * empty messages in your APIs. A typical example is to use it as the request
     * or the response type of an API method. For instance:      service Foo { rpc
     * Bar(google.protobuf.Empty) returns (google.protobuf.Empty);     }  The JSON
     * representation for `Empty` is empty JSON object `{}`.
     */
    interface Schema$Empty {
    }
    /**
     * Represents an expression text. Example:      title: &quot;User account
     * presence&quot;     description: &quot;Determines whether the request has a
     * user account&quot;     expression: &quot;size(request.user) &gt; 0&quot;
     */
    interface Schema$Expr {
        /**
         * An optional description of the expression. This is a longer text which
         * describes the expression, e.g. when hovered over it in a UI.
         */
        description?: string;
        /**
         * Textual representation of an expression in Common Expression Language
         * syntax.  The application context of the containing message determines
         * which well-known feature set of CEL is supported.
         */
        expression?: string;
        /**
         * An optional string indicating the location of the expression for error
         * reporting, e.g. a file name and a position in the file.
         */
        location?: string;
        /**
         * An optional title for the expression, i.e. a short string describing its
         * purpose. This can be used e.g. in UIs which allow to enter the
         * expression.
         */
        title?: string;
    }
    /**
     * Response for ListRepos.  The size is not set in the returned repositories.
     */
    interface Schema$ListReposResponse {
        /**
         * If non-empty, additional repositories exist within the project. These can
         * be retrieved by including this value in the next ListReposRequest&#39;s
         * page_token field.
         */
        nextPageToken?: string;
        /**
         * The listed repos.
         */
        repos?: Schema$Repo[];
    }
    /**
     * Configuration to automatically mirror a repository from another hosting
     * service, for example GitHub or Bitbucket.
     */
    interface Schema$MirrorConfig {
        /**
         * ID of the SSH deploy key at the other hosting service. Removing this key
         * from the other service would deauthorize Google Cloud Source Repositories
         * from mirroring.
         */
        deployKeyId?: string;
        /**
         * URL of the main repository at the other hosting service.
         */
        url?: string;
        /**
         * ID of the webhook listening to updates to trigger mirroring. Removing
         * this webhook from the other hosting service will stop Google Cloud Source
         * Repositories from receiving notifications, and thereby disabling
         * mirroring.
         */
        webhookId?: string;
    }
    /**
     * Defines an Identity and Access Management (IAM) policy. It is used to
     * specify access control policies for Cloud Platform resources.   A `Policy`
     * consists of a list of `bindings`. A `binding` binds a list of `members` to
     * a `role`, where the members can be user accounts, Google groups, Google
     * domains, and service accounts. A `role` is a named list of permissions
     * defined by IAM.  **JSON Example**      {       &quot;bindings&quot;: [ {
     * &quot;role&quot;: &quot;roles/owner&quot;,           &quot;members&quot;: [
     * &quot;user:mike@example.com&quot;, &quot;group:admins@example.com&quot;,
     * &quot;domain:google.com&quot;,
     * &quot;serviceAccount:my-other-app@appspot.gserviceaccount.com&quot; ] }, {
     * &quot;role&quot;: &quot;roles/viewer&quot;,           &quot;members&quot;:
     * [&quot;user:sean@example.com&quot;]         }       ]     }  **YAML
     * Example**      bindings:     - members:       - user:mike@example.com -
     * group:admins@example.com       - domain:google.com       -
     * serviceAccount:my-other-app@appspot.gserviceaccount.com       role:
     * roles/owner     - members:       - user:sean@example.com       role:
     * roles/viewer   For a description of IAM and its features, see the [IAM
     * developer&#39;s guide](https://cloud.google.com/iam/docs).
     */
    interface Schema$Policy {
        /**
         * Specifies cloud audit logging configuration for this policy.
         */
        auditConfigs?: Schema$AuditConfig[];
        /**
         * Associates a list of `members` to a `role`. `bindings` with no members
         * will result in an error.
         */
        bindings?: Schema$Binding[];
        /**
         * `etag` is used for optimistic concurrency control as a way to help
         * prevent simultaneous updates of a policy from overwriting each other. It
         * is strongly suggested that systems make use of the `etag` in the
         * read-modify-write cycle to perform policy updates in order to avoid race
         * conditions: An `etag` is returned in the response to `getIamPolicy`, and
         * systems are expected to put that etag in the request to `setIamPolicy` to
         * ensure that their change will be applied to the same version of the
         * policy.  If no `etag` is provided in the call to `setIamPolicy`, then the
         * existing policy is overwritten blindly.
         */
        etag?: string;
        /**
         * Deprecated.
         */
        version?: number;
    }
    /**
     * Cloud Source Repositories configuration of a project.
     */
    interface Schema$ProjectConfig {
        /**
         * Reject a Git push that contains a private key.
         */
        enablePrivateKeyCheck?: boolean;
        /**
         * The name of the project. Values are of the form
         * `projects/&lt;project&gt;`.
         */
        name?: string;
        /**
         * How this project publishes a change in the repositories through Cloud
         * Pub/Sub. Keyed by the topic names.
         */
        pubsubConfigs?: {
            [key: string]: Schema$PubsubConfig;
        };
    }
    /**
     * Configuration to publish a Cloud Pub/Sub message.
     */
    interface Schema$PubsubConfig {
        /**
         * The format of the Cloud Pub/Sub messages.
         */
        messageFormat?: string;
        /**
         * Email address of the service account used for publishing Cloud Pub/Sub
         * messages. This service account needs to be in the same project as the
         * PubsubConfig. When added, the caller needs to have
         * iam.serviceAccounts.actAs permission on this service account. If
         * unspecified, it defaults to the compute engine default service account.
         */
        serviceAccountEmail?: string;
        /**
         * A topic of Cloud Pub/Sub. Values are of the form
         * `projects/&lt;project&gt;/topics/&lt;topic&gt;`. The project needs to be
         * the same project as this config is in.
         */
        topic?: string;
    }
    /**
     * A repository (or repo) is a Git repository storing versioned source
     * content.
     */
    interface Schema$Repo {
        /**
         * How this repository mirrors a repository managed by another service.
         * Read-only field.
         */
        mirrorConfig?: Schema$MirrorConfig;
        /**
         * Resource name of the repository, of the form
         * `projects/&lt;project&gt;/repos/&lt;repo&gt;`.  The repo name may contain
         * slashes. eg, `projects/myproject/repos/name/with/slash`
         */
        name?: string;
        /**
         * How this repository publishes a change in the repository through Cloud
         * Pub/Sub. Keyed by the topic names.
         */
        pubsubConfigs?: {
            [key: string]: Schema$PubsubConfig;
        };
        /**
         * The disk usage of the repo, in bytes. Read-only field. Size is only
         * returned by GetRepo.
         */
        size?: string;
        /**
         * URL to clone the repository from Google Cloud Source Repositories.
         * Read-only field.
         */
        url?: string;
    }
    /**
     * Request message for `SetIamPolicy` method.
     */
    interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the `resource`. The size
         * of the policy is limited to a few 10s of KB. An empty policy is a valid
         * policy but certain Cloud Platform services (such as Projects) might
         * reject them.
         */
        policy?: Schema$Policy;
        /**
         * OPTIONAL: A FieldMask specifying which fields of the policy to modify.
         * Only the fields in the mask will be modified. If no mask is provided, the
         * following default mask is used: paths: &quot;bindings, etag&quot; This
         * field is only used by Cloud IAM.
         */
        updateMask?: string;
    }
    /**
     * Request message for `TestIamPermissions` method.
     */
    interface Schema$TestIamPermissionsRequest {
        /**
         * The set of permissions to check for the `resource`. Permissions with
         * wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed.
         * For more information see [IAM
         * Overview](https://cloud.google.com/iam/docs/overview#permissions).
         */
        permissions?: string[];
    }
    /**
     * Response message for `TestIamPermissions` method.
     */
    interface Schema$TestIamPermissionsResponse {
        /**
         * A subset of `TestPermissionsRequest.permissions` that the caller is
         * allowed.
         */
        permissions?: string[];
    }
    /**
     * Request for UpdateProjectConfig.
     */
    interface Schema$UpdateProjectConfigRequest {
        /**
         * The new configuration for the project.
         */
        projectConfig?: Schema$ProjectConfig;
        /**
         * A FieldMask specifying which fields of the project_config to modify. Only
         * the fields in the mask will be modified. If no mask is provided, this
         * request is no-op.
         */
        updateMask?: string;
    }
    /**
     * Request for UpdateRepo.
     */
    interface Schema$UpdateRepoRequest {
        /**
         * The new configuration for the repository.
         */
        repo?: Schema$Repo;
        /**
         * A FieldMask specifying which fields of the repo to modify. Only the
         * fields in the mask will be modified. If no mask is provided, this request
         * is no-op.
         */
        updateMask?: string;
    }
    class Resource$Projects {
        context: APIRequestContext;
        repos: Resource$Projects$Repos;
        constructor(context: APIRequestContext);
        /**
         * sourcerepo.projects.getConfig
         * @desc Returns the Cloud Source Repositories configuration of the project.
         * @alias sourcerepo.projects.getConfig
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the requested project. Values are of the form `projects/<project>`.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getConfig(params?: Params$Resource$Projects$Getconfig, options?: MethodOptions): GaxiosPromise<Schema$ProjectConfig>;
        getConfig(params: Params$Resource$Projects$Getconfig, options: MethodOptions | BodyResponseCallback<Schema$ProjectConfig>, callback: BodyResponseCallback<Schema$ProjectConfig>): void;
        getConfig(params: Params$Resource$Projects$Getconfig, callback: BodyResponseCallback<Schema$ProjectConfig>): void;
        getConfig(callback: BodyResponseCallback<Schema$ProjectConfig>): void;
        /**
         * sourcerepo.projects.updateConfig
         * @desc Updates the Cloud Source Repositories configuration of the project.
         * @alias sourcerepo.projects.updateConfig
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the requested project. Values are of the form `projects/<project>`.
         * @param {().UpdateProjectConfigRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        updateConfig(params?: Params$Resource$Projects$Updateconfig, options?: MethodOptions): GaxiosPromise<Schema$ProjectConfig>;
        updateConfig(params: Params$Resource$Projects$Updateconfig, options: MethodOptions | BodyResponseCallback<Schema$ProjectConfig>, callback: BodyResponseCallback<Schema$ProjectConfig>): void;
        updateConfig(params: Params$Resource$Projects$Updateconfig, callback: BodyResponseCallback<Schema$ProjectConfig>): void;
        updateConfig(callback: BodyResponseCallback<Schema$ProjectConfig>): void;
    }
    interface Params$Resource$Projects$Getconfig extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The name of the requested project. Values are of the form
         * `projects/<project>`.
         */
        name?: string;
    }
    interface Params$Resource$Projects$Updateconfig extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The name of the requested project. Values are of the form
         * `projects/<project>`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateProjectConfigRequest;
    }
    class Resource$Projects$Repos {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * sourcerepo.projects.repos.create
         * @desc Creates a repo in the given project with the given name.  If the
         * named repository already exists, `CreateRepo` returns `ALREADY_EXISTS`.
         * @alias sourcerepo.projects.repos.create
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.parent The project in which to create the repo. Values are of the form `projects/<project>`.
         * @param {().Repo} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create(params?: Params$Resource$Projects$Repos$Create, options?: MethodOptions): GaxiosPromise<Schema$Repo>;
        create(params: Params$Resource$Projects$Repos$Create, options: MethodOptions | BodyResponseCallback<Schema$Repo>, callback: BodyResponseCallback<Schema$Repo>): void;
        create(params: Params$Resource$Projects$Repos$Create, callback: BodyResponseCallback<Schema$Repo>): void;
        create(callback: BodyResponseCallback<Schema$Repo>): void;
        /**
         * sourcerepo.projects.repos.delete
         * @desc Deletes a repo.
         * @alias sourcerepo.projects.repos.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the repo to delete. Values are of the form `projects/<project>/repos/<repo>`.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params?: Params$Resource$Projects$Repos$Delete, options?: MethodOptions): GaxiosPromise<Schema$Empty>;
        delete(params: Params$Resource$Projects$Repos$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Repos$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * sourcerepo.projects.repos.get
         * @desc Returns information about a repo.
         * @alias sourcerepo.projects.repos.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the requested repository. Values are of the form `projects/<project>/repos/<repo>`.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params?: Params$Resource$Projects$Repos$Get, options?: MethodOptions): GaxiosPromise<Schema$Repo>;
        get(params: Params$Resource$Projects$Repos$Get, options: MethodOptions | BodyResponseCallback<Schema$Repo>, callback: BodyResponseCallback<Schema$Repo>): void;
        get(params: Params$Resource$Projects$Repos$Get, callback: BodyResponseCallback<Schema$Repo>): void;
        get(callback: BodyResponseCallback<Schema$Repo>): void;
        /**
         * sourcerepo.projects.repos.getIamPolicy
         * @desc Gets the access control policy for a resource. Returns an empty
         * policy if the resource exists and does not have a policy set.
         * @alias sourcerepo.projects.repos.getIamPolicy
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. See the operation documentation for the appropriate value for this field.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getIamPolicy(params?: Params$Resource$Projects$Repos$Getiampolicy, options?: MethodOptions): GaxiosPromise<Schema$Policy>;
        getIamPolicy(params: Params$Resource$Projects$Repos$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Repos$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * sourcerepo.projects.repos.list
         * @desc Returns all repos belonging to a project. The sizes of the repos
         * are not set by ListRepos.  To get the size of a repo, use GetRepo.
         * @alias sourcerepo.projects.repos.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The project ID whose repos should be listed. Values are of the form `projects/<project>`.
         * @param {integer=} params.pageSize Maximum number of repositories to return; between 1 and 500. If not set or zero, defaults to 100 at the server.
         * @param {string=} params.pageToken Resume listing repositories where a prior ListReposResponse left off. This is an opaque token that must be obtained from a recent, prior ListReposResponse's next_page_token field.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params?: Params$Resource$Projects$Repos$List, options?: MethodOptions): GaxiosPromise<Schema$ListReposResponse>;
        list(params: Params$Resource$Projects$Repos$List, options: MethodOptions | BodyResponseCallback<Schema$ListReposResponse>, callback: BodyResponseCallback<Schema$ListReposResponse>): void;
        list(params: Params$Resource$Projects$Repos$List, callback: BodyResponseCallback<Schema$ListReposResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListReposResponse>): void;
        /**
         * sourcerepo.projects.repos.patch
         * @desc Updates information about a repo.
         * @alias sourcerepo.projects.repos.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the requested repository. Values are of the form `projects/<project>/repos/<repo>`.
         * @param {().UpdateRepoRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params?: Params$Resource$Projects$Repos$Patch, options?: MethodOptions): GaxiosPromise<Schema$Repo>;
        patch(params: Params$Resource$Projects$Repos$Patch, options: MethodOptions | BodyResponseCallback<Schema$Repo>, callback: BodyResponseCallback<Schema$Repo>): void;
        patch(params: Params$Resource$Projects$Repos$Patch, callback: BodyResponseCallback<Schema$Repo>): void;
        patch(callback: BodyResponseCallback<Schema$Repo>): void;
        /**
         * sourcerepo.projects.repos.setIamPolicy
         * @desc Sets the access control policy on the specified resource. Replaces
         * any existing policy.
         * @alias sourcerepo.projects.repos.setIamPolicy
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. See the operation documentation for the appropriate value for this field.
         * @param {().SetIamPolicyRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        setIamPolicy(params?: Params$Resource$Projects$Repos$Setiampolicy, options?: MethodOptions): GaxiosPromise<Schema$Policy>;
        setIamPolicy(params: Params$Resource$Projects$Repos$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Repos$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * sourcerepo.projects.repos.testIamPermissions
         * @desc Returns permissions that a caller has on the specified resource. If
         * the resource does not exist, this will return an empty set of
         * permissions, not a NOT_FOUND error.
         * @alias sourcerepo.projects.repos.testIamPermissions
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. See the operation documentation for the appropriate value for this field.
         * @param {().TestIamPermissionsRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        testIamPermissions(params?: Params$Resource$Projects$Repos$Testiampermissions, options?: MethodOptions): GaxiosPromise<Schema$TestIamPermissionsResponse>;
        testIamPermissions(params: Params$Resource$Projects$Repos$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Repos$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    interface Params$Resource$Projects$Repos$Create extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The project in which to create the repo. Values are of the form
         * `projects/<project>`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Repo;
    }
    interface Params$Resource$Projects$Repos$Delete extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The name of the repo to delete. Values are of the form
         * `projects/<project>/repos/<repo>`.
         */
        name?: string;
    }
    interface Params$Resource$Projects$Repos$Get extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The name of the requested repository. Values are of the form
         * `projects/<project>/repos/<repo>`.
         */
        name?: string;
    }
    interface Params$Resource$Projects$Repos$Getiampolicy extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * REQUIRED: The resource for which the policy is being requested. See the
         * operation documentation for the appropriate value for this field.
         */
        resource?: string;
    }
    interface Params$Resource$Projects$Repos$List extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The project ID whose repos should be listed. Values are of the form
         * `projects/<project>`.
         */
        name?: string;
        /**
         * Maximum number of repositories to return; between 1 and 500. If not set
         * or zero, defaults to 100 at the server.
         */
        pageSize?: number;
        /**
         * Resume listing repositories where a prior ListReposResponse left off.
         * This is an opaque token that must be obtained from a recent, prior
         * ListReposResponse's next_page_token field.
         */
        pageToken?: string;
    }
    interface Params$Resource$Projects$Repos$Patch extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The name of the requested repository. Values are of the form
         * `projects/<project>/repos/<repo>`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateRepoRequest;
    }
    interface Params$Resource$Projects$Repos$Setiampolicy extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * REQUIRED: The resource for which the policy is being specified. See the
         * operation documentation for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    interface Params$Resource$Projects$Repos$Testiampermissions extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * REQUIRED: The resource for which the policy detail is being requested.
         * See the operation documentation for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
}
