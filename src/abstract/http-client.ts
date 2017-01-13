import { Request, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

export interface HttpClient{

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response>;

}
