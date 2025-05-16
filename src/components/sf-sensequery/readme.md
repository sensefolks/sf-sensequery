# sf-sensequery

A customizable, embeddable micro-survey web component that collects user feedback through a multi-step wizard interface.

## Overview

The `sf-sensequery` component provides a frictionless survey experience that can be embedded on any website. It guides users through a series of steps to collect feedback, categorize it, and gather optional respondent details.

## Installation

### NPM

```bash
npm install @sensefolks/sf-sensequery --save
```

### Script Tag

```html
<script type="module" src="https://unpkg.com/@sensefolks/sf-sensequery/dist/sf-sensequery/sf-sensequery.esm.js"></script>
<script nomodule src="https://unpkg.com/@sensefolks/sf-sensequery/dist/sf-sensequery/sf-sensequery.js"></script>
```

## Basic Usage

Add the component to your HTML with a survey key:

```html
<sf-sensequery survey-key="your-survey-key"></sf-sensequery>
```

## Styling

The component is completely unstyled by default and uses CSS parts for customization. This allows you to match your brand's design system while maintaining the component's encapsulation.

The component is styled primarily using CSS parts, which provide fine-grained control over individual elements within the component. For the main container (host element), you can apply styles directly to the custom element tag.

### Example Styling

```css
/* Main container styling (applied directly to the host element) */
sf-sensequery {
  display: block;
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  color: #333;
}

/* Internal elements styling (using CSS parts) */

/* Headings */
sf-sensequery::part(heading) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Inputs */
sf-sensequery::part(input) {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

sf-sensequery::part(textarea) {
  min-height: 100px;
}

/* Buttons */
sf-sensequery::part(button) {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

sf-sensequery::part(next-button),
sf-sensequery::part(submit-button) {
  background-color: #3b82f6;
  color: white;
  border: none;
}

sf-sensequery::part(back-button) {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  margin-right: 0.5rem;
}

/* States */
sf-sensequery::part(error-container) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

sf-sensequery::part(error-message) {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

sf-sensequery::part(retry-button) {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

sf-sensequery::part(loading-message) {
  color: #6b7280;
  font-style: italic;
}
```

## CSS Parts Reference

The component exposes the following CSS parts for styling:

| Part                          | Description                                           |
| ----------------------------- | ----------------------------------------------------- |
| `container`                   | The main container of the component                   |
| `message`                     | Base part for all message types                       |
| `error-message`               | Error message display                                 |
| `error-container`             | Container for error message and retry button          |
| `retry-button`                | Button to retry after an error                        |
| `loading-message`             | Loading message display                               |
| `step`                        | Base part for all steps                               |
| `heading`                     | Base part for all headings                            |
| `button`                      | Base part for all buttons                             |
| `button-container`            | Container for buttons                                 |
| `question-step`               | Container for the question step                       |
| `question-heading`            | Heading for the question step                         |
| `textarea`                    | Textarea for entering the question                    |
| `input`                       | Base part for all input elements                      |
| `next-button`                 | Next button                                           |
| `category-step`               | Container for the category step                       |
| `category-heading`            | Heading for the category step                         |
| `categories-container`        | Container for category options                        |
| `category-option`             | Container for a single category option                |
| `radio-input`                 | Radio input for selecting a category                  |
| `category-label`              | Label for a category option                           |
| `back-button`                 | Back button                                           |
| `respondent-details-step`     | Container for the respondent details step             |
| `respondent-heading`          | Heading for the respondent details step               |
| `respondent-fields-container` | Container for respondent detail fields                |
| `field`                       | Container for a single field                          |
| `field-label`                 | Label for a field                                     |
| `text-input`                  | Text input for respondent details                     |
| `empty-message`               | Message shown when no respondent details are required |
| `submit-button`               | Submit button                                         |
| `thank-you-step`              | Container for the thank you step                      |
| `thank-you-heading`           | Heading for the thank you message                     |

## Framework Integration

### React

```jsx
import React from 'react';
import '@sensefolks/sf-sensequery';

function FeedbackForm() {
  return <sf-sensequery survey-key="your-survey-key"></sf-sensequery>;
}
```

### Vue

```html
<template>
  <sf-sensequery survey-key="your-survey-key"></sf-sensequery>
</template>

<script>
  import '@sensefolks/sf-sensequery';

  export default {
    name: 'FeedbackForm',
  };
</script>
```

### Angular

```typescript
// In your module
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

// In your component
import '@sensefolks/sf-sensequery';
```

<!-- Auto Generated Below -->

## Properties

| Property    | Attribute    | Description                              | Type     | Default     |
| ----------- | ------------ | ---------------------------------------- | -------- | ----------- |
| `surveyKey` | `survey-key` | The unique key for the survey to display | `string` | `undefined` |

## Shadow Parts

| Part                            | Description |
| ------------------------------- | ----------- |
| `"back-button"`                 |             |
| `"button"`                      |             |
| `"button-container"`            |             |
| `"categories-container"`        |             |
| `"category-heading"`            |             |
| `"category-label"`              |             |
| `"category-option"`             |             |
| `"category-step"`               |             |
| `"container"`                   |             |
| `"empty-message"`               |             |
| `"error-container"`             |             |
| `"error-message"`               |             |
| `"retry-button"`                |             |
| `"field"`                       |             |
| `"field-label"`                 |             |
| `"heading"`                     |             |
| `"input"`                       |             |
| `"loading-message"`             |             |
| `"message"`                     |             |
| `"next-button"`                 |             |
| `"question-heading"`            |             |
| `"question-step"`               |             |
| `"radio-input"`                 |             |
| `"respondent-details-step"`     |             |
| `"respondent-fields-container"` |             |
| `"respondent-heading"`          |             |
| `"step"`                        |             |
| `"submit-button"`               |             |
| `"text-input"`                  |             |
| `"textarea"`                    |             |
| `"thank-you-heading"`           |             |
| `"thank-you-step"`              |             |

---

_Built with [StencilJS](https://stenciljs.com/)_
