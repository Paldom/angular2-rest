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

import {Injectable, Inject, Injector} from 'angular2/angular2';
import {Http, Headers as AngularHeaders} from 'angular2/http';

export interface IRequest {
    url: string;
    headers: AngularHeaders;
    body?: Object;
}

export interface IResponse {
}

/**
* Angular 2 RESTClient class.
*
* @class RESTClient
* @constructor
*/
export class RESTClient {

    public constructor( @Inject(Http) protected http: Http) {
    }

    protected getBaseUrl(): string {
        return null;
    };

    protected getDefaultHeaders(): string {
        return null;
    };

    /**
    * Request Interceptor
    *
    * @method requestInterceptor
    * @param {IRequest} req - request object
    */
    protected requestInterceptor(req: IRequest) {
    }

    /**
    * Response Interceptor
    * NOT IMPLEMENTED YET!
    *
    * @method responseInterceptor
    * @param {IResponse} resp - response object
    */
    protected responseInterceptor(resp: IResponse) {
        // TODO
        throw new Error("Not implemented yet!");
    }

}

/**
 * Set the base URL of REST resource
 * @param {String} url - base URL
 */
export function BaseUrl(url: string) {
    return function <TFunction extends Function>(Target: TFunction): TFunction {
        Target.prototype.getBaseUrl = function() {
            return url;
        }
        return Target;
    }
}

/**
 * Set default headers for every method of the RESTClient 
 * @param {Object} headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: any) {
    return function <TFunction extends Function>(Target: TFunction): TFunction {
        Target.prototype.getDefaultHeaders = function() {
            return headers;
        }
        return Target;
    }
}

function paramBuilder(paramName: string) {
    return function(key: string) {
        return function(target: RESTClient, propertyKey: string | symbol, parameterIndex: number) {
            var metadataKey = `${propertyKey}_${paramName}_parameters`;
            var paramObj: any = {
                parameterIndex: parameterIndex,
                key: key
            }
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
export var Path = paramBuilder("Path");
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export var Query = paramBuilder("Query");
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export var Body = paramBuilder("Body")("Body");
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export var Header = paramBuilder("Header");


/**
 * Set custom headers for a REST method 
 * @param {Object} headersDef - custom headers in a key-value pair
 */
export function Headers(headersDef: any) {
    return function(target: RESTClient, propertyKey: string, descriptor: any) {
        descriptor.headers = headersDef;
        return descriptor;
    }
}

function methodBuilder(name: string) {
    return function(url: string) {
        return function(target: RESTClient, propertyKey: string, descriptor: any) {

            var pPath = target[`${propertyKey}_Path_parameters`];
            var pQuery = target[`${propertyKey}_Query_parameters`];
            var pBody = target[`${propertyKey}_Body_parameters`];
            var pHeader = target[`${propertyKey}_Header_parameters`];

            descriptor.value = function(...args: any[]) {

                //Body
                var body = null;
                if (pBody) {
                    body = JSON.stringify(args[pBody[0].parameterIndex]);
                } 
                
                // Path
                var resUrl: string = url;
                if (pPath) {
                    for (k in pPath) {
                        resUrl = resUrl.replace("{" + pPath[k].key + "}", args[pPath[k].parameterIndex]);
                    }
                }
                
                // Query
                var queryString = "";
                if (pQuery) {
                    queryString = pQuery.map(p => {
                        return encodeURIComponent(p.key) + '=' + encodeURIComponent(args[p.parameterIndex]);
                    }).join('&');
                }
                if (queryString) {
                    queryString = "?" + queryString;
                }
                resUrl = resUrl + queryString;


                // Headers
                var headers = new AngularHeaders();
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

                return new Promise<any>((resolve, reject) => {
                    var req: IRequest = {
                        url: self.getBaseUrl() + resUrl,
                        headers: headers,
                        body: body
                    };
                    self.requestInterceptor(req);
                    if (name === "post" || name === "put") {
                        self.http[name](req.url, req.body, {
                            'headers': req.headers
                        }).subscribe(res => {
                            resolve(res.json());
                        });
                    } else {
                        self.http[name](req.url, {
                            'headers': req.headers
                        }).subscribe(res => {
                            resolve(res.json());
                        });
                    }
                });

            };

            return descriptor;
        };
    }
}

/**
 * GET method
 * @param {string} url - resource url of the method
 */
export var GET = methodBuilder("get");
/**
 * POST method
 * @param {string} url - resource url of the method
 */
export var POST = methodBuilder("post");
/**
 * PUT method
 * @param {string} url - resource url of the method
 */
export var PUT = methodBuilder("put");
/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
export var DELETE = methodBuilder("delete");
