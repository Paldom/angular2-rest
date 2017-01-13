
import { Request, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "./abstract/http-client";
/**
 * Angular 2 RestClient class.
 *
 * @class RESTClient
 * @constructor
 */
export class RestClient {

  public constructor( protected httpClient: HttpClient) {
  }

  public getServiceId(): string{
    return null;
  }

  public getBaseUrl(): string {
    return null;
  };

  public getDefaultHeaders(): Object {
    return null;
  };

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param {Request} req - request object
   */
  protected requestInterceptor(req: Request):void {
    //
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param {Response} res - response object
   * @returns {Response} res - transformed response object
   */
  protected responseInterceptor(res: Observable<Response>): Observable<any> {
    return res;
  }

}
