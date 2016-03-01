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

import {Inject} from "angular2/core";
import {
Http, Headers as AngularHeaders,
Request, RequestOptions, RequestMethod as RequestMethods,
Response,
URLSearchParams
} from "angular2/http";
import {Observable} from "rxjs/Observable";

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

    protected getDefaultHeaders(): Object {
        return null;
    };

    /**
    * Request Interceptor
    *
    * @method requestInterceptor
    * @param {Request} req - request object
    */
    protected requestInterceptor(req: Request) {
      //
    }

    /**
    * Response Interceptor
    *
    * @method responseInterceptor
    * @param {Response} res - response object
    * @returns {Response} res - transformed response object
    */
    protected responseInterceptor(res: Observable<any>): Observable<any> {
        return res;
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
        };
        return Target;
    };
}

/**
 * Set default headers for every method of the RESTClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: any) {
    return function <TFunction extends Function>(Target: TFunction): TFunction {
        Target.prototype.getDefaultHeaders = function() {
            return headers;
        };
        return Target;
    };
}

function paramBuilder(paramName: string) {
    return function(key: string) {
        return function(target: RESTClient, propertyKey: string | symbol, parameterIndex: number) {
            var metadataKey = `${propertyKey}_${paramName}_parameters`;
            var paramObj: any = {
                key: key,
                parameterIndex: parameterIndex
            };
            if (Array.isArray(target[metadataKey])) {
                target[metadataKey].push(paramObj);
            } else {
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
    };
}


/**
 * Defines the media type(s) that the methods can produce
 * @param MediaType producesDef - mediaType to be parsed
 */
export function Produces(producesDef: MediaType) {
    return function(target: RESTClient, propertyKey: string, descriptor: any) {
        descriptor.isJSON = producesDef === MediaType.JSON;
        return descriptor;
    };
}


/**
 * Supported @Produces media types
 */
export enum MediaType {
    JSON
}


function methodBuilder(method: number) {
    return function(url: string) {
        return function(target: RESTClient, propertyKey: string, descriptor: any) {

            var pPath = target[`${propertyKey}_Path_parameters`];
            var pQuery = target[`${propertyKey}_Query_parameters`];
            var pBody = target[`${propertyKey}_Body_parameters`];
            var pHeader = target[`${propertyKey}_Header_parameters`];

            descriptor.value = function(...args: any[]) {

                // Body
                var body = null;
                if (pBody) {
                    body = JSON.stringify(args[pBody[0].parameterIndex]);
                }

                // Path
                var resUrl: string = url;
                if (pPath) {
                    for (var k in pPath) {
                        if (pPath.hasOwnProperty(k)) {
                            resUrl = resUrl.replace("{" + pPath[k].key + "}", args[pPath[k].parameterIndex]);
                        }
                    }
                }

                // Query
                var search = new URLSearchParams();
                if (pQuery) {
                    pQuery
                    .filter(p => args[p.parameterIndex]) // filter out optional parameters
                    .forEach(p => {
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
                var headers = new AngularHeaders(this.getDefaultHeaders());
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
                var options = new RequestOptions({
                    method,
                    url: this.getBaseUrl() + resUrl,
                    headers,
                    body,
                    search
                });

                var req = new Request(options);

                // intercept the request
                this.requestInterceptor(req);
                // make the request and store the observable for later transformation
                var observable: Observable<Response> = this.http.request(req);

                // transform the obserable in accordance to the @Produces decorator
                if (descriptor.isJSON) {
                  observable = observable.map(res => res.json());
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
 * GET method
 * @param {string} url - resource url of the method
 */
export var GET = methodBuilder(RequestMethods.Get);
/**
 * POST method
 * @param {string} url - resource url of the method
 */
export var POST = methodBuilder(RequestMethods.Post);
/**
 * PUT method
 * @param {string} url - resource url of the method
 */
export var PUT = methodBuilder(RequestMethods.Put);
/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
export var DELETE = methodBuilder(RequestMethods.Delete);
/**
 * HEAD method
 * @param {string} url - resource url of the method
 */
export var HEAD = methodBuilder(RequestMethods.Head);
