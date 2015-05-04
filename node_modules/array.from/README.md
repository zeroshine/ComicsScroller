# ES6 `Array.from` polyfill [![Build status](https://travis-ci.org/mathiasbynens/Array.from.svg?branch=master)](https://travis-ci.org/mathiasbynens/Array.from)

A robust & optimized ES3-compatible polyfill for [the `Array.from` method in ECMAScript 6](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from).

## Installation

In a browser:

```html
<script src="array-from.js"></script>
```

Via [npm](http://npmjs.org/):

```bash
npm install array.from
```

Then, in [Node.js](http://nodejs.org/):

```js
require('array.from');

// On Windows and on Mac systems with default settings, case doesn’t matter,
// which allows you to do this instead:
require('Array.from');
```

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](http://mathiasbynens.be/) |

## License

This polyfill is available under the [MIT](http://mths.be/mit) license.
