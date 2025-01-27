Donations can be given at baboonxiv@gmail.com via PayPal.me/thexiv

# DotPipe.js: The Ultimate Interpreter for HTML and Modala JSONs

## Introduction
DotPipe.js is a groundbreaking JavaScript library designed to transform static web pages into highly interactive, dynamic experiences. By acting as an interpreter for Modala JSON and HTML structures, DotPipe.js allows developers to build powerful, responsive web applications with minimal code. Its feature-rich toolkit simplifies complex web development tasks, making it the go-to solution for modern web projects.

---

## Core Concept
DotPipe.js integrates JSON files with HTML elements to dynamically create, manipulate, and update web content. By leveraging custom tags, attributes, and classes, it provides unparalleled flexibility and control over the web development process. All active or container elements must have a unique `id` attribute, ensuring proper identification and functionality.

Key capabilities include:
- **Real-time content injection** for dynamic updates.
- **Effortless AJAX requests** to fetch and populate data.
- **Customizable components** like carousels, modals, and timed elements.
- **Event-driven behaviors** for responsive interactivity.

---

## Key Features
### 1. **Dynamic Content Injection**
DotPipe.js enables seamless updates to web content by injecting JSON or server responses directly into the DOM.

### 2. **Modala JSON Support**
Define and manage complex UI structures in JSON format, streamlining the development of layouts, tables, and menus.

### 3. **AJAX Integration**
Fetch data from APIs or local files with attributes like `ajax` and `insert`, making backend communication intuitive.

### 4. **Advanced Tag and Attribute System**
Custom tags such as `<pipe>`, `<dyn>`, and `<timed>` empower developers to build feature-rich, dynamic content effortlessly.

### 5. **Event Binding and Automation**
Automate repetitive tasks, including content refreshing and carousel navigation, while handling user interactions dynamically.

---

## Comprehensive Attribute, Class, and Tag List

### **Attributes**
| Attribute            | Description                                                                                       | Example                                                                                           |
|----------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `id`                 | Unique identifier required for all elements.                                                     | `<pipe id="pipe1" ajax="data.json" insert="content"></pipe>`                                |
| `ajax`               | URL or path to fetch data from.                                                                  | `<pipe ajax="data.json" query="key:value;" insert="content"></pipe>`                        |
| `insert`             | ID of the target element where content will be injected.                                         | `<pipe ajax="data.json" insert="content"></pipe>`                                             |
| `query`              | Passes query parameters to the `ajax` URL.                                                       | `<pipe ajax="data.json" query="key:value;"></pipe>`                                            |
| `modal`              | Links a JSON file containing modal content.                                                      | `<pipe modal="modal.json"></pipe>`                                                             |
| `file`               | Specifies the filename for downloads.                                                            | `<tag class="download" file="example.zip"></tag>`                                             |
| `directory`          | Path for downloads.                                                                              | `<tag class="download" directory="/files/" file="example.zip"></tag>`                       |
| `delay`              | Refresh interval (ms) for timed updates.                                                         | `<timed id="timed1" delay="3000" ajax="data.json" insert="content"></timed>`              |
| `style`              | Inline CSS styling.                                                                              | `<pipe style="color: red;" ajax="data.json"></pipe>`                                          |
| `x-toggle`           | Toggles classes on specified elements.                                                           | `<pipe x-toggle="id1:class1;id2:class2"></pipe>`                                                |
| `form-class`         | Associates form elements with dynamic functionality.                                              | `<tag form-class="form1" ajax="submit.json"></tag>`                                           |
| `turn`               | Cycles through specified actions or elements.                                                    | `<pipe turn="id1;id2"></pipe>`                                                                 |
| `remove`             | Removes specified elements from the DOM.                                                         | `<pipe remove="id1;id2;"></pipe>`                                                              |

### **Classes**
| Class                | Description                                                                                       | Example                                                                                           |
|----------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `pipe`               | Initializes a listener for dynamic updates.                                                      | `<pipe id="pipe1" class="pipe" ajax="data.json" insert="content"></pipe>`                 |
| `dyn`                | Triggers dynamic updates on click.                                                               | `<dyn id="dyn1" class="dyn" ajax="data.json" insert="content"></dyn>`                     |
| `download`           | Enables file downloads.                                                                          | `<tag class="download" file="example.zip"></tag>`                                             |
| `time-active`        | Activates timers for periodic updates.                                                            | `<timed id="timed1" class="time-active" ajax="data.json" delay="3000"></timed>`           |
| `time-inactive`      | Deactivates timers for periodic updates.                                                          | `<timed id="timed1" class="time-inactive"></timed>`                                           |
| `clear-node`         | Clears content of specified nodes.                                                                | `<pipe id="clear1" class="clear-node" insert="id1;id2;"></pipe>`                            |
| `modala`             | Links elements to Modala JSON content.                                                           | `<pipe id="modala1" class="modala" modal="modal.json"></pipe>`                              |
| `carousel`           | Creates a carousel element.                                                                      | `<carousel id="carousel1" class="carousel" delay="3000" boxes="5"></carousel>`            |
| `multi-part`         | Handles multi-part AJAX calls.                                                                   | `<pipe id="multipart1" class="multi-part" ajax="part1.json;part2.json"></pipe>`             |
| `plain-text`         | Inserts response as plain text.                                                                  | `<pipe id="plaintext1" class="plain-text" ajax="data.json" insert="content"></pipe>`      |
| `plain-html`         | Inserts response as HTML content.                                                                | `<pipe id="html1" class="plain-html" ajax="data.html" insert="content"></pipe>`           |
| `carousel-ajax`      | Enables AJAX-powered carousel updates.                                                           | `<carousel id="carouselAjax1" class="carousel-ajax" ajax="images.json" delay="3000"></carousel>` |

### **Tags**
| Tag                  | Description                                                                                       | Example                                                                                           |
|----------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `<pipe>`             | Processes dynamic content updates on page load.                                                  | `<pipe id="pipe1" ajax="data.json" insert="content"></pipe>`                                 |
| `<dyn>`              | Updates content dynamically on user interaction.                                                 | `<dyn id="dyn1" ajax="data.json" insert="content"></dyn>`                                   |
| `<timed>`            | Refreshes content at specified intervals.                                                        | `<timed id="timed1" delay="3000" ajax="data.json" insert="content"></timed>`              |
| `<carousel>`         | Creates a rotating content carousel.                                                             | `<carousel id="carousel1" ajax="images.json" delay="3000" boxes="3"></carousel>`          |
| `<lnk>`              | Provides AJAX-enhanced hyperlinks.                                                               | `<lnk id="lnk1" ajax="page.html" query="key:value;"></lnk>`                                 |

---

## Example Use Cases

### 1. **Dynamic Content Loading**
```html
<pipe id="pipe1" ajax="data.json" query="userId:123;" insert="user-profile"></pipe>
```
This dynamically fetches user data from `data.json` and populates the element with `id="user-profile"`.

### 2. **Interactive Modals**
```html
<pipe id="modala1" class="modala" modal="modal-content.json" insert="modal-container"></pipe>
```
This creates a modal window populated with content from `modal-content.json`.

### 3. **Automated Carousels**
```html
<carousel id="carousel1" class="carousel" delay="5000" ajax="carousel-data.json" insert="carousel-container"></carousel>
```
This carousel auto-refreshes every 5 seconds with data from `carousel-data.json`.

---

## Why Choose DotPipe.js?
1. **Ease of Use**: Simplifies complex DOM manipulations and AJAX workflows.
2. **Flexibility**: Supports a vast array of attributes, classes, and custom tags.
3. **Efficiency**: Reduces boilerplate code and streamlines development.
4. **Scalability**: Integrates seamlessly with JSON-based structures for scalable UI design.
5. **Interactivity**: Handles user interactions dynamically, enabling responsive web applications.

---

DotPipe.js is your ultimate solution for building dynamic, data-driven web applications with ease and efficiency. Start transforming your web projects today!



# PipesJS v 3.7

Bug fixes
 - recognizes id adherence by itself

added remedial get-var and set-var for query 
 - use set-var to put query into insert Node
 - get get-var to put them in query and send to pipes when clicked

# Irondocks v 3.45.1

Bug fixes

added ajax-multi

All is well!

# Irondocks v 3.11.0

the new set of key pairs for Modala are great

sources="file;file1;file2"

auto = true

iter = 1

vertical = false

direction = right

Some of the best I've ever done. (Still not using AI)

# Irondocks v 3.0.5

"set-attr": now active in this way: set-attr="id.attr:value;id2.attr:val2;id.attr2:val3"

Small changes, reignited the Modala key of "br" for having "x" amount of HTML line breaks.

Updated "HOWTO"

Started automatic Listeners again

# Irondocks v3

Thankfully, I noticed that the '?' was missing in the URLs being AJAXed to. That's now fixed. Please bring up issues to me here. I'd love to fix them

Also, I figured that 'insert' is now a good way to address multi-changes. It's not necessary, but it's an addition. insert="id:incoming.foo;id2:incoming.bar;"

# Irondocks v2.8.3

Ahh how time flies. onclick is unnecessary. At all. If you wish to have a tag be active, ID it. It'll act with the rest of the code. Everything is good. But! Nested modals are a bit slow. Till a solution is found! goodnight!

# Irondocks v2.0

One very huge and important update here: { "modal": "foo.json" } is now the official nest key/value for inserting nested template files.
Must use "onclick": "pipes(this)" at any point you're going to be using Invents. The name pipes() is not going to be deprecated. It will be an alias at some point.

# Irondocks v1.0

Irondocks is a JSON structure-mapped HTML translator where you can create templates, and offer more pages to users with less code. It's a run away hit when you notice how fun it is. Used with Invents it's as perfectly harmonizing as any other framework. Give it a go. It's at least worthy of a look. Just clone and use Invents. Affix the JSON of HTML to the function

modala({"key": "pair",...}, rootNode);

and run it on the page you want. That said, you will need to make one value, the delay attribute can be used to state that you want your timers all to use TimeOuts every x milliseconds.

At that point in Irondocks, Invents will have a future of being created in Irondocks. But this is far off. The Irondocks package, as it sets, is a rich and heavily blendable template. This is because you can write JSONs in such languages as PHP, and it can be given to the Irondocks interpreter. Very keen I think.

Another problem with Irondocks, though, is that it doesn't create subpages from the function. It strictly sticks to the first page. Again, this is JS's fault and if I find another way, I will. But you can call and replace more than one DOM Node at a time. This is seen in test.php. The example shows more than one timed function going on. And as it is, the templates can work with changing data. So, no loss of utility really happens within Irondocks huge exterior from nesting out-of-the-box information when trying to scale for template use. That means we have a great ability to give you complete control over your coding. Your wish is in a command. It's a strong adversary to the others out there. With a tenth of the learning time. Honestly? it's as always HTML with more specs you know you need in a way you love. Thanks for choosing Invents. I appreciate it.
