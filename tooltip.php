<!-- HTML code for the left sidebar -->
<div id="left-sidebar">
    <script>
        function toggleAttributes() {
            var attributes = document.getElementById("attributes");
            attributes.classList.toggle("show");
        }

        function showAttributes(tagName) {
            var attributesList = document.getElementById("attributes-list");
            attributesList.innerHTML = ""; // Clear previous attributes

            var attributes = {
                a: ["href", "target", "download", "rel", "hreflang", "type"],
                abbr: ["title"],
                address: [],
                area: ["alt", "coords", "shape", "href", "target", "download"],
                article: [],
                aside: [],
                audio: ["autoplay", "controls", "loop", "preload", "src"],
                b: [],
                base: ["href", "target"],
                bdi: [],
                bdo: ["dir"],
                blockquote: ["cite"],
                body: ["onload", "onunload"],
                br: [],
                button: ["autofocus", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "type", "value"],
                canvas: ["width", "height"],
                caption: [],
                cite: [],
                code: [],
                col: ["span"],
                colgroup: ["span"],
                data: ["value"],
                datalist: [],
                dd: [],
                del: ["cite", "datetime"],
                details: ["open"],
                dfn: [],
                dialog: ["open"],
                div: [],
                dl: [],
                dt: [],
                em: [],
                embed: ["src", "type", "width", "height"],
                fieldset: ["disabled", "form", "name"],
                figcaption: [],
                figure: [],
                footer: [],
                form: ["accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"],
                h1: [],
                h2: [],
                h3: [],
                h4: [],
                h5: [],
                h6: [],
                head: [],
                header: [],
                hr: [],
                html: ["manifest", "xmlns"],
                i: [],
                iframe: ["src", "srcdoc", "name", "sandbox", "seamless", "width", "height"],
                img: ["alt", "src", "srcset", "crossorigin", "usemap", "ismap", "width", "height"],
                input: ["accept", "alt", "autocomplete", "autofocus", "checked", "dirname", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "list", "max", "maxlength", "min", "multiple", "name", "pattern", "placeholder", "readonly", "required", "size", "src", "step", "type", "value", "width"],
                ins: ["cite", "datetime"],
                kbd: [],
                label: ["for", "form"],
                legend: [],
                li: ["value"],
                link: ["href", "rel", "as", "crossorigin", "media", "hreflang", "type", "sizes"],
                main: [],
                map: ["name"],
                mark: [],
                menu: [],
                meta: ["name", "content", "charset"],
                meter: ["value", "min", "max", "low", "high", "optimum"],
                nav: [],
                noscript: [],
                object: ["data", "type", "typemustmatch", "name", "usemap", "form", "width", "height"],
                ol: ["reversed", "start", "type"],
                optgroup: ["disabled", "label"],
                option: ["disabled", "label", "selected", "value"],
                output: ["for", "form", "name"],
                p: [],
                param: ["name", "value"],
                picture: [],
                pre: [],
                progress: ["value", "max"],
                q: ["cite"],
                rp: [],
                rt: [],
                ruby: [],
                s: [],
                samp: [],
                script: ["src", "type", "async", "defer", "crossorigin", "nonce"],
                section: [],
                select: ["autofocus", "disabled", "form", "multiple", "name", "required", "size"],
                small: [],
                source: ["src", "type", "srcset", "sizes", "media"],
                span: [],
                strong: [],
                style: ["media", "type", "scoped"],
                sub: [],
                summary: [],
                sup: [],
                table: ["border", "sortable"],
                tbody: [],
                td: ["colspan", "rowspan", "headers"],
                template: [],
                textarea: ["autofocus", "cols", "dirname", "disabled", "form", "maxlength", "name", "placeholder", "readonly", "required", "rows", "wrap"],
                tfoot: [],
                th: ["colspan", "rowspan", "headers", "scope", "abbr"],
                thead: [],
                time: ["datetime"],
                title: [],
                tr: [],
                track: ["default", "kind", "label", "src", "srclang"],
                u: [],
                ul: [],
                var: [],
                video: ["autoplay", "controls", "crossorigin", "loop", "muted", "playsinline", "poster", "preload", "src", "width", "height"],
                wbr: [],
                custom: []
                // Add more tags and their attributes here
            };

            // Get the attributes for the selected tag
            var tagAttributes = attributes[tagName];

            // Create the attribute elements
            tagAttributes.forEach(function(attribute) {
                var attributeElement = document.createElement("div");
                attributeElement.classList.add("attribute");
                attributeElement.innerText = attribute;
                attributeElement.onclick = function() {
                    addTagWithAttribute(tagName, attribute);
                };
                attributesList.appendChild(attributeElement);
            });

            toggleAttributes(); // Show the attributes
        }

        function addTagWithAttribute(tagName, attribute) {
            var footer = document.getElementById("footer");
            footer.innerHTML += "<" + tagName + " " + attribute + "></" + tagName + ">";
        }
    </script>

    <style>
        .window {
            /* Existing styles */
        }

        .input {
            /* Existing styles */
        }

        .caption {
            /* Existing styles */
        }

        .attributes {
            display: none;
            margin-top: 10px;
        }

        .show {
            display: block;
        }

        .attribute {
            cursor: pointer;
            padding: 5px;
            border-bottom: 1px solid #ccc;
        }
    </style>

    <div class="window">
        <input type="text" class="input" placeholder="Enter text">
        <div class="caption">Caption goes here</div>
        <div class="attributes" id="attributes">
            <div class="attribute" onclick="showAttributes('div')">div</div>
            <div class="attribute" onclick="showAttributes('span')">span</div>
            <div class="attribute" onclick="showAttributes('a')">a</div>
            <!-- Add more tags here -->
        </div>
        <div id="attributes-list"></div>
    </div>

    <footer id="footer"></footer>
</div>