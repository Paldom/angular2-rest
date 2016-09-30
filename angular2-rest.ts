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

import {
  Headers as AngularHeaders,
  Request,
  RequestOptions,
  RequestMethod as RequestMethods,
  Response,
  URLSearchParams,
  RequestOptionsArgs
} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {MapSignature} from "rxjs/operator/map";

/**
 * Angular 2 RestClient class.
 *
 * @class RESTClient
 * @constructor
 */
export class RestClient {

  public constructor( protected httpClient: HttpClient) {
  }

  protected getServiceId(): string{
    return null;
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
 * Configure the REST Client
 * @param {String} url - base URL
 * @param {String} serviceId - Service ID
 * @param {Object} headers - deafult headers in a key-value pair
 */
export function Client(args:{serviceId?: string, baseUrl?: string, headers?: any}) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    if(args.serviceId){
      Target.prototype.getServiceId = function() {
        return args.serviceId;
      };
    }
    if(args.baseUrl){
      Target.prototype.getBaseUrl = function() {
        return args.baseUrl;
      };
    }
    if(args.headers){
      Target.prototype.getDefaultHeaders = function() {
        return args.headers;
      };
    }
    return Target;
  };
}

function paramBuilder(paramName: string) {
  return function(key: string) {
    return function(target: RestClient, propertyKey: string | symbol, parameterIndex: number) {
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
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    descriptor.headers = headersDef;
    return descriptor;
  };
}

/**
 * Defines a custom mapper function
 * Overrides @Produces
 * @param MediaType media type or custom mapper function
 */
export function Map(mapper:(resp : any)=>any){
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    descriptor.mapper = res => res.json();
  }
}

/**
 * Defines the media type(s) that the methods can produce
 * @param MediaType media type or custom mapper function
 */
export function Produces(mime:MediaType) {
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    if(mime != undefined) {
      if (mime === MediaType.JSON) {
        descriptor.mime = res => res.json();
      }
    }
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
    return function(target: RestClient, propertyKey: string, descriptor: any) {

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
        if(this.getBaseUrl() != null){
          var baseUrl = this.getBaseUrl();
          if(baseUrl.indexOf("/") == baseUrl.length-1 && resUrl.indexOf("/") == 0){
            baseUrl = baseUrl.substring(0, 1);
          }
          resUrl = baseUrl + resUrl;
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
          url: resUrl,
          headers,
          body,
          search
        });

        var req = new Request(options);

        // intercept the request
        this.requestInterceptor(req);
        // make the request and store the observable for later transformation
        var observable: Observable<Response> = this.httpClient.request(req);

        // transform the observable in accordance to the @Produces decorator
        if (descriptor.mapper != undefined) {
          observable = observable.map(descriptor.mapper);
        }else if (descriptor.mime != undefined) {
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
export var Get = methodBuilder(RequestMethods.Get);
/**
 * Post method
 * @param {string} url - resource url of the method
 */
export var Post = methodBuilder(RequestMethods.Post);
/**
 * Put method
 * @param {string} url - resource url of the method
 */
export var Put = methodBuilder(RequestMethods.Put);
/**
 * Delete method
 * @param {string} url - resource url of the method
 */
export var Delete = methodBuilder(RequestMethods.Delete);
/**
 * Head method
 * @param {string} url - resource url of the method
 */
export var Head = methodBuilder(RequestMethods.Head);

export interface HttpClient{

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response>;

}
