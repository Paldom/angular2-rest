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
 @Produces(MediaType)

 - Parameter Decorators:
 @Path(string)
 @Query(string)
 @Header(string)
 @Body
 */
"use strict";
var http_1 = require("@angular/http");
/**
 * Angular 2 RestClient class.
 *
 * @class RESTClient
 * @constructor
 */
var RestClient = (function () {
    function RestClient(httpClient) {
        this.httpClient = httpClient;
    }
    RestClient.prototype.getServiceId = function () {
        return null;
    };
    RestClient.prototype.getBaseUrl = function () {
        return null;
    };
    ;
    RestClient.prototype.getDefaultHeaders = function () {
        return null;
    };
    ;
    /**
     * Request Interceptor
     *
     * @method requestInterceptor
     * @param {Request} req - request object
     */
    RestClient.prototype.requestInterceptor = function (req) {
        //
    };
    /**
     * Response Interceptor
     *
     * @method responseInterceptor
     * @param {Response} res - response object
     * @returns {Response} res - transformed response object
     */
    RestClient.prototype.responseInterceptor = function (res) {
        return res;
    };
    return RestClient;
}());
exports.RestClient = RestClient;
/**
 * Configure the REST Client
 * @param {String} url - base URL
 * @param {String} serviceId - Service ID
 * @param {Object} headers - deafult headers in a key-value pair
 */
function Client(args) {
    return function (Target) {
        if (args.serviceId) {
            Target.prototype.getServiceId = function () {
                return args.serviceId;
            };
        }
        if (args.baseUrl) {
            Target.prototype.getBaseUrl = function () {
                return args.baseUrl;
            };
        }
        if (args.headers) {
            Target.prototype.getDefaultHeaders = function () {
                return args.headers;
            };
        }
        return Target;
    };
}
exports.Client = Client;
function paramBuilder(paramName) {
    return function (key) {
        return function (target, propertyKey, parameterIndex) {
            var metadataKey = propertyKey + "_" + paramName + "_parameters";
            var paramObj = {
                key: key,
                parameterIndex: parameterIndex
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
/**
 * Defines a custom mapper function
 * Overrides @Produces
 * @param MediaType media type or custom mapper function
 */
function Map(mapper) {
    return function (target, propertyKey, descriptor) {
        descriptor.mapper = mapper;
        return descriptor;
    };
}
exports.Map = Map;
/**
 * Defines the media type(s) that the methods can produce
 * @param MediaType media type or custom mapper function
 */
function Produces(mime) {
    return function (target, propertyKey, descriptor) {
        if (mime != undefined) {
            if (mime === MediaType.JSON) {
                descriptor.mime = function (res) { return res.json(); };
            }
        }
        return descriptor;
    };
}
exports.Produces = Produces;
/**
 * Supported @Produces media types
 */
(function (MediaType) {
    MediaType[MediaType["JSON"] = 0] = "JSON";
})(exports.MediaType || (exports.MediaType = {}));
var MediaType = exports.MediaType;
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
                var resUrl = url;
                if (pPath) {
                    for (var k in pPath) {
                        if (pPath.hasOwnProperty(k)) {
                            resUrl = resUrl.replace("{" + pPath[k].key + "}", args[pPath[k].parameterIndex]);
                        }
                    }
                }
                if (this.getBaseUrl() != null) {
                    var baseUrl = this.getBaseUrl();
                    if (baseUrl.indexOf("/") == baseUrl.length - 1 && resUrl.indexOf("/") == 0) {
                        baseUrl = baseUrl.substring(0, 1);
                    }
                    resUrl = baseUrl + resUrl;
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
                // set class default headers
                var headers = new http_1.Headers(this.getDefaultHeaders());
                // set method specific headers
                for (var k in descriptor.headers) {
                    if (descriptor.headers.hasOwnProperty(k)) {
                        headers.append(k, descriptor.headers[k]);
                    }
                }
                // set parameter specific headers
                if (pHeader) {
                    for (var k in pHeader) {
                        if (pHeader.hasOwnProperty(k)) {
                            headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                        }
                    }
                }
                // Request options
                var options = new http_1.RequestOptions({
                    method: method,
                    url: resUrl,
                    headers: headers,
                    body: body,
                    search: search
                });
                var req = new http_1.Request(options);
                // intercept the request
                this.requestInterceptor(req);
                // make the request and store the observable for later transformation
                var observable = this.httpClient.request(req);
                // transform the observable in accordance to the @Produces decorator
                if (descriptor.mapper != undefined) {
                    observable = observable.map(descriptor.mapper);
                }
                else if (descriptor.mime != undefined) {
                    observable = observable.map(descriptor.mime);
                }
                // intercept the response
                observable = this.responseInterceptor(observable);
                return observable;
            };
            return descriptor;
        };
    };
}
/**
 * Get method
 * @param {string} url - resource url of the method
 */
exports.Get = methodBuilder(http_1.RequestMethod.Get);
/**
 * Post method
 * @param {string} url - resource url of the method
 */
exports.Post = methodBuilder(http_1.RequestMethod.Post);
/**
 * Put method
 * @param {string} url - resource url of the method
 */
exports.Put = methodBuilder(http_1.RequestMethod.Put);
/**
 * Delete method
 * @param {string} url - resource url of the method
 */
exports.Delete = methodBuilder(http_1.RequestMethod.Delete);
/**
 * Head method
 * @param {string} url - resource url of the method
 */
exports.Head = methodBuilder(http_1.RequestMethod.Head);
