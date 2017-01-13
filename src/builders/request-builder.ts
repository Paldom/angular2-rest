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
import { Format } from "../decorators/parameters";

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
          if(pBody.length > 1){
            throw new Error("Only one @Body is allowed");
          }
          var value = args[pBody[0].parameterIndex];
          if(value === undefined && pBody[0].value !== undefined) {
            value = pBody[0].value;
          }
          body = JSON.stringify(value);
        }

        // Path
        var resUrl: string = url;
        if (pPath) {
          for (var k in pPath) {
            if (pPath.hasOwnProperty(k)) {
              let value:any = args[pPath[k].parameterIndex];
              if(value === undefined && pPath[k].value !== undefined) {
                value = pPath[k].value;
              }
              if(value !== undefined && value !== null) {
                resUrl = resUrl.replace( "{" + pPath[ k ].key + "}", value );
              }else{
                throw new Error("Missing path variable '" + pPath[k].key + "' in url '" + url + "'");
              }
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
            .filter((p:any) => args[p.parameterIndex] !== undefined || p.value !== undefined) // filter out optional parameters
            .forEach((p:any) => {
              var key = p.key;
              let value:any = args[p.parameterIndex];
              if(value === undefined && p.value !== undefined) {
                value = p.value;
              }

              // if the value is a instance of Object, we stringify it
              if(Array.isArray(value)){
                switch(p.format){
                  case Format.CSV:
                    value = value.join(',');
                    break;
                  case Format.SSV:
                    value = value.join(' ');
                    break;
                  case Format.TSV:
                    value = value.join('\t');
                    break;
                  case Format.PIPES:
                    value = value.join('|');
                    break;
                  case Format.MULTI:
                    value = value;
                    break;
                  default:
                    value = value.join(',');
                }
              }else if (value instanceof Object) {
                value = JSON.stringify(value);
              }
              if(Array.isArray(value)){
                value.forEach(v => search.append(key, v));
              }else {
                search.set( key, value );
              }
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
              let value:any = args[pHeader[k].parameterIndex];
              if(value === undefined && pHeader[k].value !== undefined) {
                value = pHeader[k].value;
              }
              if(Array.isArray(value)){
                switch(pHeader[k].format){
                  case Format.CSV:
                    value = value.join(',');
                    break;
                  case Format.SSV:
                    value = value.join(' ');
                    break;
                  case Format.TSV:
                    value = value.join('\t');
                    break;
                  case Format.PIPES:
                    value = value.join('|');
                    break;
                  case Format.MULTI:
                    value = value;
                    break;
                  default:
                    value = value.join(',');
                }
              }
              if(Array.isArray(value)){
                value.forEach(v => headers.append(pHeader[k].key, v));
              }else {
                headers.append( pHeader[k].key, value );
              }
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
          descriptor.mappers.forEach((mapper:(resp : any)=>any) => {
            observable = observable.map(mapper);
          });
        }
        if(descriptor.emitters){
          descriptor.emitters.forEach((handler:(resp : Observable<any>)=>Observable<any>) => {
            observable = handler(observable);
          });
        }

        // intercept the response
        observable = this.responseInterceptor(observable);

        return observable;
      };

      return descriptor;
    };
  };
}
