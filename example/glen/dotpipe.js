/**
  *  only usage: onclick="pipes(this)"
  *  to begin using the PipesJS code in other ways than <dyn> <pipe> and <timed>.
  *  Usable DOM Attributes (almost all are optional
  *  upto x > 134,217,000 different configurations 
  *  with unlimited inputs/outputs):
  *  Attribute/Tag   |   Use Case
  *  -------------------------------------------------------------
  *  insert............= return ajax call to this id
  *  ajax..............= calls and returns the value file's output ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  query.............= default query string associated with url ex: <anyTag form-class="someClass" query="key0:value0;key1:value2;" ajax="page.foo"> (Req. form-class)
  *  modal.............= Irondocks key. Inserts the Irondocks file in the value for template ease of use.
  *  download..........= class for downloading files ex: <tagName class="download" file="foo.zip" directory="/home/bar/"> (needs ending with slash)
  *  file..............= filename to download
  *  x-toggle..........= toggle values from class attribute that are listed in the toggle attribute "id1:class1;id1:class2;id2:class2"
  *  directory.........= relative or full path of 'file'
  *  clear-node........= clear nodes. delimited in insert="first;second;thirdnode" by ';'
  *  redirect..........= "follow" the ajax call in POST or GET mode ex: <pipe ajax="foo.bar" class="redirect" query="key0:value0;" insert="someID">
  *  multi-part........= Class to create multi-ajax calls ex: <tag id="something" ajax="foo.bar:insertIn0;foo.bar:insertIn1;bar.foo:insertIn3">Click me!</tag>
  *  modala-multi-last.= Class to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the last
  *  modala-multi-first= Class to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the first
  *  time-active.......= Class to activate timers for things that go on continuously
  *  time-inactive.....= Class to deactivate timers for things that go on continuously
  *  disabled..........= Class to disable a tag (use x-toggle to toggle state of this and time-active/-inactive)
  *  br................= [Specifically a] Modala key/value pair. "br": "x" where x is the number of breaks in succession.
  *  js................= [Specifically a] Modala key/value pair. Allows access to outside JavaScript files in scope of top nest.
  *  css...............= [Specifically a] Modala key/value pair. Imports a stylesheet file to the page accessing it.
  *  <lnk>.............= tag for clickable link <lnk ajax="goinghere.html" query="key0:value0;">
  *  <pipe>............= Tag (initializes on DOMContentLoaded Event) ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  <dyn>.............= Automatic eventListening tag for onclick="pipes(this)" ex: <dyn ajax="foo.bar" query="key0:value0;" insert="someID">
  *  \n................= RegEx emplacement to insert <br /> in Modala contents for innerHTML
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
  *  boxes.............= <carousel> attribute to request for x boxes for pictures
  *  file-order........= ajax to these files, iterating [0,1,2,3]%array.length per call (delimited by ';') ex: <pipe query="key0:value0;" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  file-index........= counter of which index to use with file-order to go with ajax ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  incrIndex.........= increment thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="incrIndex" interval="2" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  decrIndex.........= decrement thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="decrIndex" interval="3" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  interval..........= Take this many steps when stepping through file-order default = 1
  *  set-attr..........= attribute to set in target HTML tag ex: <pipe id="thisOrSomeId" class="set-attr" set-attr="value" ajax="foo.bar" query="key0:value0;" insert="thisOrSomeID">
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
  *  event.............= works with mouse/pipe class only. activates according to the event, like a normal click would
  *  options...........= works with <select> tagName only. Key:Value; pairs to setup and easily roll out multiple selects.
  **** FILTERS aer go ahead code usually coded in other languages and just come back with a result. Not wholly different from AJAX. They are general purpose files.
  **** ALL HEADERS FOR AJAX are available. They will use defaults to
  **** go on if there is no input to replace them.
  */

  function last() {
    try {
        const irc = JSON.parse(document.body.innerText);

        document.body.innerText = "";
        modala(irc, document.body);
        document.body.style.display = "block";
    }
    catch (e) {
        console.log(e);
    }
    document.addEventListener("click", function (elem) {
        console.log(elem.target);
        if (elem.target.id != undefined) { pipes(elem.target); }
    });
    return;
}

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

    let elements_Carousel = document.getElementsByTagName("carousel");
    Array.from(elements_Carousel).forEach(function (elem) {
        if (elem.classList.contains("time-inactive"))
            return;
        if (elem.classList.contains("time-active")) {
            auto = true;
            setTimers(elem);
        }
        else if (elem.classList.contains("time-inactive")) {
            auto = false;
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
    Array.from(elements_mouse).forEach(function (elem) {

        var ev = elem.getAttribute("event");
        var rv = ev.split(";");
        Array.from(rv).forEach((v) => {
            elem.addEventListener(v, function () {
                (pipes(elem, auto));
            });
        });
    });

    let elements_pipe = document.querySelectorAll(".pipe");
    Array.from(elements_pipe).forEach(function (elem) {
        var ev = elem.getAttribute("event");
        elem.addEventListener(ev, function () {
            if (elem.classList.contains("dyn-one") && !elem.classList.contains("dyn-done")) {
                elem.classList.toggle("dyn-done");
                pipes(elem);
                return;
            }
            else if (elem.classList.contains("dyn-one") && elem.classList.contains("dyn-done")) { }
            else
                pipes(elem);
        });
    });
}

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

function modal(filename, tagId) {
    if (typeof (tagId) == "string") {
        tagId = document.getElementById(tagId);
    }
    const draft = getJSONFile(filename)
    draft.then(function (res) {
        modala(res, tagId);
    });
}

function modalList(filenames) {
    const fileList = getJSONFile(filenames);
    fileList.then(function (res) {
        console.log(res);
        const files = res['modal'].split(";");
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
            modal(filenames[0].split(":")[0], filenames[0].split(":")[1]);
        }
    });
}

function getJSONFile(filename) {
    const resp = fetch(filename)
        .then(response => response.json())
        .then(data => {
            return data;
        });
    const f = resp.then(function (res) {
        return res;
    });
    return f;
}

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
    if (temp.tagName.toLowerCase() == "undefined") {
        temp.tagName = "div";
        temp.id = "undefined";
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
            var auto = (value['auto'] != undefined && value['auto'] != false) ? true : false;
            if (value['direction'] != undefined && value['direction'].toLowerCase() == "right")
                shiftFilesRight(temp, auto, value['delay']);
            else
                shiftFilesLeft(temp, auto, value['delay']);

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
        else if (!Number(k) && k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "innerhtml" && k.toLowerCase() != "innertext") {
            try {
                temp.setAttribute(k, v);
            }
            catch(e) {}
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
    return tempTag;
}

function setTimers(target) {
    var delay = target.getAttribute("delay");
    if (target.classList.contains("time-inactive") && target.classList.contains("time-active")) {
        target.classList.toggle("time-active")
        return;
    }
    else if (target.classList.contains("time-active")) {
    }
    else if (target.classList.contains("time-inactive")) {
        return;
    }
    else {
        target.classList.toggle("time-inactive")
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

    while (iter * i > h) {
        var clone = null
        try {
            elem.firstChild.cloneNode(true);
            clone.style.display = "none";
            elem.appendChild(clone);
            elem.removeChild(elem.firstChild);
        }
        catch (e) { console.log(e) }
       
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

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    if (auto == "on")
        setTimeout(() => { shiftFilesRight(elem, elem.getAttribute("auto"), delay); }, (delay));

}

function fileShift(elem) {
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

function fileOrder(elem) {
    arr = elem.getAttribute("file-order").split(";");
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
    }
    else {
        var obj = document.createElement("img");
        obj.setAttribute("src", arr[index].toString());
        ppfc.appendChild(obj);
    }
}
function carousel(elem, auto = true) {
    if (typeof (elem) == "string")
        elem = document.getElementById(elem);
    var x = document.getElementById(elem.getAttribute("insert"));
    var mArray = x.getAttribute("file-order").split(";");
    var y = 1;
    var crement = 1;
    if (x.classList.contains("decrIndex"))
        crement = (-1);
    var i = (parseInt(x.getAttribute("file-index"))) ?? 0;
    var j = parseInt(x.getAttribute("interval")) ?? 1;
    var multiVert = 1;
    if (x.classList.contains("carousel-vert")) {
        multiVert = 2;
    }
    while (x.children.length) {
        x.removeChild(x.children[0]);
    }
    var m = 0;
    var obj = document.createElement("card");
    obj.classList.toggle("pipe-grid");
    for (n = 0; obj.children.length < (x.getAttribute("boxes") * multiVert); n++) {
        if (x.classList.contains("carousel-ajax") || elem.classList.contains("carousel-ajax")) // && x.children.length < elem.getAttribute("boxes")) {
        {
            p = document.createElement("p");
            p.setAttribute("ajax", mArray[(i + j) % mArray.length]);
            p.setAttribute("insert", "self_" + obj.children.length + 1);
            p.classList.add("modala");
            p.id = "self_" + obj.children.length + 1;
            p.setAttribute("onclick", "pipes(this)");
            p.click();
            p.removeAttribute("onclick");
            p.classList.add("pipe-grid-child");
            p.classList.add("pipe");
            obj.appendChild(p);
            i = (crement > 0) ? i + 1 : (i < 0) ? (mArray.length - 1) : i - 1;
            if (multiVert == 2) {
                n++;
                obj.appendChild(br);
            }
        }
        else if (x.classList.contains("carousel-images") || elem.classList.contains("carousel-images")) {
            img = document.createElement("img");
            img.src = mArray[(i + j) % mArray.length];
            img.style = x.style;
            img.classList.add("pipe-grid-child");
            if (x.classList.contains("carousel-images")) {
                img.height = x.getAttribute("height");
                img.width = x.getAttribute("width");
            }
            obj.appendChild(img);
        }
        else if (x.classList.contains("carousel-video") || elem.classList.contains("carousel-video")) {
            var video = document.createElement("video");
            video.src = mArray[(i + j) % mArray.length];
            video.style = x.style;
            video.classList.add("pipe-grid-child");
            video.autoplay = true;
            video.loop = false;
            video.muted = true;
            video.id = "self_" + obj.children.length + 1;
            obj.appendChild(video);
        }
        else if (x.classList.contains("carousel-audio") || elem.classList.contains("carousel-audio")) {
            var audio = document.createElement("audio");
            audio.src = mArray[(i + j) % mArray.length];
            audio.style = x.style;
            audio.classList.add("pipe-grid-child");
            audio.autoplay = true;
            audio.loop = false;
            audio.muted = true;
            audio.id = "self_" + obj.children.length + 1;
            obj.appendChild(audio);
        }
        else if (x.classList.contains("carousel-iframe") || elem.classList.contains("carousel-iframe")) {
            var iframe = document.createElement("iframe");
            iframe.src = mArray[(i + j) % mArray.length];
            iframe.style = x.style;
            iframe.classList.add("pipe-grid-child");
            iframe.id = "self_" + obj.children.length + 1;
            obj.appendChild(iframe);
        }
        else if (x.classList.contains("carousel-link") || elem.classList.contains("carousel-link")) {
            var link = document.createElement("a");
            link.href = mArray[(i + j) % mArray.length];
            link.textContent = mArray[(i + j) % mArray.length];
            link.style = x.style;
            link.classList.add("pipe-grid-child");
            link.id = "self_" + obj.children.length + 1;
            obj.appendChild(link);
        }
        i = (crement > 0) ? i + 1 : (i < 0) ? (mArray.length - 1) : i - 1;
        br = document.createElement("br");
        if (multiVert == 2) {
            n++;
            obj.appendChild(br);
        }
        // console.log("OIWEWI");
    }
    // while (x.children.length || (x.classList.contains("carousel-ajax") || elem.classList.contains("carousel-ajax")) && x.children.length > x.getAttribute("boxes") * multiVert)
    //     x.removeChild(x.children[x.children.length - 1]);
    x.append(obj);
    var w = (Math.abs(i));
    x.setAttribute("file-index", w % mArray.length);
    var delay = x.getAttribute("delay");
    if (x.classList.contains("time-active")) {
        auto = true;
    }
    else if (x.classList.contains("time-inactive")) {
        auto = false;
    }
    setTimeout(() => { carousel(x.id, auto) }, delay);
}

function fileShift(elem) {
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

function classOrder(elem) {
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

function pipes(elem, stop = false) {

    var query = "";
    var headers = new Map();
    var formclass = "";

    if (elem.id === null)
        return;

    if (elem.classList.contains("disabled"))
        return;
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
            pipes(stag);
        });
        return;
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
        var optsArray = elem.getAttribute("turn").split(";");
        if (elem.hasAttribute("turn-index")) {
            var index = parseInt(elem.getAttribute("turn-index"));
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
        optsArray.forEach((e, f) => {
            this.pipes(e.target);
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

            if (elem.classList.contains("time-active")) {
                auto = true;
            }
            else if (elem.classList.contains("time-inactive")) {
                auto = false;
            }
            this.shiftFilesRight(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-step-left")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));

            if (elem.classList.contains("time-active")) {
                auto = true;
            }
            else if (elem.classList.contains("time-inactive")) {
                auto = false;
            }
            this.shiftFilesLeft(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-slide-left")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));

            if (elem.classList.contains("time-active")) {
                auto = true;
            }
            else if (elem.classList.contains("time-inactive")) {
                auto = false;
            }
            this.shiftFilesLeft(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-slide-right")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));

            if (elem.classList.contains("time-active")) {
                auto = true;
            }
            else if (elem.classList.contains("time-inactive")) {
                auto = false;
            }
            this.shiftFilesRight(x, auto, parseInt(x.getAttribute("delay")));
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
    if (elem.hasAttribute("class-switch")) {
        classOrder(elem);
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
        elem_qstring = elem_qstring + elem_value.id + "=" + elem_value.value + "&";
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


function navigate(elem, opts = null, query = "", classname = "") {
    //formAJAX at the end of this line
    //	console.log();
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
    else if (elem.classList.contains("text-html")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";// JSON.parse(rawFile.responseText);
                try {
                    allText = (rawFile.responseText);
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
    else if (elem.classList.contains("json")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";// JSON.parse(rawFile.responseText);
                try {
                    console.log(rawFile.responseText);
                    allText = JSON.parse(rawFile.responseText);
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
    else if (elem.classList.contains("modala")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "" //JSON.parse(rawFile.responseText);
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
                modala(allText, document.getElementById(elem.getAttribute("insert")));
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

last();