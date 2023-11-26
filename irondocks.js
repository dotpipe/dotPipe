class irondocks {
    constructor(value, tempTag, root, id) {
        this.create(value, tempTag, root, id);
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
        Object.entries(value).forEach((nest) => {
            const [k, v] = nest;
            if (v instanceof Object)
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
                    console.log("d");
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
            else if (!Number(k) && k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "innerhtml" && k.toLowerCase() != "innertext") {
                temp.setAttribute(k, v);
            }
            else if (!Number(k) && k.toLowerCase() != "tagname" && (k.toLowerCase() == "textcontent" || k.toLowerCase() == "innerhtml" || k.toLowerCase() == "innertext")) {
                (k.toLowerCase() == "textcontent") ? temp.textContent = v : (k.toLowerCase() == "innerhtml") ? temp.innerHTML = v : temp.innerText = v;
            }
        });
        tempTag.appendChild(temp);
    }

}

export { irondocks };

