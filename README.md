# @maxxton/angular-rest
Angular2 HTTP client to consume RESTful services. Built on @angular/http with TypeScript.  
**Note:** Production Ready! (Well tested)

## Installation

```sh
npm install @maxxton/angular-rest --save
```

## Example

```ts

import {Http, Request, Response} from '@angular/http';
import {HttpClient, RESTClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType} from '@maxxton/angular-rest';

import {Todo} from './models/Todo';
import {SessionFactory} from './sessionFactory';

@Injectable()
@Client({
    serviceId: 'todo-service',
    baseUrl: 'http://localhost:3000/api/',
    headers: {
        'content-type': 'application/json'
    }
})
export class TodoClient extends RestClient {

    constructor(http:Http){
        super(<HttpClient>http);
    }

    protected requestInterceptor(req: Request):void {
        if (SessionFactory.getInstance().isAuthenticated) {
            req.headers.append('jwt', SessionFactory.getInstance().credentials.jwt);
        }
    }
    
    protected responseInterceptor(res: Observable<Response>): Observable<any> {
        // do anything with responses
        return res;
    }

    @Get("todo/")
    @Produces(MediaType.JSON)
    public getTodos( @Query("page") page:number, @Query("size", {default: 20}) size?:number, @Query("sort") sort?: string): Observable<Todo[]> { return null; };

    @Get("todo/{id}")
    @Map(resp => new Todo(resp.json()))
    public getTodoById( @Path("id") id: number): Observable<Todo>{ return null; };

    @Post("todo")
    @Headers({
        'content-type': 'application/json'
    })
    public postTodo( @Body todo: Todo): Observable<Response> { return null; };

    @Put("todo/{id}")
    public putTodoById( @Path("id") id: string, @Body todo: Todo): Observable<Response> { return null; };

    @Delete("todo/{id}")
    public deleteTodoById( @Path("id") id: string): Observable<Response> { return null; };

}
```

### Using it in your component

**```app.module.ts```**
``` ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule
  ],
  providers: [
    TodoClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
**```todo.component.ts```**
``` ts
@Component({
  selector: 'to-do',
})
export class ToDoCmp {

  constructor(private todoClient: TodoClient) {
  }
  
  //Use todoClient
}
```
## API Docs

### RESTClient
#### Methods:
- `getServiceId(): string`: returns the serviceId of the RestClient
- `getBaseUrl(): string`: returns the base url of RestClient
- `getDefaultHeaders(): Object`: returns the default headers of RestClient in a key-value pair

### Class decorators:
- `@Client(args:{serviceId?: string, baseUrl?: string, headers?: any})`

### Method decorators:
- `@Get(url: String)`
- `@Post(url: String)`
- `@Put(url: String)`
- `@Patch(url: String)`
- `@Delete(url: String)`
- `@Head(url: String)`
- `@Headers(headers: Object)`

### Parameter decorators:
- `@Path(name: string, value?:any|{value?:any})`
- `@Query(name: string, value?:any|{value?:any,format?:string})`
- `@Header(name: string, value?:any|{value?:any,format?:string})`
- `@Body`

#### Collection Format
Determines the format of the array if type array is used. (used for ``@Query`` and ``@Header``) Possible values are:
* ``Format.CSV`` - comma separated values ``foo,bar``.
* ``Format.SSV`` - space separated values ``foo bar``.
* ``Format.TSV`` - tab separated values ``foo\tbar``.
* ``Format.PIPES`` - pipe separated values ``foo|bar``.
* ``Format.MULTI`` - corresponds to multiple parameter instances instead of multiple values for a single instance ``foo=bar&foo=baz``. This is valid only for parameters in "query" or "formData".

Default value is ``Format.CSV``.

# License

MIT
