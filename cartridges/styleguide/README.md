# Style Guide
## What are style guides
A Style Guide is a living, breathing documentation of the visual language used in the web application. You can read about some [things people have written about style guides](http://styleguides.io/), as well as [examples of style guides](http://styleguides.io/examples.html).

## SiteGenesis Style Guide
The SiteGenesis Style Guide (SSG) is created with the goal of helping designers and developers in defining and understanding a common visual language used for their ecommerce application. It includes design elements such as colors, typography and icons as well as more complex UI components such as the product tile or navigation menu.

By documenting only what is essential to the design of the application, SSG frees up the constraints that are traditionally imposed on designers by old-school wireframes, allowing them to be creative and experiment with new and user-friendly interface centered around the users.

_**Disclaimer**: this is still a work in progress and is not complete. The example style guide provided here is meant as a proof of concept. Further development on top of is strongly encouranged._

## How to use
In order to generate the styleguide for your application, go to the command line and run `gulp styleguide`. This will set up a static web server (by default at `http://localhost:8000`) that displays the living styleguide.

## What it does
This style guide imports the Sass styles in `app_storefront_core`. This way, any update to the application's style will be reflected in the style guide.

The guide is broken down into 4 major sections: Foundation, Elements, Components and Pages.

- Foundation include things such as colors, typography and icons.
- Elements represent small UI elements that are used repeatedly throughout the application, such as buttons, color swatches etc.
- One or more elements put together create components. Components are atomic and holistic UI interfaces that carry a semantic meaning on its own. Examples of components include navigation menu or product tile.
- Pages are templates for pages or full pages that represent a good structure of how different components come together. Some examples of pages include the homepage or the product search page.

For most elements and components, the UI demo is accompanied with HTML markup.

## What it uses
SSG is built as a client-side app using [Ampersand](http://ampersandjs.com/).

Templates are written in Handlebars. Data are specified in JSON. Even though SiteGenesis the application is not using client-side templating at the moment, these templates could grow to become guideliens of how that could be done in the future.
