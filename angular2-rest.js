/*

angular2-rest
(c) Domonkos Pal
License: MIT

Table of Contents:

- interface IRequest
- interface IResponse
- class RESTClient

- Class Decorators:
    @BaseUrl(String)
    @DefaultHeaders(Object)

- Method Decorators:
    @GET(url: String)
    @POST(url: String)
    @PUT(url: String)
    @DELETE(url: String)
    @Headers(object)

- Parameter Decorators:
    @Path(string)
    @Query(string)
    @Header(string)
    @Body

*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var angular2_1 = require('angular2/angular2');
var http_1 = require('angular2/http');
/**
* Angular 2 RESTClient class.
*
* @class RESTClient
* @constructor
*/
var RESTClient = (function () {
    function RESTClient(http) {
        this.http = http;
    }
    RESTClient.prototype.getBaseUrl = function () {
        return null;
    };
    ;
    RESTClient.prototype.getDefaultHeaders = function () {
        return null;
    };
    ;
    /**
    * Request Interceptor
    *
    * @method requestInterceptor
    * @param {IRequest} req - request object
    */
    RESTClient.prototype.requestInterceptor = function (req) {
    };
    /**
    * Response Interceptor
    * NOT IMPLEMENTED YET!
    *
    * @method responseInterceptor
    * @param {IResponse} resp - response object
    */
    RESTClient.prototype.responseInterceptor = function (resp) {
        // TODO
        throw new Error("Not implemented yet!");
    };
    RESTClient = __decorate([
        __param(0, angular2_1.Inject(http_1.Http)), 
        __metadata('design:paramtypes', [http_1.Http])
    ], RESTClient);
    return RESTClient;
})();
exports.RESTClient = RESTClient;
/**
 * Set the base URL of REST resource
 * @param {String} url - base URL
 */
function BaseUrl(url) {
    return function (Target) {
        Target.prototype.getBaseUrl = function () {
            return url;
        };
        return Target;
    };
}
exports.BaseUrl = BaseUrl;
/**
 * Set default headers for every method of the RESTClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
function DefaultHeaders(headers) {
    return function (Target) {
        Target.prototype.getDefaultHeaders = function () {
            return headers;
        };
        return Target;
    };
}
exports.DefaultHeaders = DefaultHeaders;
function paramBuilder(paramName) {
    return function (key) {
        return function (target, propertyKey, parameterIndex) {
            var metadataKey = propertyKey + "_" + paramName + "_parameters";
            var paramObj = {
                parameterIndex: parameterIndex,
                key: key
            };
            if (Array.isArray(target[metadataKey])) {
                target[metadataKey].push(paramObj);
            }
            else {
                target[metadataKey] = [paramObj];
            }
        };
    };
}
/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
exports.Path = paramBuilder("Path");
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
exports.Query = paramBuilder("Query");
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
exports.Body = paramBuilder("Body")("Body");
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
exports.Header = paramBuilder("Header");
/**
 * Set custom headers for a REST method
 * @param {Object} headersDef - custom headers in a key-value pair
 */
function Headers(headersDef) {
    return function (target, propertyKey, descriptor) {
        descriptor.headers = headersDef;
        return descriptor;
    };
}
exports.Headers = Headers;
function methodBuilder(name) {
    return function (url) {
        return function (target, propertyKey, descriptor) {
            var pPath = target[(propertyKey + "_Path_parameters")];
            var pQuery = target[(propertyKey + "_Query_parameters")];
            var pBody = target[(propertyKey + "_Body_parameters")];
            var pHeader = target[(propertyKey + "_Header_parameters")];
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                //Body
                var body = null;
                if (pBody) {
                    body = JSON.stringify(args[pBody[0].parameterIndex]);
                }
                // Path
                var resUrl = url;
                if (pPath) {
                    for (k in pPath) {
                        resUrl = resUrl.replace("{" + pPath[k].key + "}", args[pPath[k].parameterIndex]);
                    }
                }
                // Query
                var queryString = "";
                if (pQuery) {
                    queryString = pQuery
                        .filter(function (p) { return args[p.parameterIndex]; })
                        .map(function (p) {
                        var key = encodeURIComponent(p.key);
                        var value = encodeURIComponent(JSON.stringify(args[p.parameterIndex]));
                        return key + '=' + value;
                    })
                        .join('&');
                }
                if (queryString) {
                    queryString = "?" + queryString;
                }
                resUrl = resUrl + queryString;
                // Headers
                var headers = new http_1.Headers();
                var defaultHeadersDef = this.getDefaultHeaders();
                for (var k in defaultHeadersDef) {
                    headers.append(k, defaultHeadersDef[k]);
                }
                for (var k in descriptor.headers) {
                    headers.append(k, descriptor.headers[k]);
                }
                if (pHeader) {
                    for (var k in pHeader) {
                        headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                    }
                }
                var self = this;
                return new Promise(function (resolve, reject) {
                    var req = {
                        url: self.getBaseUrl() + resUrl,
                        headers: headers,
                        body: body
                    };
                    self.requestInterceptor(req);
                    if (name === "post" || name === "put") {
                        self.http[name](req.url, req.body, {
                            'headers': req.headers
                        }).subscribe(function (res) {
                            resolve(res.json());
                        });
                    }
                    else {
                        self.http[name](req.url, {
                            'headers': req.headers
                        }).subscribe(function (res) {
                            resolve(res.json());
                        });
                    }
                });
            };
            return descriptor;
        };
    };
}
/**
 * GET method
 * @param {string} url - resource url of the method
 */
exports.GET = methodBuilder("get");
/**
 * POST method
 * @param {string} url - resource url of the method
 */
exports.POST = methodBuilder("post");
/**
 * PUT method
 * @param {string} url - resource url of the method
 */
exports.PUT = methodBuilder("put");
/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
exports.DELETE = methodBuilder("delete");
