
import {assert} from 'chai';
import { Observable } from "rxjs";
import { Request, Response, ResponseOptions, RequestMethod } from "@angular/http";
import { RestClient } from "./rest-client";
import { HttpClient } from "./abstract/http-client";
import { Get } from "./decorators/request-methods";
import { Client } from "./decorators/client";

describe('RestClient', () => {
  beforeEach(() => {
  });

  it('checkSetup', () => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions()));
    });
    let testClient = new TestClient1(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal(requestMock.callCount, 1);
    assert.equal(requestMock.lastRequest.method, RequestMethod.Get);

  });

  it('call requestInterceptor', () => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions()));
    });
    let testClient = new TestClient2(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal(testClient.interceptorCallCount, 1);
    assert.equal(testClient.interceptorRequest.method, RequestMethod.Get);

  });

  it('call responseInterceptor', () => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({status: 200})));
    });
    let testClient = new TestClient3(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal(testClient.interceptorCallCount, 1);

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

class TestClient1 extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/test')
  public getItems():Observable<Response>{
    return null;
  }

}

class TestClient2 extends RestClient {

  public interceptorCallCount: number = 0;
  public interceptorRequest: Request;

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/test')
  public getItems():Observable<Response>{
    return null;
  }

  protected requestInterceptor(req:Request):void{
    this.interceptorCallCount++;
    this.interceptorRequest = req;
  }

}

class TestClient3 extends RestClient {

  public interceptorCallCount: number = 0;
  public interceptorResponse: Observable<Response>;

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/test')
  public getItems():Observable<Response>{
    return null;
  }

  protected responseInterceptor(res: Observable<Response>): Observable<any> {
    this.interceptorCallCount++;
    this.interceptorResponse = res;
    return res;
  }

}
