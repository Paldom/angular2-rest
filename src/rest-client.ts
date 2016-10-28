
import { Request } from "@angular/http";
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
