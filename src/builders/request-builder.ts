import {
  Headers as AngularHeaders,
  Request,
  RequestOptions,
  Response,
  URLSearchParams,
} from "@angular/http";

import { RestClient } from "../rest-client";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

export function methodBuilder( method: number) {
  return function(url: string) {
    return function(target: RestClient, propertyKey: string, descriptor: any) {

      var pPath = target[`${propertyKey}_Path_parameters`];
      var pQuery = target[`${propertyKey}_Query_parameters`];
      var pBody = target[`${propertyKey}_Body_parameters`];
      var pHeader = target[`${propertyKey}_Header_parameters`];

      descriptor.value = function(...args: any[]) {

        // Body
        var body:any = null;
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
            .filter((p:any) => args[p.parameterIndex]) // filter out optional parameters
            .forEach((p:any) => {
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
        if (descriptor.mime) {
          observable = observable.map(descriptor.mime);
        }
        if(descriptor.mappers){
          descriptor.mappers.forEach(mapper => {
            observable = observable.map(mapper);
          })
        }
        if(descriptor.emitters){
          descriptor.emitters.forEach(handler => {
            observable = handler(observable);
          })
        }

        // intercept the response
        observable = this.responseInterceptor(observable);

        return observable;
      };

      return descriptor;
    };
  };
}
