/// <reference path="node_modules/angular2/core.d.ts" />
/// <reference path="node_modules/angular2/http.d.ts" />
/// <reference path="node_modules/rxjs/Rx.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/*

angular2-rest
(c) Domonkos Pal
License: MIT

Table of Contents:

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
var core_1 = require('angular2/core');
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
    * @param {Request} req - request object
    */
    RESTClient.prototype.requestInterceptor = function (req) {
    };
    /**
    * Response Interceptor
    *
    * @method responseInterceptor
    * @param {Response} res - response object
    * @returns {Response} res - transformed response object
    */
    RESTClient.prototype.responseInterceptor = function (res) {
        return res;
    };
    RESTClient = __decorate([
        __param(0, core_1.Inject(http_1.Http)), 
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
function methodBuilder(method) {
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
                // Body
                var body = null;
                if (pBody) {
                    body = JSON.stringify(args[pBody[0].parameterIndex]);
                }
                // Path
                if (pPath) {
                    for (k in pPath) {
                        url = url.replace("{" + pPath[k].key + "}", args[pPath[k].parameterIndex]);
                    }
                }
                // Query
                var search = new http_1.URLSearchParams();
                if (pQuery) {
                    pQuery
                        .filter(function (p) { return args[p.parameterIndex]; }) // filter out optional parameters
                        .forEach(function (p) {
                        var key = p.key;
                        var value = args[p.parameterIndex];
                        // if the value is a instance of Object, we stringify it
                        if (value instanceof Object) {
                            value = JSON.stringify(value);
                        }
                        search.set(encodeURIComponent(key), encodeURIComponent(value));
                    });
                }
                // Headers
                var headers = new http_1.Headers(this.getDefaultHeaders());
                for (var k in descriptor.headers) {
                    headers.append(k, descriptor.headers[k]);
                }
                if (pHeader) {
                    for (var k in pHeader) {
                        headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                    }
                }
                // Request options
                var options = new http_1.RequestOptions({
                    method: method,
                    url: this.getBaseUrl() + url,
                    headers: headers,
                    body: body,
                    search: search
                });
                var req = new http_1.Request(options);
                // intercept the request
                this.requestInterceptor(req);
                // make the request and store the observable for later transformation
                var observable = this.http.request(req);
                // intercept the response
                observable = observable.map(this.responseInterceptor);
                return observable;
            };
            return descriptor;
        };
    };
}
/**
 * GET method
 * @param {string} url - resource url of the method
 */
exports.GET = methodBuilder(http_1.RequestMethod.Get);
/**
 * POST method
 * @param {string} url - resource url of the method
 */
exports.POST = methodBuilder(http_1.RequestMethod.Post);
/**
 * PUT method
 * @param {string} url - resource url of the method
 */
exports.PUT = methodBuilder(http_1.RequestMethod.Put);
/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
exports.DELETE = methodBuilder(http_1.RequestMethod.Delete);
//# sourceMappingURL=angular2-rest.js.map