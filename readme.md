# sf-sensequery

> Embeddable survey component for websites

sf-sensequery is a lightweight, customizable survey component that can be easily embedded into any website. Built with web components, it works with any framework or with no framework at all.

## Installation

### NPM

Install the component via npm:

```bash
npm install sf-sensequery --save
```

### Script Tag

You can also use the component directly via a script tag:

```html
<script type="module" src="https://unpkg.com/sf-sensequery/dist/sf-sensequery/sf-sensequery.esm.js"></script>
<script nomodule src="https://unpkg.com/sf-sensequery/dist/sf-sensequery/sf-sensequery.js"></script>
```

## Usage

Once installed, you can use the survey component in your HTML:

```html
<sf-sensequery></sf-sensequery>
```

### Basic Configuration

The survey component can be configured with the survey-key attribute:

```html
<sf-sensequery survey-key="your-survey-key"></sf-sensequery>
```

## Framework Integration

### Vanilla JS

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="https://unpkg.com/sf-sensequery/dist/sf-sensequery/sf-sensequery.esm.js"></script>
  </head>
  <body>
    <sf-sensequery survey-key="your-survey-key"></sf-sensequery>
  </body>
</html>
```

### React

```jsx
import React from 'react';
// Import the component
import 'sf-sensequery';

function App() {
  return (
    <div>
      <sf-sensequery survey-key="your-survey-key"></sf-sensequery>
    </div>
  );
}

export default App;
```

### Vue

```html
<template>
  <div>
    <sf-sensequery survey-key="your-survey-key"></sf-sensequery>
  </div>
</template>

<script>
  import 'sf-sensequery';

  export default {
    name: 'App',
  };
</script>
```

### Angular

```typescript
// In your module
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}

// In your component
import 'sf-sensequery';
```

## API Reference

The sf-sensequery component supports the following attribute:

| Attribute  | Type   | Default | Description                              |
| ---------- | ------ | ------- | ---------------------------------------- |
| survey-key | string | null    | The unique key for the survey to display |

## Browser Support

sf-sensequery works in all modern browsers that support Web Components:

- Chrome
- Firefox
- Safari
- Edge (Chromium-based)

### Older Browser Support

For older browsers that don't fully support Web Components, you may need to include polyfills:

```html
<!-- Polyfills for older browsers -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.8.0/webcomponents-loader.js"></script>
```

## CDN Usage

You can use sf-sensequery directly from a CDN like unpkg:

```html
<!-- ESM version for modern browsers -->
<script type="module" src="https://unpkg.com/sf-sensequery/dist/sf-sensequery/sf-sensequery.esm.js"></script>
<!-- Regular version for older browsers -->
<script nomodule src="https://unpkg.com/sf-sensequery/dist/sf-sensequery/sf-sensequery.js"></script>
```

Or from jsDelivr:

```html
<!-- ESM version for modern browsers -->
<script type="module" src="https://cdn.jsdelivr.net/npm/sf-sensequery/dist/sf-sensequery/sf-sensequery.esm.js"></script>
<!-- Regular version for older browsers -->
<script nomodule src="https://cdn.jsdelivr.net/npm/sf-sensequery/dist/sf-sensequery/sf-sensequery.js"></script>
```

## License

MIT
