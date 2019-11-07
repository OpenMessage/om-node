"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
var Joi = __importStar(require("@hapi/joi"));
var wreck_1 = __importDefault(require("@hapi/wreck"));
var AuthStatus;
(function (AuthStatus) {
    AuthStatus[AuthStatus["Unauthorized"] = 0] = "Unauthorized";
    AuthStatus[AuthStatus["Authorizing"] = 1] = "Authorizing";
    AuthStatus[AuthStatus["Authorized"] = 2] = "Authorized";
})(AuthStatus || (AuthStatus = {}));
var internals = {
    phone: /^\+(?:[0-9]?){6,14}[0-9]$/
};
var schemas = {
    createContact: Joi.object({
        phone: Joi.string().regex(internals.phone).required()
    }).required()
};
var wreck = wreck_1.default.defaults({
    json: true
});
var requestBuffer = [];
var OM = /** @class */ (function () {
    function OM(apiKey, apiSecret, baseUrl) {
        var _this = this;
        if (!apiKey || !apiSecret) {
            throw new Error('credentials are required');
        }
        this.baseUrl = baseUrl || 'https://api.omsg.io';
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.authstatus = AuthStatus.Authorizing;
        this.authorize().then(function (token) {
            _this.token = token;
            _this.authstatus = AuthStatus.Authorized;
        });
    }
    OM.prototype.untilAuthorizationIsDone = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var checker = setInterval(function () {
                if (AuthStatus.Authorized === _this.authstatus) {
                    clearInterval(checker);
                    resolve(true);
                }
            }, 100);
        });
    };
    OM.prototype.createContact = function (contact) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Joi.assert(contact, schemas.createContact, '[OM] Create Contact', { allowUnknown: true });
                        if (!(AuthStatus.Authorizing === this.authstatus)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.untilAuthorizationIsDone()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, wreck.post(this.baseUrl + "/contacts", {
                            payload: contact,
                            headers: {
                                authorization: "Bearer " + this.token
                            }
                        })];
                    case 3:
                        payload = (_a.sent()).payload;
                        return [2 /*return*/, payload];
                }
            });
        });
    };
    ;
    OM.prototype.authorize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wreck.post(this.baseUrl + "/auth/token", {
                            payload: {
                                apiKey: this.apiKey,
                                apiSecret: this.apiSecret
                            }
                        })];
                    case 1:
                        payload = (_a.sent()).payload;
                        if (payload.accessToken) {
                            this.token = payload.accessToken;
                            console.log('[OM] - Authorized', payload.accessToken);
                        }
                        return [2 /*return*/, payload.accessToken];
                }
            });
        });
    };
    ;
    return OM;
}());
exports.OM = OM;
;
//# sourceMappingURL=index.js.map