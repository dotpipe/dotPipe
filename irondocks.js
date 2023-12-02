class irondocks {
    constructor(value, tempTag, root, id) {
        this.create(value, tempTag, root, id);
    }

    modalaHead(value, tempTag, root, id) {

        if (typeof (tempTag) == "string") {
            tempTag = document.createElement(tempTag);
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
    
        Object.entries(value).forEach((nest) => {
            const [k, v] = nest;
            if (v instanceof Object) {
                modalaHead(v, temp, root, id);
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

    create(value, tempTag, root, id) {
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
                this.create(v, temp, root, id);
            else if (k.toLowerCase() == "select") {
                var select = document.createElement("select");
                temp.appendChild(select);
                this.create(v, temp, root, id);
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
                        const tmp = this.create(data, temp, root, id);
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

}

export { irondocks };

