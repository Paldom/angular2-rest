
import {assert} from 'chai';
import { Observable } from "rxjs";
import { Request, Response, ResponseOptions } from "@angular/http";
import { HttpClient } from "../abstract/http-client";
import { RestClient } from "../rest-client";
import { Get, Post } from "./request-methods";
import { Map } from "./map";
import { Produces, MediaType } from "./produces";
import { Path, Query, Format, Header, Body } from "./parameters";

describe('@Path', () => {

  it('resolve Path variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientPath(requestMock);

    // Act
    let result = testClient.getItem(5);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/items/5' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve missing Path variable', () => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientPath(requestMock);

    try {
      // Act
      let result = testClient.getItem();

      // Assert
      assert.fail();
    }catch(e){
      assert.equal(e.message, "Missing path variable 'id' in url '/items/{id}'");
    }

  });

  it('resolve default Path variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientPath(requestMock);

    // Act
    let result = testClient.getItem2();

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/items2/7' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve multiple Path variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientPath(requestMock);

    // Act
    let result = testClient.getItem3(20, 'done');

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/items3/20/status/status-done.json' );
        done();
      }catch(e){
        done(e);
      }
    });

  });
});

describe('@Query', () => {

  it('resolve Query variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItems(5);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/items?page=5' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve missing Query variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/items' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve default Query variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItems2();

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/items2?page=20' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve multiple Query variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItems3(3, '20');

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/items3?sort=asc&size=20&page=3' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format CSV', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItemsCSV(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/itemsCSV?field=name,desc' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format SSV', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItemsSSV(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/itemsSSV?field=name%20desc' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format TSV', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItemsTSV(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/itemsTSV?field=name%09desc' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format PIPES', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItemsPIPES(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/itemsPIPES?field=name%7Cdesc' );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format MULTI', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({url: req.url})));
    });
    let testClient = new TestClientQuery(requestMock);

    // Act
    let result = testClient.getItemsMULTI(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal( resp.url, '/itemsMULTI?field=name&field=desc' );
        done();
      }catch(e){
        done(e);
      }
    });

  });
});

describe('@Header', () => {

  it('resolve Header variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItems(5);

    // Assert
    result.subscribe(resp => {
      try {
        assert.deepEqual(resp.headers.getAll('page'), [5]);
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve missing Header variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    result.subscribe(resp => {
      try {
        assert.isFalse(resp.headers.has('path'));
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve default Header variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItems2();

    // Assert
    result.subscribe(resp => {
      try {
        assert.deepEqual(resp.headers.getAll('page'), ['20']);
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve multiple Header variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItems3(3, '20');

    // Assert
    result.subscribe(resp => {
      try {
        assert.deepEqual(resp.headers.getAll('page'), [3]);
        assert.deepEqual(resp.headers.getAll('sort'), ['asc']);
        assert.deepEqual(resp.headers.getAll('size'), ['20']);
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItemsDefault(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name,desc');
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format CSV', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItemsCSV(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name,desc');
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format SSV', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItemsSSV(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name desc');
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format TSV', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItemsTSV(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name\tdesc');
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format PIPES', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItemsPIPES(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name|desc');
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve Collection Format MULTI', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({headers: req.headers})));
    });
    let testClient = new TestClientHeader(requestMock);

    // Act
    let result = testClient.getItemsMULTI(['name', 'desc']);

    // Assert
    result.subscribe(resp => {
      try {
        assert.deepEqual(resp.headers.getAll('field'), ['name', 'desc']);
        done();
      }catch(e){
        done(e);
      }
    });

  });
});

describe('@Body', () => {

  it('resolve Body variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({body: req.getBody()})));
    });
    let testClient = new TestClientBody(requestMock);

    // Act
    let result = testClient.createItem({name: "Awesome Item"});

    // Assert
    result.subscribe(resp => {
      try {
        assert.deepEqual( resp.json(), {name: "Awesome Item"} );
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve missing Body variable', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({body: req.getBody()})));
    });
    let testClient = new TestClientBody(requestMock);

    // Act
    let result = testClient.createItem();

    // Assert
    result.subscribe(resp => {
      try {
        assert.deepEqual( resp.json(), null);
        done();
      }catch(e){
        done(e);
      }
    });

  });

  it('resolve 2 Body variable', () => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({body: req.getBody()})));
    });
    let testClient = new TestClientBody(requestMock);

    // Act
    try {
      testClient.createItem2( { name: 'first' }, { name: 'second' } );
      assert.fail();
    }catch(e){
      assert.equal(e.message, "Only one @Body is allowed");
    }

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

class TestClientPath extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/items/{id}')
  public getItem(@Path('id') id?:number):Observable<Response>{
    return null;
  }

  @Get('/items2/{id}')
  public getItem2(@Path('id', {value: 7}) id?:number):Observable<Response>{
    return null;
  }

  @Get('/items3/{id}/status/status-{statusName}.{ext}')
  public getItem3(@Path('id') id:number, @Path('statusName') statusName:string, @Path('ext', 'json') ext?:string):Observable<Response>{
    return null;
  }

}

class TestClientQuery extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/items')
  public getItems(@Query('page') page?:number):Observable<Response>{
    return null;
  }

  @Get('/items2')
  public getItems2(@Query('page', '20') page?:number):Observable<Response>{
    return null;
  }

  @Get('/items3')
  public getItems3(@Query('page') page:number, @Query('size', 20) size?:string, @Query('sort', 'asc') sort?:string):Observable<Response>{
    return null;
  }

  @Get('/itemsCSV')
  public getItemsCSV(@Query('field', {format: Format.CSV}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsSSV')
  public getItemsSSV(@Query('field', {format: Format.SSV}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsTSV')
  public getItemsTSV(@Query('field', {format: Format.TSV}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsPIPES')
  public getItemsPIPES(@Query('field', {format: Format.PIPES}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsMULTI')
  public getItemsMULTI(@Query('field', {format: Format.MULTI}) fields:string|string[]):Observable<Response>{
    return null;
  }

}

class TestClientHeader extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/items')
  public getItems(@Header('page') page?:number):Observable<Response>{
    return null;
  }

  @Get('/items2')
  public getItems2(@Header('page', '20') page?:number):Observable<Response>{
    return null;
  }

  @Get('/items3')
  public getItems3(@Header('page') page:number, @Header('size', 20) size?:string, @Header('sort', 'asc') sort?:string):Observable<Response>{
    return null;
  }

  @Get('/itemsDefault')
  public getItemsDefault(@Header('field') fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsCSV')
  public getItemsCSV(@Header('field', {format: Format.CSV}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsSSV')
  public getItemsSSV(@Header('field', {format: Format.SSV}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsTSV')
  public getItemsTSV(@Header('field', {format: Format.TSV}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsPIPES')
  public getItemsPIPES(@Header('field', {format: Format.PIPES}) fields:string|string[]):Observable<Response>{
    return null;
  }

  @Get('/itemsMULTI')
  public getItemsMULTI(@Header('field', {format: Format.MULTI}) fields:string|string[]):Observable<Response>{
    return null;
  }

}

class TestClientBody extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Post('/items')
  public createItem(@Body body?:any):Observable<Response>{
    return null;
  }

  @Get('/items2')
  public createItem2(@Body body1?:any, @Body body2?:any):Observable<Response>{
    return null;
  }

}
