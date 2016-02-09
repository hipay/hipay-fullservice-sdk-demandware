# JavaScript Guide
This is a [part](https://intranet.demandware.com/jira/browse/RAP-2737) of a larger effort to refactor SiteGenesis's JavaScript code into more modular components. [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) standard is used to break the original behemoth codebase into smaller modules.

The modules are then bundled into a single file using [Browserify](http://browserify.org/).

To use browserify, run `gulp js` on the command line. See the contributing guide in `CONTRIBUTING.md`.

## Authoring
All codes are written in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode).

In order to enforce a consistent style, please use [editorconfig](http://editorconfig.org/) to set up your editors.

[jshint](http://www.jshint.com/) and [jscs](https://github.com/mdevils/node-jscs) are used for style and format validation.
They can be run using the build tool, `gulp jscs` and `gulp jshint`. Grunt task equivalents are also available (`grunt jscs` and `grunt jshint`).

### Code styles
> Inspired by <http://www.jshint.com/hack/>

#### White spaces
- Hard tabs everywhere (this allows different developer to configure the amount of tab size to their liking).
- Use 1 space after keywords `if`, `for`, `while` etc.
- Use one space after function for anonymous functions but not for named functions:
```js
var a = function () {};
function a() {}
```
- Use a space before and a space after binary operators `+`, `=`, `&&` etc.
```js
if (a === '1') {
	a = a + '2';
}
```
For other more granular rules about spaces, see `.jscsrc`.

#### Variables
- Don't be overly descriptive with your variable names but don't abuse one-letter variables either. Find a sweet spot somewhere in between.
- For variables that refer to jQuery DOM elements, prefix it with `$`
```js
var $main = $('body'),
	$form = $('.form');
```

#### Comments
- Use `//` for all comments.
- Comment everything that is not obvious.
- If you're adding a new check, write a comment describing why this check is important and what it checks for.

#### Misc
- Always use strict mode.
- Always use strict comparision, i.e. `===` and `!==`.
- Use semicolons.
- Don't use comma-first notation.
```js
// OK
var main = 'one',
	secondary = 'two',
	tertiary = 'three';
// Bad
var main = 'one'
	, secondary = 'two'
	, tertiary = 'three'
	;
```
- Always use curly braces, even for a single statement
```js
// OK
if (condition === true) { return true; }
// Bad
if (condition === false) return false;
```
- Use single quotes as much as possible. Use double quotes within single quote for quoting inside a string. This is especially relevant for jQuery selectors.
```js
var string = 'I prefer single quotes';
var quotes = 'I am a "quote" within a string';
var $navContainer = $('.container[name$="nav"]');
```
- Object keys shouldn't have quotes around them unless necessary.
```js
var obj = {
	one: 'One',
	't-w-o': 2
};
```
