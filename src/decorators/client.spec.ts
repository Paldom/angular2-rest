
import {assert} from 'chai';
import { Observable } from "rxjs";
import { Request, Response, ResponseOptions, RequestMethod } from "@angular/http";
import { HttpClient } from "../abstract/http-client";
import { RestClient } from "../rest-client";
import { Get } from "./request-methods";
import { Client } from "./client";

describe('@Client', () => {

  it('verify decorator attributes are added to the request', () => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({status: 200})));
    });
    let testClient = new TestClient(requestMock);

    // Assert
    assert.equal(testClient.getServiceId(), 'customer-service');
    assert.equal(testClient.getBaseUrl(), '/api/v1/customers');
    assert.deepEqual(testClient.getDefaultHeaders(), {
      'content-type': 'application/json'
    });

  });
});

class RequestMock implements HttpClient{

  constructor(private requestFunction:(req:Request) =>Observable<Response>){}

  public callCount:number = 0;
  public lastRequest:Request;

  public request(req:Request):Observable<Response> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }
}

@Client({
  serviceId: 'customer-service',
  baseUrl: '/api/v1/customers',
  headers: {
    'content-type': 'application/json'
  }
})
class TestClient extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/test')
  public getItems():Observable<Response>{
    return null;
  }

}
