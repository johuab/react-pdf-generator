# React->PDF Generator

Toolbox to build react-pdf based templates and render pdfs based on the templates 

## Environments

react-pdf-template supports multiple build targets with different purposes

### Dev server

The dev server is mainly used while developing the templates.
The server uses a hotreloader so every save of the template will trigger a rerender

1. Launch it: `yarn run app`

2. View it: `http://127.0.0.1:8888`

### Node Cli

Launch the rendering pipeline from command line

1. Build it `yarn run build`

2. Launch `node build/cli.js -t MY_TEMPLATE_NAME MY_TEMPLATE_DATA`

Or if the json data is in a file, do something like:

2. `cat mydata.json | xargs -0 node build/cli.js -t MY_TEMPLATE_NAME`

### Express

Run a service listening to HTTP requests and responding with the rendered PDF

1. Build it `yarn run build`

2. Start `node build/server.js`

3. Render `curl -X POST -H "content-type: application/json" -d MY_TEMPLATE_DATA http://127.0.0.1:8888/MY_TEMPLATE_NAME`

## Adding templates

To add a new template just follow these simple steps:

1. Add a new template file in `src/main/js/templates`
2. Export a `Template<P>` from the file, see `src/main/js/templates/types`
3. Add the template to list of templates in `src/main/js/templates/templates`

If added correct, any added template will be available on all build targets listed above.

## TODOs

* **Add type validations** - Add type validations for incomming JSON data
* **Images in app** - Some images fails to load in the app (browser) client, due to CORS?, example https://commons.wikimedia.org/wiki/File:Fresh_made_bread_05.jpg#/media/File:Fresh_made_bread_05.jpg