Please drop me a donation at baboonxiv@gmail.com on Paypal.com.
I take Bitcoin as well!

**bc1qjt8je65vc245y2xq0cx8lfdq0cpvxt957ns2ac**

Or ETH **0x12c35f0d64cBbf3Ea250daD1C82E93902Be5198e**

Or BTC Cash: **bitcoincash:qq6qugkmnl42sm3lgymrnsdrkpgt3a24pqllt4mlsg**

# DotPipe.js Function Compendium

This document details the functions within `dotpipe.js`, outlining their purpose, parameters, attributes, and how they interconnect. It serves as a guide for beginners, amateurs, and professionals to understand and utilize DotPipe.js effectively.  

# Custom Tagnames in DotPipe.js

1. `<pipe>`
   Purpose: Initializes on DOMContentLoaded Event for automatic event handling.
   Example: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">

2. `<dyn>`
   Purpose: Automatic event listening tag for onclick="pipes(this)".
   Example: <dyn ajax="foo.bar" query="key0:value0;" insert="someID">

3. `<timed>`
   Purpose: Timed result refreshing tags for keeping content up-to-date.
   Example: <timed ajax="foo.bar" delay="3000" query="key0:value0;" insert="someID">

These custom tagnames enhance the functionality of DotPipe.js by providing specialized elements for dynamic content loading, timed updates, carousels, and interactive links.
#

# Modala Documentation in DotPipe.js

Modala is a core feature of DotPipe.js that dynamically generates HTML elements based on JSON structures. It provides a powerful way to create and manipulate DOM elements programmatically.

## Basic Usage

The main function for using Modala is `modala(value, tempTag, root, id)`.

- `value`: JSON object describing the DOM structure
- `tempTag`: Target DOM element or its ID
- `root`: Default container (optional)
- `id`: Optional ID for the element (optional)

Example:

```javascript
const modalaConfig = {
    "tagname": "div",
    "id": "myContent",
    "class": "content-container",
    "textContent": "Hello, Modala!"
};

modala(modalaConfig, document.getElementById('targetElement'));

```

## JSON Structure
# The JSON structure for Modala supports various attributes:

- `tagname`: HTML element to create
- `textContent` or `label`: Text content of the element
- `id`: ID attribute
- `class`: CSS class(es)
- `style`: Inline styles
- `ajax`: URL for AJAX content
- `header`: For creating <head> elements

## Nested elements are created by nesting objects within the JSON structure.

## Special Attributes
- `br`: Adds line breaks
- `select` and `options`: Creates dropdown menus
- `sources`: For carousel-like elements
- `css` and `js`: Adds stylesheets and scripts
- AJAX Integration
- Modala can fetch and render content dynamically:

<div class="modala" ajax="content.json" insert="containerID"></div>

## Advanced Features
- Supports creation of complex, nested DOM structures
- Handles various media types (images, audio, video)
- Integrates with other DotPipe.js features like carousels
- Can manipulate existing DOM elements
- Best Practices
- Use meaningful IDs and classes for generated elements
- Structure your JSON logically to mirror desired HTML structure
- Leverage AJAX capabilities for dynamic content loading
- Combine with other DotPipe.js features for enhanced functionality
- Modala is a versatile tool in DotPipe.js, enabling dynamic and flexible content generation and manipulation.

# DotPipe.js Function Documentation

## `domContentLoad(again = false)`
Attaches event listeners and initializes tags such as `<pipe>`, `<timed>`, `<dyn>`, and `<carousel>` when the DOM content loads.

## `modala(value, tempTag, root, id)`
Dynamically generates HTML elements based on a JSON structure and appends them to the DOM.

## `renderTree(value, tempTag)`
Renders hierarchical tree-like structures with collapsible behavior.

## `modalaHead(value)`
Creates `<title>`, `<link>` (CSS), and `<script>` tags based on a JSON structure and appends them to the `<head>` of the document.

## `modal(filename, tagId)`
Fetches a JSON file and renders it into a specified element using `modala()`.

## `modalList(filenames)`
Processes multiple JSON files (separated by semicolons) and renders them using `modala()`.

## `getJSONFile(filename)`
Fetches a JSON file from a specified URL and parses it.

## `getTextFile(filename)`
Fetches a text file and returns its content as plain text.

## `escapeHtml(html)`
Escapes special HTML characters in a string for safe rendering.

## `sha256(message)`
Computes the SHA-256 hash of a given message.

## `generateNonce()`
Generates a cryptographically secure nonce for use in security headers.

## `pipes(elem, stop = false)`
Core function handling events, dynamic AJAX calls, and DOM updates based on the attributes of the triggered element.

## `setAJAXOpts(elem, opts = null)`
Configures AJAX options for a request, ensuring headers are correctly structured.

## `formAJAX(elem, classname)`
Builds a query string from form elements with a specified class name.

## `navigate(elem, opts = null, query = '', classname = '')`
Sends AJAX requests with optional headers and query parameters.

## `setTimers(target)`
Manages timed events for tags like `<timed>` and `<carousel>`.

## `carouselButtonSlide(elem, direction)`
Slides the carousel left or right when triggered.

## `carouselButtonStep(elem, direction)`
Steps the carousel left or right by one item when triggered.

## `shiftFilesLeft(elem, auto = false, delay = 1000)`
Shifts carousel items to the left.

## `shiftFilesRight(elem, auto = false, delay = 1000)`
Shifts carousel items to the right.

## `fileShift(elem)`
Updates the file index for carousel-like elements.

## `fileOrder(elem)`
Handles file ordering for carousel-like elements.

## `carousel(elem, auto = true)`
Creates and updates carousels dynamically, supporting various media types.

## `htmlToJson(htmlString)`
Converts an HTML string into a JSON representation.

## `classOrder(elem)`
Toggles through predefined class names on an element.

## `addPipe(elem)`
Adds event listeners for "pipe" behavior on an element or array of elements.

## `hasPipeListener(elem)`
Checks if an element already has a pipe listener attached.

## `copyContentById(id)`
Copies the content of an element with the specified ID to the clipboard.

## `modalCard(filename, insert_id, x_center = false, y_center = false, duration = -1, zindex = 100)`
Creates a modal card with content from a specified file.

## `textCard(text, id = "", classes = "", x_center = false, y_center = false, duration = -1, zindex = 100)`
Creates a text card with specified positioning and styling.

# Custom Attributes in DotPipe.js

- ajax
- insert
- query
- headers
- x-toggle
- modal
- download
- pipe
- form-class
- time-active
- time-inactive
- delay
- file-order
- file-index
- boxes
- class-switch
- class-index
- turn
- turn-index
- interval
- get-var
- set-var
- x-value-set
- x-value-get
- x-value-rem
- x-value-clear
- tool-tip
- display
- remove
- sources
- carousel-step-right
- carousel-step-left
- carousel-slide-left
- carousel-slide-right
- event
- mode
- directory
- vertical
- iter
- auto
- type
- modala-multi-first
- modala-multi-last
- plain-text
- plain-html
- tree-view
- dyn-one
- dyn-done
- incrIndex
- decrIndex

# Custom Classes in DotPipe.js

- pipe
- mouse
- download
- redirect
- clear-node
- multi-part
- carousel
- carousel-step-right
- carousel-step-left
- carousel-slide-left
- carousel-slide-right
- modala
- modala-multi-first
- modala-multi-last
- tree-view
- dyn-one
- dyn-done
- incrIndex
- decrIndex
- x-value-set
- x-value-get
- x-value-rem
- x-value-clear
- plain-text
- plain-html
- json
- disabled

# DotPipe.js Custom Attributes and Classes Usage Examples

## Custom Attributes

1. `ajax`:
   <div ajax="data.php"></div>
   Fetches content from data.php.

2. `insert`:
   <div ajax="data.php" insert="result-container"></div>
   Specifies where to insert the fetched content.

3. `query`:
   <div ajax="search.php" query="term:javascript;limit:10"></div>
   Sends query parameters with the AJAX request.

4. `headers`:
   <div ajax="api.php" headers="Authorization:Bearer token123&Content-Type:application/json"></div>
   Sets custom headers for the AJAX request.

5. `x-toggle`:
   <button x-toggle="panel1:visible;panel2:hidden">Toggle</button>
   Toggles CSS classes on specified elements.

6. `modal`:
   <div modal="modal-content.json:modal-container"></div>
   Loads modal content from a JSON file.

7. `download`:
   <a class="download" file="document.pdf" directory="/files/">Download</a>
   Creates a downloadable link.

8. `pipe`:
   <div class="pipe" class="download" file="document.pdf" directory="/files/">Click me</div>
   Fires on window load.

9. `form-class`:
   <any-tag class="ajax-form" form-class="form-field">
     <input class="form-field" name="username">
   Groups form elements for AJAX submission.

10. `time-active` and `time-inactive`:
    <div class="carousel time-active">Auto-sliding carousel</div>
    <div class="carousel time-inactive">Static carousel</div>
    Controls timed behavior of elements.

11. `delay`:
    <div class="carousel" delay="3000">Carousel with 3s delay</div>
    Sets the delay for timed actions.

12. `file-order`:
    <div class="carousel" file-order="img1.jpg;img2.jpg;img3.jpg"></div>
    Specifies the order of files for carousels or similar components.

13. `file-index`:
    <div class="carousel" file-index="0"></div>
    Sets the starting index for file-based components.

14. `boxes`:
    <div class="carousel" boxes="3"></div>
    Specifies the number of visible items in a carousel.

15. `class-switch`:
    <div class="theme-toggle" class-switch="light-theme;dark-theme"></div>
    Allows cycling through a list of classes.

16. `class-index`:
    <div class="theme-toggle" class-index="0"></div>
    Keeps track of the current class in class-switch.

17. `turn`:
    <div turn="panel1;panel2;panel3"></div>
    Cycles through different panels or states.

18. `turn-index`:
    <div turn="panel1;panel2;panel3" turn-index="0"></div>
    Keeps track of the current state in turn attribute.

19. `interval`:
    <div class="auto-update" interval="5"></div>
    Sets the interval for recurring actions.

20. `get-var` and `set-var`:
    <div get-var="username:currentUser"></div>
    <div set-var="username:John"></div>
    Gets and sets JavaScript variables.

21. `x-value-set`, `x-value-get`, `x-value-rem`, `x-value-clear`:
    <input id="name" class="x-value-set" insert="displayName">
    <div id="displayName"></div>
    Manipulates values between elements.

22. `tool-tip`:
    <button tool-tip="Click to submit">Submit</button>
    Adds a tooltip to an element.

23. `display`:
    <button display="panel1;panel2">Toggle Panels</button>
    Toggles the display of specified elements.

24. `remove`:
    <button remove="temp-message">Clear Message</button>
    Removes specified elements from the DOM.

25. `sources`:
    <div class="carousel" sources="img1.jpg;img2.jpg;img3.jpg"></div>
    Specifies source files for components like carousels.

26. `event`:
    <div class="pipe" event="click;mouseover">Interactive</div>
    Specifies events to listen for.

27. `mode`:
    <div ajax="data.php" mode="POST"></div>
    Sets the HTTP method for AJAX requests.

28. `directory`:
    <a class="download" file="doc.pdf" directory="/files/">Download</a>
    Specifies the directory for downloadable files.

29. `vertical`:
    <div class="carousel" vertical="true"></div>
    Creates a vertical carousel.

30. `iter`:
    <div class="carousel" iter="2"></div>
    Sets the number of items to iterate in carousels.

31. `auto`:
    <div class="carousel" auto="false"></div>
    Controls automatic progression in carousels.

32. `type`:
    <div class="carousel" type="image"></div>
    Specifies the type of content in components.

## Custom Classes

1. `pipe`:
   <div class="pipe">Pipe-enabled element</div>
   Firess on window load.

2. `mouse`:
   <div class="mouse" event="mouseover;dblclick">Mouse-reactive element</div>
   Enables mouse event handling. Pairs with event attribute.

3. `download`:
   <a class="download" file="document.pdf">Download PDF</a>
   Creates a downloadable link.

4. `redirect`:
   <a class="redirect" ajax="new-page.html">Go to New Page</a>
   Performs a redirect after AJAX call.

5. `clear-node`:
   <button class="clear-node" insert="content-area">Clear Content</button>
   Clears content of specified nodes.

6. `multi-part`:
   <div class="multi-part" ajax="part1.html:container1;part2.html:container2"></div>
   Loads multiple AJAX parts.

7. `carousel`:
   <div class="carousel" sources="img1.jpg;img2.jpg;img3.jpg"></div>
   Creates a carousel component.

8. `carousel-step-right`, `carousel-step-left`:
   <button class="carousel-step-right">Next</button>
   <button class="carousel-step-left">Previous</button>
   Controls for stepping through carousel items.

9. `carousel-slide-left`, `carousel-slide-right`:
   <div class="carousel carousel-slide-left"></div>
   Enables sliding animation for carousels.

10. `carousel-ajax`, `carousel-images`, `carousel-video`, `carousel-audio`, `carousel-iframe`, `carousel-link`:
    <div class="carousel carousel-images"></div>
    Specifies the type of carousel content.

11. `carousel-vert`:
    <div class="carousel carousel-vert"></div>
    Creates a vertical carousel.

12. `modala`:
    <div class="modala" ajax="content.json"></div>
    Enables modal functionality.

13. `modala-multi-first`, `modala-multi-last`:
    <div class="modala modala-multi-first"></div>
    Controls insertion point for multi-part modals.

14. `tree-view`:
    <ul class="tree-view">
      <li class="tree-item">Item 1
        <ul class="sub-tree">
          <li class="tree-item">Subitem 1</li>
        </ul>
      </li>
    </ul>
    Creates a collapsible tree structure.

15. `dyn-one`, `dyn-done`:
    <div class="dyn-one">One-time Dynamic Content</div>
    Controls one-time dynamic content loading.

16. `incrIndex`, `decrIndex`:
    <button class="incrIndex">Next</button>
    <button class="decrIndex">Previous</button>
    Increments or decrements indexes in components.

17. `plain-text`, `plain-html`:
    <div class="plain-text" ajax="content.txt"></div>
    <div class="plain-html" ajax="content.html"></div>
    Specifies how to interpret AJAX responses.

18. `json`:
    <div class="json" ajax="data.json"></div>
    Handles JSON responses.

19. `disabled`:
    <button class="disabled">Inactive Button</button>
    Disables interaction with an element.
