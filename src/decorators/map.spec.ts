
import {assert} from 'chai';
import { Observable } from "rxjs";
import { Request, Response, ResponseOptions } from "@angular/http";
import { HttpClient } from "../abstract/http-client";
import { RestClient } from "../rest-client";
import { Get } from "./request-methods";
import { Map } from "./map";

describe('@Map', () => {

  it('verify Map function is called', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      let json:any = {name: 'itemName', desc: 'Some awesome item'};
      return Observable.of(new Response(new ResponseOptions({body: JSON.stringify(json)})));
    });
    let testClient = new TestClient(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    result.subscribe(item => {
      try {
        assert.equal( item.name, 'itemName' );
        assert.equal( item.desc, 'Some awesome item' );
        done();
      }catch(e){
        done(e);
      }
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

class TestClient extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/test')
  @Map(resp => new Item(resp.json()))
  public getItems():Observable<Item>{
    return null;
  }

}

class Item {

  public name:string;
  public desc: string;

  constructor(props:{name:string,desc:string}){
    this.name = props.name;
    this.desc = props.desc;
  }
}
