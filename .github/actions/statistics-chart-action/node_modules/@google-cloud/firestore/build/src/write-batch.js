"use strict";
/*!
 * Copyright 2019 Google Inc. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const document_1 = require("./document");
const logger_1 = require("./logger");
const path_1 = require("./path");
const reference_1 = require("./reference");
const serializer_1 = require("./serializer");
const timestamp_1 = require("./timestamp");
const util_1 = require("./util");
const validate_1 = require("./validate");
/*!
 * Google Cloud Functions terminates idle connections after two minutes. After
 * longer periods of idleness, we issue transactional commits to allow for
 * retries.
 */
const GCF_IDLE_TIMEOUT_MS = 110 * 1000;
/**
 * A WriteResult wraps the write time set by the Firestore servers on sets(),
 * updates(), and creates().
 *
 * @class
 */
class WriteResult {
    /**
     * @hideconstructor
     *
     * @param _writeTime The time of the corresponding document write.
     */
    constructor(_writeTime) {
        this._writeTime = _writeTime;
    }
    /**
     * The write time as set by the Firestore servers.
     *
     * @type {Timestamp}
     * @name WriteResult#writeTime
     * @readonly
     *
     * @example
     * let documentRef = firestore.doc('col/doc');
     *
     * documentRef.set({foo: 'bar'}).then(writeResult => {
     *   console.log(`Document written at: ${writeResult.writeTime.toDate()}`);
     * });
     */
    get writeTime() {
        return this._writeTime;
    }
    /**
     * Returns true if this `WriteResult` is equal to the provided value.
     *
     * @param {*} other The value to compare against.
     * @return true if this `WriteResult` is equal to the provided value.
     */
    isEqual(other) {
        return (this === other ||
            (other instanceof WriteResult &&
                this._writeTime.isEqual(other._writeTime)));
    }
}
exports.WriteResult = WriteResult;
/**
 * A Firestore WriteBatch that can be used to atomically commit multiple write
 * operations at once.
 *
 * @class
 */
class WriteBatch {
    /**
     * @hideconstructor
     *
     * @param firestore The Firestore Database client.
     */
    constructor(firestore) {
        /**
         * An array of write operations that are executed as part of the commit. The
         * resulting `api.IWrite` will be sent to the backend.
         * @private
         */
        this._ops = [];
        this._committed = false;
        this._firestore = firestore;
        this._serializer = new serializer_1.Serializer(firestore);
    }
    /**
     * Checks if this write batch has any pending operations.
     *
     * @private
     */
    get isEmpty() {
        return this._ops.length === 0;
    }
    /**
     * Throws an error if this batch has already been committed.
     *
     * @private
     */
    verifyNotCommitted() {
        if (this._committed) {
            throw new Error('Cannot modify a WriteBatch that has been committed.');
        }
    }
    /**
     * Create a document with the provided object values. This will fail the batch
     * if a document exists at its location.
     *
     * @param {DocumentReference} documentRef A reference to the document to be
     * created.
     * @param {DocumentData} data The object to serialize as the document.
     * @returns {WriteBatch} This WriteBatch instance. Used for chaining
     * method calls.
     *
     * @example
     * let writeBatch = firestore.batch();
     * let documentRef = firestore.collection('col').doc();
     *
     * writeBatch.create(documentRef, {foo: 'bar'});
     *
     * writeBatch.commit().then(() => {
     *   console.log('Successfully executed batch.');
     * });
     */
    create(documentRef, data) {
        reference_1.validateDocumentReference('documentRef', documentRef);
        validateDocumentData('data', data, /* allowDeletes= */ false);
        this.verifyNotCommitted();
        const transform = document_1.DocumentTransform.fromObject(documentRef, data);
        transform.validate();
        const precondition = new document_1.Precondition({ exists: false });
        const op = () => {
            const document = document_1.DocumentSnapshot.fromObject(documentRef, data);
            const write = !document.isEmpty || transform.isEmpty ? document.toProto() : null;
            return {
                write,
                transform: transform.toProto(this._serializer),
                precondition: precondition.toProto(),
            };
        };
        this._ops.push(op);
        return this;
    }
    /**
     * Deletes a document from the database.
     *
     * @param {DocumentReference} documentRef A reference to the document to be
     * deleted.
     * @param {Precondition=} precondition A precondition to enforce for this
     * delete.
     * @param {Timestamp=} precondition.lastUpdateTime If set, enforces that the
     * document was last updated at lastUpdateTime. Fails the batch if the
     * document doesn't exist or was last updated at a different time.
     * @returns {WriteBatch} This WriteBatch instance. Used for chaining
     * method calls.
     *
     * @example
     * let writeBatch = firestore.batch();
     * let documentRef = firestore.doc('col/doc');
     *
     * writeBatch.delete(documentRef);
     *
     * writeBatch.commit().then(() => {
     *   console.log('Successfully executed batch.');
     * });
     */
    delete(documentRef, precondition) {
        reference_1.validateDocumentReference('documentRef', documentRef);
        validateDeletePrecondition('precondition', precondition, { optional: true });
        this.verifyNotCommitted();
        const conditions = new document_1.Precondition(precondition);
        const op = () => {
            return {
                write: {
                    delete: documentRef.formattedName,
                },
                precondition: conditions.toProto(),
            };
        };
        this._ops.push(op);
        return this;
    }
    /**
     * Write to the document referred to by the provided
     * [DocumentReference]{@link DocumentReference}.
     * If the document does not exist yet, it will be created. If you pass
     * [SetOptions]{@link SetOptions}., the provided data can be merged
     * into the existing document.
     *
     * @param {DocumentReference} documentRef A reference to the document to be
     * set.
     * @param {DocumentData} data The object to serialize as the document.
     * @param {SetOptions=} options An object to configure the set behavior.
     * @param {boolean=} options.merge - If true, set() merges the values
     * specified in its data argument. Fields omitted from this set() call
     * remain untouched.
     * @param {Array.<string|FieldPath>=} options.mergeFields - If provided,
     * set() only replaces the specified field paths. Any field path that is not
     * specified is ignored and remains untouched.
     * @returns {WriteBatch} This WriteBatch instance. Used for chaining
     * method calls.
     *
     * @example
     * let writeBatch = firestore.batch();
     * let documentRef = firestore.doc('col/doc');
     *
     * writeBatch.set(documentRef, {foo: 'bar'});
     *
     * writeBatch.commit().then(() => {
     *   console.log('Successfully executed batch.');
     * });
     */
    set(documentRef, data, options) {
        validateSetOptions('options', options, { optional: true });
        const mergeLeaves = options && options.merge === true;
        const mergePaths = options && options.mergeFields;
        reference_1.validateDocumentReference('documentRef', documentRef);
        validateDocumentData('data', data, 
        /* allowDeletes= */ !!(mergePaths || mergeLeaves));
        this.verifyNotCommitted();
        let documentMask;
        if (mergePaths) {
            documentMask = document_1.DocumentMask.fromFieldMask(options.mergeFields);
            data = documentMask.applyTo(data);
        }
        const transform = document_1.DocumentTransform.fromObject(documentRef, data);
        transform.validate();
        const op = () => {
            const document = document_1.DocumentSnapshot.fromObject(documentRef, data);
            if (mergePaths) {
                documentMask.removeFields(transform.fields);
            }
            else {
                documentMask = document_1.DocumentMask.fromObject(data);
            }
            const hasDocumentData = !document.isEmpty || !documentMask.isEmpty;
            let write;
            if (!mergePaths && !mergeLeaves) {
                write = document.toProto();
            }
            else if (hasDocumentData || transform.isEmpty) {
                write = document.toProto();
                write.updateMask = documentMask.toProto();
            }
            return {
                write,
                transform: transform.toProto(this._serializer),
            };
        };
        this._ops.push(op);
        return this;
    }
    /**
     * Update fields of the document referred to by the provided
     * [DocumentReference]{@link DocumentReference}. If the document
     * doesn't yet exist, the update fails and the entire batch will be rejected.
     *
     * The update() method accepts either an object with field paths encoded as
     * keys and field values encoded as values, or a variable number of arguments
     * that alternate between field paths and field values. Nested fields can be
     * updated by providing dot-separated field path strings or by providing
     * FieldPath objects.
     *
     * A Precondition restricting this update can be specified as the last
     * argument.
     *
     * @param {DocumentReference} documentRef A reference to the document to be
     * updated.
     * @param {UpdateData|string|FieldPath} dataOrField An object
     * containing the fields and values with which to update the document
     * or the path of the first field to update.
     * @param {
     * ...(Precondition|*|string|FieldPath)} preconditionOrValues -
     * An alternating list of field paths and values to update or a Precondition
     * to restrict this update.
     * @returns {WriteBatch} This WriteBatch instance. Used for chaining
     * method calls.
     *
     * @example
     * let writeBatch = firestore.batch();
     * let documentRef = firestore.doc('col/doc');
     *
     * writeBatch.update(documentRef, {foo: 'bar'});
     *
     * writeBatch.commit().then(() => {
     *   console.log('Successfully executed batch.');
     * });
     */
    update(documentRef, dataOrField, ...preconditionOrValues) {
        validate_1.validateMinNumberOfArguments('WriteBatch.update', arguments, 2);
        reference_1.validateDocumentReference('documentRef', documentRef);
        this.verifyNotCommitted();
        const updateMap = new Map();
        let precondition = new document_1.Precondition({ exists: true });
        const argumentError = 'Update() requires either a single JavaScript ' +
            'object or an alternating list of field/value pairs that can be ' +
            'followed by an optional precondition.';
        const usesVarargs = typeof dataOrField === 'string' || dataOrField instanceof path_1.FieldPath;
        if (usesVarargs) {
            try {
                for (let i = 1; i < arguments.length; i += 2) {
                    if (i === arguments.length - 1) {
                        validateUpdatePrecondition(i, arguments[i]);
                        precondition = new document_1.Precondition(arguments[i]);
                    }
                    else {
                        path_1.validateFieldPath(i, arguments[i]);
                        // Unlike the `validateMinNumberOfArguments` invocation above, this
                        // validation can be triggered both from `WriteBatch.update()` and
                        // `DocumentReference.update()`. Hence, we don't use the fully
                        // qualified API name in the error message.
                        validate_1.validateMinNumberOfArguments('update', arguments, i + 1);
                        const fieldPath = path_1.FieldPath.fromArgument(arguments[i]);
                        validateFieldValue(i, arguments[i + 1], fieldPath);
                        updateMap.set(fieldPath, arguments[i + 1]);
                    }
                }
            }
            catch (err) {
                logger_1.logger('WriteBatch.update', null, 'Varargs validation failed:', err);
                // We catch the validation error here and re-throw to provide a better
                // error message.
                throw new Error(`${argumentError} ${err.message}`);
            }
        }
        else {
            try {
                validateUpdateMap('dataOrField', dataOrField);
                validate_1.validateMaxNumberOfArguments('update', arguments, 3);
                const data = dataOrField;
                Object.keys(data).forEach(key => {
                    path_1.validateFieldPath(key, key);
                    updateMap.set(path_1.FieldPath.fromArgument(key), data[key]);
                });
                if (preconditionOrValues.length > 0) {
                    validateUpdatePrecondition('preconditionOrValues', preconditionOrValues[0]);
                    precondition = new document_1.Precondition(preconditionOrValues[0]);
                }
            }
            catch (err) {
                logger_1.logger('WriteBatch.update', null, 'Non-varargs validation failed:', err);
                // We catch the validation error here and prefix the error with a custom
                // message to describe the usage of update() better.
                throw new Error(`${argumentError} ${err.message}`);
            }
        }
        validateNoConflictingFields('dataOrField', updateMap);
        const transform = document_1.DocumentTransform.fromUpdateMap(documentRef, updateMap);
        transform.validate();
        const documentMask = document_1.DocumentMask.fromUpdateMap(updateMap);
        const op = () => {
            const document = document_1.DocumentSnapshot.fromUpdateMap(documentRef, updateMap);
            let write = null;
            if (!document.isEmpty || !documentMask.isEmpty) {
                write = document.toProto();
                write.updateMask = documentMask.toProto();
            }
            return {
                write,
                transform: transform.toProto(this._serializer),
                precondition: precondition.toProto(),
            };
        };
        this._ops.push(op);
        return this;
    }
    /**
     * Atomically commits all pending operations to the database and verifies all
     * preconditions. Fails the entire write if any precondition is not met.
     *
     * @returns {Promise.<Array.<WriteResult>>} A Promise that resolves
     * when this batch completes.
     *
     * @example
     * let writeBatch = firestore.batch();
     * let documentRef = firestore.doc('col/doc');
     *
     * writeBatch.set(documentRef, {foo: 'bar'});
     *
     * writeBatch.commit().then(() => {
     *   console.log('Successfully executed batch.');
     * });
     */
    commit() {
        return this.commit_();
    }
    /**
     * Commit method that takes an optional transaction ID.
     *
     * @private
     * @param commitOptions Options to use for this commit.
     * @param commitOptions.transactionId The transaction ID of this commit.
     * @param commitOptions.requestTag A unique client-assigned identifier for
     * this request.
     * @returns  A Promise that resolves when this batch completes.
     */
    async commit_(commitOptions) {
        // Note: We don't call `verifyNotCommitted()` to allow for retries.
        this._committed = true;
        const tag = (commitOptions && commitOptions.requestTag) || util_1.requestTag();
        await this._firestore.initializeIfNeeded(tag);
        const database = this._firestore.formattedName;
        const request = { database };
        // On GCF, we periodically force transactional commits to allow for
        // request retries in case GCF closes our backend connection.
        const explicitTransaction = commitOptions && commitOptions.transactionId;
        if (!explicitTransaction && this._shouldCreateTransaction()) {
            logger_1.logger('WriteBatch.commit', tag, 'Using transaction for commit');
            return this._firestore
                .request('beginTransaction', request, tag, true)
                .then(resp => {
                return this.commit_({ transactionId: resp.transaction });
            });
        }
        const writes = this._ops.map(op => op());
        request.writes = [];
        for (const req of writes) {
            assert(req.write || req.transform, 'Either a write or transform must be set');
            if (req.precondition) {
                (req.write || req.transform).currentDocument = req.precondition;
            }
            if (req.write) {
                request.writes.push(req.write);
            }
            if (req.transform) {
                request.writes.push(req.transform);
            }
        }
        logger_1.logger('WriteBatch.commit', tag, 'Sending %d writes', request.writes.length);
        if (explicitTransaction) {
            request.transaction = explicitTransaction;
        }
        return this._firestore
            .request('commit', request, tag, 
        /* allowRetries= */ false)
            .then(resp => {
            const writeResults = [];
            if (request.writes.length > 0) {
                assert(Array.isArray(resp.writeResults) &&
                    request.writes.length === resp.writeResults.length, `Expected one write result per operation, but got ${resp.writeResults.length} results for ${request.writes.length} operations.`);
                const commitTime = timestamp_1.Timestamp.fromProto(resp.commitTime);
                let offset = 0;
                for (let i = 0; i < writes.length; ++i) {
                    const writeRequest = writes[i];
                    // Don't return two write results for a write that contains a
                    // transform, as the fact that we have to split one write
                    // operation into two distinct write requests is an implementation
                    // detail.
                    if (writeRequest.write && writeRequest.transform) {
                        // The document transform is always sent last and produces the
                        // latest update time.
                        ++offset;
                    }
                    const writeResult = resp.writeResults[i + offset];
                    writeResults.push(new WriteResult(writeResult.updateTime
                        ? timestamp_1.Timestamp.fromProto(writeResult.updateTime)
                        : commitTime));
                }
            }
            return writeResults;
        });
    }
    /**
     * Determines whether we should issue a transactional commit. On GCF, this
     * happens after two minutes of idleness.
     *
     * @private
     * @returns Whether to use a transaction.
     */
    _shouldCreateTransaction() {
        if (!this._firestore._preferTransactions) {
            return false;
        }
        if (this._firestore._lastSuccessfulRequest) {
            const now = new Date().getTime();
            return now - this._firestore._lastSuccessfulRequest > GCF_IDLE_TIMEOUT_MS;
        }
        return true;
    }
}
exports.WriteBatch = WriteBatch;
/**
 * Validates the use of 'value' as a Precondition and enforces that 'exists'
 * and 'lastUpdateTime' use valid types.
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param value The object to validate
 * @param allowExists Whether to allow the 'exists' preconditions.
 */
function validatePrecondition(arg, value, allowExists) {
    if (typeof value !== 'object' || value === null) {
        throw new Error('Input is not an object.');
    }
    const precondition = value;
    let conditions = 0;
    if (precondition.exists !== undefined) {
        ++conditions;
        if (!allowExists) {
            throw new Error(`${validate_1.invalidArgumentMessage(arg, 'precondition')} "exists" is not an allowed precondition.`);
        }
        if (typeof precondition.exists !== 'boolean') {
            throw new Error(`${validate_1.invalidArgumentMessage(arg, 'precondition')} "exists" is not a boolean.'`);
        }
    }
    if (precondition.lastUpdateTime !== undefined) {
        ++conditions;
        if (!(precondition.lastUpdateTime instanceof timestamp_1.Timestamp)) {
            throw new Error(`${validate_1.invalidArgumentMessage(arg, 'precondition')} "lastUpdateTime" is not a Firestore Timestamp.`);
        }
    }
    if (conditions > 1) {
        throw new Error(`${validate_1.invalidArgumentMessage(arg, 'precondition')} Input specifies more than one precondition.`);
    }
}
/**
 * Validates the use of 'value' as an update Precondition.
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param value The object to validate.
 * @param options Optional validation options specifying whether the value can
 * be omitted.
 */
function validateUpdatePrecondition(arg, value, options) {
    if (!validate_1.validateOptional(value, options)) {
        validatePrecondition(arg, value, /* allowExists= */ false);
    }
}
/**
 * Validates the use of 'value' as a delete Precondition.
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param value The object to validate.
 * @param options Optional validation options specifying whether the value can
 * be omitted.
 */
function validateDeletePrecondition(arg, value, options) {
    if (!validate_1.validateOptional(value, options)) {
        validatePrecondition(arg, value, /* allowExists= */ true);
    }
}
/**
 * Validates the use of 'value' as SetOptions and enforces that 'merge' is a
 * boolean.
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param value The object to validate.
 * @param options Optional validation options specifying whether the value can
 * be omitted.
 * @throws if the input is not a valid SetOptions object.
 */
function validateSetOptions(arg, value, options) {
    if (!validate_1.validateOptional(value, options)) {
        if (!util_1.isObject(value)) {
            throw new Error(`${validate_1.invalidArgumentMessage(arg, 'set() options argument')} Input is not an object.`);
        }
        const setOptions = value;
        if ('merge' in setOptions && typeof setOptions.merge !== 'boolean') {
            throw new Error(`${validate_1.invalidArgumentMessage(arg, 'set() options argument')} "merge" is not a boolean.`);
        }
        if ('mergeFields' in setOptions) {
            if (!Array.isArray(setOptions.mergeFields)) {
                throw new Error(`${validate_1.invalidArgumentMessage(arg, 'set() options argument')} "mergeFields" is not an array.`);
            }
            for (let i = 0; i < setOptions.mergeFields.length; ++i) {
                try {
                    path_1.validateFieldPath(i, setOptions.mergeFields[i]);
                }
                catch (err) {
                    throw new Error(`${validate_1.invalidArgumentMessage(arg, 'set() options argument')} "mergeFields" is not valid: ${err.message}`);
                }
            }
        }
        if ('merge' in setOptions && 'mergeFields' in setOptions) {
            throw new Error(`${validate_1.invalidArgumentMessage(arg, 'set() options argument')} You cannot specify both "merge" and "mergeFields".`);
        }
    }
}
exports.validateSetOptions = validateSetOptions;
/**
 * Validates a JavaScript object for usage as a Firestore document.
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param obj JavaScript object to validate.
 * @param allowDeletes Whether to allow FieldValue.delete() sentinels.
 * @throws when the object is invalid.
 */
function validateDocumentData(arg, obj, allowDeletes) {
    if (!serializer_1.isPlainObject(obj)) {
        throw new Error(validate_1.customObjectMessage(arg, obj));
    }
    for (const prop of Object.keys(obj)) {
        serializer_1.validateUserInput(arg, obj[prop], 'Firestore document', {
            allowDeletes: allowDeletes ? 'all' : 'none',
            allowTransforms: true,
        }, new path_1.FieldPath(prop));
    }
}
exports.validateDocumentData = validateDocumentData;
/**
 * Validates that a value can be used as field value during an update.
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param val The value to verify.
 * @param path The path to show in the error message.
 */
function validateFieldValue(arg, val, path) {
    serializer_1.validateUserInput(arg, val, 'Firestore value', { allowDeletes: 'root', allowTransforms: true }, path);
}
exports.validateFieldValue = validateFieldValue;
/**
 * Validates that the update data does not contain any ambiguous field
 * definitions (such as 'a.b' and 'a').
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param data An update map with field/value pairs.
 */
function validateNoConflictingFields(arg, data) {
    const fields = [];
    data.forEach((value, key) => {
        fields.push(key);
    });
    fields.sort((left, right) => left.compareTo(right));
    for (let i = 1; i < fields.length; ++i) {
        if (fields[i - 1].isPrefixOf(fields[i])) {
            throw new Error(`${validate_1.invalidArgumentMessage(arg, 'update map')} Field "${fields[i - 1]}" was specified multiple times.`);
        }
    }
}
/**
 * Validates that a JavaScript object is a map of field paths to field values.
 *
 * @private
 * @param arg The argument name or argument index (for varargs methods).
 * @param obj JavaScript object to validate.
 * @throws when the object is invalid.
 */
function validateUpdateMap(arg, obj) {
    if (!serializer_1.isPlainObject(obj)) {
        throw new Error(validate_1.customObjectMessage(arg, obj));
    }
    let isEmpty = true;
    if (obj) {
        for (const prop of Object.keys(obj)) {
            isEmpty = false;
            validateFieldValue(arg, obj[prop], new path_1.FieldPath(prop));
        }
    }
    if (isEmpty) {
        throw new Error('At least one field must be updated.');
    }
}
//# sourceMappingURL=write-batch.js.map