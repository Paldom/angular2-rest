# angular2-rest
Angular2 HTTP client to consume RESTful services. Built on angular2/http with TypeScript.  
**Note:** this solutions is not production ready, it's in a very basic alpha state. Any ideas or contributions are very welcomed :)

## Installation

```sh
npm install angular2-rest
```

## Example

```ts

import {RESTClient, GET, PUT, POST, DELETE, BaseUrl, Headers, DefaultHeaders, Path, Body, Query, IRequest} from 'angular2-rest';

import {Todo} from './models/Todo';
import {SessionFactory} from './sessionFactory';

@Injectable()
@BaseUrl("http://localhost:3000/api/")
@DefaultHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
})
export class TodoRESTClient extends RESTClient {

    protected requestInterceptor(req: IRequest) {
        if (SessionFactory.getInstance().isAuthenticated) {
            req.headers.append('jwt', SessionFactory.getInstance().credentials.jwt);
        }
    }

    @GET("todo/")
    public getTodos( @Query("sort") sort?: string): Promise<Array<Todo>> { return null; };

    @GET("todo/{id}")
    public getTodoById( @Path("id") id: string): Promise<Todo> { return null; };

    @POST("todo")
    public postTodo( @Body todo: Todo): Promise<Todo> { return null; };

    @PUT("todo/{id}")
    public putTodoById( @Path("id") id: string, @Body todo: Todo): Promise<Todo> { return null; };

    @DELETE("todo/{id}")
    public deleteTodoById( @Path("id") id: string): Promise<any> { return null; };

}

```

## API Docs

### RESTClient
#### Methods:
- `getBaseUrl(): string`: returns the base url of RESTClient
- `getDefaultHeaders(): Object`: returns the default headers of RESTClient in a key-value pair

### Class decorators:
- `@BaseUrl(url: string)`
- `@DefaultHeaders(headers: Object)`

### Method decorators:
- `@GET(url: String)`
- `@POST(url: String)`
- `@PUT(url: String)`
- `@DELETE(url: String)`
- `@Headers(headers: Object)`

### Parameter decorators:
- `@Path(key: string)`
- `@Query(key: string)`
- `@Header(key: string)`
- `@Body`

### IRequest
#### Properties:
- `url: string;`: resource url
- `headers: Headers;`: angular/http Headers
- `body?: Object;`: optional, body Object

### IResponse
TODO

# License

MIT
