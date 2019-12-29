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
export declare namespace doubleclickbidmanager_v1 {
    interface Options extends GlobalOptions {
        version: 'v1';
    }
    interface StandardParameters {
        /**
         * Data format for the response.
         */
        alt?: string;
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
         * An opaque string that represents a user for quota purposes. Must not
         * exceed 40 characters.
         */
        quotaUser?: string;
        /**
         * Deprecated. Please use quotaUser instead.
         */
        userIp?: string;
    }
    /**
     * DoubleClick Bid Manager API
     *
     * API for viewing and managing your reports in DoubleClick Bid Manager.
     *
     * @example
     * const {google} = require('googleapis');
     * const doubleclickbidmanager = google.doubleclickbidmanager('v1');
     *
     * @namespace doubleclickbidmanager
     * @type {Function}
     * @version v1
     * @variation v1
     * @param {object=} options Options for Doubleclickbidmanager
     */
    class Doubleclickbidmanager {
        context: APIRequestContext;
        lineitems: Resource$Lineitems;
        queries: Resource$Queries;
        reports: Resource$Reports;
        sdf: Resource$Sdf;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Request to fetch stored line items.
     */
    interface Schema$DownloadLineItemsRequest {
        /**
         * File specification (column names, types, order) in which the line items
         * will be returned. Default to EWF.
         */
        fileSpec?: string;
        /**
         * Ids of the specified filter type used to filter line items to fetch. If
         * omitted, all the line items will be returned.
         */
        filterIds?: string[];
        /**
         * Filter type used to filter line items to fetch.
         */
        filterType?: string;
        /**
         * Format in which the line items will be returned. Default to CSV.
         */
        format?: string;
    }
    /**
     * Download line items response.
     */
    interface Schema$DownloadLineItemsResponse {
        /**
         * Retrieved line items in CSV format. For more information about file
         * formats, see  Entity Write File Format.
         */
        lineItems?: string;
    }
    /**
     * Request to fetch stored inventory sources, campaigns, insertion orders,
     * line items, TrueView ad groups and ads.
     */
    interface Schema$DownloadRequest {
        /**
         * File types that will be returned.  Acceptable values are:   -
         * &quot;AD&quot;  - &quot;AD_GROUP&quot;  - &quot;CAMPAIGN&quot;  -
         * &quot;INSERTION_ORDER&quot;  - &quot;LINE_ITEM&quot;  -
         * &quot;INVENTORY_SOURCE&quot;
         */
        fileTypes?: string[];
        /**
         * The IDs of the specified filter type. This is used to filter entities to
         * fetch. At least one ID must be specified.
         */
        filterIds?: string[];
        /**
         * Filter type used to filter entities to fetch.
         */
        filterType?: string;
        /**
         * SDF Version (column names, types, order) in which the entities will be
         * returned. Default to 3.1.
         */
        version?: string;
    }
    /**
     * Download response.
     */
    interface Schema$DownloadResponse {
        /**
         * Retrieved ad groups in SDF format.
         */
        adGroups?: string;
        /**
         * Retrieved ads in SDF format.
         */
        ads?: string;
        /**
         * Retrieved campaigns in SDF format.
         */
        campaigns?: string;
        /**
         * Retrieved insertion orders in SDF format.
         */
        insertionOrders?: string;
        inventorySources?: string;
        /**
         * Retrieved line items in SDF format.
         */
        lineItems?: string;
    }
    /**
     * Filter used to match traffic data in your report.
     */
    interface Schema$FilterPair {
        /**
         * Filter type.
         */
        type?: string;
        /**
         * Filter value.
         */
        value?: string;
    }
    /**
     * List queries response.
     */
    interface Schema$ListQueriesResponse {
        /**
         * Identifies what kind of resource this is. Value: the fixed string
         * &quot;doubleclickbidmanager#listQueriesResponse&quot;.
         */
        kind?: string;
        /**
         * Retrieved queries.
         */
        queries?: Schema$Query[];
    }
    /**
     * List reports response.
     */
    interface Schema$ListReportsResponse {
        /**
         * Identifies what kind of resource this is. Value: the fixed string
         * &quot;doubleclickbidmanager#listReportsResponse&quot;.
         */
        kind?: string;
        /**
         * Retrieved reports.
         */
        reports?: Schema$Report[];
    }
    /**
     * Parameters of a query or report.
     */
    interface Schema$Parameters {
        /**
         * Filters used to match traffic data in your report.
         */
        filters?: Schema$FilterPair[];
        /**
         * Data is grouped by the filters listed in this field.
         */
        groupBys?: string[];
        /**
         * Whether to include data from Invite Media.
         */
        includeInviteData?: boolean;
        /**
         * Metrics to include as columns in your report.
         */
        metrics?: string[];
        /**
         * Report type.
         */
        type?: string;
    }
    /**
     * Represents a query.
     */
    interface Schema$Query {
        /**
         * Identifies what kind of resource this is. Value: the fixed string
         * &quot;doubleclickbidmanager#query&quot;.
         */
        kind?: string;
        /**
         * Query metadata.
         */
        metadata?: Schema$QueryMetadata;
        /**
         * Query parameters.
         */
        params?: Schema$Parameters;
        /**
         * Query ID.
         */
        queryId?: string;
        /**
         * The ending time for the data that is shown in the report. Note,
         * reportDataEndTimeMs is required if metadata.dataRange is CUSTOM_DATES and
         * ignored otherwise.
         */
        reportDataEndTimeMs?: string;
        /**
         * The starting time for the data that is shown in the report. Note,
         * reportDataStartTimeMs is required if metadata.dataRange is CUSTOM_DATES
         * and ignored otherwise.
         */
        reportDataStartTimeMs?: string;
        /**
         * Information on how often and when to run a query.
         */
        schedule?: Schema$QuerySchedule;
        /**
         * Canonical timezone code for report data time. Defaults to
         * America/New_York.
         */
        timezoneCode?: string;
    }
    /**
     * Query metadata.
     */
    interface Schema$QueryMetadata {
        /**
         * Range of report data.
         */
        dataRange?: string;
        /**
         * Format of the generated report.
         */
        format?: string;
        /**
         * The path to the location in Google Cloud Storage where the latest report
         * is stored.
         */
        googleCloudStoragePathForLatestReport?: string;
        /**
         * The path in Google Drive for the latest report.
         */
        googleDrivePathForLatestReport?: string;
        /**
         * The time when the latest report started to run.
         */
        latestReportRunTimeMs?: string;
        /**
         * Locale of the generated reports. Valid values are cs CZECH de GERMAN en
         * ENGLISH es SPANISH fr FRENCH it ITALIAN ja JAPANESE ko KOREAN pl POLISH
         * pt-BR BRAZILIAN_PORTUGUESE ru RUSSIAN tr TURKISH uk UKRAINIAN zh-CN
         * CHINA_CHINESE zh-TW TAIWAN_CHINESE  An locale string not in the list
         * above will generate reports in English.
         */
        locale?: string;
        /**
         * Number of reports that have been generated for the query.
         */
        reportCount?: number;
        /**
         * Whether the latest report is currently running.
         */
        running?: boolean;
        /**
         * Whether to send an email notification when a report is ready. Default to
         * false.
         */
        sendNotification?: boolean;
        /**
         * List of email addresses which are sent email notifications when the
         * report is finished. Separate from sendNotification.
         */
        shareEmailAddress?: string[];
        /**
         * Query title. It is used to name the reports generated from this query.
         */
        title?: string;
    }
    /**
     * Information on how frequently and when to run a query.
     */
    interface Schema$QuerySchedule {
        /**
         * Datetime to periodically run the query until.
         */
        endTimeMs?: string;
        /**
         * How often the query is run.
         */
        frequency?: string;
        /**
         * Time of day at which a new report will be generated, represented as
         * minutes past midnight. Range is 0 to 1439. Only applies to scheduled
         * reports.
         */
        nextRunMinuteOfDay?: number;
        /**
         * Canonical timezone code for report generation time. Defaults to
         * America/New_York.
         */
        nextRunTimezoneCode?: string;
    }
    /**
     * Represents a report.
     */
    interface Schema$Report {
        /**
         * Key used to identify a report.
         */
        key?: Schema$ReportKey;
        /**
         * Report metadata.
         */
        metadata?: Schema$ReportMetadata;
        /**
         * Report parameters.
         */
        params?: Schema$Parameters;
    }
    /**
     * An explanation of a report failure.
     */
    interface Schema$ReportFailure {
        /**
         * Error code that shows why the report was not created.
         */
        errorCode?: string;
    }
    /**
     * Key used to identify a report.
     */
    interface Schema$ReportKey {
        /**
         * Query ID.
         */
        queryId?: string;
        /**
         * Report ID.
         */
        reportId?: string;
    }
    /**
     * Report metadata.
     */
    interface Schema$ReportMetadata {
        /**
         * The path to the location in Google Cloud Storage where the report is
         * stored.
         */
        googleCloudStoragePath?: string;
        /**
         * The ending time for the data that is shown in the report.
         */
        reportDataEndTimeMs?: string;
        /**
         * The starting time for the data that is shown in the report.
         */
        reportDataStartTimeMs?: string;
        /**
         * Report status.
         */
        status?: Schema$ReportStatus;
    }
    /**
     * Report status.
     */
    interface Schema$ReportStatus {
        /**
         * If the report failed, this records the cause.
         */
        failure?: Schema$ReportFailure;
        /**
         * The time when this report either completed successfully or failed.
         */
        finishTimeMs?: string;
        /**
         * The file type of the report.
         */
        format?: string;
        /**
         * The state of the report.
         */
        state?: string;
    }
    /**
     * Represents the upload status of a row in the request.
     */
    interface Schema$RowStatus {
        /**
         * Whether the stored entity is changed as a result of upload.
         */
        changed?: boolean;
        /**
         * Entity Id.
         */
        entityId?: string;
        /**
         * Entity name.
         */
        entityName?: string;
        /**
         * Reasons why the entity can&#39;t be uploaded.
         */
        errors?: string[];
        /**
         * Whether the entity is persisted.
         */
        persisted?: boolean;
        /**
         * Row number.
         */
        rowNumber?: number;
    }
    /**
     * Request to run a stored query to generate a report.
     */
    interface Schema$RunQueryRequest {
        /**
         * Report data range used to generate the report.
         */
        dataRange?: string;
        /**
         * The ending time for the data that is shown in the report. Note,
         * reportDataEndTimeMs is required if dataRange is CUSTOM_DATES and ignored
         * otherwise.
         */
        reportDataEndTimeMs?: string;
        /**
         * The starting time for the data that is shown in the report. Note,
         * reportDataStartTimeMs is required if dataRange is CUSTOM_DATES and
         * ignored otherwise.
         */
        reportDataStartTimeMs?: string;
        /**
         * Canonical timezone code for report data time. Defaults to
         * America/New_York.
         */
        timezoneCode?: string;
    }
    /**
     * Request to upload line items.
     */
    interface Schema$UploadLineItemsRequest {
        /**
         * Set to true to get upload status without actually persisting the line
         * items.
         */
        dryRun?: boolean;
        /**
         * Format the line items are in. Default to CSV.
         */
        format?: string;
        /**
         * Line items in CSV to upload. Refer to  Entity Write File Format for more
         * information on file format.
         */
        lineItems?: string;
    }
    /**
     * Upload line items response.
     */
    interface Schema$UploadLineItemsResponse {
        /**
         * Status of upload.
         */
        uploadStatus?: Schema$UploadStatus;
    }
    /**
     * Represents the status of upload.
     */
    interface Schema$UploadStatus {
        /**
         * Reasons why upload can&#39;t be completed.
         */
        errors?: string[];
        /**
         * Per-row upload status.
         */
        rowStatus?: Schema$RowStatus[];
    }
    class Resource$Lineitems {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * doubleclickbidmanager.lineitems.downloadlineitems
         * @desc Retrieves line items in CSV format. TrueView line items are not
         * supported.
         * @alias doubleclickbidmanager.lineitems.downloadlineitems
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().DownloadLineItemsRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        downloadlineitems(params?: Params$Resource$Lineitems$Downloadlineitems, options?: MethodOptions): GaxiosPromise<Schema$DownloadLineItemsResponse>;
        downloadlineitems(params: Params$Resource$Lineitems$Downloadlineitems, options: MethodOptions | BodyResponseCallback<Schema$DownloadLineItemsResponse>, callback: BodyResponseCallback<Schema$DownloadLineItemsResponse>): void;
        downloadlineitems(params: Params$Resource$Lineitems$Downloadlineitems, callback: BodyResponseCallback<Schema$DownloadLineItemsResponse>): void;
        downloadlineitems(callback: BodyResponseCallback<Schema$DownloadLineItemsResponse>): void;
        /**
         * doubleclickbidmanager.lineitems.uploadlineitems
         * @desc Uploads line items in CSV format. TrueView line items are not
         * supported.
         * @alias doubleclickbidmanager.lineitems.uploadlineitems
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().UploadLineItemsRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        uploadlineitems(params?: Params$Resource$Lineitems$Uploadlineitems, options?: MethodOptions): GaxiosPromise<Schema$UploadLineItemsResponse>;
        uploadlineitems(params: Params$Resource$Lineitems$Uploadlineitems, options: MethodOptions | BodyResponseCallback<Schema$UploadLineItemsResponse>, callback: BodyResponseCallback<Schema$UploadLineItemsResponse>): void;
        uploadlineitems(params: Params$Resource$Lineitems$Uploadlineitems, callback: BodyResponseCallback<Schema$UploadLineItemsResponse>): void;
        uploadlineitems(callback: BodyResponseCallback<Schema$UploadLineItemsResponse>): void;
    }
    interface Params$Resource$Lineitems$Downloadlineitems extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DownloadLineItemsRequest;
    }
    interface Params$Resource$Lineitems$Uploadlineitems extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UploadLineItemsRequest;
    }
    class Resource$Queries {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * doubleclickbidmanager.queries.createquery
         * @desc Creates a query.
         * @alias doubleclickbidmanager.queries.createquery
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().Query} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        createquery(params?: Params$Resource$Queries$Createquery, options?: MethodOptions): GaxiosPromise<Schema$Query>;
        createquery(params: Params$Resource$Queries$Createquery, options: MethodOptions | BodyResponseCallback<Schema$Query>, callback: BodyResponseCallback<Schema$Query>): void;
        createquery(params: Params$Resource$Queries$Createquery, callback: BodyResponseCallback<Schema$Query>): void;
        createquery(callback: BodyResponseCallback<Schema$Query>): void;
        /**
         * doubleclickbidmanager.queries.deletequery
         * @desc Deletes a stored query as well as the associated stored reports.
         * @alias doubleclickbidmanager.queries.deletequery
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.queryId Query ID to delete.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        deletequery(params?: Params$Resource$Queries$Deletequery, options?: MethodOptions): GaxiosPromise<void>;
        deletequery(params: Params$Resource$Queries$Deletequery, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        deletequery(params: Params$Resource$Queries$Deletequery, callback: BodyResponseCallback<void>): void;
        deletequery(callback: BodyResponseCallback<void>): void;
        /**
         * doubleclickbidmanager.queries.getquery
         * @desc Retrieves a stored query.
         * @alias doubleclickbidmanager.queries.getquery
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.queryId Query ID to retrieve.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getquery(params?: Params$Resource$Queries$Getquery, options?: MethodOptions): GaxiosPromise<Schema$Query>;
        getquery(params: Params$Resource$Queries$Getquery, options: MethodOptions | BodyResponseCallback<Schema$Query>, callback: BodyResponseCallback<Schema$Query>): void;
        getquery(params: Params$Resource$Queries$Getquery, callback: BodyResponseCallback<Schema$Query>): void;
        getquery(callback: BodyResponseCallback<Schema$Query>): void;
        /**
         * doubleclickbidmanager.queries.listqueries
         * @desc Retrieves stored queries.
         * @alias doubleclickbidmanager.queries.listqueries
         * @memberOf! ()
         *
         * @param {object=} params Parameters for request
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        listqueries(params?: Params$Resource$Queries$Listqueries, options?: MethodOptions): GaxiosPromise<Schema$ListQueriesResponse>;
        listqueries(params: Params$Resource$Queries$Listqueries, options: MethodOptions | BodyResponseCallback<Schema$ListQueriesResponse>, callback: BodyResponseCallback<Schema$ListQueriesResponse>): void;
        listqueries(params: Params$Resource$Queries$Listqueries, callback: BodyResponseCallback<Schema$ListQueriesResponse>): void;
        listqueries(callback: BodyResponseCallback<Schema$ListQueriesResponse>): void;
        /**
         * doubleclickbidmanager.queries.runquery
         * @desc Runs a stored query to generate a report.
         * @alias doubleclickbidmanager.queries.runquery
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.queryId Query ID to run.
         * @param {().RunQueryRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        runquery(params?: Params$Resource$Queries$Runquery, options?: MethodOptions): GaxiosPromise<void>;
        runquery(params: Params$Resource$Queries$Runquery, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        runquery(params: Params$Resource$Queries$Runquery, callback: BodyResponseCallback<void>): void;
        runquery(callback: BodyResponseCallback<void>): void;
    }
    interface Params$Resource$Queries$Createquery extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Query;
    }
    interface Params$Resource$Queries$Deletequery extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Query ID to delete.
         */
        queryId?: string;
    }
    interface Params$Resource$Queries$Getquery extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Query ID to retrieve.
         */
        queryId?: string;
    }
    interface Params$Resource$Queries$Listqueries extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
    }
    interface Params$Resource$Queries$Runquery extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Query ID to run.
         */
        queryId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunQueryRequest;
    }
    class Resource$Reports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * doubleclickbidmanager.reports.listreports
         * @desc Retrieves stored reports.
         * @alias doubleclickbidmanager.reports.listreports
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.queryId Query ID with which the reports are associated.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        listreports(params?: Params$Resource$Reports$Listreports, options?: MethodOptions): GaxiosPromise<Schema$ListReportsResponse>;
        listreports(params: Params$Resource$Reports$Listreports, options: MethodOptions | BodyResponseCallback<Schema$ListReportsResponse>, callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
        listreports(params: Params$Resource$Reports$Listreports, callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
        listreports(callback: BodyResponseCallback<Schema$ListReportsResponse>): void;
    }
    interface Params$Resource$Reports$Listreports extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Query ID with which the reports are associated.
         */
        queryId?: string;
    }
    class Resource$Sdf {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * doubleclickbidmanager.sdf.download
         * @desc Retrieves entities in SDF format.
         * @alias doubleclickbidmanager.sdf.download
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().DownloadRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        download(params?: Params$Resource$Sdf$Download, options?: MethodOptions): GaxiosPromise<Schema$DownloadResponse>;
        download(params: Params$Resource$Sdf$Download, options: MethodOptions | BodyResponseCallback<Schema$DownloadResponse>, callback: BodyResponseCallback<Schema$DownloadResponse>): void;
        download(params: Params$Resource$Sdf$Download, callback: BodyResponseCallback<Schema$DownloadResponse>): void;
        download(callback: BodyResponseCallback<Schema$DownloadResponse>): void;
    }
    interface Params$Resource$Sdf$Download extends StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DownloadRequest;
    }
}
