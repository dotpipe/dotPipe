/**
  *  All tags being used must have an 'id' attribute
  *  Usable DOM Attributes (almost all are enabled for combinations)
  *  Attribute/Tag   |   Use Case
  *  -------------------------------------------------------------
  *  insert............= [Attr] return ajax call to this id
  *  ajax..............= [Attr] * calls and returns the value file's output ex: <pipe id="id1" ajax="foo.bar:insert1:countByEvent" query="key0:value0;" insert="someID">
  *    *  *  query.............= [Attr] default query string associated with url ex: <anyTag form-class="someClass" query="key0:value0;key1:value2;" ajax="page.foo"> (Req. form-class)
  *  turn..............= [Attr] * turns based element routine element ex: <anyTag turn="firstelem;secondelem;" class="decrIndex" index="1"> 
  *  callback..........= [Attr] callback function ex: <pipe id="id1" callback="foo" class="class1 class2" value="submit" callback-class="class1 class2" ajax="page.foo;insert-id1">
  *  callback-class....= [Attr] class to be used in the callback function ex: <pipe id="id1" callback="foo" class="class1 class2" value="submit" callback-class="class1 class2" ajax="page.foo;insert-id1">
  *     - note: names will be sorted alphabetically in the param list. Params can be infinite. just ready your function for that consolidatoin of params.
  *  modal.............= [Modala Key] * Inserts JSON files in the insert targets for template ease of use. "modal": "json1.json:insert1.insert2.insert3;continued"
  *  download..........= [Class] for downloading files ex: <tagName class="download" file="foo.zip" directory="/home/bar/"> (needs ending with slash)
  *  file..............= [Attr] filename to download
  *  set...............= [Attr] set the value of the element attribute ex: <tagName set="set-this-id:attribute-name:value">
  *  get...............= [Attr] get the value of the element attribute and return to this element ex: <tagName get="get-this-id:attribute-name">
  *  delete............= [Attr] delete the value of the element attribute ex: <tagName delete="delete-this-id:attribute-name">
  *  x-toggle..........= [Attr] toggle values from class attribute that are listed in the toggle attribute "id1:class1;id1:class2;id2:class2"
  *  directory.........= [Attr] relative or full path of 'file'
  *  tool-tip..........= [Attr] tooltip for the element ex: <tagName tool-tip="this is a tooltip;id;class;duration;zIndex">
  *  modal-tip..........= [Attr] tooltip for the element ex: <tagName tool-tip="filename.json;duration;zIndex">
  *  copy..............= [Attr] copy the value of the element to the clipboard ex: <tagName copy="copy-this-id">
  *  clear-node........= [Class] clear nodes. delimited in insert="first;second;thirdnode" by ';'
  *  redirect..........= [Class] "follow" the ajax call in POST or GET mode ex: <pipe ajax="foo.bar" class="redirect" query="key0:value0;" insert="someID">
  *  modala-multi-last.= [Class] to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the last
  *  modala-multi-first= [Class] to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the first
  *  time-active.......= [Class] to activate timers for things that go on continuously
  *  time-inactive.....= [Class] to deactivate timers for things that go on continuously
  *  disabled..........= [Class] to disable a tag (use x-toggle to toggle state of this and time-active/-inactive)
  *  br................= [Specifically a] Modala key/value pair. "br": "x" where x is the number of breaks in succession.
  *  js................= [Specifically a] Modala key/value pair. Allows access to outside JavaScript files in scope of top nest.
  *  css...............= [Specifically a] Modala key/value pair. Imports a stylesheet file to the page accessing it.
  *  modala............= [Specifically a] Modala key/value pair. Allows access to Modala files in scope of top nest.
  *  tree-view.........= [Specifically a] Modala key/value pair or class. Allows access to Tree files in scope of top nest.
  *  strict-json.......= [Class] returns only JSON to full page as response. Error on non-parse
  *  <lnk>.............= [Tag] tag for clickable link <lnk ajax="goinghere.html" query="key0:value0;">
  *  <pipe>............= [Tag] (initializes on DOMContentLoaded Event) ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  <dyn>.............= [Tag] Automatic eventListening tag for onclick="pipes(this)" ex: <dyn ajax="foo.bar" query="key0:value0;" insert="someID">
  *  <search>..........= [Tag] Search tag for searching in the page ex: <search use-id="id1;id2;id3;" input-width="200px" input-height="30px" placeholder="Search..." search-delay="300">
  *  <csv>.............= [Tag] CSV tag for displaying CSV data in a table format ex: <csv ajax="data.csv" insert="tableId" headers="true">
  *  <tabs>............= [Tag] Tabs tag for creating tabbed interfaces ex: <tabs tab="Tab1:tab1Id:source1;Tab2:tab2Id:source2" class="tab-class" style="width:100%;height:50px;">
  *  <login>...........= [Tag] Login tag for creating login and registration forms ex: <login login-page="login.php" registration-page="register.php" css-page="styles.css">
  *  \n................= [-] RegEx emplacement to insert <br /> in Modala contents for innerHTML
  *  plain-text........= [Class] plain text returned to the insertion point
  *  plain-html........= [Class] returns as true HTML
  *  redirect..........= [Class] redirects to the ajax call in POST or GET mode ex: <tag id="someref" ajax="foo.bar" class="redirect" query="key0:value0;">
  *  <timed>...........= [Tag] Timed result refreshing tags (Keep up-to-date handling on page) ex: <timed ajax="foo.bar" delay="3000" query="key0:value0;" insert="someID">
  *  delay.............= [Attr] delay between <timed> tag refreshes (required for <timed> tag) ex: see <timed>
  *  <carousel>........= [Tag] to create a carousel that moves every a timeOut() delay="x" occurs ex: <carousel ajax="foo.bar" file-order="foo.bar;bar.foo;foobar.barfoo" delay="3000" id="thisId" insert="thisId" height="100" width="100" boxes="8" style="height:100;width:800">
  *  carousel-step-right.= [Class] to move the carousel to the right
  *  carousel-step-left.= [Class] to move the carousel to the left
  *  carousel-slide-right.= [Class] to iterate the carousel to the right
  *  carousel-slide-left.= [Class] to iterate the carousel to the left
  *  boxes.............= [Attr] attribute to request for x boxes for carousel elementss ex: <carousel ajax="foo.bar" file-order="foo.bar;bar.foo;foobar.barfoo" delay="3000" id="thisId" insert="thisId" height="100" width="100" boxes="8" style="height:100;width:800">
  *  file-order........= [Attr] ajax to these files, iterating [0,1,2,3]%array.length per call (delimited by ';') ex: <pipe query="key0:value0;" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  file-index........= [Attr] counter of which index to use with file-order to go with ajax ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  incrIndex.........= [Class] increment thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="incrIndex" interval="2" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  decrIndex.........= [Class] decrement thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="decrIndex" interval="3" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  interval..........= [Attr] Take this many steps when stepping through file-order default = 1
  *  mode..............= [Attr] "POST" or "GET" (default: "POST") ex: <pipe mode="POST" set-attr="value" ajax="foo.bar" query="key0:value0;" insert="thisOrSomeID">
  *  multiple..........= [Class] states that this object has two or more key/value pairs use: states this is a multi-select form box
  *  remove............= [Attr] * remove element in tag ex: <anyTag remove="someID;someOtherId;">
  *  display...........= [Attr] toggle visible and invisible of anything in the value ex: <anyTag display="someID;someOtherId;">
  *  json..............= [Class] returns a JSON file set as value
  *  headers...........= [Attr] headers in CSS markup-style (delimited by '&') <any ajax="foo.bar" headers="foobar:boo&barfoo:barfoo;q:9&" insert="someID">
  *  form-class........= [Attr] class of devoted form elements
  *  action-class......= [Class] name of devoted to-be-triggered tags (acts as listener to other certain tag(s))
  *  mouse.............= [Class] name to work thru PipesJS' other attributes on event="mouseover;mouseleave" (example)
  *  mouse-insert......= [Class] name to work thru PipesJS' other attributes on event="mouseover;mouseleave" (example)
  *  event.............= [Attr] works with mouse/pipe class only.event="click;dblclick;etc" activates according to the event, like a normal click would
  *  options...........= [Attr] works with <select> tagName only. Key:Value; pairs to setup and easily roll out multiple selects.
  **** FILTERS aer go ahead code usually coded in other languages and just come back with a result. Not wholly different from AJAX. They are general purpose files.
  **** ALL HEADERS FOR AJAX are available. They will use defaults to
  **** go on if there is no input to replace them.
  */

document.addEventListener("DOMContentLoaded", function () {
    try {
        if (document.body != null && JSON.parse(document.body.textContent)) {
            const irc = JSON.parse(document.body.textContent);

            document.body.textContent = "";
            modala(irc, document.body);
            document.body.style.display = "block";
        }
    }
    catch (e) {
    }

    domContentLoad();
    addPipe(document.body);

    generateNonce().then(nonce => {
        const script_tags = document.getElementsByTagName("script");
        const style_tags = document.getElementsByTagName("style");

        Array.from(script_tags).forEach(function (elem) {
            elem.nonce = nonce;
        });
        Array.from(style_tags).forEach(function (elem) {
            elem.nonce = nonce;
        });
        PAGE_NONCE = nonce
        var meta = document.createElement("meta");
        meta.content = `script-src 'self' nonce-${PAGE_NONCE}; img-src 'self'; style-src 'self' nonce-${PAGE_NONCE}; child-src 'none'; object-src 'none'`;
        meta.httpEquiv = "Content-Security-Policy";
        document.head.appendChild(meta);
    });
});

let domContentLoad = (again = false) => {
    doc_set = document.getElementsByTagName("pipe");
    if (again == false) {
        Array.from(doc_set).forEach(function (elem) {
            if (elem.classList.contains("pipe-active"))
                return;
            elem.classList.toggle("pipe-active")
            pipes(elem);
        });
    }

    let elementsArray_time = document.getElementsByTagName("timed");
    Array.from(elementsArray_time).forEach(function (elem) {
        if (elem.classList.contains("time-inactive"))
            return;
        if (elem.classList.contains("time-active")) {
            auto = true;
            setTimers(elem);
        }
        else if (elem.classList.contains("time-inactive")) {
            auto = false;
        }
    });

    let elementsArray_dyn = document.getElementsByTagName("dyn");
    Array.from(elementsArray_dyn).forEach(function (elem) {
        if (elem.classList.contains("disabled"))
            return;
        elem.classList.toggle("disabled");
    });

    // Process search tags
    processSearchTags();
    // Process CSV tags
    processCsvTags();
    processLoginTags();
    processTabTags();
    processCartTags();
    processOrderConfirmationTags();
    processColumnsTags();
    let elements_Carousel = document.getElementsByTagName("carousel");
    Array.from(elements_Carousel).forEach(function (elem) {
        if (!elem.classList.contains("turn-auto"))
            return;
        if (elem.classList.contains("turn-auto")) {
            auto = true;
            setTimers(elem);
        }
        setTimeout(carousel(elem, auto), elem.getAttribute("delay"));
    });

    let elementsArray_link = document.getElementsByTagName("lnk");
    Array.from(elementsArray_link).forEach(function (elem) {
        if (elem.classList.contains("disabled"))
            return;
        elem.classList.toggle("disabled");

    });

    let elements_mouse = document.querySelectorAll(".mouse");
    console.log(elements_mouse.length);
    Array.from(elements_mouse).forEach(function (elemv) {
        console.log(elemv);
        if (elemv.hasAttribute("tool-tip")) {
            console.log(elemv.getAttribute("modal-tip") + "...");
            var eve = elemv.getAttribute("event");
            rv = ['mouseover'];
            if (eve) {
                rv = ev.split(";");
            }
            Array.from(rv).forEach((ev) => {
                elemv.addEventListener(ev, function (el) {
                    const rect = el.target.getBoundingClientRect();
                    const x = rect.left;
                    const y = rect.top;
                    var duration = 750;
                    var [tip, id, classes, duration, z] = el.target.getAttribute("tool-tip").split(";");
                    textCard(tip, id, classes, x + 15, y + 15, duration, z);
                });
            });
        }
        if (elemv.hasAttribute("modal-tip")) {
            console.log(elemv.getAttribute("modal-tip") + "...");
            var eve = elemv.getAttribute("event");
            rv = ['mouseover'];
            if (eve) {
                rv = ev.split(";");
            }
            Array.from(rv).forEach((ev) => {
                elemv.addEventListener(ev, function (el) {
                    const rect = el.target.getBoundingClientRect();
                    const x = rect.left;
                    const y = rect.top;
                    var [filename, duration, z] = el.target.getAttribute("modal-tip").split(";");
                    modalCard(filename, x + 15, y + 15, duration, z);
                });
            });
        }
        var ev = elemv.getAttribute("event");
        if (!ev) {
            elemv.addEventListener("click", function () {
                pipes(elemv, auto);
            });
            return;
        }
        var rv = ev.split(";");
        Array.from(rv).forEach((v) => {
            elemv.addEventListener(v, function () {
                pipes(elemv, auto);
            });
        });
    });
}

/**
 * columns-component.js - Multi-column layout component for dotPipe.js
 * This handles the <columns> custom element for creating responsive multi-column layouts
 * with dynamic content loading
 */

// Initialize columns component functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Process all columns tags
    processColumnsTags();
});

/**
 * Process all columns tags in the document
 */
function processColumnsTags() {
    const columnsElements = document.getElementsByTagName("columns");

    Array.from(columnsElements).forEach(function (columnsElement) {
        if (columnsElement.classList.contains("processed")) {
            return;
        }

        // Get attributes
        const columnCount = parseInt(columnsElement.getAttribute("count") || "2");
        const columnPercents = parseColumnPercents(columnsElement.getAttribute("percents"), columnCount);
        const height = columnsElement.getAttribute("height") || "auto";
        const width = columnsElement.getAttribute("width") || "100%";
        const pages = columnsElement.getAttribute("pages")?.split(";") || [];

        // Set up columns element
        setupColumnsElement(columnsElement, columnCount, columnPercents, height, width, pages);

        // Mark as processed
        columnsElement.classList.add("processed");
    });
}

/**
 * Parse column percentages from attribute
 * @param {string} percentsAttr - The percents attribute value (comma-separated)
 * @param {number} columnCount - The number of columns
 * @returns {Array} - Array of percentage values
 */
function parseColumnPercents(percentsAttr, columnCount) {
    if (!percentsAttr) {
        // If no percentages provided, distribute evenly
        const equalPercent = 100 / columnCount;
        return Array(columnCount).fill(equalPercent);
    }

    // Parse comma-separated percentages
    const percents = percentsAttr.split(',').map(p => parseFloat(p.trim()));

    // Validate percentages
    if (percents.length !== columnCount) {
        console.warn(`Column count (${columnCount}) doesn't match percentage count (${percents.length}). Using equal distribution.`);
        const equalPercent = 100 / columnCount;
        return Array(columnCount).fill(equalPercent);
    }

    // Check if percentages sum to 100
    const sum = percents.reduce((total, p) => total + p, 0);
    if (Math.abs(sum - 100) > 0.1) {
        console.warn(`Column percentages sum to ${sum}, not 100. Normalizing.`);
        // Normalize to 100%
        return percents.map(p => (p / sum) * 100);
    }

    return percents;
}

/**
 * Set up a columns element with necessary structure and content
 * @param {Element} columnsElement - The columns element to set up
 * @param {number} columnCount - Number of columns
 * @param {Array} columnPercents - Array of column percentages
 * @param {string} height - Height of the columns container
 * @param {string} width - Width of the columns container
 * @param {Array} pages - Array of page URLs to load into columns
 */
function setupColumnsElement(columnsElement, columnCount, columnPercents, height, width, pages) {
    // Create columns container
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'columns-container';
    columnsContainer.style.display = 'flex';
    columnsContainer.style.flexWrap = 'nowrap';
    columnsContainer.style.height = height.includes('px') ? height : `${height}px`;
    columnsContainer.style.width = width.includes('%') || width.includes('px') ? width : `${width}px`;

    // Create columns
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = `column column-${i + 1}`;
        column.id = `${columnsElement.id}-column-${i + 1}`;
        column.style.flex = `0 0 ${columnPercents[i]}%`;
        column.style.overflow = 'auto';
        column.style.padding = '15px';
        column.style.boxSizing = 'border-box';

        // Add loading indicator
        column.innerHTML = '<div class="column-loading">Loading content...</div>';

        // Add to container
        columnsContainer.appendChild(column);
    }

    // Replace columns tag content with our container
    columnsElement.innerHTML = '';
    columnsElement.appendChild(columnsContainer);

    // Load content into columns
    loadColumnContent(columnsElement, pages);
}

/**
 * Load content into columns
 * @param {Element} columnsElement - The columns element
 * @param {Array} pages - Array of page URLs to load
 */
function loadColumnContent(columnsElement, pages) {
    const columns = columnsElement.querySelectorAll('.column');

    // Load content for each column that has a corresponding page
    columns.forEach((column, index) => {
        if (index < pages.length && pages[index]) {
            loadContentIntoColumn(column, pages[index]);
        } else {
            // No content specified for this column
            column.innerHTML = '<div class="column-empty">No content specified for this column</div>';
        }
    });
}

/**
 * Load content into a specific column
 * @param {Element} column - The column element
 * @param {string} pageUrl - The URL of the content to load
 */
function loadContentIntoColumn(column, pageUrl) {
    const fileExtension = pageUrl.split('.').pop().toLowerCase();

    if (fileExtension === 'json') {
        // Load JSON content using modala
        loadJsonContent(column, pageUrl);
    } else if (fileExtension === 'html' || fileExtension === 'htm') {
        // Load HTML content
        loadHtmlContent(column, pageUrl);
    } else {
        // Load other content types (like .cf) as text/html
        loadGenericContent(column, pageUrl);
    }
}

/**
 * Load JSON content into a column using modala
 * @param {Element} column - The column element
 * @param {string} jsonUrl - The URL of the JSON file
 */
function loadJsonContent(column, jsonUrl) {
    // Create a temporary container for the JSON content
    const tempContainer = document.createElement('div');
    tempContainer.style.display = 'none';
    document.body.appendChild(tempContainer);

    // Use modal function from dotPipe.js to load JSON
    modal(jsonUrl, tempContainer)
        .then(() => {
            // Move content from temp container to column
            column.innerHTML = '';
            while (tempContainer.firstChild) {
                column.appendChild(tempContainer.firstChild);
            }

            // Remove temp container
            document.body.removeChild(tempContainer);

            // Dispatch content loaded event
            dispatchColumnContentLoaded(column);
        })
        .catch(error => {
            column.innerHTML = `<div class="column-error">Error loading JSON content: ${error.message}</div>`;
            console.error('Error loading JSON content:', error);
        });
}

/**
 * Load HTML content into a column
 * @param {Element} column - The column element
 * @param {string} htmlUrl - The URL of the HTML file
 */
function loadHtmlContent(column, htmlUrl) {
    // Create a pipe element to fetch HTML content
    const pipeElement = document.createElement('pipe');
    pipeElement.setAttribute('ajax', htmlUrl);
    pipeElement.setAttribute('insert', column.id);
    pipeElement.classList.add('column-content-loader');
    pipeElement.classList.add('plain-html');

    // Add to document
    document.body.appendChild(pipeElement);

    // Trigger the pipe to load content
    pipes(pipeElement);

    // Set up event listener to handle when content is loaded
    document.addEventListener('DOMNodeInserted', function handler(event) {
        if (event.target.parentNode && event.target.parentNode.id === column.id) {
            // Content has been inserted into the column
            setTimeout(() => {
                // Remove loading indicator if it exists
                const loadingIndicator = column.querySelector('.column-loading');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }

                // Dispatch content loaded event
                dispatchColumnContentLoaded(column);

                // Remove event listener
                document.removeEventListener('DOMNodeInserted', handler);
            }, 100);
        }
    });
}

/**
 * Load generic content into a column
 * @param {Element} column - The column element
 * @param {string} contentUrl - The URL of the content file
 */
function loadGenericContent(column, contentUrl) {
    fetch(contentUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            column.innerHTML = content;

            // Process any dotPipe elements in the loaded content
            domContentLoad();

            // Dispatch content loaded event
            dispatchColumnContentLoaded(column);
        })
        .catch(error => {
            column.innerHTML = `<div class="column-error">Error loading content: ${error.message}</div>`;
            console.error('Error loading content:', error);
        });
}

/**
 * Dispatch a custom event when column content is loaded
 * @param {Element} column - The column element
 */
function dispatchColumnContentLoaded(column) {
    const event = new CustomEvent('columnContentLoaded', {
        detail: {
            columnId: column.id,
            column: column
        },
        bubbles: true
    });
    column.dispatchEvent(event);
}

/**
 * Add CSS styles for columns component
 */
function addColumnsStyles() {
    // Check if styles already exist
    if (document.getElementById('columns-component-styles')) {
        return;
    }

    // Create style element
    const style = document.createElement('style');
    style.id = 'columns-component-styles';

    // Add CSS rules
    style.textContent = `
    .columns-container {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .column {
      position: relative;
      min-height: 100px;
      transition: all 0.3s ease;
    }
    
    .column:not(:last-child) {
      border-right: 1px solid #eee;
    }
    
    .column-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #6c757d;
      font-style: italic;
    }
    
    .column-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #6c757d;
      font-style: italic;
      background-color: #f8f9fa;
    }
    
    .column-error {
      padding: 15px;
      color: #dc3545;
      background-color: #f8d7da;
      border-radius: 4px;
      margin: 10px 0;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .columns-container {
        flex-direction: column;
        height: auto !important;
      }
      
      .column {
        flex: 1 1 auto !important;
        width: 100% !important;
        border-right: none !important;
      }
      
      .column:not(:last-child) {
        border-bottom: 1px solid #eee;
      }
    }
  `;

    // Add to document head
    document.head.appendChild(style);
}

// Add styles when the script loads
addColumnsStyles();

/**
 * Public API for columns component
 */
window.columnsComponent = {
    /**
     * Refresh content in a specific column
     * @param {string} columnsId - ID of the columns element
     * @param {number} columnIndex - Index of the column to refresh (0-based)
     */
    refreshColumn: function (columnsId, columnIndex) {
        const columnsElement = document.getElementById(columnsId);
        if (!columnsElement) {
            console.error(`Columns element with ID '${columnsId}' not found`);
            return;
        }

        const pages = columnsElement.getAttribute("pages")?.split(";") || [];
        if (columnIndex >= pages.length) {
            console.error(`Column index ${columnIndex} is out of bounds`);
            return;
        }

        const column = columnsElement.querySelector(`.column-${columnIndex + 1}`);
        if (column) {
            column.innerHTML = '<div class="column-loading">Refreshing content...</div>';
            loadContentIntoColumn(column, pages[columnIndex]);
        }
    },

    /**
     * Update content in a specific column
     * @param {string} columnsId - ID of the columns element
     * @param {number} columnIndex - Index of the column to update (0-based)
     * @param {string} newContent - New content to display (HTML string)
     */
    updateColumnContent: function (columnsId, columnIndex, newContent) {
        const columnsElement = document.getElementById(columnsId);
        if (!columnsElement) {
            console.error(`Columns element with ID '${columnsId}' not found`);
            return;
        }

        const column = columnsElement.querySelector(`.column-${columnIndex + 1}`);
        if (column) {
            column.innerHTML = newContent;
            domContentLoad(); // Process any dotPipe elements in the new content
        }
    },

    /**
     * Load a new page into a specific column
     * @param {string} columnsId - ID of the columns element
     * @param {number} columnIndex - Index of the column to update (0-based)
     * @param {string} pageUrl - URL of the new page to load
     */
    loadColumnPage: function (columnsId, columnIndex, pageUrl) {
        const columnsElement = document.getElementById(columnsId);
        if (!columnsElement) {
            console.error(`Columns element with ID '${columnsId}' not found`);
            return;
        }

        const column = columnsElement.querySelector(`.column-${columnIndex + 1}`);
        if (column) {
            column.innerHTML = '<div class="column-loading">Loading content...</div>';
            loadContentIntoColumn(column, pageUrl);

            // Update the pages attribute to reflect the change
            const pages = columnsElement.getAttribute("pages")?.split(";") || [];
            pages[columnIndex] = pageUrl;
            columnsElement.setAttribute("pages", pages.join(";"));
        }
    }
};

/**
 * refresh-component.js - Custom refresh component for dotPipe.js
 * This handles the <refresh> custom element for refreshing content in specific targets
 * or reloading the entire page
 */

// Initialize refresh component functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Process all refresh tags
  processRefreshTags();
});

/**
 * Process all refresh tags in the document
 */
function processRefreshTags() {
  const refreshElements = document.getElementsByTagName("refresh");
  
  Array.from(refreshElements).forEach(function(refreshElement) {
    if (refreshElement.classList.contains("processed")) {
      return;
    }
    
    // Get attributes
    const target = refreshElement.getAttribute("target") || "";
    
    // Set up refresh element
    setupRefreshElement(refreshElement, target);
    
    // Mark as processed
    refreshElement.classList.add("processed");
  });
}

/**
 * Set up a refresh element with necessary functionality
 * @param {Element} refreshElement - The refresh element to set up
 * @param {string} target - The target specification string
 */
function setupRefreshElement(refreshElement, target) {
  // Create refresh button
  const refreshButton = document.createElement('button');
  refreshButton.className = 'refresh-button';
  
  // Get button text from element content or use default
  const buttonText = refreshElement.textContent.trim() || 'Refresh';
  refreshButton.textContent = buttonText;
  
  // Get button attributes from the refresh element
  for (let i = 0; i < refreshElement.attributes.length; i++) {
    const attr = refreshElement.attributes[i];
    if (attr.name !== 'target' && attr.name !== 'id' && attr.name !== 'class') {
      refreshButton.setAttribute(attr.name, attr.value);
    }
  }
  
  // Add click event listener
  refreshButton.addEventListener('click', function() {
    handleRefresh(target);
  });
  
  // Replace refresh tag content with our button
  refreshElement.innerHTML = '';
  refreshElement.appendChild(refreshButton);
  
  // Add auto-refresh functionality if interval is specified
  if (refreshElement.hasAttribute('interval')) {
    const interval = parseInt(refreshElement.getAttribute('interval'));
    if (!isNaN(interval) && interval > 0) {
      setInterval(() => {
        handleRefresh(target);
      }, interval * 1000); // Convert to milliseconds
    }
  }
}

/**
 * Handle refresh action based on target specification
 * @param {string} target - The target specification string
 */
function handleRefresh(target) {
  if (!target) {
    console.error('No target specified for refresh');
    return;
  }
  
  // Check if target is to refresh the whole page
  if (target === '_page') {
    window.location.reload();
    return;
  }
  
  // Parse target specifications (format: "targetId:pageUrl;targetId2:pageUrl2")
  const targetSpecs = target.split(';');
  
  targetSpecs.forEach(spec => {
    const [targetId, pageUrl] = spec.split(':');
    
    if (!targetId || !pageUrl) {
      console.error(`Invalid target specification: ${spec}`);
      return;
    }
    
    // Handle different target types
    if (targetId.startsWith('cols-')) {
      // Target is a column in a columns component
      refreshColumnTarget(targetId, pageUrl);
    } else {
      // Standard target refresh
      refreshStandardTarget(targetId, pageUrl);
    }
  });
}

/**
 * Refresh a standard target element with content from a URL
 * @param {string} targetId - The ID of the target element
 * @param {string} pageUrl - The URL of the content to load
 */
function refreshStandardTarget(targetId, pageUrl) {
  const targetElement = document.getElementById(targetId);
  
  if (!targetElement) {
    console.error(`Target element with ID '${targetId}' not found`);
    return;
  }
  
  // Show loading indicator
  const originalContent = targetElement.innerHTML;
  targetElement.innerHTML = '<div class="refresh-loading">Loading content...</div>';
  
  // Determine content type based on file extension
  const fileExtension = pageUrl.split('.').pop().toLowerCase();
  
  if (fileExtension === 'json') {
    // Load JSON content using modala
    refreshJsonContent(targetElement, pageUrl);
  } else if (fileExtension === 'html' || fileExtension === 'htm') {
    // Load HTML content
    refreshHtmlContent(targetElement, pageUrl);
  } else {
    // Load other content types as text/html
    refreshGenericContent(targetElement, pageUrl);
  }
  
  // Dispatch refresh started event
  dispatchRefreshEvent(targetElement, 'refreshStarted', {
    targetId: targetId,
    pageUrl: pageUrl,
    originalContent: originalContent
  });
}

/**
 * Refresh a column in a columns component
 * @param {string} targetId - The ID specification for the column (format: "cols-columnIndex")
 * @param {string} pageUrl - The URL of the content to load
 */
function refreshColumnTarget(targetId, pageUrl) {
  // Parse column specification (format: "cols-columnIndex")
  const parts = targetId.split('-');
  if (parts.length !== 2) {
    console.error(`Invalid column target specification: ${targetId}`);
    return;
  }
  
  const columnsId = parts[0];
  const columnIndex = parseInt(parts[1]) - 1; // Convert to 0-based index
  
  // Check if columns component API is available
  if (typeof window.columnsComponent === 'undefined') {
    console.error('Columns component not loaded');
    return;
  }
  
  // Use columns component API to refresh the column
  window.columnsComponent.loadColumnPage(columnsId, columnIndex, pageUrl);
}

/**
 * Load JSON content into a target element using modala
 * @param {Element} targetElement - The target element
 * @param {string} jsonUrl - The URL of the JSON file
 */
function refreshJsonContent(targetElement, jsonUrl) {
  // Create a temporary container for the JSON content
  const tempContainer = document.createElement('div');
  tempContainer.style.display = 'none';
  document.body.appendChild(tempContainer);
  
  // Use modal function from dotPipe.js to load JSON
  modal(jsonUrl, tempContainer)
    .then(() => {
      // Move content from temp container to target element
      targetElement.innerHTML = '';
      while (tempContainer.firstChild) {
        targetElement.appendChild(tempContainer.firstChild);
      }
      
      // Remove temp container
      document.body.removeChild(tempContainer);
      
      // Dispatch refresh completed event
      dispatchRefreshEvent(targetElement, 'refreshCompleted', {
        targetId: targetElement.id,
        pageUrl: jsonUrl,
        success: true
      });
    })
    .catch(error => {
      targetElement.innerHTML = `<div class="refresh-error">Error loading content: ${error.message}</div>`;
      console.error('Error loading JSON content:', error);
      
      // Dispatch refresh failed event
      dispatchRefreshEvent(targetElement, 'refreshFailed', {
        targetId: targetElement.id,
        pageUrl: jsonUrl,
        error: error.message
      });
    });
}

/**
 * Load HTML content into a target element
 * @param {Element} targetElement - The target element
 * @param {string} htmlUrl - The URL of the HTML file
 */
function refreshHtmlContent(targetElement, htmlUrl) {
  // Create a pipe element to fetch HTML content
  const pipeElement = document.createElement('pipe');
  pipeElement.setAttribute('ajax', htmlUrl);
  pipeElement.setAttribute('insert', targetElement.id);
  pipeElement.classList.add('refresh-content-loader');
  pipeElement.classList.add('plain-html');
  
  // Add to document
  document.body.appendChild(pipeElement);
  
  // Trigger the pipe to load content
  pipes(pipeElement);
  
  // Set up event listener to handle when content is loaded
  document.addEventListener('DOMNodeInserted', function handler(event) {
    if (event.target.parentNode && event.target.parentNode.id === targetElement.id) {
      // Content has been inserted into the target element
      setTimeout(() => {
        // Remove loading indicator if it exists
        const loadingIndicator = targetElement.querySelector('.refresh-loading');
        if (loadingIndicator) {
          loadingIndicator.remove();
        }
        
        // Dispatch refresh completed event
        dispatchRefreshEvent(targetElement, 'refreshCompleted', {
          targetId: targetElement.id,
          pageUrl: htmlUrl,
          success: true
        });
        
        // Remove event listener
        document.removeEventListener('DOMNodeInserted', handler);
        
        // Remove the pipe element
        if (document.body.contains(pipeElement)) {
          document.body.removeChild(pipeElement);
        }
      }, 100);
    }
  });
  
  // Set up error handling
  setTimeout(() => {
    if (targetElement.querySelector('.refresh-loading')) {
      // Content hasn't loaded within timeout period
      targetElement.innerHTML = `<div class="refresh-error">Error loading content: Timeout</div>`;
      
      // Dispatch refresh failed event
      dispatchRefreshEvent(targetElement, 'refreshFailed', {
        targetId: targetElement.id,
        pageUrl: htmlUrl,
        error: 'Timeout'
      });
      
      // Remove the pipe element
      if (document.body.contains(pipeElement)) {
        document.body.removeChild(pipeElement);
      }
    }
  }, 10000); // 10 second timeout
}

/**
 * Load generic content into a target element
 * @param {Element} targetElement - The target element
 * @param {string} contentUrl - The URL of the content file
 */
function refreshGenericContent(targetElement, contentUrl) {
  fetch(contentUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(content => {
      targetElement.innerHTML = content;
      
      // Process any dotPipe elements in the loaded content
      domContentLoad();
      
      // Dispatch refresh completed event
      dispatchRefreshEvent(targetElement, 'refreshCompleted', {
        targetId: targetElement.id,
        pageUrl: contentUrl,
        success: true
      });
    })
    .catch(error => {
      targetElement.innerHTML = `<div class="refresh-error">Error loading content: ${error.message}</div>`;
      console.error('Error loading content:', error);
      
      // Dispatch refresh failed event
      dispatchRefreshEvent(targetElement, 'refreshFailed', {
        targetId: targetElement.id,
        pageUrl: contentUrl,
        error: error.message
      });
    });
}

/**
 * Dispatch a custom event for refresh actions
 * @param {Element} element - The element to dispatch the event on
 * @param {string} eventName - The name of the event
 * @param {Object} detail - Event details
 */
function dispatchRefreshEvent(element, eventName, detail) {
  const event = new CustomEvent(eventName, {
    detail: detail,
    bubbles: true
  });
  element.dispatchEvent(event);
}

/**
 * Add CSS styles for refresh component
 */
function addRefreshStyles() {
  // Check if styles already exist
  if (document.getElementById('refresh-component-styles')) {
    return;
  }
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'refresh-component-styles';
  
  // Add CSS rules
  style.textContent = `
    .refresh-button {
      display: inline-block;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .refresh-button:hover {
      background-color: #0069d9;
    }
    
    .refresh-button:active {
      background-color: #0062cc;
    }
    
    .refresh-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #6c757d;
      font-style: italic;
      position: relative;
    }
    
    .refresh-loading:before {
      content: '';
      width: 20px;
      height: 20px;
      margin-right: 10px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      animation: refresh-spin 1s linear infinite;
    }
    
    @keyframes refresh-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .refresh-error {
      padding: 15px;
      color: #dc3545;
      background-color: #f8d7da;
      border-radius: 4px;
      margin: 10px 0;
    }
  `;
  
  // Add to document head
  document.head.appendChild(style);
}

// Add styles when the script loads
addRefreshStyles();

/**
 * Public API for refresh component
 */
window.refreshComponent = {
  /**
   * Refresh content in a target element
   * @param {string} targetId - ID of the target element
   * @param {string} pageUrl - URL of the content to load
   */
  refreshTarget: function(targetId, pageUrl) {
    if (targetId === '_page') {
      window.location.reload();
      return;
    }
    
    if (targetId.startsWith('cols-')) {
      refreshColumnTarget(targetId, pageUrl);
    } else {
      refreshStandardTarget(targetId, pageUrl);
    }
  },
  
  /**
   * Refresh multiple targets
   * @param {string} targetSpec - Target specification string (format: "targetId:pageUrl;targetId2:pageUrl2")
   */
  refreshTargets: function(targetSpec) {
    handleRefresh(targetSpec);
  }
};

/**
 * Process all checkout tags in the document
 */
function processCheckoutTags() {
    const checkoutElements = document.getElementsByTagName("checkout");

    Array.from(checkoutElements).forEach(function (checkoutElement) {
        if (checkoutElement.classList.contains("processed")) {
            return;
        }

        // Check if cart exists and has items
        const cart = JSON.parse(localStorage.getItem('dotPipeCart') || '{"items":[]}');

        if (cart.items.length === 0) {
            // Cart is empty, show message and return
            checkoutElement.innerHTML = `
        <div class="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Please add items to your cart before proceeding to checkout.</p>
          <a href="index.html" class="btn">Continue Shopping</a>
        </div>
      `;
            checkoutElement.classList.add("processed");
            return;
        }

        // Get validation mode
        const validateMode = checkoutElement.getAttribute('validate') === 'true';

        // Set up checkout element
        setupCheckoutElement(checkoutElement, validateMode);

        // Mark as processed
        checkoutElement.classList.add("processed");
    });
}

/**
 * Set up a checkout element with necessary functionality
 * @param {Element} checkoutElement - The checkout element to set up
 * @param {boolean} validateMode - Whether to run in validation mode (debug)
 */
function setupCheckoutElement(checkoutElement, validateMode) {
    // Create checkout container
    const checkoutContainer = document.createElement('div');
    checkoutContainer.className = 'checkout-container';

    // Create checkout form
    const formContainer = document.createElement('div');
    formContainer.className = 'checkout-form-container';
    formContainer.innerHTML = `
    <h2>Shipping & Payment</h2>
    <form id="checkout-form">
      <div class="form-section">
        <h3>Contact Information</h3>
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required>
          <div id="fullName-error" class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required>
          <div id="email-error" class="error-message"></div>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Shipping Address</h3>
        <div class="form-group">
          <label for="address">Street Address</label>
          <input type="text" id="address" name="address" required>
          <div id="address-error" class="error-message"></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" name="city" required>
            <div id="city-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="state">State</label>
            <select id="state" name="state" required>
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
            <div id="state-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="zipCode">ZIP Code</label>
            <input type="text" id="zipCode" name="zipCode" required>
            <div id="zipCode-error" class="error-message"></div>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Payment Information</h3>
        <div class="form-group">
          <label for="cardNumber">Card Number</label>
          <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
          <div id="cardNumber-error" class="error-message"></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cardExpiry">Expiry Date</label>
            <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/YY" required>
            <div id="cardExpiry-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="cardCvv">CVV</label>
            <input type="text" id="cardCvv" name="cardCvv" placeholder="123" required>
            <div id="cardCvv-error" class="error-message"></div>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <a href="cart.html" class="btn secondary">Back to Cart</a>
        <button type="submit" class="btn primary">Complete Order</button>
      </div>
    </form>
  `;

    // Create order summary
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'checkout-summary';
    summaryContainer.innerHTML = '<div id="order-summary"></div>';

    // Add to checkout container
    checkoutContainer.appendChild(formContainer);
    checkoutContainer.appendChild(summaryContainer);

    // Replace checkout tag content with our container
    checkoutElement.innerHTML = '';
    checkoutElement.appendChild(checkoutContainer);

    // Display order summary
    displayOrderSummary();

    // Set up form validation
    setupFormValidation(validateMode);
}

/**
 * Display order summary on checkout page
 */
function displayOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('dotPipeCart'));
    const orderSummary = document.getElementById('order-summary');
    if (!orderSummary) return;

    // Clear current content
    orderSummary.innerHTML = '';

    // Create summary HTML
    let summaryHTML = '<h3>Order Summary</h3>';

    // Add items
    summaryHTML += '<div class="summary-items">';
    cart.items.forEach(item => {
        summaryHTML += `
      <div class="summary-item">
        <span class="item-name">${item.name} × ${item.quantity}</span>
        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
    });
    summaryHTML += '</div>';

    // Add totals
    summaryHTML += `
    <div class="summary-totals">
      <div class="summary-subtotal">
        <span>Subtotal</span>
        <span>$${cart.subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-tax">
        <span>Tax</span>
        <span>$${cart.tax.toFixed(2)}</span>
      </div>
      <div class="summary-shipping">
        <span>Shipping</span>
        <span>${cart.shipping > 0 ? '$' + cart.shipping.toFixed(2) : 'Free'}</span>
      </div>
      <div class="summary-total">
        <span>Total</span>
        <span>$${cart.total.toFixed(2)}</span>
      </div>
    </div>
  `;

    // Add to DOM
    orderSummary.innerHTML = summaryHTML;
}

/**
 * Set up form validation
 * @param {boolean} validateMode - Whether to run in validation mode (debug)
 */
function setupFormValidation(validateMode) {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Validate form
        if (validateCheckoutForm()) {
            // Process order
            processOrder(validateMode);
        }
    });

    // Add input validation listeners
    const inputs = checkoutForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });
    });
}

/**
 * Validate individual form field
 * @param {Element} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Get error element
    const errorElement = document.getElementById(`${fieldName}-error`);

    // Validation rules
    switch (fieldName) {
        case 'fullName':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please enter your full name';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'address':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please enter your address';
            }
            break;

        case 'city':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please enter your city';
            }
            break;

        case 'state':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please select your state';
            }
            break;

        case 'zipCode':
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid ZIP code';
            }
            break;

        case 'cardNumber':
            // Simple validation - would use a library in production
            const cardRegex = /^\d{13,19}$/;
            if (!cardRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid card number';
            }
            break;

        case 'cardExpiry':
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid expiry date (MM/YY)';
            } else {
                // Check if card is expired
                const [month, year] = value.split('/');
                const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                const currentDate = new Date();

                if (expiryDate < currentDate) {
                    isValid = false;
                    errorMessage = 'Card has expired';
                }
            }
            break;

        case 'cardCvv':
            const cvvRegex = /^\d{3,4}$/;
            if (!cvvRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid CVV';
            }
            break;
    }

    // Update UI based on validation
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }

    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }

    return isValid;
}

/**
 * Validate entire checkout form
 * @returns {boolean} - Whether the form is valid
 */
function validateCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return false;

    const inputs = checkoutForm.querySelectorAll('input, select');
    let isFormValid = true;

    inputs.forEach(input => {
        const fieldIsValid = validateField(input);
        if (!fieldIsValid) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

/**
 * Process order
 * @param {boolean} validateMode - Whether to run in validation mode (debug)
 */
function processOrder(validateMode) {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;

    // Get form data
    const formData = new FormData(checkoutForm);
    const orderData = {};

    for (const [key, value] of formData.entries()) {
        orderData[key] = value;
    }

    // Get cart data
    const cart = JSON.parse(localStorage.getItem('dotPipeCart'));

    // Create order object
    const order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        customer: {
            fullName: orderData.fullName,
            email: orderData.email,
            address: orderData.address,
            city: orderData.city,
            state: orderData.state,
            zipCode: orderData.zipCode
        },
        items: cart.items,
        payment: {
            method: 'credit_card',
            last4: orderData.cardNumber.slice(-4)
        },
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
        validateMode: validateMode
    };

    // If in validate mode, show debug information
    if (validateMode) {
        console.log('Validate mode enabled - Order would be processed with:', order);
        textCard("Validation mode: Order would be processed (see console for details)", "validation-notice", "validation-notice", true, true, 5000, 100);
    }

    // Save order to localStorage
    saveOrder(order);

    // Clear cart
    clearCart();

    // Show confirmation or redirect
    if (validateMode) {
        // In validate mode, just show a confirmation message
        const checkoutContainer = document.querySelector('.checkout-container');
        if (checkoutContainer) {
            checkoutContainer.innerHTML = `
        <div class="order-success">
          <h2>Order Validated Successfully</h2>
          <p>Your order has been validated in debug mode.</p>
          <p>Order ID: ${order.id}</p>
          <div class="order-actions">
            <a href="index.html" class="btn">Continue Shopping</a>
          </div>
        </div>
      `;
        }
    } else {
        // In normal mode, redirect to confirmation page
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
    }
}

/**
 * Generate a unique order ID
 * @returns {string} - The generated order ID
 */
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

/**
 * Save order to localStorage
 * @param {Object} order - The order object to save
 */
function saveOrder(order) {
    // Get existing orders or initialize empty array
    const orders = JSON.parse(localStorage.getItem('dotPipeOrders') || '[]');

    // Add new order
    orders.push(order);

    // Save back to localStorage
    localStorage.setItem('dotPipeOrders', JSON.stringify(orders));
}

/**
 * Clear the cart after successful order
 */
function clearCart() {
    localStorage.setItem('dotPipeCart', JSON.stringify({
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
    }));
}

/**
 * Process all order-confirmation tags in the document
 */
function processOrderConfirmationTags() {
    const confirmationElements = document.getElementsByTagName("order-confirmation");

    if (confirmationElements.length === 0) {
        // If no custom tags, check if we're on the confirmation page
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');

        if (orderId && document.getElementById('order-confirmation')) {
            initOrderConfirmation(orderId, document.getElementById('order-confirmation'));
        }
        return;
    }

    Array.from(confirmationElements).forEach(function (confirmationElement) {
        if (confirmationElement.classList.contains("processed")) {
            return;
        }

        // Get order ID from URL or attribute
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = confirmationElement.getAttribute('order-id') || urlParams.get('orderId');

        if (!orderId) {
            // No order ID found, show error
            confirmationElement.innerHTML = `
        <div class="order-not-found">
          <h2>Order Not Found</h2>
          <p>No order ID was provided.</p>
          <a href="index.html" class="btn">Return to Home</a>
        </div>
      `;
            confirmationElement.classList.add("processed");
            return;
        }

        // Initialize order confirmation with the order ID
        initOrderConfirmation(orderId, confirmationElement);

        // Mark as processed
        confirmationElement.classList.add("processed");
    });
}

/**
 * Initialize order confirmation with the given order ID
 * @param {string} orderId - The order ID to display
 * @param {Element} container - The container element
 */
function initOrderConfirmation(orderId, container) {
    // Get order details
    const order = getOrderById(orderId);

    if (!order) {
        // Order not found, show error
        container.innerHTML = `
      <div class="order-not-found">
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <a href="index.html" class="btn">Return to Home</a>
      </div>
    `;
        return;
    }

    // Display order details
    displayOrderConfirmation(order, container);
}

/**
 * Get order by ID from localStorage
 * @param {string} orderId - The order ID to find
 * @returns {Object|null} - The order object or null if not found
 */
function getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('dotPipeOrders') || '[]');
    return orders.find(order => order.id === orderId);
}

/**
 * Display order confirmation details
 * @param {Object} order - The order object
 * @param {Element} container - The container element
 */
function displayOrderConfirmation(order, container) {
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create confirmation HTML
    let confirmationHTML = `
    <div class="confirmation-header">
      <h2>Order Confirmed!</h2>
      <p>Thank you for your purchase, ${order.customer.fullName}.</p>
    </div>
    
    <div class="confirmation-details">
      <div class="confirmation-info">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
      </div>
      
      <div class="shipping-info">
        <h3>Shipping Address</h3>
        <p>${order.customer.fullName}</p>
        <p>${order.customer.address}</p>
        <p>${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}</p>
      </div>
      
      <div class="payment-info">
        <h3>Payment Method</h3>
        <p>Credit Card ending in ${order.payment.last4}</p>
      </div>
    </div>
    
    <div class="order-items">
      <h3>Order Items</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
  `;

    // Add items
    order.items.forEach(item => {
        confirmationHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
    });

    // Add order summary
    confirmationHTML += `
        </tbody>
      </table>
    </div>
    
    <div class="order-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>$${order.subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tax</span>
        <span>$${order.tax.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${order.shipping > 0 ? '$' + order.shipping.toFixed(2) : 'Free'}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>$${order.total.toFixed(2)}</span>
      </div>
    </div>
    
    <div class="confirmation-actions">
      <a href="index.html" class="btn">Continue Shopping</a>
      <button id="print-receipt" class="btn">Print Receipt</button>
    </div>
  `;

    // Add to DOM
    container.innerHTML = confirmationHTML;

    // Add event listener for print button
    const printButton = container.querySelector('#print-receipt');
    if (printButton) {
        printButton.addEventListener('click', function () {
            window.print();
        });
    }
}

/**
 * Process all cart tags in the document
 */
function processCartTags() {
    const cartElements = document.getElementsByTagName("cart");

    Array.from(cartElements).forEach(function (cartElement) {
        if (cartElement.classList.contains("processed")) {
            return;
        }

        // Initialize cart in localStorage if it doesn't exist
        initCart();

        // Process the cart element
        setupCartElement(cartElement);

        // Process all item elements within this cart
        const itemElements = cartElement.getElementsByTagName("item");
        Array.from(itemElements).forEach(function (itemElement) {
            setupItemElement(itemElement, cartElement);
        });

        // Mark as processed
        cartElement.classList.add("processed");
    });
}

/**
 * Set up a cart element with necessary functionality
 * @param {Element} cartElement - The cart element to set up
 */
function setupCartElement(cartElement) {
    // Create cart UI container
    const cartContainer = document.createElement('div');
    cartContainer.className = 'cart-container';

    // Create cart items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'cart-items';
    itemsContainer.id = 'cart-items';

    // Create cart summary container
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'cart-summary';
    summaryContainer.innerHTML = `
    <h3>Cart Summary</h3>
    <div class="summary-row">
      <span>Subtotal</span>
      <span id="cart-subtotal">$0.00</span>
    </div>
    <div class="summary-row">
      <span>Tax</span>
      <span id="cart-tax">$0.00</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span id="cart-shipping">$0.00</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span id="cart-total">$0.00</span>
    </div>
    <div class="cart-actions">
      <button id="clear-cart" class="btn secondary">Clear Cart</button>
      <button id="checkout-button" class="btn redirect primary" ajax="checkout.html">Checkout</button>
    </div>
  `;

    // Add to cart container
    cartContainer.appendChild(itemsContainer);
    cartContainer.appendChild(summaryContainer);

    // Replace cart tag content with our container
    cartElement.innerHTML = '';
    cartElement.appendChild(cartContainer);

    // Add event listener for clear cart button
    const clearCartButton = cartContainer.querySelector('#clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    // Update cart display
    updateCartDisplay();
}

/**
 * Set up an item element with necessary functionality
 * @param {Element} itemElement - The item element to set up
 * @param {Element} cartElement - The parent cart element
 */
function setupItemElement(itemElement, cartElement) {
    // Get product ID from the item element
    const productId = itemElement.getAttribute('id');

    if (!productId) {
        console.error('Item element must have an id attribute');
        return;
    }

    // Check if item has ajax attribute
    if (itemElement.hasAttribute('ajax')) {
        // Fetch product data from server
        const ajaxAttr = itemElement.getAttribute('ajax');
        const [file, target, limit] = ajaxAttr.split(':');

        // Create a pipe element to fetch product data
        const pipeElement = document.createElement('pipe');
        pipeElement.setAttribute('ajax', file);
        pipeElement.setAttribute('insert', `product-data-${productId}`);
        pipeElement.classList.add('product-data-loader');

        // Create container for product data
        const productDataContainer = document.createElement('div');
        productDataContainer.id = `product-data-${productId}`;
        productDataContainer.classList.add('product-data-container');
        productDataContainer.style.display = 'none';

        // Add to document
        document.body.appendChild(productDataContainer);
        document.body.appendChild(pipeElement);

        // Trigger the pipe to load product data
        pipes(pipeElement);

        // Set up event listener to process product data when loaded
        document.addEventListener('DOMNodeInserted', function (event) {
            if (event.target.id === `product-data-${productId}`) {
                setTimeout(() => {
                    processProductData(productId, productDataContainer, itemElement);
                }, 100);
            }
        });
    } else {
        // Use data from item element attributes
        const name = itemElement.getAttribute('name') || 'Product';
        const price = parseFloat(itemElement.getAttribute('price') || '0');
        const image = itemElement.getAttribute('image') || '';

        // Create add to cart button
        createAddToCartButton(productId, name, price, image, itemElement);
    }
}

/**
 * Process product data loaded via AJAX
 * @param {string} productId - The product ID
 * @param {Element} dataContainer - The container with product data
 * @param {Element} itemElement - The original item element
 */
function processProductData(productId, dataContainer, itemElement) {
    try {
        // Try to parse JSON data
        let productData;

        try {
            // First try to parse as JSON
            const jsonText = dataContainer.textContent.trim();
            productData = JSON.parse(jsonText);
        } catch (e) {
            // If not JSON, try to extract data from HTML
            const nameElement = dataContainer.querySelector('.product-name');
            const priceElement = dataContainer.querySelector('.product-price');
            const imageElement = dataContainer.querySelector('.product-image');

            productData = {
                id: productId,
                name: nameElement ? nameElement.textContent : 'Product',
                price: priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.-]+/g, '')) : 0,
                image: imageElement ? imageElement.getAttribute('src') : ''
            };
        }

        // Create add to cart button
        createAddToCartButton(
            productId,
            productData.name,
            productData.price,
            productData.image,
            itemElement
        );

    } catch (error) {
        console.error('Error processing product data:', error);
    }
}

/**
 * Create an add to cart button for a product
 * @param {string} productId - The product ID
 * @param {string} name - The product name
 * @param {number} price - The product price
 * @param {string} image - The product image URL
 * @param {Element} itemElement - The item element to attach the button to
 */
function createAddToCartButton(productId, name, price, image, itemElement) {
    // Create button element
    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart-btn';
    addButton.textContent = 'Add to Cart';
    addButton.setAttribute('data-product-id', productId);
    addButton.setAttribute('data-product-name', name);
    addButton.setAttribute('data-product-price', price);
    addButton.setAttribute('data-product-image', image);

    // Add event listener
    addButton.addEventListener('click', function () {
        addToCart(
            this.getAttribute('data-product-id'),
            this.getAttribute('data-product-name'),
            parseFloat(this.getAttribute('data-product-price')),
            1,
            this.getAttribute('data-product-image')
        );
    });

    // Replace item element content with button
    itemElement.innerHTML = '';
    itemElement.appendChild(addButton);
}

/**
 * Initialize cart in localStorage
 */
function initCart() {
    if (!localStorage.getItem('dotPipeCart')) {
        localStorage.setItem('dotPipeCart', JSON.stringify({
            items: [],
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0
        }));
    }
}

/**
 * Add item to cart
 * @param {string} productId - The product ID
 * @param {string} name - The product name
 * @param {number} price - The product price
 * @param {number} quantity - The quantity to add
 * @param {string} image - The product image URL
 */
function addToCart(productId, name, price, quantity = 1, image = '') {
    const cart = JSON.parse(localStorage.getItem('dotPipeCart'));

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({
            productId,
            name,
            price,
            quantity,
            image
        });
    }

    // Update cart totals
    updateCartTotals(cart);

    // Save to localStorage
    localStorage.setItem('dotPipeCart', JSON.stringify(cart));

    // Update UI
    updateCartDisplay();

    // Show confirmation message
    textCard("Item added to cart!", "cart-notification", "", true, true, 2000, 100);
}

/**
 * Remove item from cart
 * @param {string} productId - The product ID to remove
 */
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('dotPipeCart'));

    // Filter out the item to remove
    cart.items = cart.items.filter(item => item.productId !== productId);

    // Update cart totals
    updateCartTotals(cart);

    // Save to localStorage
    localStorage.setItem('dotPipeCart', JSON.stringify(cart));

    // Update UI
    updateCartDisplay();
}

/**
 * Update item quantity in cart
 * @param {string} productId - The product ID
 * @param {number} quantity - The new quantity
 */
function updateCartQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('dotPipeCart'));

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
        if (quantity <= 0) {
            // Remove item if quantity is zero or negative
            removeFromCart(productId);
            return;
        }

        cart.items[itemIndex].quantity = quantity;

        // Update cart totals
        updateCartTotals(cart);

        // Save to localStorage
        localStorage.setItem('dotPipeCart', JSON.stringify(cart));

        // Update UI
        updateCartDisplay();
    }
}

/**
 * Calculate cart totals
 * @param {Object} cart - The cart object
 */
function updateCartTotals(cart) {
    // Calculate subtotal
    cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Calculate tax (example: 8%)
    cart.tax = cart.subtotal * 0.08;

    // Calculate shipping (example: flat $5 or free for orders over $50)
    cart.shipping = cart.subtotal > 50 ? 0 : 5;

    // Calculate total
    cart.total = cart.subtotal + cart.tax + cart.shipping;
}

/**
 * Update cart display in the UI
 */
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('dotPipeCart'));
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    if (cartCount) {
        const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        cartCount.textContent = itemCount;
    }

    if (cartItems) {
        // Clear current items
        cartItems.innerHTML = '';

        if (cart.items.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            // Create HTML for each item
            cart.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
          <div class="cart-item-image">
            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-product-id="${item.productId}">-</button>
            <input type="number" value="${item.quantity}" min="1" data-product-id="${item.productId}">
            <button class="quantity-btn increase" data-product-id="${item.productId}">+</button>
          </div>
          <div class="cart-item-subtotal">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
          <button class="remove-item" data-product-id="${item.productId}">×</button>
        `;
                cartItems.appendChild(itemElement);
            });

            // Add event listeners to the new elements
            addCartItemEventListeners();
        }
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = `$${cart.subtotal.toFixed(2)}`;
    }

    if (cartTax) {
        cartTax.textContent = `$${cart.tax.toFixed(2)}`;
    }

    if (cartShipping) {
        cartShipping.textContent = cart.shipping > 0 ? `$${cart.shipping.toFixed(2)}` : 'Free';
    }

    if (cartTotal) {
        cartTotal.textContent = `$${cart.total.toFixed(2)}`;
    }
}

/**
 * Add event listeners to cart item elements
 */
function addCartItemEventListeners() {
    // Quantity decrease buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const currentQuantity = parseInt(this.nextElementSibling.value);
            updateCartQuantity(productId, currentQuantity - 1);
        });
    });

    // Quantity increase buttons
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const currentQuantity = parseInt(this.previousElementSibling.value);
            updateCartQuantity(productId, currentQuantity + 1);
        });
    });

    // Quantity input fields
    document.querySelectorAll('.cart-item-quantity input').forEach(input => {
        input.addEventListener('change', function () {
            const productId = this.getAttribute('data-product-id');
            const quantity = parseInt(this.value);
            updateCartQuantity(productId, quantity);
        });
    });

    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}


/**
 * Process all tab tags in the document
 * This function should be called when the document is loaded
 */
function processTabTags() {
    let tabElements = document.getElementsByTagName("tabs");

    Array.from(tabElements).forEach(function (element) {
        if (element.classList.contains("processed")) {
            return;
        }

        // Get attributes
        const tabsData = element.getAttribute("tab")?.split(";") || [];
        const tabClass = element.getAttribute("class") || "";
        const tabStyle = element.getAttribute("style") || "";

        if (tabsData.length === 0) {
            console.error("Tabs tag requires tab attribute");
            element.innerHTML = "<div class='tabs-error'>Configuration error: No tabs specified</div>";
            element.classList.add("processed");
            return;
        }

        // Generate the tabs HTML
        const tabsHTML = createTabsInterface(tabsData, tabClass, tabStyle);

        // Replace the tabs tag content with our generated HTML
        element.innerHTML = tabsHTML;

        // Mark as processed
        element.classList.add("processed");

        // Process the newly added elements with dotpipe.js
        domContentLoad();

        // Preload all tab content
        preloadAllTabContent(tabsData);
    });
}

/**
 * Creates a tabbed interface based on provided attributes
 * @param {Array} tabsData - Array of tab definitions in format "TabName:TabId:ContentSource"
 * @param {string} tabClass - CSS classes to apply to tabs
 * @param {string} tabStyle - Inline styles to apply to tabs
 * @returns {string} HTML for the tabbed interface
 */
function createTabsInterface(tabsData, tabClass, tabStyle) {
    // Parse tab data
    const tabs = tabsData.map(tabData => {
        const parts = tabData.split(":");
        return {
            name: parts[0] || "Tab",
            id: parts[1] || `tab-${Math.random().toString(36).substring(2, 9)}`,
            source: parts[2] || ""
        };
    });

    // Set first tab as active by default
    const activeTab = tabs[0];

    // Create tabs HTML
    let tabsHeaderHTML = tabs.map((tab, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `<div class="tab-header ${isActive} ${tabClass}" id="header-${tab.id}" data-tab="${tab.id}" data-source="${tab.source}" style="${tabStyle}">${tab.name}</div>`;
    }).join('');

    // Create tab content containers - initially empty for preloading
    let tabsContentHTML = tabs.map((tab, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `<div class="tab-content ${isActive}" id="content-${tab.id}">
                  <div class="tab-loading">Loading content...</div>
                </div>`;
    }).join('');

    // Combine everything
    const html = `
    <div class="tabs-container">
        <div class="tabs-header">
            ${tabsHeaderHTML}
        </div>
        <div class="tabs-content">
            ${tabsContentHTML}
        </div>
    </div>

    <style>
        .tabs-container {
            width: 100%;
            margin: 0 auto;
            font-family: Arial, sans-serif;
        }
        
        .tabs-header {
            display: flex;
            border-bottom: 1px solid #ddd;
            background-color: #f8f9fa;
        }
        
        .tab-header {
            padding: 10px 15px;
            cursor: pointer;
            border: 1px solid transparent;
            border-bottom: none;
            margin-right: 5px;
            border-radius: 5px 5px 0 0;
            transition: all 0.3s ease;
        }
        
        .tab-header:hover {
            background-color: #e9ecef;
        }
        
        .tab-header.active {
            background-color: #fff;
            border-color: #ddd;
            border-bottom-color: #fff;
            margin-bottom: -1px;
            font-weight: bold;
        }
        
        .tabs-content {
            border: 1px solid #ddd;
            border-top: none;
            padding: 15px;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .tabs-error {
            padding: 15px;
            background: #ffebee;
            color: #c62828;
            border-radius: 4px;
            text-align: center;
        }
        
        .tab-loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
    </style>

    <script>
        // Tab switching functionality
        document.querySelectorAll('.tab-header').forEach(tab => {
            tab.addEventListener('click', function() {
                // Get the tab ID
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all tabs
                document.querySelectorAll('.tab-header').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                
                // Add active class to current tab
                this.classList.add('active');
                document.getElementById('content-' + tabId).classList.add('active');
            });
        });
    </script>
    `;

    return html;
}

/**
 * Preloads content for all tabs
 * @param {Array} tabsData - Array of tab definitions
 */
function preloadAllTabContent(tabsData) {
    tabsData.forEach(tabData => {
        const parts = tabData.split(":");
        const tabId = parts[1] || `tab-${Math.random().toString(36).substring(2, 9)}`;
        const source = parts[2] || "";

        if (source) {
            // Create a pipe element for each tab
            let pipeElement = document.createElement('pipe');
            pipeElement.id = `pipe-${tabId}-preload`;
            pipeElement.setAttribute('ajax', source);
            pipeElement.setAttribute('insert', `content-${tabId}`);

            // Set appropriate class based on file extension
            if (source.toLowerCase().endsWith('.json')) {
                pipeElement.classList.add('modala');
            } else if (source.toLowerCase().endsWith('.html')) {
                pipeElement.classList.add('text-html');
                pipeElement.classList.add('plain-html');
            } else {
                // Default handling for other file types
                pipeElement.classList.add('text-html');
            }

            // Add pipe element to the document
            document.body.appendChild(pipeElement);

            // Trigger the pipe to load content
            pipes(pipeElement);

            // Remove the pipe element after use
            setTimeout(() => {
                if (document.body.contains(pipeElement)) {
                    document.body.removeChild(pipeElement);
                }
            }, 2000);
        }
    });
}

/**
 * 
 * Process all login tags in the document
 * This function should be called when the document is loaded
 */
function processLoginTags() {
    let loginElements = document.getElementsByTagName("login");

    Array.from(loginElements).forEach(function (element) {
        if (element.classList.contains("processed")) {
            return;
        }

        // Get attributes
        const loginPage = element.getAttribute("login-page") || "";
        const registrationPage = element.getAttribute("registration-page") || "";
        const cssPage = element.getAttribute("css-page") || "";

        // Check if we have at least one page to show
        if (!loginPage && !registrationPage) {
            console.error("Login tag requires at least one of login-page or registration-page attributes");
            element.innerHTML = "<div class='auth-error'>Configuration error: No login or registration page specified</div>";
            element.classList.add("processed");
            return;
        }

        // Generate the login/registration HTML
        const loginHTML = createLoginRegistrationTabs(loginPage, registrationPage, cssPage);

        // Replace the login tag content with our generated HTML
        element.innerHTML = loginHTML;

        // Mark as processed
        element.classList.add("processed");

        // Process the newly added elements with dotpipe.js
        domContentLoad();
    });
}

/**
 * Creates a tabbed login and registration interface based on provided attributes
 * @param {string} loginPage - The URL for the login form submission (empty if not provided)
 * @param {string} registrationPage - The URL for the registration form submission (empty if not provided)
 * @param {string} cssPage - Optional URL to an external CSS file
 * @returns {string} HTML for the login/registration interface
 */
function createLoginRegistrationTabs(loginPage, registrationPage, cssPage) {
    const externalCss = cssPage ? `<link rel="stylesheet" href="${cssPage}">` : '';

    // Determine which tabs to show
    const showLogin = !!loginPage;
    const showRegistration = !!registrationPage;

    // Set default active tab
    const loginActive = showLogin ? 'active' : '';
    const registerActive = !showLogin && showRegistration ? 'active' : '';

    // Create tabs HTML
    let tabsHtml = '';
    if (showLogin && showRegistration) {
        // Show both tabs with switcher
        tabsHtml = `
        <div class="auth-tabs">
            <div class="auth-tab ${loginActive}" id="login-tab" onclick="switchTab('login')">Login</div>
            <div class="auth-tab ${registerActive}" id="register-tab" onclick="switchTab('register')">Register</div>
        </div>`;
    }

    // Create login form HTML if needed
    let loginFormHtml = '';
    if (showLogin) {
        loginFormHtml = `
        <div class="auth-form ${loginActive}" id="login-form">
            <h2>Login to Your Account</h2>
            <form>
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" name="email" class="login-form-class" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" name="password" class="login-form-class" required>
                </div>
                <div class="form-options">
                    <div class="remember-me">
                        <input type="checkbox" id="remember-me" name="remember" class="login-form-class">
                        <label for="remember-me">Remember me</label>
                    </div>
                    <a href="#" class="forgot-password">Forgot Password?</a>
                </div>
                <div class="form-group">
                    <pipe id="login-button" class="auth-button" form-class="login-form-class" ajax="${loginPage}" insert="login-response">Login</pipe>
                </div>
                <div id="login-response" class="response-message"></div>
            </form>
            <div class="social-login">
                <p>Or login with</p>
                <div class="social-buttons">
                    <button class="social-button google">Google</button>
                    <button class="social-button facebook">Facebook</button>
                </div>
            </div>
        </div>`;
    }

    // Create registration form HTML if needed
    let registrationFormHtml = '';
    if (showRegistration) {
        registrationFormHtml = `
        <div class="auth-form ${registerActive}" id="register-form">
            <h2>Create an Account</h2>
            <form>
                <div class="form-group">
                    <label for="register-name">Full Name</label>
                    <input type="text" id="register-name" name="name" class="register-form-class" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" name="email" class="register-form-class" required>
                </div>
                <div class="form-group">
                    <label for="register-password">Password</label>
                    <input type="password" id="register-password" name="password" class="register-form-class" required>
                </div>
                <div class="form-group">
                    <label for="register-confirm-password">Confirm Password</label>
                    <input type="password" id="register-confirm-password" name="confirm_password" class="register-form-class" required>
                </div>
                <div class="form-options">
                    <div class="terms">
                        <input type="checkbox" id="terms" name="terms" class="register-form-class" required>
                        <label for="terms">I agree to the <a href="#">Terms and Conditions</a></label>
                    </div>
                </div>
                <div class="form-group">
                    <pipe id="register-button" class="auth-button" form-class="register-form-class" ajax="${registrationPage}" insert="register-response">Register</pipe>
                </div>
                <div id="register-response" class="response-message"></div>
            </form>
        </div>`;
    }

    const html = `
    ${externalCss}
    <div class="auth-container">
        ${tabsHtml}
        
        <div class="auth-content">
            ${loginFormHtml}
            ${registrationFormHtml}
        </div>
    </div>

    <style>
        .auth-container {
            max-width: 500px;
            margin: 0 auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        
        .auth-tabs {
            display: flex;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .auth-tab {
            flex: 1;
            text-align: center;
            padding: 15px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .auth-tab.active {
            background: #f8f9fa;
            border-bottom: 3px solid #4a90e2;
        }
        
        .auth-content {
            padding: 20px;
        }
        
        .auth-form {
            display: none;
        }
        
        .auth-form.active {
            display: block;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .remember-me, .terms {
            display: flex;
            align-items: center;
        }
        
        .remember-me input, .terms input {
            margin-right: 5px;
        }
        
        .forgot-password {
            color: #4a90e2;
            text-decoration: none;
        }
        
        .auth-button {
            display: block;
            width: 100%;
            padding: 12px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
        }
        
        .auth-button:hover {
            background: #3a80d2;
        }
        
        .social-login {
            margin-top: 20px;
            text-align: center;
        }
        
        .social-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }
        
        .social-button {
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-weight: bold;
        }
        
        .social-button.google {
            color: #DB4437;
        }
        
        .social-button.facebook {
            color: #4267B2;
        }
        
        .response-message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            display: none;
        }
        
        .response-message.error {
            background: #ffebee;
            color: #c62828;
            display: block;
        }
        
        .response-message.success {
            background: #e8f5e9;
            color: #2e7d32;
            display: block;
        }
        
        .auth-error {
            padding: 15px;
            background: #ffebee;
            color: #c62828;
            border-radius: 4px;
            text-align: center;
        }
    </style>

    ${(showLogin && showRegistration) ? `
    <script>
        function switchTab(tab) {
            // Hide all forms
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            
            // Deactivate all tabs
            document.querySelectorAll('.auth-tab').forEach(tabElem => {
                tabElem.classList.remove('active');
            });
            
            // Activate selected tab and form
            document.getElementById(tab + '-form').classList.add('active');
            document.getElementById(tab + '-tab').classList.add('active');
        }
    </script>
    ` : ''}
    `;

    return html;
}
/**
 * Process all search tags in the document
 */
function processSearchTags() {
    let searchElements = document.getElementsByTagName("search");

    Array.from(searchElements).forEach(function (element) {
        if (element.classList.contains("processed")) {
            return;
        }

        // Get attributes
        const targetIds = element.getAttribute("use-id")?.split(";") || [];
        const inputWidth = element.getAttribute("input-width") || "200px";
        const inputHeight = element.getAttribute("input-height") || "30px";
        const placeholder = element.getAttribute("placeholder") || "Search...";
        const searchDelay = parseInt(element.getAttribute("search-delay") || "300");

        // Create search input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-input';
        searchInput.placeholder = placeholder;
        searchInput.style.width = inputWidth;
        searchInput.style.height = inputHeight;

        // Create search button
        const searchButton = document.createElement('button');
        searchButton.className = 'search-button';
        searchButton.textContent = '🔍';
        searchButton.style.height = inputHeight;

        // Add to container
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);

        // Clear existing content but preserve any data attributes
        const originalAttributes = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            originalAttributes[attr.name] = attr.value;
        }

        element.innerHTML = '';

        // Restore original attributes
        for (const [name, value] of Object.entries(originalAttributes)) {
            element.setAttribute(name, value);
        }

        // Add search container to the search element
        element.appendChild(searchContainer);

        // Store original content of target elements
        const targetElements = targetIds.map(id => {
            const targetElement = document.getElementById(id);
            if (!targetElement) {
                console.warn(`Target element with ID '${id}' not found for search tag`);
                return null;
            }

            return {
                element: targetElement,
                originalContent: targetElement.innerHTML,
                isTable: targetElement.tagName === 'TABLE' || targetElement.querySelector('table') !== null
            };
        }).filter(target => target !== null);

        // Function to perform search
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();

            targetElements.forEach(target => {
                if (searchTerm === '') {
                    // Reset to original content if search term is empty
                    target.element.innerHTML = target.originalContent;
                    return;
                }

                if (target.isTable) {
                    // Search in table rows
                    searchInTable(target.element, searchTerm);
                } else {
                    // Search in text content
                    searchInContent(target.element, searchTerm);
                }
            });

            // Dispatch event for other components
            const event = new CustomEvent('searchPerformed', {
                detail: {
                    searchTerm: searchTerm,
                    targetIds: targetIds
                }
            });
            document.dispatchEvent(event);
            element.dispatchEvent(event);
        }

        // Add event listeners
        let searchTimeout;

        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, searchDelay);
        });

        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                clearTimeout(searchTimeout);
                performSearch();
            }
        });

        searchButton.addEventListener('click', function () {
            clearTimeout(searchTimeout);
            performSearch();
        });

        // Mark as processed
        element.classList.add("processed");
    });
}

/**
 * Search within a table element
 * @param {Element} tableElement - The table element to search in
 * @param {string} searchTerm - The search term
 */
function searchInTable(tableElement, searchTerm) {
    // Find the table element if the container isn't a table itself
    const table = tableElement.tagName === 'TABLE' ? tableElement : tableElement.querySelector('table');

    if (!table) {
        console.warn('No table found in the target element');
        return;
    }

    // Get all rows
    const rows = table.querySelectorAll('tbody tr');

    // Check each row
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = ''; // Show matching row
            highlightSearchTerm(row, searchTerm);
        } else {
            row.style.display = 'none'; // Hide non-matching row
        }
    });
}

/**
 * Search within general content
 * @param {Element} element - The element to search in
 * @param {string} searchTerm - The search term
 */
function searchInContent(element, searchTerm) {
    // Get all child elements
    const children = element.children;

    // Check each child element
    Array.from(children).forEach(child => {
        const text = child.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            child.style.display = ''; // Show matching element
            highlightSearchTerm(child, searchTerm);
        } else {
            child.style.display = 'none'; // Hide non-matching element
        }
    });
}

/**
 * Highlight search term in an element
 * @param {Element} element - The element to highlight search term in
 * @param {string} searchTerm - The search term to highlight
 */
function highlightSearchTerm(element, searchTerm) {
    // Create a regular expression for the search term
    const regex = new RegExp(`(${searchTerm})`, 'gi');

    // Function to replace text with highlighted version
    function replaceText(node) {
        if (node.nodeType === 3) { // Text node
            const text = node.nodeValue;
            const newText = text.replace(regex, '<span class="search-highlight">$1</span>');

            if (newText !== text) {
                const tempSpan = document.createElement('span');
                tempSpan.innerHTML = newText;
                node.parentNode.replaceChild(tempSpan, node);
                return tempSpan;
            }
        } else if (node.nodeType === 1) { // Element node
            // Skip already processed nodes or script tags
            if (node.tagName === 'SCRIPT' || node.classList.contains('search-processed')) {
                return node;
            }

            // Mark as processed to avoid infinite recursion
            node.classList.add('search-processed');

            // Process child nodes
            const childNodes = Array.from(node.childNodes);
            childNodes.forEach(child => replaceText(child));
        }

        return node;
    }

    // Process the element
    replaceText(element);

    // Remove the processing markers
    const processedNodes = element.querySelectorAll('.search-processed');
    processedNodes.forEach(node => node.classList.remove('search-processed'));
}

/**
 * Process all CSV tags in the document
 */
function processCsvTags() {
    let csvElements = document.getElementsByTagName("csv");

    Array.from(csvElements).forEach(function (element) {
        if (element.classList.contains("processing")) {
            return; // Skip if already being processed
        }

        // Get attributes
        const sources = element.getAttribute("sources")?.split(";") || [];
        const displayMode = element.getAttribute("csv-as") || "table";
        const sortAttr = element.getAttribute("sort");
        const csvClass = element.getAttribute("csv-class");
        const pageSize = parseInt(element.getAttribute("page-size") || "10");
        const lazyLoad = element.getAttribute("lazy-load") !== "false"; // Default to true

        if (sources.length === 0) {
            console.error("CSV tag requires sources attribute");
            return;
        }

        // Mark as being processed
        element.classList.add("processing");
        element.classList.remove("processed");

        // Add the CSV-specific class if provided
        if (csvClass) {
            element.classList.add(csvClass);
        }

        // Store original inner content for templates
        const originalContent = element.innerHTML;

        // Process all sources and concatenate the results
        processMultipleCSVSources(sources, element, displayMode, sortAttr, pageSize, lazyLoad, originalContent);
    });
}

function processMultipleCSVSources(sources, element, displayMode, sortAttr, pageSize, lazyLoad, originalContent) {
    // Create a container for the combined data
    let combinedData = {
        headers: [],
        rows: [],
        originalSources: sources
    };

    // If lazy loading is enabled, only load the first source initially
    const sourcesToLoad = lazyLoad ? [sources[0]] : sources;
    let loadedCount = 0;

    // Process each source that should be loaded initially
    sourcesToLoad.forEach((source) => {
        fetch(source)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(csvText => {
                // Parse CSV
                const data = parseCSV(csvText);

                // For the first source, use its headers
                if (loadedCount === 0) {
                    combinedData.headers = [...data.headers];
                }

                // Add rows to the combined data
                combinedData.rows = combinedData.rows.concat(data.rows);

                // Increment loaded count
                loadedCount++;

                // If all requested sources are loaded, display the data
                if (loadedCount === sourcesToLoad.length) {
                    // Apply sorting if specified
                    if (sortAttr) {
                        const [column, direction] = parseSortAttribute(sortAttr, combinedData);
                        if (column) {
                            sortCSVData(combinedData, column, direction);
                        }
                    }

                    // Display the CSV data
                    displayCSVData(element, combinedData, displayMode, pageSize, originalContent);

                    // Mark as processed
                    element.classList.remove("processing");
                    element.classList.add("processed");

                    // Dispatch event for other components
                    const event = new CustomEvent('csvLoaded', {
                        detail: {
                            element: element,
                            data: combinedData,
                            loadedSources: sourcesToLoad
                        }
                    });
                    document.dispatchEvent(event);
                    element.dispatchEvent(event);
                }
            })
            .catch(error => {
                console.error(`Error processing CSV source ${source}:`, error);

                // Increment loaded count even on error
                loadedCount++;

                // If all requested sources are loaded, display whatever data we have
                if (loadedCount === sourcesToLoad.length) {
                    if (combinedData.rows.length > 0) {
                        // We have some data, so display it
                        displayCSVData(element, combinedData, displayMode, pageSize, originalContent);
                    } else {
                        // No data at all, show error
                        element.innerHTML = `<div class="error">Error loading CSV data: ${error.message}</div>`;
                    }

                    element.classList.remove("processing");
                    element.classList.add("processed");
                }
            });
    });
}


/**
 * Parse sort attribute, handling dynamic placeholders
 * @param {string} sortAttr - The sort attribute string
 * @param {Object} data - The CSV data object
 * @returns {Array} - [column, direction]
 */
function parseSortAttribute(sortAttr, data) {
    // Handle dynamic placeholders
    let processedAttr = sortAttr;
    if (sortAttr.includes("{{")) {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);

        // Replace placeholders with values from URL parameters
        processedAttr = sortAttr.replace(/\{\{([^}]+)\}\}/g, (match, param) => {
            return urlParams.get(param) || data.headers[0]; // Default to first column
        });
    }

    // Parse the processed attribute
    const [column, direction] = processedAttr.split(":");
    return [column, direction || "csv-asc"];
}

/**
 * Sort CSV data
 * @param {Object} data - The CSV data object
 * @param {string} column - Column to sort by
 * @param {string} direction - Sort direction (csv-asc or csv-desc)
 */
function sortCSVData(data, column, direction) {
    const columnIndex = data.headers.indexOf(column);
    if (columnIndex === -1) return;

    data.rows.sort((a, b) => {
        let valA = a[columnIndex];
        let valB = b[columnIndex];

        // Try to convert to numbers if possible
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
            valA = numA;
            valB = numB;
        }

        if (valA < valB) {
            return direction === "csv-asc" ? -1 : 1;
        }
        if (valA > valB) {
            return direction === "csv-asc" ? 1 : -1;
        }
        return 0;
    });
}

/**
 * Display CSV data in the specified format
 * @param {Element} element - The CSV element
 * @param {Object} data - The CSV data object
 * @param {string} displayMode - The display mode (table, list, cards)
 * @param {number} pageSize - Number of items per page
 * @param {string} originalContent - Original inner content of the element
 */
function displayCSVData(element, data, displayMode, pageSize, originalContent) {
    // Clear the element
    element.innerHTML = '';

    // Create container for CSV content
    const csvContainer = document.createElement('div');
    csvContainer.className = 'csv-container';

    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'csv-search-container';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'csv-search-input';
    searchInput.placeholder = 'Search...';

    const searchButton = document.createElement('button');
    searchButton.className = 'csv-search-button';
    searchButton.textContent = 'Search';

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    csvContainer.appendChild(searchContainer);

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'csv-content-container';
    csvContainer.appendChild(contentContainer);

    // Create pagination container
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'csv-pagination-container';
    csvContainer.appendChild(paginationContainer);


    // Create load more button for lazy loading
    if (data.originalSources.length > 1) {
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'csv-load-more-container';

        const loadMoreButton = document.createElement('button');
        loadMoreButton.className = 'csv-load-more-button';
        loadMoreButton.textContent = 'Load More Data';

        // Track which sources have been loaded
        const loadedSources = new Set([data.originalSources[0]]);

        loadMoreButton.addEventListener('click', function () {
            // Find the next unloaded source
            const nextSource = data.originalSources.find(source => !loadedSources.has(source));

            if (nextSource) {
                // Show loading indicator
                this.textContent = 'Loading...';
                this.disabled = true;

                // Fetch the next source
                fetch(nextSource)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(csvText => {
                        // Parse CSV
                        const newData = parseCSV(csvText);

                        // Add the source to our loaded sources set
                        loadedSources.add(nextSource);

                        // Add rows to the combined data
                        data.rows = data.rows.concat(newData.rows);

                        // Update the display
                        updateDisplayWithData(element, data, displayMode, pageSize, originalContent);

                        // Update button state
                        if (loadedSources.size < data.originalSources.length) {
                            this.textContent = 'Load More Data';
                            this.disabled = false;
                        } else {
                            loadMoreContainer.remove(); // All sources loaded
                        }

                        // Dispatch event for other components
                        const event = new CustomEvent('csvMoreDataLoaded', {
                            detail: {
                                element: element,
                                data: data,
                                loadedSources: Array.from(loadedSources)
                            }
                        });
                        document.dispatchEvent(event);
                        element.dispatchEvent(event);
                    })
                    .catch(error => {
                        console.error(`Error loading additional source ${nextSource}:`, error);
                        this.textContent = 'Error Loading Data';
                        setTimeout(() => {
                            this.textContent = 'Try Again';
                            this.disabled = false;
                        }, 3000);
                    });
            }
        });

        loadMoreContainer.appendChild(loadMoreButton);
        csvContainer.appendChild(loadMoreContainer);
    }

    element.appendChild(csvContainer);

    // Initialize the display with current data
    updateDisplayWithData(element, data, displayMode, pageSize, originalContent);

    // Set up search functionality
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            const filteredData = {
                headers: data.headers,
                rows: data.rows.filter(row =>
                    row.some(cell =>
                        String(cell).toLowerCase().includes(searchTerm)
                    )
                ),
                originalSources: data.originalSources
            };
            updateDisplayWithData(element, filteredData, displayMode, pageSize, originalContent);
        } else {
            // Reset to original data
            updateDisplayWithData(element, data, displayMode, pageSize, originalContent);
        }
    });

    // Add enter key support for search
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
}

/**
 * Update the display with the current data
 * @param {Element} element - The CSV element
 * @param {Object} data - The CSV data object
 * @param {string} displayMode - The display mode
 * @param {number} pageSize - Number of items per page
 * @param {string} originalContent - Original inner content of the element
 */
function updateDisplayWithData(element, data, displayMode, pageSize, originalContent) {
    const contentContainer = element.querySelector('.csv-content-container');
    const paginationContainer = element.querySelector('.csv-pagination-container');

    if (!contentContainer) return;

    // Clear content container
    contentContainer.innerHTML = '';

    // Calculate pagination
    const totalItems = data.rows.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    let currentPage = 1;

    // Function to display a specific page
    function displayPage(page) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        const pageRows = data.rows.slice(startIndex, endIndex);

        contentContainer.innerHTML = '';

        if (displayMode === "table") {
            renderTableView(contentContainer, data.headers, pageRows, originalContent);
        } else if (displayMode === "list") {
            renderListView(contentContainer, data.headers, pageRows, originalContent);
        } else if (displayMode === "cards") {
            renderCardsView(contentContainer, data.headers, pageRows, originalContent);
        }

        // Update pagination UI
        updatePagination();
    }

    // Function to update pagination controls
    function updatePagination() {
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return; // No pagination needed

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'csv-pagination-prev';
        prevButton.textContent = '← Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page numbers
        const pageNumbersContainer = document.createElement('div');
        pageNumbersContainer.className = 'csv-pagination-numbers';

        // Determine which page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // Adjust if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // First page link if not in range
        if (startPage > 1) {
            const firstPageBtn = document.createElement('button');
            firstPageBtn.className = 'csv-pagination-number';
            firstPageBtn.textContent = '1';
            firstPageBtn.addEventListener('click', () => {
                currentPage = 1;
                displayPage(currentPage);
            });
            pageNumbersContainer.appendChild(firstPageBtn);

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'csv-pagination-ellipsis';
                ellipsis.textContent = '...';
                pageNumbersContainer.appendChild(ellipsis);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'csv-pagination-number';
            if (i === currentPage) {
                pageBtn.classList.add('csv-pagination-current');
            }
            pageBtn.textContent = i.toString();
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                displayPage(currentPage);
            });
            pageNumbersContainer.appendChild(pageBtn);
        }

        // Last page link if not in range
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'csv-pagination-ellipsis';
                ellipsis.textContent = '...';
                pageNumbersContainer.appendChild(ellipsis);
            }

            const lastPageBtn = document.createElement('button');
            lastPageBtn.className = 'csv-pagination-number';
            lastPageBtn.textContent = totalPages.toString();
            lastPageBtn.addEventListener('click', () => {
                currentPage = totalPages;
                displayPage(currentPage);
            });
            pageNumbersContainer.appendChild(lastPageBtn);
        }

        paginationContainer.appendChild(pageNumbersContainer);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'csv-pagination-next';
        nextButton.textContent = 'Next →';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayPage(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Display the first page
    displayPage(1);
}
/**
 * Render table view of CSV data
 * @param {Element} container - Container element
 * @param {Array} headers - CSV headers
 * @param {Array} rows - CSV data rows
 * @param {string} originalContent - Original inner content for templates
 */
function renderTableView(container, headers, rows, originalContent) {
    // Check if there's a template in the original content
    const templateMatch = originalContent.match(/<template[^>]*>([\s\S]*?)<\/template>/i);

    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'csv-table-container';

    // Create table
    const table = document.createElement('table');
    table.className = 'csv-table';

    // Add headers
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Check if the template contains custom headers
    let hasCustomHeaders = false;
    if (templateMatch) {
        const templateContent = templateMatch[1];
        hasCustomHeaders = /<thead[^>]*>[\s\S]*?<\/thead>/i.test(templateContent);
    }

    // If no custom headers in template, use CSV headers
    if (!hasCustomHeaders) {
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.className = 'csv-header';
            th.setAttribute('data-column', header);

            // Add click handler for sorting
            th.addEventListener('click', function () {
                const currentDir = this.getAttribute('data-direction') || 'none';
                let newDir = 'csv-asc';

                if (currentDir === 'csv-asc') {
                    newDir = 'csv-desc';
                } else if (currentDir === 'csv-desc') {
                    newDir = 'csv-asc';
                }

                // Update all headers
                Array.from(thead.querySelectorAll('th')).forEach(h => {
                    h.removeAttribute('data-direction');
                    h.classList.remove('csv-sort-asc', 'csv-sort-desc');
                });

                // Update this header
                this.setAttribute('data-direction', newDir);
                this.classList.add(newDir === 'csv-asc' ? 'csv-sort-asc' : 'csv-sort-desc');

                // Get the parent CSV element
                const csvElement = container.closest('csv');
                if (csvElement) {
                    // Update the sort attribute
                    csvElement.setAttribute('sort', `${header}:${newDir}`);

                    // Re-process the CSV tag
                    processCsvTags();
                }
            });

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

    // Process template or create default table body
    if (templateMatch) {
        const templateContent = templateMatch[1];

        // Check if template has both thead and tbody
        const theadMatch = templateContent.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
        const tbodyMatch = templateContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);

        // If template has custom thead, use it
        if (theadMatch) {
            const tempHead = document.createElement('div');
            tempHead.innerHTML = theadMatch[1];
            thead.innerHTML = tempHead.innerHTML;
            table.appendChild(thead);

            // Add click handlers for sorting to custom headers
            Array.from(thead.querySelectorAll('th')).forEach((th, index) => {
                const columnName = headers[index] || th.textContent;
                th.setAttribute('data-column', columnName);

                th.addEventListener('click', function () {
                    const currentDir = this.getAttribute('data-direction') || 'none';
                    let newDir = 'csv-asc';

                    if (currentDir === 'csv-asc') {
                        newDir = 'csv-desc';
                    } else if (currentDir === 'csv-desc') {
                        newDir = 'csv-asc';
                    }

                    // Update all headers
                    Array.from(thead.querySelectorAll('th')).forEach(h => {
                        h.removeAttribute('data-direction');
                        h.classList.remove('csv-sort-asc', 'csv-sort-desc');
                    });

                    // Update this header
                    this.setAttribute('data-direction', newDir);
                    this.classList.add(newDir === 'csv-asc' ? 'csv-sort-asc' : 'csv-sort-desc');

                    // Get the parent CSV element
                    const csvElement = container.closest('csv');
                    if (csvElement) {
                        // Update the sort attribute
                        csvElement.setAttribute('sort', `${columnName}:${newDir}`);

                        // Re-process the CSV tag
                        processCsvTags();
                    }
                });
            });
        }

        // Create tbody
        const tbody = document.createElement('tbody');

        // If template has custom tbody, use its structure
        if (tbodyMatch) {
            const rowTemplate = tbodyMatch[1];

            rows.forEach(row => {
                // Create a row object with named properties
                const rowObj = {};
                headers.forEach((header, i) => {
                    rowObj[header] = row[i];
                });

                // Apply template to row
                let rowHtml = rowTemplate;

                // Replace {{column}} placeholders
                rowHtml = rowHtml.replace(/\{\{([^}]+)\}\}/g, (match, column) => {
                    return rowObj[column] || '';
                });

                // Create a temporary container
                const temp = document.createElement('div');
                temp.innerHTML = rowHtml;

                // Append the row
                Array.from(temp.children).forEach(child => {
                    tbody.appendChild(child);
                });
            });
        } else {
            // Use simple row template
            const rowTemplateContent = templateContent.replace(/<thead[^>]*>[\s\S]*?<\/thead>/i, '');

            rows.forEach(row => {
                // Create a row object with named properties
                const rowObj = {};
                headers.forEach((header, i) => {
                    rowObj[header] = row[i];
                });

                // Apply template to row
                let rowHtml = rowTemplateContent;

                // Replace {{column}} placeholders
                rowHtml = rowHtml.replace(/\{\{([^}]+)\}\}/g, (match, column) => {
                    return rowObj[column] || '';
                });

                // Create a temporary container
                const temp = document.createElement('div');
                temp.innerHTML = rowHtml;

                // Append the row
                Array.from(temp.children).forEach(child => {
                    tbody.appendChild(child);
                });
            });
        }

        table.appendChild(tbody);
    } else {
        // Default table rendering without template
        const tbody = document.createElement('tbody');

        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'csv-row';

            row.forEach((cell, i) => {
                const td = document.createElement('td');
                td.className = 'csv-cell';
                td.setAttribute('data-column', headers[i]);
                td.textContent = cell;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    }

    tableContainer.appendChild(table);
    container.appendChild(tableContainer);
}


/**
 * Render list view of CSV data
 * @param {Element} container - Container element
 * @param {Array} headers - CSV headers
 * @param {Array} rows - CSV data rows
 * @param {string} originalContent - Original inner content for templates
 */
function renderListView(container, headers, rows, originalContent) {
    // Check if there's a template in the original content
    const templateMatch = originalContent.match(/<template[^>]*>([\s\S]*?)<\/template>/i);

    if (templateMatch) {
        // Use template for rendering
        const templateContent = templateMatch[1];
        const listContainer = document.createElement('div');
        listContainer.className = 'csv-list-container';

        const ul = document.createElement('ul');
        ul.className = 'csv-list';

        rows.forEach(row => {
            // Create a row object with named properties
            const rowObj = {};
            headers.forEach((header, i) => {
                rowObj[header] = row[i];
            });

            // Apply template to row
            let itemHtml = templateContent;

            // Replace {{column}} placeholders
            itemHtml = itemHtml.replace(/\{\{([^}]+)\}\}/g, (match, column) => {
                return rowObj[column] || '';
            });

            // Create a temporary container
            const temp = document.createElement('li');
            temp.innerHTML = itemHtml;

            // Append the item
            ul.appendChild(temp);
        });

        listContainer.appendChild(ul);
        container.appendChild(listContainer);
    } else {
        // Default list rendering
        const ul = document.createElement('ul');
        ul.className = 'csv-list';

        rows.forEach(row => {
            const li = document.createElement('li');
            li.className = 'csv-list-item';

            const rowContent = headers.map((header, i) =>
                `<span class="csv-label">${header}:</span> <span class="csv-value">${row[i]}</span>`
            ).join(', ');

            li.innerHTML = rowContent;
            ul.appendChild(li);
        });

        container.appendChild(ul);
    }
}

/**
 * Render cards view of CSV data
 * @param {Element} container - Container element
 * @param {Array} headers - CSV headers
 * @param {Array} rows - CSV data rows
 * @param {string} originalContent - Original inner content for templates
 */
function renderCardsView(container, headers, rows, originalContent) {
    // Check if there's a template in the original content
    const templateMatch = originalContent.match(/<template[^>]*>([\s\S]*?)<\/template>/i);

    if (templateMatch) {
        // Use template for rendering
        const templateContent = templateMatch[1];
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'csv-cards';

        rows.forEach(row => {
            // Create a row object with named properties
            const rowObj = {};
            headers.forEach((header, i) => {
                rowObj[header] = row[i];
            });

            // Apply template to row
            let cardHtml = templateContent;

            // Replace {{column}} placeholders
            cardHtml = cardHtml.replace(/\{\{([^}]+)\}\}/g, (match, column) => {
                return rowObj[column] || '';
            });

            // Create a temporary container
            const temp = document.createElement('div');
            temp.className = 'csv-card';
            temp.innerHTML = cardHtml;

            // Append the card
            cardsContainer.appendChild(temp);
        });

        container.appendChild(cardsContainer);
    } else {
        // Default cards rendering
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'csv-cards';

        rows.forEach(row => {
            const card = document.createElement('div');
            card.className = 'csv-card';

            headers.forEach((header, i) => {
                const field = document.createElement('div');
                field.className = 'csv-field';

                const label = document.createElement('span');
                label.className = 'csv-label';
                label.textContent = header + ': ';

                const value = document.createElement('span');
                value.className = 'csv-value';
                value.textContent = row[i];

                field.appendChild(label);
                field.appendChild(value);
                card.appendChild(field);
            });

            cardsContainer.appendChild(card);
        });

        container.appendChild(cardsContainer);
    }
}

/**
 * Parse CSV text into a structured object
 * @param {string} text - The CSV text to parse
 * @returns {Object} - Object with headers and rows
 */
function parseCSV(text) {
    // Handle different line endings
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const result = {
        headers: [],
        rows: []
    };

    if (lines.length === 0) return result;

    // Parse headers
    result.headers = parseCSVLine(lines[0]);

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        result.rows.push(parseCSVLine(lines[i]));
    }

    return result;
}

/**
 * Parse a single CSV line, handling quoted values
 * @param {string} line - A single line of CSV text
 * @returns {Array} - Array of values
 */
function parseCSVLine(line) {
    const values = [];
    let inQuote = false;
    let currentValue = '';

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    // Add the last value
    values.push(currentValue);

    // Clean up values - remove quotes and trim
    return values.map(val => {
        val = val.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1);
        }
        return val;
    });
}

// Usage example to generate a nonce
function generateNonce() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    return sha256(randomBytes.join('')).then(hash => hash.slice(0, 16));
}

function copyContentById(id) {
    // Get the element with the specified ID
    var element = document.getElementById(id);

    // Check if element exists
    if (element) {
        // Create a new textarea element to copy the content
        var textarea = document.createElement('textarea');

        // Set the value of the textarea to the content of the element
        textarea.value = element.innerText;

        // Append the textarea to the body
        document.body.appendChild(textarea);

        // Select the text in the textarea
        textarea.select();

        // Copy the selected text to the clipboard
        document.execCommand('copy');

        // Remove the textarea from the body
        document.body.removeChild(textarea);
        textCard("Copied to the clipboard!", "id-copy", "", true, 25, 3000, 100);
        domContentLoad();
        return true;
        // Alert the user that the content has been copied
    } else {
        // Alert the user that the element does not exist
        alert('Element with ID ' + id + ' not found.');
        return false;
    };
}

function modalCard(filename, x_center = false, y_center = false, duration = -1, zindex = 100) {
    var copied = document.createElement("div");
    copied.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    copied.style.padding = "10px";
    copied.style.textAlign = "center";
    copied.style.backgroundColor = "white";
    copied.style.position = "absolute";
    var x_pos = 0;
    if (typeof x_center === 'boolean' && x_center) x_pos = (document.body.offsetWidth - copied.style.width) / 2;
    else if (typeof x_center === 'boolean' && !x_center) x_pos = 0;
    else x_pos = x_center;
    copied.style.left = x_pos + "px";
    var y_pos = 0;
    if (typeof y_center === 'boolean' && y_center) y_pos = window.scrollY + Math.abs((window.innerHeight / 2) - copied.style.height / 2);
    else if (typeof y_center === 'boolean' && !y_center) y_pos = 0;
    else y_pos = y_center;
    copied.style.top = y_pos + "px";
    copied.style.zIndex = zindex;
    modal(filename, copied);
    document.body.appendChild(copied);

    if (duration > -1) {
        setTimeout(() => {
            document.body.removeChild(copied);
        }, duration);
    }
}

function textCard(text, id = "", classes = "", x_center = false, y_center = false, duration = -1, zindex = 100) {
    var copied = document.createElement("div");
    copied.id = id;
    if (classes != undefined && classes != "")
        copied.classList.add(classes);
    copied.style.padding = "10px";
    copied.style.textAlign = "center";
    copied.style.backgroundColor = "white";
    copied.style.position = "absolute";
    var x_pos = 0;
    if (typeof x_center === 'boolean' && x_center) x_pos = (document.body.offsetWidth - copied.style.width) / 2;
    else if (typeof x_center === 'boolean' && !x_center) x_pos = 0;
    else x_pos = x_center;
    copied.style.left = x_pos + "px";
    copied.style.zIndex = zindex;
    copied.textContent = text;
    var y_pos = 0;
    if (typeof y_center === 'boolean' && y_center) y_pos = window.scrollY + Math.abs((window.innerHeight / 2) - copied.style.height / 2);
    else if (typeof y_center === 'boolean' && !y_center) y_pos = 0;
    else y_pos = y_center;
    copied.style.top = y_pos + "px";
    document.body.appendChild(copied);

    if (duration > -1) {
        setTimeout(() => {
            document.body.removeChild(copied);
        }, duration);
    }
}

let highlightedItem = null;

function renderTree(value, tempTag) {
    if (typeof tempTag == "string") {
        tempTag = document.getElementById(tempTag);
    }
    if (value == undefined) {
        console.log(tempTag + "******");
        console.error("value of reference incorrect");
        return;
    }

    var temp = document.createElement(value["tagname"] || 'span');
    temp.id = value["textContent"] || value["label"] || value.keyName;
    temp.classList.add('tree-item');

    if (value.icon) {
        let img = document.createElement('img');
        img.src = value.icon;
        img.style.marginRight = '5px';
        temp.appendChild(img);
    }

    temp.id = value.id;
    temp.textContent = value.textContent || value.label;
    if (temp.textContent.length == 0) {
        console.error("No text content for tree item. Use \"label\" or \"textContent\"");
        exit();
    }

    Object.entries(value).forEach(([k, v]) => {
        let keyName = (!isNaN(k.toString()) ? "data-" + k.toString() : k);
        if (v instanceof Object) {
            let subContainer = document.createElement('span');
            subContainer.classList.add('sub-tree');
            temp.appendChild(subContainer);
            renderTree(v, subContainer);
            temp.addEventListener('click', (e) => {
                e.stopPropagation();
                subContainer.style.display = subContainer.style.display === 'none' ? 'block' : 'none';
            });
        } else if (k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "label" && k.toLowerCase() != "icon") {
            temp.setAttribute(k, v);
        }
    });

    temp.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        temp.classList.add('highlight');
        pipes(temp);
    });

    // temp = htmlDecode(temp);

    tempTag.appendChild(temp);

    return tempTag;
}

/**
 * Recursively creates HTML elements based on a JSON object and appends them to the document head.
 *
 * @param {Object} value - A JSON object containing information about the HTML elements to create.
 * @param {string} value.tagname - The tag name of the HTML element to create.
 * @param {Object} [value[key]] - Additional properties of the HTML element, such as attributes, text content, or nested elements.
 * @returns {HTMLElement} The created HTML element.
 */
function modalaHead(value) {

    try {
        if (value == undefined) {
            console.error("value of reference incorrect");
            return;
        }
    }
    catch (e) {
        console.log(e)
    }
    var temp = document.createElement(value["tagname"]);
    Object.entries(value).forEach((nest) => {
        const [k, v] = nest;
        if (v instanceof Object) {
            modalaHead(v);
        }
        else if (k.toLowerCase() == "title") {
            var title = document.createElement("title");
            title.innerText = v;
            document.head.appendChild(title);
        }
        else if (k.toLowerCase() == "css") {
            var optsArray = v.split(";");
            console.log(v)
            optsArray.forEach((e, f) => {
                var cssvar = document.createElement("link");
                cssvar.href = v;
                cssvar.rel = "stylesheet";
                document.head.appendChild(cssvar);
            });

        }
        else if (k.toLowerCase() == "js") {
            var optsArray = v.split(";");
            console.log(v)
            optsArray.forEach((e, f) => {
                const js = document.createElement("script");
                js.src = e;
                document.head.appendChild(js);
            });
        }
        else if (k.toLowerCase() == "modal") {
            fetch(v)
                .then(response => response.json())
                .then(data => {
                    const tmp = modalaHead(data, temp, root, id);
                    document.head.appendChild(tmp);
                });
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "innerhtml" && k.toLowerCase() != "innertext") {
            temp.setAttribute(k, v);
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && (k.toLowerCase() == "textcontent" || k.toLowerCase() == "innerhtml" || k.toLowerCase() == "innertext")) {
            (k.toLowerCase() == "textcontent") ? temp.textContent = v : (k.toLowerCase() == "innerhtml") ? temp.innerHTML = v : temp.innerText = v;
        }
    });

    return;
}

/**
 * Displays a modal dialog with content from a JSON file.
 *
 * @param {string} filename - The URL or path to the JSON file containing the modal content.
 * @param {string|HTMLElement} tagId - The ID of the HTML element to insert the modal into, or the element itself.
 */
function modal(filename, tagId) {
    if (typeof (tagId) == "string") {
        tagId = document.getElementById(tagId);
    }
    const draft = getJSONFile(filename)
    return draft.then(function (res) {
        modala(res, tagId);
    });
}

/**
 * Displays a list of modals from a JSON file.
 *
 * @param {string} filenames - A string containing one or more filenames separated by semicolons. Each filename can optionally have a colon-separated target element ID.
 * @example
 * modalList('modal.json:modal-container.another-container;another-modal.json:another-target');
 */
function modalList(filenames) {
    const files = filenames.split(";");
    if (files.length >= 1) {
        files.forEach(file => {
            const f = file.split(":");
            if (f[1] != undefined && f[1].split(".").length > 1) {
                f[1].split(".").forEach(insert => {
                    modal(f[0], insert);
                });
            }
            else {
                console.log(f);
                modal(f[0], f[1]);
            }
        });
    }
    else {
        console.log(files)
        modal(files[0].split(":")[0], files[0].split(":")[1]);
    }
}


/**
 * Fetches a JSON file from the specified URL or path and returns the parsed JSON data.
 *
 * @param {string} filename - The URL or path to the JSON file to fetch.
 * @returns {Promise<any>} - A Promise that resolves to the parsed JSON data.
 */
function getJSONFile(filename) {
    const resp = fetch(filename)
        .then(response => response.json())
        .then(data => {
            return data;
        });
    return resp.then(function (res) {
        return res;
    });
    return f;
}

/**
 * Fetches a text file from the specified URL or path and returns the text content.
 *
 * @param {string} filename - The URL or path to the text file to fetch.
 * @returns {Promise<string>} - A Promise that resolves to the text content of the file.
 */
function getTextFile(filename) {
    const resp = fetch(filename)
        .then(response => response.text())
        .then(data => {
            return data;
        });
    return resp.then(function (res) {
        return res;
    });
}

function escapeHtml(html) {
    var text = document.createTextNode(html);
    var p = document.createElement('p');
    p.innerHTML = (text.innerHTML);
    console.log(p);
    return p.innerHTML;
}

/**
 * 
 * @param {JSON Object} value 
 * @param {string} tempTag 
 * @param {} root 
 * @param {*} id 
 * @returns HTML Object
 */
function modala(value, tempTag, root, id) {
    if (typeof (tempTag) == "string") {
        tempTag = document.getElementById(tempTag);
    }
    if (root === undefined)
        root = tempTag;
    if (tempTag == undefined) {
        return;
    }
    if (value == undefined) {
        console.log(tempTag + "******");
        console.error("value of reference incorrect");
        return;
    }

    var temp = document.createElement(value["tagname"]);
    if (value["tagname"] == "undefined") {
        temp.tagName = "div";
        temp = document.createElement("div");
    }
    if (value["header"] !== undefined && value["header"] instanceof Object) {

        modalaHead(value["header"], "head", root, null);
        var meta = document.createElement("meta");
        meta.content = "script-src-elem 'self'; img-src 'self'; style-src 'self'; child-src 'none'; object-src 'none'";
        meta.httpEquiv = "Content-Security-Policy";
        document.head.appendChild(meta);
    }
    Object.entries(value).forEach((nest) => {
        const [k, v] = nest;
        if (k.toLowerCase() == "header");
        else if (k.toLocaleLowerCase() == "buttons" && v instanceof Object) {
            var buttons = document.createElement("div");
            v.forEach(z => {
                var button = document.createElement("input");
                console.log(z);
                button.type = "button";
                var keys = ["text", "value", "textcontent", "innerhtml", "innerText"];
                Object.entries(z).forEach(x => {
                    const [key, val] = x;
                    console.log(["text", "value", "textcontent", "innerhtml", "innertext"].includes(key.toLowerCase()));
                    vals = escapeHtml(val);
                    if (["text", "value", "textcontent", "innerhtml", "innertext"].includes(key.toLowerCase()))
                        button.value = val;
                    else
                        button.setAttribute(key, val);
                });
                temp.appendChild(button);
            });
            // modala(v, tempTag, root, id);
        }
        else if (v instanceof Object)
            modala(v, tempTag, root, id);
        else if (v instanceof Object)
            modala(v, tempTag, root, id);
        else if (k.toLowerCase() == "br") {
            let brs = v;
            while (brs) {
                temp.appendChild(document.createElement("br"));
                brs--;
            }
        }
        else if (k.toLowerCase() == "select") {
            var select = document.createElement("select");
            temp.appendChild(select);
            modala(v, temp, root, id);
        }
        else if (k.toLowerCase() == "options" && temp.tagName.toLowerCase() == "select") {
            var optsArray = v.split(";");
            var options = null;
            console.log(v)
            optsArray.forEach((e, f) => {
                var g = e.split(":");
                options = document.createElement("option");
                options.setAttribute("value", g[1]);
                options.textContent = (g[0]);
                temp.appendChild(options);
            });
            temp.appendChild(options);
            console.log("*")
        }
        else if (k.toLowerCase() == "sources" && (temp.tagName.toLowerCase() == "card" || temp.tagName.toLowerCase() == "carousel")) {
            console.log(value);
            var optsArray = v.split(";");
            var options = null;
            var i = (value['index'] == undefined) ? 0 : value['index'];
            temp.id = value['id'];
            optsArray.forEach((e, f) => {
                if (value['boxes'] == temp.childElementCount)
                    return;
                if (value['type'] == "img") {
                    var gth = document.createElement("img");
                    gth.src = e;
                    gth.width = value['width'];
                    gth.height = value['height'];
                    gth.style.display = "hidden";
                    temp.setAttribute("sources", value['sources'])
                    temp.appendChild(gth);
                }
                else if (value['type'] == "audio") {
                    var gth = document.createElement("source");
                    gth.src = e;
                    gth.width = value['width'];
                    gth.height = value['height'];
                    while (e.substr(-i, 1) != '.') i++;
                    gth.type = "audio/" + e.substring(-(i - 1));
                    gth.controls = (values['controls'] != undefined && value['controls'] != false) ? true : false;
                    temp.appendChild(gth);
                }
                else if (value['type'] == "video") {
                    var gth = document.createElement("source");
                    gth.src = e;
                    gth.width = value['width'];
                    gth.height = value['height'];
                    gth.style.display = "hidden";
                    var i = 0;
                    while (e.substr(-i, 1) != '.') i++;
                    gth.type = "video/" + e.substring(-(i - 1));
                    gth.controls = (values['controls'] != undefined && value['controls'] != false) ? true : false;
                    temp.appendChild(gth);
                }
                else if (value['type'] == "modal") {
                    modalList(v)
                }
                else if (value['type'] == "html") {
                    console.log(e);
                    fetch(e)
                        .then(response => response.text())
                        .then(data => {
                            var div = document.createElement("div");
                            div.innerHTML = data;
                            tempTag.appendChild(div);
                        });
                }
                else if (value['type'] == "php") {
                    console.log(e);
                    fetch(e)
                        .then(response => response.text())
                        .then(data => {
                            var div = document.createElement("div");
                            div.innerHTML = data;
                            tempTag.appendChild(div);
                        });
                }
            });

        }
        else if (k.toLowerCase() == "css") {
            var cssvar = document.createElement("link");
            cssvar.href = v;
            cssvar.rel = "stylesheet";
            tempTag.appendChild(cssvar);
        }
        else if (k.toLowerCase() == "js") {
            var js = document.createElement("script");
            js.src = v;
            js.setAttribute("defer", "true");
            tempTag.appendChild(js);
        }
        else if (k.toLowerCase()[0] == "h" && k.length == 2) {
            var h = document.createElement(k);
            h.innerText = v;
            tempTag.appendChild(h);
        }
        else if (k.toLowerCase() == "modal") {
            modalList(v)
        }
        else if (k.toLowerCase() == "html") {
            fetch(v)
                .then(response => response.text())
                .then(data => {
                    var div = document.createElement("div");
                    div.innerHTML = data;
                    tempTag.appendChild(div);
                });
        }
        else if (k.toLowerCase() == "php") {
            fetch(v)
                .then(response => response.text())
                .then(data => {
                    var div = document.createElement("div");
                    div.innerHTML = data;
                    tempTag.appendChild(div);
                });
        }
        else if (k.toLowerCase() == "boxes") {
            console.log(v);
            temp.setAttribute("boxes", v);
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "innerhtml" && k.toLowerCase() != "innertext") {
            try {
                temp.setAttribute(k, v);
            }
            catch (e) {
                console.error(`Error setting attribute ${k}:`, e);
            }
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && (k.toLowerCase() == "textcontent" || k.toLowerCase() == "innerhtml" || k.toLowerCase() == "innertext")) {
            const val = v.replace(/\r?\n/g, "<br>");
            (k.toLowerCase() == "textcontent") ? temp.textContent = val : (k.toLowerCase() == "innerhtml") ? temp.innerHTML = val : temp.innerText = val;
        }
        else if (k.toLowerCase() == "style") {
            temp.style.cssText = v;
        }
    });
    tempTag.appendChild(temp);
    domContentLoad();
    return tempTag;
}

/**
 * @param {string} target
 * @example
 * 
 */
function setTimers(target) {
    var delay = target.getAttribute("delay");
    if ((target.tagName == "carousel" || target.tagName == "timed") && target.classList.contains("turn-auto")) {
        target.classList.toggle("turn-auto")
        return;
    }
    if (delay < 500) {
        console.error("Delay must be greater than 500ms");
        return;
    }
    setTimeout(function () {
        pipes(target);
        setTimers(target);
    }, delay);
}

function carouselButtonSlide(elem, direction) {

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    if (direction.toLowerCase() == "right")
        shiftFilesRight(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
    else
        shiftFilesLeft(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
}

function carouselButtonStep(elem, direction) {

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    if (direction.toLowerCase() == "right")
        shiftFilesRight(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
    else
        shiftFilesLeft(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
}

function shiftFilesLeft(elem, auto = false, delay = 1000) {
    if (typeof (elem) == "string")
        elem = document.getElementById(elem);

    console.error(elem)
    var iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
    var i = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
    var b = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;

    var h = 0;

    while (h < b) {
        elem.removeChild(elem.firstChild);
        var cloneSrcs = elem.getAttribute("sources").split(";");
        var clones = cloneSrcs[(h + i) % cloneSrcs.length];
        var newClone = null;
        if (elem.getAttribute("type").toLowerCase() == ('audio' | 'video'))
            newClone = document.createElement(elem.getAttribute("source"));
        else if (elem.getAttribute("type").toLowerCase() == ('modal'))
            modalList(clones);
        else if (elem.getAttribute("type").toLowerCase() == ('php' | 'html')) {
            var f = htmlToJson(getTextFile(clones));
            modalList(f)
        }
        else
            newClone = document.createElement(elem.getAttribute("type"));
        newClone.src = clones;
        newClone.height = elem.getAttribute("height");
        newClone.width = elem.getAttribute("width");
        elem.appendChild(newClone);
        h++;
    }

    if (elem.hasAttribute("vertical") && elem.getAttribute("vertical") == "true")
        elem.style.display = "block";
    else
        elem.style.display = "inline-block";

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    elem.setAttribute("index", (i + iter) % elem.children.length);
    if (auto == "on")
        setTimeout(() => { shiftFilesLeft(elem, auto, delay); }, (delay));

}
function shiftFilesRight(elem, auto = false, delay = 1000) {
    if (typeof (elem) == "string")
        elem = document.getElementById(elem);

    console.error(elem)
    var iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
    var i = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
    var b = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;

    var h = 0;

    while (h < b) {
        elem.removeChild(elem.lastChild);
        var cloneSrcs = elem.getAttribute("sources").split(";");
        var clones = cloneSrcs[(h + i) % cloneSrcs.length];
        var newClone = null;
        if (elem.getAttribute("type").toLowerCase() == ('audio' | 'video'))
            newClone = document.createElement(elem.getAttribute("source"));
        else if (elem.getAttribute("type").toLowerCase() == ('modal'))
            modalList(clones);
        else if (elem.getAttribute("type").toLowerCase() == ('php' | 'html')) {
            var f = htmlToJson(getTextFile(clones));
            modalList(f)
        }
        else
            newClone = document.createElement(elem.getAttribute("type"));
        newClone.src = clones;
        newClone.height = elem.getAttribute("height");
        newClone.width = elem.getAttribute("width");
        elem.prepend(newClone);
        h++;
    }

    if (elem.hasAttribute("vertical") && elem.getAttribute("vertical") == "true")
        elem.style.display = "block";
    else
        elem.style.display = "inline-block";

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    elem.setAttribute("index", (i + iter) % elem.children.length);
    if (auto == "on")
        setTimeout(() => { shiftFilesLeft(elem, auto, delay); }, (delay));

}

function fileShift(elem) {
    var i = elem.getAttribute("index");
    var iter = elem.getAttribute("iter");
    var b = elem.getAttribute("boxes");
    var h = 0;
    var g = 0;
    var arr = elem.getAttribute("sources").split(";");
    var ppfc = document.getElementById(elem.getAttribute("insert").toString());
    if (!ppfc.hasAttribute("file-index"))
        ppfc.setAttribute("file-index", "0");
    index = parseInt(ppfc.getAttribute("file-index").toString());
    var interv = elem.getAttribute("interval");
    if (elem.classList.contains("decrIndex"))
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) - interv;
    else
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) + interv;
    if (index < 0)
        index = arr.length - 1;
    index = index % arr.length;
    ppfc.setAttribute("file-index", index.toString());

}

function fileOrder(elem) {
    if (typeof (elem) == "string")
        elem = document.getElementById(elem);

    arr = elem.getAttribute("sources").split(";");
    ppfc = document.getElementById(elem.getAttribute("insert").toString());
    if (!ppfc.hasAttribute("file-index"))
        ppfc.setAttribute("file-index", "0");
    index = parseInt(ppfc.getAttribute("file-index").toString());
    var interv = elem.getAttribute("interval");
    if (elem.classList.contains("decrIndex"))
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) - interv;
    else
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) + interv;
    if (index < 0)
        index = arr.length - 1;
    index = index % arr.length;
    ppfc.setAttribute("file-index", index.toString());

    if (ppfc.tagName == "SOURCE" && ppfc.hasAttribute("src")) {
        try {
            ppfc.parentNode.pause();
            ppfc.parentNode.setAttribute("src", arr[index].toString());
            ppfc.parentNode.load();
            ppfc.parentNode.play();
        }
        catch (e) {
            ppfc.setAttribute("src", arr[index].toString());
        }
    }
    else if (ppfc && ppfc.tagName == "IMG") {
        ppfc.setAttribute("src", arr[index].toString());
        var loop = index;
        while (loop % arr.length != (index + iter) % arr.length) {
            if (elem.getAttribute("direction").toLowerCase() !== "left")
                ppfc.removeChild(ppfc.lastChild);
            else
                ppfc.removeChild(ppfc.firstChild);
            var obj = document.createElement("img");
            obj.setAttribute("src", arr[loop % arr.length].toString());

            if (elem.getAttribute("direction").toLowerCase() !== "left")
                ppfc.insertBefore(obj, ppfc.firstChild);
            else
                ppfc.appendChild(obj);
            loop++;
        }
    }
}


function htmlToJson(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    function elementToJson(element) {
        const result = {
            tagName: element.tagName.toLowerCase(),
            attributes: {},
            children: []
        };

        // Process attributes
        for (const attr of element.attributes) {
            result.attributes[attr.name] = attr.value;
        }

        // Process child nodes
        for (const child of element.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                result.children.push(elementToJson(child));
            } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                result.children.push({
                    type: 'text',
                    content: child.textContent.trim()
                });
            }
        }

        return result;
    }

    return elementToJson(doc.body.firstChild);
}

const processedElements = new WeakSet();

function addPipe(elem = document) {
    // Attach global listeners to document
    ['click'].forEach(eventType => {
        document.addEventListener(eventType, function (event) {
            let target = event.target;
            if (target.classList.contains('mouse') || target.id !== null) {
                if (!hasPipeListener(target))
                    pipes(target);
                console.log(target.id);
            }
        }, true);
    });
    // Add this inside your existing addPipe function
    const csvForEachElements = document.getElementsByTagName("csv-foreach");
    Array.from(csvForEachElements).forEach(function (elem) {
        if (!elem.classList.contains("processed")) {
            processCsvForeach();
        }
    });

}

function flashClickListener(elem) {
    if (elem.id) {
        elem.removeEventListener('click', () => {
            pipes(elem);
            console.log(elem.id);
        });
        elem.addEventListener('click', () => {
            pipes(elem);
            console.log(elem.id);
        });
    }
    domContentLoad(true);
}

function attachEventListeners(elem) {
    if (elem.classList.contains('mouse') || elem.id !== null) {
        let events = (elem.getAttribute("event") || "click").split(';');
        events.forEach(event => elem.addEventListener(event, () => {
            pipes(elem);
            console.log(elem.id);
        }));
        if (!hasPipeListener(elem)) {
            elem.addEventListener('click', () => {
                pipes(elem);
                console.log(elem.id);
            });
        }
    }
}

function hasPipeListener(elem) {
    return elem && typeof elem.onclick === 'function';
}

function test(param1, param2) {
    console.log(param1, param2);
}

function sortNodesByName(selector) {
    const nodes = document.querySelectorAll(selector);
    const nodesArray = Array.from(nodes);

    nodesArray.sort((a, b) => {
        const nameA = a.getAttribute('name') || '';
        const nameB = b.getAttribute('name') || '';
        return nameA.localeCompare(nameB);
    });

    return nodesArray;
}


function pipes(elem, stop = false) {

    var query = "";
    var headers = new Map();
    var formclass = "";
    //
    if (elem.id === null)
        return;

    if (elem.hasAttribute("callback") && typeof window[elem.getAttribute("callback")] === "function") {
        var params = [];
        const calls = sortNodesByName("." + elem.getAttribute("callback-class"));
        Object.keys(calls).forEach((key, n) => {
            params.push(calls[key].getAttribute("value"));
        });
        console.log(params);
        params = params.join(", ");
        window[elem.getAttribute("callback")](params);
    }
    if (elem.classList.contains("redirect"))
        window.location.href = elem.getAttribute("ajax");
    if (elem.classList.contains("disabled"))
        return;
    if (elem.classList.contains("clear-node")) {
        var pages = elem.getAttribute("node").split(";");
        pages.forEach((e) => {
            console.log(e);
            document.getElementById(e).innerHTML = "";
        });
    }

    if (elem.tagName == "lnk") {
        window.open(elem.getAttribute("ajax") + (elem.hasAttribute("query") ? "?" + elem.getAttribute("query") : ""), "_blank");
    }
    if (elem.hasAttribute("display") && elem.getAttribute("display")) {
        var optsArray = elem.getAttribute("display").split(";");
        optsArray.forEach((e, f) => {
            var x = document.getElementById(e);
            if (x !== null && x.style.display !== "none")
                x.style.display = "none";
            else if (x !== null)
                x.style.display = "block";
        });
    }
    if (elem.hasAttribute("turn")) {
        var optsArray = elem.getAttribute("turn");
        var index = 0;
        if (elem.hasAttribute("turn-index")) {
            index = parseInt(elem.getAttribute("turn-index"));
            var interv = elem.getAttribute("interval");
            if (elem.classList.contains("decrIndex"))
                index = Math.abs(parseInt(elem.getAttribute("turn-index").toString())) - interv;
            else
                index = Math.abs(parseInt(elem.getAttribute("turn-index").toString())) + interv;
            if (index < 0)
                index = optsArray.length - 1;
            index = index % optsArray.length;
            elem.setAttribute("turn-index", index.toString());
        }
        else
            elem.setAttribute("turn-index", "0");

        const classLists = document.querySelectorAll("." + elem.getAttribute("turn"));
        classLists.forEach((e, f) => {
            if (f == index) {
                pipes(e);
            }
        });
    }
    if (elem.hasAttribute("x-toggle")) {
        var optsArray = elem.getAttribute("x-toggle").split(";");
        optsArray.forEach((e, f) => {
            var g = e.split(":");
            if (g[0] != '' && g[0] != undefined)
                document.getElementById(g[0]).classList.toggle(g[1]);
        });
    }
    if (elem.hasAttribute("set") && elem.getAttribute("set")) {
        js = elem.getAttribute("set");
        js.split(";").forEach((e, f) => {
            var [id, name, value] = e.split(":");
            if (id != '' && id != undefined)
                document.getElementById(id).setAttribute(name, value);
        });
    }
    if (elem.hasAttribute("get") && elem.getAttribute("get")) {
        js = elem.getAttribute("get");
        js.split(";").forEach((e, f) => {
            var [id, name, target] = e.split(":");
            if (id != undefined && name != undefined && target != undefined) {
                var n = document.getElementById(id).getAttribute(name);
                document.getElementById(target).setAttribute(name, n);
            }
        });
    }
    if (elem.hasAttribute("delete") && elem.getAttribute("delete")) {
        js = elem.getAttribute("delete");
        js.split(";").forEach((e, f) => {
            var [id, name] = e.split(":");
            if (g[0] != '' && g[0] != undefined && g[1] != undefined) {
                document.getElementById(id).removeAttribute(name);
            }
        });
    }
    if (elem.hasAttribute("remove") && elem.getAttribute("remove")) {
        var optsArray = elem.getAttribute("remove").split(";");
        optsArray.forEach((e, f) => {
            var x = document.getElementById(e);
            x.remove();
        });
    }
    if (elem.classList.contains("carousel-step-right")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = false;
            shiftFilesRight(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-step-left")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = false;
            shiftFilesLeft(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-slide-left")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = true;
            shiftFilesLeft(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-slide-right")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = true;
            shiftFilesRight(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.hasAttribute("query")) {
        var optsArray = elem.getAttribute("query").split(";");
        var query = "";
        optsArray.forEach((e, f) => {
            var g = e.split(":");
            query = query + g[0] + "=" + g[1] + "&";
        });
        query = query.substring(0, -1);
        // console.log(query);
    }
    if (elem.hasAttribute("headers")) {
        var optsArray = elem.getAttribute("headers").split("&");
        optsArray.forEach((e, f) => {
            var g = e.split(":");
            headers.set(g[0], g[1]);
        });
    }
    if (elem.hasAttribute("form-class")) {
        formclass = elem.getAttribute("form-class");
    }
    if (elem.tagName != "carousel" && elem.hasAttribute("file-order")) {
        fileOrder(elem);
    }
    if (elem.classList.contains("carousel")) {
        var auto = true;
        if (elem.classList.contains("time-active")) {
            auto = true;
        }
        else if (elem.classList.contains("time-inactive")) {
            auto = false;
        }
        carousel(elem, auto);
        return;
    }
    if (elem.hasAttribute("ajax")) {
        var parts = elem.getAttribute("ajax").split(";");
        parts.forEach((part) => {
            var [file, target, limit] = part.split(":");
            var clone = elem.cloneNode(true);
            clone.setAttribute("ajax", file);
            clone.setAttribute("insert", target);
            if (limit) {
                clone.setAttribute("boxes", limit);
            }
            navigate(clone, headers, query, formclass);
        });
    }
    // This is a quick way to make a downloadable link in an href
    //     else
    if (elem.classList.contains("download")) {
        console.log("$$$");
        var text = elem.getAttribute("file");
        var element = document.createElement('a');
        var location = (elem.hasAttribute("directory")) ? elem.getAttribute("directory") : "./";
        element.setAttribute('href', location + encodeURIComponent(text));
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return;
    }
    if (elem.hasAttribute("ajax"))
        navigate(elem, headers, query, formclass);
    else if (elem.hasAttribute("modal")) {
        modalList(elem.getAttribute("modal"));
    }
}

function setAJAXOpts(elem, opts) {

    // communicate properties of Fetch Request
    var method_thru = (opts["method"] !== undefined) ? opts["method"] : "GET";
    var mode_thru = (opts["mode"] !== undefined) ? opts["mode"] : '{"Access-Control-Allow-Origin":"*"}';
    var cache_thru = (opts["cache"] !== undefined) ? opts["cache"] : "no-cache";
    var cred_thru = (opts["cred"] !== undefined) ? opts["cred"] : '{"Access-Control-Allow-Origin":"*"}';
    // updated "headers" attribute to more friendly "content-type" attribute
    var content_thru = (opts["content-type"] !== undefined) ? opts["content-type"] : '{"Content-Type":"text/html"}';
    var redirect_thru = (opts["redirect"] !== undefined) ? opts["redirect"] : "manual";
    var refer_thru = (opts["referrer"] !== undefined) ? opts["referrer"] : "referrer";
    opts.set("method", method_thru); // *GET, POST, PUT, DELETE, etc.
    opts.set("mode", mode_thru); // no-cors, cors, *same-origin
    opts.set("cache", cache_thru); // *default, no-cache, reload, force-cache, only-if-cached
    opts.set("credentials", cred_thru); // include, same-origin, *omit
    opts.set("content-type", content_thru); // content-type UPDATED**
    opts.set("redirect", redirect_thru); // manual, *follow, error
    opts.set("referrer", refer_thru); // no-referrer, *client
    opts.set('body', JSON.stringify(content_thru));

    return opts;
}

function formAJAX(elem, classname) {
    var elem_qstring = "";

    console.log(document.getElementsByClassName(classname));
    // No, 'pipe' means it is generic. This means it is open season for all with this class
    for (var i = 0; i < document.getElementsByClassName(classname).length; i++) {
        var elem_value = document.getElementsByClassName(classname)[i];
        elem_qstring = elem_qstring + elem_value.name + "=" + elem_value.value + "&";
        // Multi-select box
        if (elem_value.hasOwnProperty("multiple")) {
            for (var o of elem_value.options) {
                if (o.selected) {
                    elem_qstring = elem_qstring + "&" + elem_value.getAttribute('name') + "=" + o.getAttribute('name');
                }
            }
        }
    }
    if (elem.classList.contains("redirect"))
        window.location.href = elem.getAttribute("ajax") + "?" + ((elem_qstring.length > 0) ? elem_qstring : "");
    return (elem_qstring);
}
var pretty = 0;
function prettifyJsonWithColors(jsonObj) {
    const prettyJson = JSON.stringify(jsonObj, null, 2);
    if (pretty == 0) {
        // Add CSS to pipes.js or index.html
        const style = document.createElement('style');
        style.textContent = `
        .key { color: purple; }
        .string { color: green; }
        .number { color: darkorange; }
        .boolean { color: blue; }
        .null { color: magenta; }
    `;
        document.head.appendChild(style);
    }
    pretty = 1;
    return prettyJson
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
            let cls = 'number';
            if (/^"/.test(match)) {
                cls = match.endsWith('":') ? 'key' : 'string';
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return `<span class="${cls}">${match}</span>`;
        });
}

// Usage
function displayColoredJson(elementId, jsonObj) {
    const prettyHtml = prettifyJsonWithColors(jsonObj);
    document.getElementById(elementId).innerHTML = `<pre>${prettyHtml}</pre>`;
}

function navigate(elem, opts = null, query = "", classname = "") {
    //formAJAX at the end of this line
    console.log(elem);
    elem_qstring = query + ((document.getElementsByClassName(classname).length > 0) ? formAJAX(elem, classname) : "");
    //    elem_qstring = elem_qstring;
    elem_qstring = encodeURI(elem_qstring);
    console.log(elem_qstring);
    opts = setAJAXOpts(elem, opts);
    var opts_req = new Request(elem_qstring);
    opts.set("mode", (opts["mode"] !== undefined) ? opts["mode"] : '"Access-Control-Allow-Origin":"*"');

    var rawFile = new XMLHttpRequest();
    rawFile.open(opts.get("method"), elem.getAttribute("ajax") + "?" + elem_qstring, true);
    console.log(elem);

    if (elem.classList.contains("strict-json")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";// JSON.parse(rawFile.responseText);
                try {
                    console.log(rawFile.responseText);
                    JSON.parse(rawFile.responseText);
                }
                catch (e) {
                    console.log("Error: ", e, rawFile.responseText);
                    return;
                }
                document.body.innerHTML = rawFile.responseText;
            }
        }
    }
    else if (elem.classList.contains("json")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";// JSON.parse(rawFile.responseText);
                try {
                    console.log(rawFile.responseText);
                    var allPretty = JSON.parse(rawFile.responseText);
                    // var allPretty = prettifyJsonWithColors(allText);
                    // allText = JSON.stringify(allText, null, 4);
                    displayColoredJson(elem.getAttribute("insert"), allPretty);
                    if (elem.hasAttribute("insert")) {
                        if (elem.classList.contains("text-html")) {
                            //    document.getElementById(elem.getAttribute("insert")).innerHTML = (JSON.stringify(allPretty));
                        } else {
                            document.getElementById(elem.getAttribute("insert")).textContent = (JSON.stringify(allPretty, null, 2));
                        }
                    }
                    domContentLoad();
                    flashClickListener(elem);
                    return allText;
                }
                catch (e) {
                    console.log("Response not a JSON");
                }
            }
        }
    }
    else if (elem.classList.contains("text-html")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";// JSON.parse(rawFile.responseText);
                try {
                    allText = (rawFile.responseText);
                    if (elem.hasAttribute("insert")) {
                        document.getElementById(elem.getAttribute("insert")).innerHTML = (rawFile.responseText);
                    }
                    domContentLoad();
                    flashClickListener(elem);
                    return allText;
                }
                catch (e) {
                    // console.log("Error Handling Text");
                }
            }
        }
    }
    else if (elem.classList.contains("plain-text")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";// JSON.parse(rawFile.responseText);
                try {
                    var f = "";
                    allText = (rawFile.responseText);
                    if (elem.hasAttribute("insert")) {
                        document.getElementById(elem.getAttribute("insert")).textContent = (rawFile.responseText);
                    }
                    domContentLoad();
                    flashClickListener(elem);
                    return allText;
                }
                catch (e) {
                    // console.log("Error Handling Text");
                }
            }
        }
    }
    else if (elem.classList.contains("tree-view")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";
                try {
                    console.log(rawFile.responseText);
                    allText = JSON.parse(rawFile.responseText);
                    console.log(allText);
                    var editNode = document.getElementById(elem.id);
                    editNode.innerHTML = "";
                    // editNode.innerHTML = allText;
                    renderTree(allText, editNode);
                    domContentLoad();
                    flashClickListener(elem);
                    return;
                }
                catch (e) {
                    console.log("Response: " + e);
                }
            }
        }
    }
    else if (elem.classList.contains("modala")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = JSON.parse(rawFile.responseText);
                var insertElement = document.getElementById(elem.getAttribute("insert"));
                var boxLimit = elem.getAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : Infinity;

                if (!elem.classList.contains("modala-multi-first") && !elem.classList.contains("modala-multi-last")) {
                    insertElement.innerHTML = "";
                } else if (insertElement.children.length >= boxLimit) {
                    if (elem.classList.contains("modala-multi-first")) {
                        insertElement.lastChild.remove();
                    } else if (elem.classList.contains("modala-multi-last")) {
                        insertElement.firstChild.remove();
                    }
                }
                var newContent = document.createElement('div');
                modala(allText, newContent);
                domContentLoad()
                flashClickListener(elem);
                if (elem.classList.contains("modala-multi-first")) {
                    insertElement.insertBefore(newContent, insertElement.firstChild);
                } else {
                    insertElement.appendChild(newContent);
                }
            }
        }
    }

    else if (!elem.classList.contains("json") && !elem.hasAttribute("callback")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = rawFile.responseText;
                if (document.getElementById(elem.getAttribute("insert")) !== null)
                    document.getElementById(elem.getAttribute("insert")).innerHTML = allText;
            }
        }
    }
    try {
        rawFile.send();
    } catch (e) {
        // console.log(e);
    }
}