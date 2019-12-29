"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const call_1 = require("../call");
/**
 * Creates an API caller for regular unary methods.
 */
class NormalApiCaller {
    init(settings, callback) {
        if (callback) {
            return new call_1.OngoingCall(callback);
        }
        return new call_1.OngoingCallPromise(settings.promise);
    }
    wrap(func) {
        return func;
    }
    call(apiCall, argument, settings, canceller) {
        canceller.call(apiCall, argument);
    }
    fail(canceller, err) {
        canceller.callback(err);
    }
    result(canceller) {
        return canceller.promise;
    }
}
exports.NormalApiCaller = NormalApiCaller;
//# sourceMappingURL=normalApiCaller.js.map