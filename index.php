
<!DOCTYPE html>
<html>

<head>
    <link rel="icon" href="pipes.ico">
    <title>Modala Creator</title>
    <style>
        body {
            background-color: #333;
            color: #fff;
            font-family: Arial, sans-serif;
        }

        h1 {
            text-align: center;
            margin-top: 50px;
        }

        textarea {
            width: 90%;
            max-height: 300px;
        }

        article,
        textarea {
            max-width: 500px;
            margin: 0 auto;
            padding: 10px;
            background-color: #444;
            border-radius: 10px;
            border: 1px solid grey;
        }

        a {
            color: #fff;
        }
        
        select {
            max-width: 200px;
            height: 20px;
            margin: 0 auto;
            padding: 0px;
            background-color: #eee;
            border-radius: 10px;
            cursor: pointer;
        }

        label {
            display: block;
            margin-bottom: 10px;
        }

        input[type="text"] {
            float: right;
            width: 60%;
            margin: 0 auto;
            padding: 10px;
            border: none;
            background-color: #bbb;
            color: #fff;
            border-radius: 5px;
        }

        button[type="submit"],
        dyn {
            display: block;
            width: 90%;
            padding: 10px;
            margin-top: 20px;
            border: none;
            background-color: #999;
            color: #fff;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
        }

        button[type="submit"]:hover,
        dyn:hover {
            background-color: #666;
        }
    </style>
</head>

<body>
    <table style="">
        <tr>
            <td style="grid-template-columns:500px 500px auto;display:inline-grid;grid-column-count:3">
                <dyn id="i1" style="position:relative;width:300px;" ajax="https://github.com/wise-penny/pipes"
                    class="redirect">GitHub</dyn>
                <dyn id="i2" style="position:static;width:300px;" ajax="http://g0d.me/ivy" class="redirect">Ivy Seed
                </dyn>
                <dyn id="i3" style="position:relative;width:300px;" ajax="http://g0d.me/freqwave" class="redirect">
                    Freqwave</dyn>
            </td>
        </tr>
    </table>

    <div id="instr" style="position:absolute"></div>
    <table style="width:75%;z-index:-1">
        <tr>
            <td style="width:30%;vertical-align:bottom;">
                <br><br><br><br>
                Please Help us with a donation! $1 a month counts as a very helpful subscription!
            </td>
        </tr>
        <tr>
            <td>
            </td>
            <td rowspan="3">
                <article style="margin-top:-10px">
                    <h1>Modala Creator</h1>
                    <block id="block0"></block>
                    <block id="block5"></block>

                    <block id="block1"></block>
                    <block id="block6"></block>

                    <block id="block2"></block>
                    <block id="block7"></block>

                    <block id="block3"></block>
                    <block id="block8"></block>

                    <block id="block4"></block>
                    <block id="block9"></block>

                    <dyn id="submit" form-class="form1" method="GET"
                        header="'contentType: application/x-www-form-urlencoded'" ajax="getform.php" insert="ta">Add
                    </dyn>

                    <br>

                    <textarea id="ta" style="color:black" disabled="true"></textarea>

                    <dyn id="copy" onclick="insertIntoTextArea(document.getElementById('ta').value)">Copy Modal</dyn>
                </article>
            </td>
            <td rowspan="3">
                <div id="puthere"></div>
                <dyn id="cancel" onclick="document.getElementById('puthere').textContent='';">Cancel Out</dyn>
            </td>
            <td rowspan="3" width="width:250px;max-width:400px;">
            </td>
        </tr>
        <tr>
            <td>
                <textarea id="whole" name="modal" class="form2" style="height:250px;max-height:200px"></textarea>
                <dyn id="submit" form-class="form2" method="GET"
                    header="'contentType: application/x-www-form-urlencoded'"
                    onclick="modala(JSON.parse(document.getElementById('whole').value), document.getElementById('puthere'))">
                    Make page</dyn>
                                <dyn id="copy-download" ajax="makefile.php" method="GET" insert="download" form-class="form2"
                    onclick="copyJSON()">Copy JSON</dyn>
                <br>
                <div id="download"></div>
            </td>
        </tr>
    </table>
    <script src="pipes.js"></script>
    <script>

        function copyJSON() {
            /* Get the text field */
            var json = document.getElementById("whole");

            /* Select the text field */
            json.select();
            json.setSelectionRange(0, 99999); /* For mobile devices */

            /* Copy the text inside the text field */
            document.execCommand("copy");

            /* Alert the copied text */
            alert("Copied Modal to clipboard");
        }

        var lastCursorPosition = 0;

        function insertIntoTextArea(arg) {
            var textarea = document.getElementById("whole");
            var cursorPosition = textarea.selectionStart;
            var text = textarea.value;
            var newText = text.slice(0, cursorPosition) + arg + text.slice(cursorPosition);
            textarea.value = newText;
            lastCursorPosition = cursorPosition + arg.length;
        }
        var cheatSheet =
        {
            "j0": {
                "tagname": "dyn",
                "textContent": "Instructions",
                "ajax": "cheatsheet.txt",
                "id": "inst",
                "class": "mouse",
                "event": "click:-1;",
                "insert": "instruct",
                "display": "instruct"
            },
            "j1": {
                "tagname": "textarea",
                "style": "display:none;font-size:12px;height:600px;color:lightgray;max-width:1000px;z-index:3;position:static;margin-left:530px;margin-top:10px;",
                "id": "instruct",
		"disabled": "true",
                "class": "mouse",
                "event": "click:-1",
                "display": "instruct"
            }
        }
        modala(cheatSheet, document.getElementById("instr"));
        var form = {
            "tagname": "div",
            "j0": {
                "jsons": {
                    "tagname": "select",
                    "style": "width:150px;height:40px;font-size:30px",
                    "name": "key",
                    "select": {
			"options": "tagname:tagname;id:id;style:style;content:textContent;insert:insert;ajax:ajax;src:src;query:query;callback:callback;download:download;file:file;directory:directory;redirect:redirect;js:js;css:css;lnk:lnk;dyn:dyn;class:class"
                    },
                    "class": "form1",
                    "id": "key"
                }
            },
            "j1": {
                "tagname": "input",
                "id": "GH",
                "type": "text",
                "name": "value",
                "class": "form1"
            }
        };

        for (i = 0; i <= 9; i++) {
            form['j0']['jsons']['name'] = "key" + i;
            form['j0']['jsons']['id'] = "key" + i;
            form['j1']['name'] = "value" + (i);
            form['j1']['id'] = "GH" + (i);
            modala(form, document.getElementById("block" + (i)));
        }
    </script>

</body>

</html>
