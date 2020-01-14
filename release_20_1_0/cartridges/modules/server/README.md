# Server module

The server module is a replacement for guard functionality that existed in the original SiteGenesis JavaScript Controllers (SGJC) reference application. The server module also provides a different approach to extensibility that is new to Storefront Reference Architecture (SFRA).

The server module uses a modern JavaScript approach and borrows heavily from NodeJS's [Express](http://expressjs.com/) along with features specific to Storefront Reference Architecture.

The server module allows users to register routes that create a mapping between a provided URL and code to execute when server detects that URL.

```js

var server = require('server');

server.get('Show', function(req, res, next) {
    res.json({ value: 'Hello World'});
    next();
});

module.exports = server.exports();

```

If the code above is saved to a file named `Page.js`, then it creates a new route for a URL matching `http://sandbox-host-name/on/demandware.store/site-name/en_US/Page-Show.` Whenever that URL is called, the provided function is executed and renders a page with `Content-Type: application/json` and body `{ value: 'Hello World '}`. You can enhance this code by adding another parameter `server.middleware.https`, after `Show` to limit this route to only allow HTTPS requests.

The first parameter of `server.get` and `server.post` functions is always the name of the route (the URL endpoint). The last parameter always the main function for the endpoint. You can add as many parameters in between the first and last parameter as you need. Each parameter specifies a function to be executed in order and can either allow next step to be executed (by calling `next()`), or reject a request (by calling `next(new Error())`).
The code executed between the first and last parameter is referred to as **middleware** and the whole process is called **chaining**. You can easily create your own middleware functions for any purpose. You can use them to limit route access, to add information to `pdict`, or for any other reason. One limitation of this approach is that you always have to call the `next()` function at the end of every step in the chain, otherwise the next function in the chain is not executed.

## Middleware

Every step of the middleware chain is a function that takes three arguments. `req`, `res` and `next`.

### `req`

`req` stands for Request, and contains information about server request that initiated execution. If you are looking for input information, for example, content-type that user accepts, or user's login and locale information, it is available on `req` object. The `req` argument automatically pre-parses query string parameters and assigns them to `req.querystring` object.

### `res`

`res` stands for Response, and contains functionality for outputting data back to the client. For example,

* `res.cacheExpiration(24);` which sets cache expiration to 24 hours from now. `req.render(templateName, data)` outputs an ISML template back to the client and assigns `data` to `pdict`.
* `req.json(data)` prints out a JSON object back to the screen. It's helpful in creating AJAX service endpoints that you want to execute from the client-side scripts.
* `req.setViewData(data)` does not render anything, but sets the output object. This can be helpful if you want to add multiple objects to the `pdict` of the template, which contains all of in the information for rendering that is passed to the template. `setViewData` merges all of the data that you passed in into a single object, so you can call it at every step of the middleware chain. For example, you might want to have a separate middleware function that retrieves information about user's locale to render a language switch on the page. Actual output of the ISML template or JSON happens after every step of the middleware chain is complete.

### `next`

Executing the `next` function notifies the server that you are done with this middleware step and it can execute next step in the chain.

## Extending routes

The power of this approach is that by chaining multiple middleware functions, you can compartmentalize your code better and extend existing or modify routes without having to rewrite them.

### Changing wording in a template
For example, you might have a controller `Page` with the following route:

```js
var server = require('server');

server.get('Show', function(req, res, next) {
    res.render('someTemplate', { value: 'Hello World' });
    next();
});

module.exports = server.exports();
```

Let's say that you are a client who is fine with the look and feel of the Page-Show template, but want to change the wording. Instead of creating your own controller and route or modifying SFRA code, you can extend this route with the following code:

```js
var page = require('app_storefront_base/cartridge/controller/Page');
var server = require('server');

server.extend(page);

server.append('Show', function(req, res, next) {
    res.setViewData({ value: 'Hello Commerce Cloud' });
    next();
});

module.exports = server.exports();
```

Once the user loads this page, the text on the page now says "Hello Commerce Cloud", since the data passed to the template was overwritten.

### Changing template styles
It is simple to change the template style if you are fine with the data, but don't like the look and feel of the template. Instead of setting ViewData, you can just call the `render` function and pass it a new template like this:

```js
var page = require('app_storefront_base/cartridge/controller/Page');
var server = require('server');

server.extend(page);

server.append('Show', function(req, res, next) {
    res.render('myNewTemplate');
    next();
});

module.exports = server.exports();
```

Your new template still has the `pdict.value` variable with a value of `Hello World`, but you can render it using your own template without modifying any of the SFRA code.

We recommend that you never modify anything in app\_storefront_base, but instead to create your own cartridge and overlay it in the Business Manager cartridge path. This enables you to upgrade to a newer version of SFRA without having to manually cherry-pick changes and perform manual merges. This doesn't mean that every new version of SFRA will not modify your client's site, but upgrade and feature adoption process is much quicker and less painful.

### Replacing a route
Sometimes you might want to reuse the route's name, but do not want any of the existing functionality. In those cases, you can use `replace` command to completely remove and re-add a new route.

```js
var page = require('app_storefront_base/cartridge/controller/Page');
var server = require('server);

server.extend(page);

server.replace('Show', server.middleware.get, function(req, res, next){
    res.render('myNewTemplate');
    next();
});

module.exports = server.exports();
```

## Middleware chain events

The server module also emits events at every step of execution and you can subscribe and unsubscribe events from a given route. Here's the list of currently supported events:

* `route:Start` - emitted as a first thing before middleware chain execution.
* `route:Redirect` - emitted right before `res.redirect` execution.
* `route:Step` - emitted before execution of every step in the middleware chain.
* `route:Complete` - emitted after every step in the chain finishes execution. Currently subscribed to by the server to render ISML or JSON back to the client.

All of the events provide both `req` and `res` as parameters to all handlers.

Subscribing or unsubscribing from events can allow you to do some very complex and interesting things. For example, currently the server subscribes to the `route:Complete` event to render out ISML back to the client. If, for example, you want to use something other then ISML to render the content of your template, you could unsubscribe route from `route:Complete` event and subscribe to it again with a function that would use your own rendering engine instead of ISML, without modifying any of the existing controllers.
