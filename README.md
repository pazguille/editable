# Editable Component

> Simple and tiny Edit in place for component.

## Features

- Dependency-free.
- Easy CSS customization.
- Just 1 Kb! (min & gzip)

## Demo

[Check out the demo](https://pazguille.github.io/editable/) to see it in action.

## Installation

    $ npm install editable

    $ bower install editable

    $ component install pazguille/editable

## Usage

```html
<div id="example">Everything contained within this div is editable.</div>
```

```js
// Creates a new editable component
var Editable = require('editable');
var element = document.getElementById('example');
var edit = new Editable(element, 'Please, edit it!');

// Binds events
edit.on('done', function (content) {
  // Some code here!
  // For example, you can send the content to the server via AJAX,
  // or save into localStorage.
});

edit.on('cancel', function (content) {
  // Some code here!
});
```

## Browser Support

- Chrome (IOS, Android, desktop)
- Firefox (Android, desktop)
- Safari (IOS, Android, desktop)
- Opera (desktop)
- IE 8+ (desktop)

## API

### Events
- `done`: It's emitted when set a new content.
- `cancel`: It's emitted when cancel the edit.

## With ❤ by
- Guille Paz (Front-end developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)

## License
MIT license. Copyright © 2015.
