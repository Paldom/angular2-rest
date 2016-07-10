import { Http, Request } from "@angular/http";
import { Observable } from "rxjs/Observable";
/**
* Angular 2 RESTClient class.
*
* @class RESTClient
* @constructor
*/
export declare class RESTClient {
    protected http: Http;
    constructor(http: Http);
    protected getBaseUrl(): string;
    protected getDefaultHeaders(): Object;
    /**
    * Request Interceptor
    *
    * @method requestInterceptor
    * @param {Request} req - request object
    */
    protected requestInterceptor(req: Request): void;
    /**
    * Response Interceptor
    *
    * @method responseInterceptor
    * @param {Response} res - response object
    * @returns {Response} res - transformed response object
    */
    protected responseInterceptor(res: Observable<any>): Observable<any>;
}
/**
 * Set the base URL of REST resource
 * @param {String} url - base URL
 */
export declare function BaseUrl(url: string): <TFunction extends Function>(Target: TFunction) => TFunction;
/**
 * Set default headers for every method of the RESTClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
export declare function DefaultHeaders(headers: any): <TFunction extends Function>(Target: TFunction) => TFunction;
/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
export declare var Path: (key: string) => (target: RESTClient, propertyKey: string | symbol, parameterIndex: number) => void;
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export declare var Query: (key: string) => (target: RESTClient, propertyKey: string | symbol, parameterIndex: number) => void;
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export declare var Body: (target: RESTClient, propertyKey: string | symbol, parameterIndex: number) => void;
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export declare var Header: (key: string) => (target: RESTClient, propertyKey: string | symbol, parameterIndex: number) => void;
/**
 * Set custom headers for a REST method
 * @param {Object} headersDef - custom headers in a key-value pair
 */
export declare function Headers(headersDef: any): (target: RESTClient, propertyKey: string, descriptor: any) => any;
/**
 * Defines the media type(s) that the methods can produce
 * @param MediaType producesDef - mediaType to be parsed
 */
export declare function Produces(producesDef: MediaType): (target: RESTClient, propertyKey: string, descriptor: any) => any;
/**
 * Supported @Produces media types
 */
export declare enum MediaType {
    JSON = 0,
}
/**
 * GET method
 * @param {string} url - resource url of the method
 */
export declare var GET: (url: string) => (target: RESTClient, propertyKey: string, descriptor: any) => any;
/**
 * POST method
 * @param {string} url - resource url of the method
 */
export declare var POST: (url: string) => (target: RESTClient, propertyKey: string, descriptor: any) => any;
/**
 * PUT method
 * @param {string} url - resource url of the method
 */
export declare var PUT: (url: string) => (target: RESTClient, propertyKey: string, descriptor: any) => any;
/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
export declare var DELETE: (url: string) => (target: RESTClient, propertyKey: string, descriptor: any) => any;
/**
 * HEAD method
 * @param {string} url - resource url of the method
 */
export declare var HEAD: (url: string) => (target: RESTClient, propertyKey: string, descriptor: any) => any;
