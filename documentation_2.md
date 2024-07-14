## PipesJS Documentation

### Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Basic Usage](#basic-usage)
3. [Features and Attributes](#features-and-attributes)
    - [Attributes](#attributes)
    - [Tags](#tags)
4. [Advanced Usage](#advanced-usage)
    - [Creating a Carousel](#creating-a-carousel)
    - [Handling Dynamic Content](#handling-dynamic-content)
    - [Event Handling](#event-handling)
    - [Downloading Files](#downloading-files)
5. [Examples](#examples)
    - [Simple AJAX Call](#simple-ajax-call)
    - [Multiple AJAX Calls](#multiple-ajax-calls)
    - [Using Callbacks](#using-callbacks)
    - [Dynamic Forms](#dynamic-forms)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Changelog](#changelog)
9. [License](#license)

## Introduction

PipesJS is a versatile JavaScript library designed to streamline the integration of dynamic content into HTML documents. This documentation will guide you through the various features and functionalities provided by PipesJS, enabling you to effectively utilize its capabilities in your web projects.

## Getting Started

### Installation

To begin using PipesJS, include the library in your HTML document:

```html
<script src="path/to/pipes.js"></script>
```

### Basic Usage

To initialize PipesJS, simply add the following script at the end of your HTML document:

```html
<script>
document.addEventListener("DOMContentLoaded", function() {
    domContentLoad();
});
</script>
```

## Features and Attributes

### Attributes

PipesJS provides a wide range of attributes and tags that can be used to dynamically update and manage content on your web page. Below is a comprehensive list of these attributes and their use cases:

- **insert**: Specifies the ID of the element where the AJAX response will be inserted.
- **ajax**: Calls and returns content from multiple files for insertion into specified nodes. Allows class-type insertion (e.g., `ajax="page.html:therethere@plain-html"`).
- **turn**: Calls each node with an ID matching the listed values, delimited by a semicolon.
- **ajax-multi**: Similar to `ajax`, but allows multiple insertions (e.g., `ajax-multi="page.html:therethere@plain-html"`).
- **callbacks**: Calls a function specified as the attribute value.
- **set-var**: Sets a window variable to a dynamic value.
- **get-var**: Retrieves a variable from the window array in JavaScript.
- **clear-node**: Clears nodes specified in the `insert` attribute, delimited by `;`.
- **modala-multi-last**: Creates multiple AJAX calls, removing the last item after each call (e.g., `ajax="foo.bar:insertHere:x;.."`, where `x` is the max number of insertions).
- **modala-multi-first**: Similar to `modala-multi-last`, but removes the first item instead.
- **call-chain**: Functions like `callbacks`, but does not use AJAX results for the chained set of commands.
- **query**: Default query string associated with the URL (e.g., `<anyTag form-class="someClass" query="key0:value0;key1:value2;" ajax="page.foo">`).
- **modal**: Inserts the specified Irondocks file for template ease of use.
- **br**: Inserts the specified number of line breaks (e.g., `{ "br": "x" }`).
- **download**: Class for downloading files (e.g., `<tagName class="download" file="foo.zip" directory="/home/bar/">`).
- **x-toggle**: Toggles values from the class attribute listed in the `toggle` attribute (e.g., `"id1:class1;id1:class2;id2:class2"`).
- **directory**: Specifies the relative or full path of the file to download.
- **redirect**: Follows the AJAX call in POST or GET mode (e.g., `<pipe ajax="foo.bar" class="redirect" query="key0:value0;" insert="someID">`).
- **js**: Modala key/value pair for including external JavaScript files.
- **css**: Modala key/value pair for importing stylesheet files.
- **lnk**: Tag for clickable links (e.g., `<lnk ajax="goinghere.html" query="key0:value0;">`).
- **pipe**: Tag that initializes on the `DOMContentLoaded` event (e.g., `<pipe ajax="foo.bar" query="key0:value0;" insert="someID">`).
- **dyn**: Automatic event-listening tag for `onclick="pipes(this)"` (e.g., `<dyn ajax="foo.bar" query="key0:value0;" insert="someID">`).
- **dyn-one**: Class to stop recurring clicking activities.
- **plain-text**: Returns plain text to the insertion point.
- **plain-html**: Returns true HTML content.
- **timed**: Timed result refreshing tags (e.g., `<timed ajax="foo.bar" delay="3000" query="key0:value0;" insert="someID">`).
- **delay**: Delay between `<timed>` tag refreshes (required for `<timed>` tag).
- **carousel**: Tag to create a carousel that moves every `timeOut()` delay (e.g., `<carousel ajax="foo.bar" file-order="foo.bar;bar.foo;foobar.barfoo" delay="3000" id="thisId" insert="thisId" height="100" width="100" boxes="8" style="height:100;width:800">`).
- **carousel-ajax**: Class to create Modala sets for carousel use.
  - **-images**: Class to use pure images for the carousel.
  - **-auto-off**: Class to stop the carousel from moving (better to create buttons).
  - **-vert**: Class to make the carousel vertical (default is horizontal).
  - **-video**: Class to make a video carousel.
  - **-audio**: Class to make an audio carousel.
  - **-iframe**: Class to make an iframe carousel.
  - **-link**: Class to make a link carousel.
- **direction**: Specifies the direction of the carousel (right/left vs up/down).
- **vertical**: Boolean attribute to make the carousel vertical.
- **auto**: Boolean attribute for auto-scrolling the carousel.
- **sources**: List of files for the carousel, delimited by `;`.
- **type**: Specifies the type of objects in the carousel.
- **width**: Width of the carousel frame.
- **height**: Height of the carousel frame.
- **boxes**: Number of box cards in the carousel.
- **file-order**: Specifies the order of files to be iterated through (e.g., `<pipe query="key0:value0;" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">`).
- **file-index**: Counter for the index to use with `file-order`.
- **incrIndex**: Increment through the index of `file-order`.
- **decrIndex**: Decrement through the index of `file-order`.
- **iter**: Number of steps to take when stepping through `file-order`.
- **set-attr**: Sets an attribute in the target HTML tag (e.g., `<pipe id="thisOrSomeId" set-attr="id.attr:value" ajax="foo.bar" query="do0:reme0;" insert="thisOrSomeID">`).
- **mode**: Specifies the HTTP method for the AJAX call ("POST" or "GET"; default is "POST").
- **multiple**: Indicates that the object has two or more key/value pairs, used for multi-select form boxes.
- **remove**: Removes an element specified in the tag (e.g., `<anyTag remove="someID;someOtherId;">`).
- **display**: Toggles visibility of elements specified in the value (e.g., `<anyTag display="someID;someOtherId;">`).
- **json**: Returns a JSON file specified as the value.
- **headers**: Specifies headers in CSS markup-style attribute, delimited by `&` (e.g., `<any ajax="foo.bar" headers="foobar:boo&barfoo:barfoo;q:9&" insert="someID">`).
- **form-class**: Class name for form elements.
- **action-class**: Class name for elements to be triggered (acts as a listener to certain other tags).
- **mouse**: Class name for working with PipesJS attributes on mouse events (e.g., `event="mouseover;mouseleave"`).
- **mouse-insert**: Class name for working with PipesJS attributes on mouse events.
- **event**: Works with `mouse` or `pipe` class only. Creates an event listener on the inserted node.
- **options**: Used with `<select>` tag to easily roll out multiple select options.

### Tags

- **<lnk>**: Creates a clickable link.
- **<pipe>**: Initializes on `DOMContentLoaded` event.
- **<dyn>**: Automatic event-listening tag.
- **<timed>**: Timed result

 refreshing tags.
- **<carousel>**: Tag for creating a carousel.

## Advanced Usage

### Creating a Carousel

To create a carousel that scrolls through images every 3 seconds:

```html
<carousel ajax="images.json" file-order="image1.jpg;image2.jpg;image3.jpg" delay="3000" id="imageCarousel" insert="carouselContainer" height="200" width="300" boxes="3" style="height:200;width:300"></carousel>
```

### Handling Dynamic Content

Use the `<pipe>` tag to dynamically load and insert content:

```html
<pipe ajax="content.html" query="param1:value1;param2:value2;" insert="contentContainer"></pipe>
```

### Event Handling

Add event listeners to dynamically loaded content:

```html
<caller event="click:handleClick;mouseover:handleMouseOver"></caller>
```

### Downloading Files

Enable file downloads using the `download` class:

```html
<tagName class="download" file="example.zip" directory="/downloads/"></tagName>
```

## Examples

### Simple AJAX Call

Load content from `example.html` into an element with the ID `content`:

```html
<pipe ajax="example.html" insert="content"></pipe>
```

### Multiple AJAX Calls

Load content from multiple files into different elements:

```html
<pipe ajax-multi="page1.html:content1;page2.html:content2"></pipe>
```

### Using Callbacks

Execute a function after an AJAX call:

```html
<pipe ajax="data.json" callbacks="processData" insert="dataContainer"></pipe>
<script>
function processData(response) {
    console.log(response);
}
</script>
```

### Dynamic Forms

Create a form that dynamically loads options:

```html
<select form-class="dynamicSelect" ajax="options.json" options="option1;option2;option3"></select>
```

## API Reference

### domContentLoad

Initializes the PipesJS library and processes all tags and attributes defined in the HTML document. This function should be called when the DOM content is fully loaded.

```javascript
function domContentLoad() {
    // Implementation
}
```

## Troubleshooting

### Common Issues

- **Content Not Loading**: Ensure the `ajax` attribute URL is correct and the server is responding.
- **Event Listeners Not Working**: Verify that the `event` attribute is correctly specified and the event handler functions are defined.

### Debugging Tips

- Use browser developer tools to inspect AJAX requests and responses.
- Check the console for any error messages related to PipesJS.

## Changelog

### Version 1.0.0

- Initial release with basic functionality.

### Version 1.1.0

- Added support for carousels and dynamic forms.

## License

PipesJS is licensed under the MIT License. See the LICENSE file for more details.

---

This expanded documentation covers various aspects of PipesJS, including detailed descriptions of attributes and tags, advanced usage examples, and troubleshooting tips. Feel free to let me know if you need more information or specific examples!
