/**
 *** Only donate through the js.fivy.org website 
 *** It's safe and secure through Paypal, no Venmo or Cashapp
 *** You can donate any amount.
  *  ?? only usage: onclick="pipes(this)" ?? <!-- Legacy Instructions
  *  All nodes to be active must have an ID. This injects the Automatic 'click' Listener
  *  to begin using the PipesJS code in other ways than <dyn> <pipe> and <timed>.
  *  Usable DOM Attributes (almost all are optional
  *  upto x > 134,217,000 different configurations 
  *  with unlimited inputs/outputs):
  *  Attribute/Tag   |   Use Case
  *  -------------------------------------------------------------
  *  insert............= return ajax call to this id
  *  ajax..............= calls and returns multiple files for insert in as many nodes. Also allows class-type insertion types (ex: ajax="page.html:therethere@plain-html")
  *  turn..............= creates a call to each Node with an id matching the listed, delimited with a semicolon in the 'turn' attribute
  *  ajax-multi........= calls and returns multiple files for insert in as many nodes. Also allows class-type insertion types (ex: ajax-multi="page.html:therethere@plain-html")
  *  callbacks.........= calls function set as attribute value
  *  set-var...........= set window varianble as a dynamic value you setup
  *  get-var...........= get variable fmo window array in JS
  *  <caller>..........= creates listeners with attribute values as event type to callback functions with parameters
  *  clear-node........= clear nodes. delimited in insert="first;second;thirdnode" by ';'
  *  modala-multi-last.= Class to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the last
  *  modala-multi-first= Class to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the first
  *  call-chain........= same as callbacks, but the chained set of commands doesn't use AJAX results
  *  query.............= default query string associated with url ex: <anyTag form-class="someClass" query="key0:value0;key1:value2;" ajax="page.foo"> (Req. form-class)
  *  modal.............= Irondocks key. Inserts the Irondocks file in the value for template ease of use.
  *  br................= Irondocks key. Inserts 'x' amount of breaks successively. { "br": "x" }
  *  download..........= class for downloading files ex: <tagName class="download" file="foo.zip" directory="/home/bar/"> (needs ending with slash)
  *  file..............= filename to download
  *  x-toggle..........= toggle values from class attribute that are listed in the toggle attribute "id1:class1;id1:class2;id2:class2"
  *  directory.........= relative or full path of 'file'
  *  redirect..........= "follow" the ajax call in POST or GET mode ex: <pipe ajax="foo.bar" class="redirect" query="key0:value0;" insert="someID">
  *  js................= [Specifically a] Modala key/value pair. Allows access to outside JavaScript files in scope of top nest.
  *  css...............= [Specifically a] Modala key/value pair. Imports a stylesheet file to the page accessing it.
  *  <lnk>.............= tag for clickable link <lnk ajax="goinghere.html" query="key0:value0;">
  *  <pipe>............= Tag (initializes on DOMContentLoaded Event) ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  <dyn>.............= Automatic eventListening tag for onclick="pipes(this)" ex: <dyn ajax="foo.bar" query="key0:value0;" insert="someID">
  *  dyn-one...........= Class to stop recurring clicking activities 
  *  plain-text........= plain text returned to the insertion point
  *  plain-html........= returns as true HTML
  *  <timed>...........= Timed result refreshing tags (Keep up-to-date handling on page) ex: <timed ajax="foo.bar" delay="3000" query="key0:value0;" insert="someID">
  *  delay.............= delay between <timed> tag refreshes (required for <timed> tag) ex: see <timed>
  *  <carousel>........= Tag to create a carousel that moves every a timeOut() delay="x" occurs ex: <carousel ajax="foo.bar" file-order="foo.bar;bar.foo;foobar.barfoo" delay="3000" id="thisId" insert="thisId" height="100" width="100" boxes="8" style="height:100;width:800">
  *  carousel-ajax.....= Class to create Modala sets for carousel use.
  *         -images...= Class to use pure images for carousel use.
  *         -auto-off.= Class to stop carousel from moving (better to create buttons)
  *         -vert.....= Class to make carousel vertical, instead of horizontal (default)
  *         -video....= Class to make video carousel
  *         -audio....= Class to make audio carousel
  *         -iframe...= Class to make iframe carousel
  *         -link.....= Class to make link carousel
  *  direction.........= Right/left vs Up/down
  *  vertical..........= (boolean) turns carousel vertical
  *  auto..............= (boolean) auto scroll
  *  sources...........= file list delimited by ';' 
  *  type..............= type of objects in carousel
  *  width.............= width of carousel frame
  *  height............= height of carousel frame
  *  boxes.............= <carousel> attribute to request x box cards
  *  file-order........= ajax to these files, iterating [0,1,2,3]%array.length per call (delimited by ';') ex: <pipe query="key0:value0;" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  file-index........= counter of which index to use with file-order to go with ajax ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  incrIndex.........= increment thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="incrIndex" interval="2" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  decrIndex.........= decrement thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="decrIndex" interval="3" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  iter..........= Take this many steps when stepping through file-order default = 1
  *  set-attr..........= attribute to set in target HTML tag ex: <pipe id="thisOrSomeId" set-attr="id.attr:value" ajax="foo.bar" query="do0:reme0;" insert="thisOrSomeID">
  *  mode..............= "POST" or "GET" (default: "POST") ex: <pipe mode="POST" set-attr="value" ajax="foo.bar" query="key0:value0;" insert="thisOrSomeID">
  *  pipe..............= creates a listener on the object. use listen="eventType" to relegate.
  *  multiple..........= states that this object has two or more key/value pairs use: states this is a multi-select form box
  *  remove............= remove element in tag ex: <anyTag remove="someID;someOtherId;">
  *  display...........= toggle visible and invisible of anything in the value ex: <anyTag display="someID;someOtherId;">
  *  json..............= returns a JSON file set as value
  *  headers...........= headers in CSS markup-style-attribute (delimited by '&') <any ajax="foo.bar" headers="foobar:boo&barfoo:barfoo;q:9&" insert="someID">
  *  form-class........= class name of devoted form elements
  *  action-class......= class name of devoted to-be-triggered tags (acts as listener to other certain tag(s))
  *  mouse.............= class name to work thru PipesJS' other attributes on event="mouseover;mouseleave" (example)
  *  mouse-insert......= class name to work thru PipesJS' other attributes on event="mouseover;mouseleave" (example)
  *  event.............= works with mouse/pipe class only. Creates eventListener on "insert"-d to node.
  *  options...........= works with <select> tagName only. Key:Value; pairs to setup and easily roll out multiple selects.
  **** FILTERS aer go ahead code usually coded in other languages and just come back with a result. Not wholly different from AJAX. They are general purpose files.
  **** ALL HEADERS FOR AJAX are available. They will use defaults to
  **** go on if there is no input to replace them.
  */

// Just incase you get the hang of this file.
// import { navigate, formAJAX, domContentLoad, setAJAXOpts, carousel, classOrder, fileOrder, fileShift, modala, pipes, setTimers };


export default dotPipe;

class dotPipe {

    constructor() {

        const irc = JSON.parse(document.body.innerText);

        document.body.innerText = "";
        // document.head.append(modalaHead(irc, ""));
        this.modala(irc, document.body);
        document.body.style.display = "block";
        document.addEventListener("click", function (elem) {
            console.log(elem.target);
            if (elem.target.id != undefined) { pipes(elem.target); }
        });
        this.run()
        return;
    }

    run() {
        doc_set = document.getElementsByTagName("pipe");
        if (again == false) {
            Array.from(doc_set).forEach(function (elem) {
                if (elem.classList.contains("pipe-active"))
                    return;
                elem.classList.toggle("pipe-active")
                this.pipes(elem);
            });
        }

        let elementsArray_time = document.getElementsByTagName("timed");
        Array.from(elementsArray_time).forEach(function (elem) {
            if (elem.classList.contains("pipe-active"))
                return;
            elem.classList.toggle("pipe-active")
            this.setTimers(elem);
        });

        let elementsArray_dyn = document.getElementsByTagName("dyn");
        Array.from(elementsArray_dyn).forEach(function (elem) {
            if (elem.classList.contains("pipe-active"))
                return;
            elem.classList.toggle("pipe-active");
        });

        let elements_Carousel = document.getElementsByTagName("carousel");
        Array.from(elements_Carousel).forEach(function (elem) {
            if (elem.classList.contains("pipe-active"))
                return;
            elem.classList.toggle("pipe-active")
            let auto = true;
            if (elem.classList.contains("carousel-auto-off"))
                auto = false;
            if (elem.getAttribute("direction") == "left")
                setTimeout(this.shiftFilesLeft(elem, auto), elem.getAttribute("delay"));
            if (elem.getAttribute("direction") == "right")
                setTimeout(this.shiftFilesRight(elem, auto), elem.getAttribute("delay"));
        });

        let elementsArray_link = document.getElementsByTagName("lnk");
        Array.from(elementsArray_link).forEach(function (elem) {
            if (elem.classList.contains("pipe-active"))
                return;
            elem.classList.toggle("pipe-active")
            elem.addEventListener("click", function () {
                this.pipes(elem);
            });
        });

        let event_listen = document.getElementsByTagName("caller");
        Array.from(event_listen).forEach(function (elem) {
            var ev = elem.getAttribute("event");
            var rv = ev.split(";");
            Array.from(rv).forEach((v) => {
                var g = v.split(":");
                elem.addEventListener(g[1], function () {
                    if (typeof window[g[0]] === 'function') {
                        if (elem.hasAttribute("get-var") && elem.getAttribute("get-var")) {
                            js = elem.getAttribute("get-var").split(";");
                            let variables = [];
                            js.forEach((i) => {
                                variables.push(i);
                            });
                            window[g[0]].apply(this, variables);
                        }
                        // Check if the function exists
                        else {
                            // Handle the case where the function doesn't exist
                            console.error("Function '" + g[0] + "' not found.");
                            return null;
                        }
                    }
                    else if (typeof g[0] === 'function') {
                        if (elem.hasAttribute("get-var") && elem.getAttribute("get-var")) {
                            js = elem.getAttribute("get-var").split(";");
                            let variables = [];
                            js.forEach((i) => {
                                variables.push(i);
                            });
                            g[0](variables);
                        }
                        // Check if the function exists
                        else {
                            // Handle the case where the function doesn't exist
                            console.error("Function '" + g[0] + "' not found.");
                            return null;
                        }
                    }
                });
            });
        });

        let elements_mouse = document.querySelectorAll(".mouse");
        Array.from(elements_mouse).forEach(function (elem) {

            var ev = elem.getAttribute("event");
            var rv = ev.split(";");
            Array.from(rv).forEach((v) => {
                var g = v.split(":");
                elem.addEventListener(g[0], function () {
                    setTimeout(pipes(elem, true), g[1]);
                });
            });
        });

        let elements_pipe = document.querySelectorAll(".pipe");
        Array.from(elements_pipe).forEach(function (elem) {
            var ev = elem.getAttribute("event");
            elem.addEventListener(ev, function () {
                if (elem.classList.contains("dyn-one") && !elem.classList.contains("dyn-done")) {
                    elem.classList.toggle("dyn-done");
                    this.pipes(elem);
                    return;
                }
                else if (elem.classList.contains("dyn-one") && elem.classList.contains("dyn-done")) { }
                else
                    this.pipes(elem);
            });
        });
        reattributeStylesheets();

    }

    parseStylesheet(sheet) {
        const rules = sheet.cssRules || sheet.rules;
        let extractedRules = [];

        for (let rule of rules) {
            switch (rule.type) {
                case CSSRule.STYLE_RULE:
                    extractedRules.push({
                        type: 'style',
                        selector: rule.selectorText,
                        style: rule.style.cssText
                    });
                    break;
                case CSSRule.MEDIA_RULE:
                    extractedRules.push({
                        type: 'media',
                        media: rule.media.mediaText,
                        rules: this.parseStylesheet(rule)
                    });
                    break;
                case CSSRule.KEYFRAMES_RULE:
                    extractedRules.push({
                        type: 'keyframes',
                        name: rule.name,
                        rules: Array.from(rule.cssRules).map(keyframe => ({
                            keyText: keyframe.keyText,
                            style: keyframe.style.cssText
                        }))
                    });
                    break;
            }
        }

        return extractedRules;
    }

    organizeRules(rules) {
        let organized = {
            ids: {},
            classes: {},
            others: [],
            media: [],
            keyframes: []
        };

        rules.forEach(rule => {
            if (rule.type === 'style') {
                const { selector, style } = rule;
                if (selector.startsWith('#')) {
                    organized.ids[selector] = organized.ids[selector] || [];
                    organized.ids[selector].push(style);
                } else if (selector.startsWith('.')) {
                    organized.classes[selector] = organized.classes[selector] || [];
                    organized.classes[selector].push(style);
                } else {
                    organized.others.push({ selector, style });
                }
            } else if (rule.type === 'media') {
                organized.media.push(rule);
            } else if (rule.type === 'keyframes') {
                organized.keyframes.push(rule);
            }
        });

        return organized;
    }

    createStylesheet(rules) {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';

        function appendRules(selector, styles) {
            styles.forEach(style => {
                styleSheet.appendChild(document.createTextNode(`${selector} { ${style} }`));
            });
        }

        for (let selector in rules.ids) {
            appendRules(selector, rules.ids[selector]);
        }

        for (let selector in rules.classes) {
            appendRules(selector, rules.classes[selector]);
        }

        rules.others.forEach(({ selector, style }) => {
            appendRules(selector, [style]);
        });

        rules.media.forEach(({ media, rules }) => {
            const mediaBlock = `@media ${media} { ${rules.map(rule => `${rule.selector} { ${rule.style} }`).join(' ')} }`;
            styleSheet.appendChild(document.createTextNode(mediaBlock));
        });

        rules.keyframes.forEach(({ name, rules }) => {
            const keyframesBlock = `@keyframes ${name} { ${rules.map(rule => `${rule.keyText} { ${rule.style} }`).join(' ')} }`;
            styleSheet.appendChild(document.createTextNode(keyframesBlock));
        });

        return styleSheet;
    }

    reattributeStylesheets() {
        const sheets = Array.from(document.styleSheets);
        let allRules = [];

        sheets.forEach(sheet => {
            try {
                const rules = parseStylesheet(sheet);
                allRules = allRules.concat(rules);
            } catch (e) {
                console.warn('Could not access stylesheet', sheet, e);
            }
        });

        const organizedRules = organizeRules(allRules);
        const newStyleSheet = createStylesheet(organizedRules);

        // Remove old stylesheets
        sheets.forEach(sheet => {
            sheet.disabled = true;
        });

        // Append new stylesheet
        document.head.appendChild(newStyleSheet);
    }

    modalaHead(value) {

        if (value == undefined) {
            console.error("value of reference incorrect");
            return;
        }
        var temp = document.createElement(value["tagname"]);

        Object.entries(value).forEach((nest) => {
            const [k, v] = nest;
            if (v instanceof Object) {
                this.modalaHead(v);
            }
            else if (k.toLowerCase() == "title") {
                var title = document.createElement("title");
                title.innerText = v;
                document.head.appendChild(title);
            }
            else if (k.toLowerCase() == "css") {
                var cssvar = document.createElement("link");
                cssvar.href = v;
                cssvar.rel = "stylesheet";
                document.head.appendChild(cssvar);
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

    modala(value, tempTag, root, id) {
        if (typeof (tempTag) == "string") {
            tempTag = document.getElementById(tempTag);
        }
        if (root === undefined)
            root = tempTag;
        if (tempTag == undefined) {
            return;
        }
        if (value == undefined) {
            console.error("value of reference incorrect");
            return;
        }
        var temp = document.createElement(value["tagname"]);
        if (value["header"] !== undefined && value["header"] instanceof Object) {

            this.modalaHead(value["header"], "head", root, null);
            var meta = document.createElement("meta");
            meta.content = "script-src-elem 'self'; img-src 'self'; style-src 'self'; child-src 'none'; object-src 'none'";
            meta.httpEquiv = "Content-Security-Policy";
            document.head.appendChild(meta);
        }
        Object.entries(value).forEach((nest) => {
            const [k, v] = nest;
            if (k.toLowerCase() == "header");
            else if (v instanceof Object)
                this.modala(v, temp, root, id);
            else if (k.toLowerCase() == "select") {
                var select = document.createElement("select");
                temp.appendChild(select);
                this.modala(v, temp, root, id);
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
                console.log("*")
            }
            else if (k.toLowerCase() == "sources" && (temp.tagName.toLowerCase() == "card" || temp.tagName.toLowerCase() == "carousel")) {
                console.log(value);
                var optsArray = v.split(";");
                var options = null;
                var i = (value['index'] == undefined) ? 0 : value['index'];
                temp.id = value['id'];
                optsArray.forEach((e, f) => {
                    if (value['type'] == "img") {
                        var gth = document.createElement("img");
                        gth.src = e;
                        gth.width = value['width'];
                        gth.height = value['height'];
                        gth.style.display = "hidden";
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
                        fetch(e)
                            .then(response => response.json())
                            .then(data => {
                                const tmp = this.modala(data, temp, root, id);
                                tempTag.appendChild(tmp);
                            });
                    }
                });
                var auto = (value['auto'] != undefined && value['auto'] != false) ? true : false;
                // carousel(temp, auto);
                if (value['description'] != undefined && value['direction'].toLowerCase() == "right")
                    this.shiftFilesRight(temp, auto, value['delay']);
                else
                    this.shiftFilesLeft(temp, auto, value['delay']);

            }
            else if (k.toLowerCase() == "br") {
                var br = document.createElement("br");
                var rows = parseInt(v);
                while (rows > 0) {
                    tempTag.appendChild(br);
                    rows--;
                }
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
            else if (k.toLowerCase() == "modal") {
                fetch(v)
                    .then(response => response.json())
                    .then(data => {
                        const tmp = this.modala(data, temp, root, id);
                        tempTag.appendChild(tmp);
                    });
            }
            else if (!Number(k) && k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "innerhtml" && k.toLowerCase() != "innertext") {
                temp.setAttribute(k, v);
            }
            else if (!Number(k) && k.toLowerCase() != "tagname" && (k.toLowerCase() == "textcontent" || k.toLowerCase() == "innerhtml" || k.toLowerCase() == "innertext")) {
                (k.toLowerCase() == "textcontent") ? temp.textContent = v : (k.toLowerCase() == "innerhtml") ? temp.innerHTML = v : temp.innerText = v;
            }
        });

        tempTag.appendChild(temp);
        return tempTag;
    }
    setTimers(target) {
        var delay = target.getAttribute("delay");
        setTimeout(function () {
            this.pipes(target);
            this.setTimers(target);
        }, delay);
    }
    carouselButtonSlide(elem, direction) {

        if (direction.toLowerCase() == "right")
            this.shiftFilesRight(elem.getAttribute("insert"), true, elem.getAttribute("delay"));
        else
            this.shiftFilesLeft(elem.getAttribute("insert"), true, elem.getAttribute("delay"));
    }
    carouselButtonStep(elem, direction) {

        if (direction.toLowerCase() == "right")
            this.shiftFilesRight(elem.getAttribute("insert"), false, elem.getAttribute("delay"));
        else
            this.shiftFilesLeft(elem.getAttribute("insert"), false, elem.getAttribute("delay"));
    }
    shiftFilesLeft(elem, auto = false, delay = 1000) {
        if (typeof (elem) == "string")
            elem = document.getElementById(elem);
        console.error(elem)
        var iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
        var i = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
        var b = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;

        var h = 0;

        while (iter * i + 1 > h) {
            {
                // let n = elem.childNodes;
                var clone = elem.firstChild.cloneNode(true);
                clone.style.display = "none";
                elem.appendChild(clone);
                elem.removeChild(elem.firstChild);
            }
            h++;
        }

        h = 0;

        while (h < b) {
            if (h + 1 < b && elem.hasAttribute("vertical") && elem.getAttribute("vertical") == "true")
                elem.children[h].style.display = "block";
            else if (h + 1 < b)
                elem.children[h].style.display = "inline-block";
            h++;
        }

        elem.setAttribute("index", (i + iter) % elem.children.length);
        if (auto == true)
            setTimeout(() => { this.shiftFilesLeft(elem, auto, delay); }, (delay));
    }

    shiftFilesRight(elem, auto = false, delay = 1000) {
        if (typeof (elem) == "string")
            elem = document.getElementById(elem);
        var iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
        var i = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
        var b = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;

        var h = 0;
        var g = 0;

        while (b + 1 > h) {
            {
                // let n = elem.childNodes;
                var clone = elem.lastChild.cloneNode(true);
                clone.style.display = "none";
                elem.insertBefore(clone, elem.firstChild);
                elem.removeChild(elem.lastChild);
            }
            h++;
        }

        h = 0;

        while (h < b) {
            if (h + 1 < b && elem.hasAttribute("vertical") && elem.getAttribute("vertical") == "true")
                elem.children[h].style.display = "block";
            else if (h + 1 < b)
                elem.children[h].style.display = "inline-block";
            h++;
        }
        if (i - iter <= 0)
            i = elem.children.length
        else
            i -= iter;

        elem.setAttribute("index", Math.abs(i) % elem.children.length);

        if (auto == true)
            setTimeout(() => { shiftFilesRight(elem, auto, delay); }, (delay));

    }

    fileShift(elem) {
        if (elem == null || elem == undefined)
            return;
        var arr = elem.getAttribute("file-order").split(";");
        var ppfc = document.getElementById(elem.getAttribute("insert").toString());
        if (!ppfc.hasAttribute("file-index"))
            ppfc.setAttribute("file-index", "0");
        var index = parseInt(ppfc.getAttribute("file-index").toString());
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

    classOrder(elem) {
        arr = elem.getAttribute("class-switch").split(";");
        if (!elem.hasAttribute("class-index"))
            elem.setAttribute("class-index", "0");
        index = parseInt(elem.getAttribute("class-index").toString());
        var interv = elem.getAttribute("interval");
        if (elem.classList.contains("decrIndex"))
            index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) - interv;
        else
            index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) + interv;
        if (index < 0)
            index = arr.length - 1;
        index = index % arr.length;
        elem.setAttribute("class-index", index.toString());
        elem.classList = arr[index];
    }

    pipes(elem, stop = false) {
        var query = "";
        var headers = new Map();
        var formclass = "";
        var json = new Map();
        if (elem.id === null)
            return;
        //    domContentLoad(true);
        if (elem.classList.contains("clear-node")) {
            var pages = elem.getAttribute("insert").split(";");
            pages.forEach((e) => {
                console.log(e);
                document.getElementById(e).innerHTML = "";
            });
        }
        if (elem.classList.contains("multi-part") == true) {
            var pages = elem.getAttribute("ajax").split(";");
            pages.forEach((e) => {
                var g = e.split(":");
                var stag = elem.cloneNode();
                stag.classList.toggle("multi-part");
                stag.setAttribute("insert", g[1]);
                stag.setAttribute("ajax", g[0]);
                if (g.length == 3) {
                    stag.setAttribute("boxes", g[2]);
                }
                else {
                    stag.setAttribute("boxes", 1);
                }
                this.pipes(stag);
            });
            return;
        }
        if (elem.tagName == "lnk" && elem.classList.contains("new-win")) {
            let lnk_win = (elem.hasAttribute("win-name") && elem.getAttribute("win-name")) ? elem.getAttribute("win-name") : "_blank";
            window.open(elem.getAttribute("ajax") + (elem.hasAttribute("query") ? "?" + elem.getAttribute("query") : ""), lnk_win);
        }
        if (elem.tagName == "lnk" || elem.classList.contains("redirect")) {
            window.location.href = elem.getAttribute("ajax") + (elem.hasAttribute("query") ? "?" + elem.getAttribute("query") : "");
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
        if (elem.hasAttribute("ajax-multi") && elem.getAttribute("ajax-multi")) {
            var optsArray = elem.getAttribute("ajax-multi").split(";");
            optsArray.forEach((e, f) => {
                var g = e.split(":");
                if (g.length > 1 && g[1] != '' && g[0] != '' && g[1] != undefined) {
                    var p = elem.cloneNode(true);
                    p.removeAttribute("ajax-multi");
                    p.setAttribute("ajax", g[0]);

                    if (g[1].split("@").length > 1) {
                        p.classList.toggle(g[1].split("@")[1]);
                        p.setAttribute("insert", g[1].split("@")[0]);
                    }
                    else {
                        p.setAttribute("insert", g[1]);
                    }
                    this.pipes(p)
                }
            });
        }
        if (elem.hasAttribute("crud") && elem.getAttribute("crud")) {
            var optsArray = elem.getAttribute("crud").split(";");
            optsArray.forEach((e, f) => {
                var g = e.split(":");
                if (g.length > 1 && g[1] != '' && g[0] != '' && g[1] != undefined) {
                    var p = elem.cloneNode(true);
                    p.removeAttribute("crud");
                    p.setAttribute("crud", g[0]);

                    // if (g[1].split("@").length > 1) {
                    //     p.classList.toggle(g[1].split("@")[1]);
                    //     p.setAttribute("insert", g[1].split("@")[0]);
                    // }
                    // else {
                    p.setAttribute("insert", g[1]);
                    // }
                    this.pipes(p);
                }
            });
        }
        if (elem.hasAttribute("get-var") && elem.getAttribute("get-var")) {
            js = elem.getAttribute("query").split(";");
            var str = "";
            js.forEach((i, f) => {
                var g = i.split(":");
                str += `${g[0]}:${window[g[0]]};`;
            });
            query = document.getElementById(elem.getAttribute("insert")).getAttribute("query")
        }
        if (elem.hasAttribute("set-var") && elem.getAttribute("set-var")) {
            js = elem.getAttribute("set-var").split(";");
            js.forEach((e, f) => {
                var i = e.split(":");
                window[i[0]] = i[1];
                json.set(i[0], window[i[0]]);
            });
            let str = "";
            json.forEach((i, f) => {
                str += `${i}:${window[i]};`;
            });
            document.getElementById(elem.getAttribute("insert")).setAttribute("query", str.toString())
        }
        if (elem.hasAttribute("turn")) {
            var optsArray = elem.getAttribute("turn").split(";");
            optsArray.forEach((e, f) => {
                this.pipes(e.target);
            });
        }
        if (elem.classList.contains("carousel-step-right")) {
            if (elem.hasAttribute("insert")) {
                var x = document.getElementById(elem.getAttribute("insert"));
                this.shiftFilesRight(x, false, parseInt(x.getAttribute("delay")));
            }
        }
        if (elem.classList.contains("carousel-step-left")) {
            if (elem.hasAttribute("insert")) {
                var x = document.getElementById(elem.getAttribute("insert"));
                this.shiftFilesLeft(x, false, parseInt(x.getAttribute("delay")));
            }
        }
        if (elem.classList.contains("carousel-slide-left")) {
            if (elem.hasAttribute("insert")) {
                var x = document.getElementById(elem.getAttribute("insert"));
                this.shiftFilesLeft(x, true, parseInt(x.getAttribute("delay")));
            }
        }
        if (elem.classList.contains("carousel-slide-right")) {
            if (elem.hasAttribute("insert")) {
                var x = document.getElementById(elem.getAttribute("insert"));
                this.shiftFilesRight(x, true, parseInt(x.getAttribute("delay")));
            }
        }
        if (elem.hasAttribute("set-attr") && elem.getAttribute("set-attr")) {
            var optsArray = elem.getAttribute("insert").split(";");
            optsArray.forEach((e, f) => {
                var g = e.split(":");
                var dot = g[0].split(".")
                if (dot.length > 1 && dot[1] != '' && dot[0] != '' && g[1] != undefined)
                    document.getElementById(dot[0]).setAttribute(dot[1], g[1]);

            });
            INSERT_MOD = 1;
        }
        if (elem.hasAttribute("x-toggle")) {
            var optsArray = elem.getAttribute("x-toggle").split(";");
            optsArray.forEach((e, f) => {
                var g = e.split(":");
                if (g[0] != '' && g[0] != undefined)
                    document.getElementById(g[0]).classList.toggle(g[1]);
            });
        }
        if (elem.hasAttribute("remove") && elem.getAttribute("remove")) {
            var optsArray = elem.getAttribute("remove").split(";");
            optsArray.forEach((e, f) => {
                var x = document.getElementById(e);
                x.remove();
            });
        }
        if (elem.hasAttribute("query")) {
            var optsArray = elem.getAttribute("query").split(";");
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
        if (elem.hasAttribute("class-switch")) {
            this.classOrder(elem);
        }
        if (elem.tagName != "carousel" && elem.hasAttribute("file-order")) {
            this.fileOrder(elem);
        }
        if (elem.classList.contains("carousel")) {
            var auto = true;
            if (elem.classList.contains("carousel-auto-off"))
                auto = false;
            this.carousel(elem, auto);
            return;
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
        if (stop == true)
            return;
        if (elem.hasAttribute("ajax"))
            return navigate(elem, headers, query, formclass);
    }
    setAJAXOpts(elem, opts) {

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
    formAJAX(elem, classname) {
        var elem_qstring = "";

        // No, 'pipe' means it is generic. This means it is open season for all with this class
        for (var i = 0; i < document.getElementsByClassName(classname).length; i++) {
            var elem_value = document.getElementsByClassName(classname)[i];
            elem_qstring = elem_qstring + elem_value.name + "=" + elem_value.value + "&";
            // Multi-select box
            if (elem_value.hasOwnProperty("multiple")) {
                for (var o of elem_value.options) {
                    if (o.selected) {
                        elem_qstring = elem_qstring + "&" + elem_value.name + "=" + o.value;
                    }
                }
            }
        }
        if (elem.classList.contains("redirect"))
            window.location.href = elem.getAttribute("ajax") + "?" + ((elem_qstring.length > 0) ? elem_qstring : "");
        return (elem_qstring);
    }
    formJSONAJAX(elem, classname) {
        var elements = document.getElementsByClassName(classname);
        var data = {};

        for (var i = 0; i < elements.length; i++) {
            var elem = elements[i];

            var data_nest = {};
            var elem_count_base = elem.getAttribute("crud") + ";";
            // getting all FORM data with "crud" as an attr
            for (var j = 0; elem.hasAttribute("crud") && elem_count_base.length > 1;) {
                var el_crud_calls = elem_count_base.split(";")

                // init map for holding temp variables
                var map = {}
                for (var element of el_crud_calls) {
                    var all_crud = element.getAttribute('crud')
                    var el_id = (all_crud.contains("?")) ? all_crud.split('?') : ""
                    var el_crud_id = (el_id[0].length > 0) ? map.push({ "id": el_id[0] }) : "NULL"
                    var el_key_value = el_id[1].split('@')
                    var insert = (el_key_value[1].contains("."))
                    for (var kv of el_key_value) {
                        var key = kv.split(":")[0]
                        var val = kv.split(":")[1]
                        map.push({ key: val })
                    }

                    map.push({ "insert": insert })
                    data_nest[j].push(map)
                    map = {}
                    j++;
                }
            }

            if (data_nest.length > 0)
                data.push(data_nest);

            var name = elem.name;
            var value = elem.value;

            // Handle multiple select boxes
            if (elem.multiple) {
                data[name] = [];
                for (var o of elem.options) {
                    if (o.selected) {
                        data[name].push(o.value);
                    }
                }
            } else {
                data[name] = value;
            }
        }
        // Convert the data object to a JSON string
        var jsonString = JSON.stringify(data, null, 2);
        return jsonString;
    }
    navigate(elem, opts = null, query = "", classname = "") {
        //formAJAX at the end of this line
        //	console.log();
        elem_qstring = "";
        if (elem.classList.contains("db-pipe"))
            elem_qstring = query + ((document.getElementsByClassName(classname).length > 0) ? this.formJSONAJAX(elem, classname) : "");
        else
            elem_qstring = query + ((document.getElementsByClassName(classname).length > 0) ? this.formAJAX(elem, classname) : "");
        //    elem_qstring = elem_qstring;
        elem_qstring = encodeURI(elem_qstring);
        console.log(elem_qstring);
        opts = this.setAJAXOpts(elem, opts);
        var opts_req = new Request(elem_qstring);
        opts.set("mode", (opts["mode"] !== undefined) ? opts["mode"] : '"Access-Control-Allow-Origin":"*"');

        var rawFile = new XMLHttpRequest();
        rawFile.open(opts.get("method"), elem.getAttribute("ajax") + "?" + elem_qstring, true);
        console.log(elem);

        if (elem.classList.contains("set-attr")) {
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    var allText = (rawFile.responseText);
                    try {
                        if (elem.classList.contains("plain-html"))
                            document.getElementById(elem.getAttribute("insert")).innerHTML = (allText);
                        else if (elem.classList.contains("plain-text"))
                            document.getElementById(elem.getAttribute("insert")).textContent = (allText);
                        else if (elem.classList.contains("json"))
                            document.getElementById(elem.getAttribute("insert")).textContent = (allText);
                        else
                            document.getElementById(elem.getAttribute("insert")).setAttribute(elem.getAttribute("set-attr"), allText);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }
        else if (elem.classList.contains("db-pipe")) {
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {

                }
            }
        }
        else if (elem.classList.contains("text-html")) {
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    var allText = "";// JSON.parse(rawFile.responseText);
                    try {
                        allText = (rawFile.responseText);
                        if (elem.hasAttribute("callback")) {
                            var func = elem.getAttribute("callback");
                            var fn = window[func];

                            // check if object a function? 
                            if (typeof fn === "function") {
                                fn.apply(null, allText);
                            }
                        }
                        if (elem.hasAttribute("insert")) {
                            document.getElementById(elem.getAttribute("insert")).innerHTML = (rawFile.responseText);
                        }
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
                        if (elem.hasAttribute("callback")) {
                            var func = elem.getAttribute("callback");
                            var fn = window[func];

                            // check if object a function? 
                            if (typeof fn === "function") {
                                fn.apply(null, allText);
                            }
                        }
                        if (elem.hasAttribute("insert")) {
                            document.getElementById(elem.getAttribute("insert")).textContent = (rawFile.responseText);
                        }
                        return allText;
                    }
                    catch (e) {
                        // console.log("Error Handling Text");
                    }
                }
            }
        }
        else if (elem.classList.contains("modala")) {
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    var allText = ""; // JSON.parse(rawFile.responseText);
                    var html = "";
                    try {
                        allText = JSON.parse(rawFile.responseText);
                    } catch (e) {
                        html = rawFile.responseText;
                    }
                    var boxOF = false;
                    console.log(elem.getAttribute("boxes") + " " + document.getElementById(elem.getAttribute("insert")).childElementCount);
                    if (elem.hasAttribute("boxes") && elem.getAttribute("boxes") <= document.getElementById(elem.getAttribute("insert")).childElementCount)
                        boxOF = true;
                    if (!elem.classList.contains("modala-multi-first") && !elem.classList.contains("modala-multi-last")) {
                        document.getElementById(elem.getAttribute("insert")).innerHTML = "";
                    }
                    if (elem.classList.contains("modala-multi-first") && boxOF) {
                        document.getElementById(elem.getAttribute("insert")).lastChild.remove();
                    }
                    else if (elem.classList.contains("modala-multi-last") && boxOF) {
                        document.getElementById(elem.getAttribute("insert")).firstChild.remove();
                    }
                    else {
                        document.getElementById(elem.getAttribute("insert")).innerHTML = "";
                        this.modala(allText, elem.getAttribute("insert"));
                        if (elem.hasAttribute("callback")) {
                            var func = elem.getAttribute("callback");
                            var fn = window[func];

                            // check if object a function? 
                            if (typeof fn === "function") {
                                fn.apply(null, allText);
                            }
                        }
                        return;
                    }
                    this.modala(allText, document.getElementById(elem.getAttribute("insert")));
                }
            }
        }
        else if (elem.classList.contains("json")) {
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    try {
                        console.log(rawFile.responseText);
                        allText = JSON.parse(rawFile.responseText);
                        if (elem.hasAttribute("callback")) {
                            var func = elem.getAttribute("callback");
                            var fn = window[func];

                            // check if object a function? 
                            if (typeof fn === "function") {
                                fn.apply(null, allText);
                            }
                        }
                        if (elem.hasAttribute("insert")) {
                            document.getElementById(elem.getAttribute("insert")).textContent = (rawFile.responseText);
                        }
                        return allText;
                    }
                    catch (e) {
                        console.log("Response not a JSON");
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
        else {
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    var allText = JSON.parse(rawFile.responseText);
                    console.log(allText);
                    var func = elem.getAttribute("callback");
                    var fn = window[func];

                    // check if object a function? 
                    if (typeof fn === "function") {
                        fn.apply(null, allText);
                    }
                }
            }
        }
        try {
            rawFile.send();
            if (rawFile.readyState === 4)
                return rawFile.responseText;
        } catch (e) {
            // console.log(e);
        }
    }
    // Function to update styles dynamically
}

window.updateStyle = function (selector, newStyles) {
    dotPipe.reattributeStylesheets();
    console.log(`Updating styles for selector: ${selector}`);
    const sheets = document.styleSheets;
    let ruleFound = false;

    for (let sheet of sheets) {
        try {
            const rules = sheet.cssRules || sheet.rules;
            for (let rule of rules) {
                if (rule.selectorText === selector) {
                    console.log(`Found rule for selector: ${selector}`);
                    Object.keys(newStyles).forEach(prop => {
                        const camelCaseProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
                        rule.style[camelCaseProp] = newStyles[prop];
                    });
                    ruleFound = true;
                    break;
                }
            }
            if (ruleFound) break;
        } catch (e) {
            console.warn('Could not access stylesheet', sheet, e);
        }
    }

    if (!ruleFound) {
        console.warn(`No rule found for selector: ${selector}`);
    }

    // Directly apply styles to elements as a fallback
    document.querySelectorAll(selector).forEach(element => {
        Object.keys(newStyles).forEach(prop => {
            element.style[prop] = newStyles[prop];
        });
    });
}
