<<<<<<< HEAD
<html>
<head>

    <script src="irondocks.js"></script>
</head>
</html>
<p id="thisone" style="display:block" onclick="pipes(this)" ajax-multi="j.json:thisone@modala;j.json:thatone@json">THICK</p>
<p id="thatone">THIN</p>
<script>
var f = {
    "button-left": {
        "tagname": "p",
        "id": "left",
        "width": 100,
        "height": 100,
        "onclick": "pipes(this)",
        "class": "carousel-step-left",
        "insert": "idtag1",
        "textContent": "HI!",
        "set-attr": "idtag1.auto:true;idtag1.direction:left"
    },
    "carousel": {
        "tagname": "card",
        "id": "idtag1",
        "type": "img",
        "sources": "headstockfront.jpg;headstockback.jpg;backheel.jpg;headstockback.jpg",
        "auto": false,
        "delay": 1500,
        "boxes": 4,
        "iter": 0,
        "vertical": true,
        "insert": "idtag1",
        "width": 100,
        "height": 100,
        "direction": "right"
    },
    "button-right": {
        "tagname": "p",
        "id": "right",
        "width": 100,
        "height": 100,
        "onclick": "pipes(this)",
        "class": "carousel-step-right",
        "insert": "idtag1",
        "textContent": "HI!",
        "set-attr": "idtag1.auto:false;idtag1.direction:right"
    },
    "chexMix0": {
        "tagname": "div",
        "id": "get",
        "insert": "left",
        "textContent": "HEY!",
        "set-var": "taking:out;messing:with;redoing:oldcode"
    },
    "chexMix1": {
        "tagname": "div",
        "id": "set",
        "insert": "left",
        "textContent": "HEY!",
        "get-var": "taking;messing;redoing"
    }
}
modala(f, document.body);
</script>
=======
<html>
<head>

    <script src="irondocks.js"></script>
</head>
</html>
<p id="thisone" style="display:block" onclick="pipes(this)" ajax-multi="j.json:thisone@modala;j.json:thatone@json">THICK</p>
<p id="thatone">THIN</p>
<script>
var f = {
    "button-left": {
        "tagname": "p",
        "id": "left",
        "width": 100,
        "height": 100,
        "onclick": "pipes(this)",
        "class": "carousel-step-left",
        "insert": "idtag1",
        "textContent": "HI!",
        "set-attr": "idtag1.auto:true;idtag1.direction:left"
    },
    "carousel": {
        "tagname": "card",
        "id": "idtag1",
        "type": "img",
        "sources": "headstockfront.jpg;headstockback.jpg;backheel.jpg;headstockback.jpg",
        "auto": false,
        "delay": 1500,
        "boxes": 4,
        "iter": 0,
        "vertical": true,
        "insert": "idtag1",
        "width": 100,
        "height": 100,
        "direction": "right"
    },
    "button-right": {
        "tagname": "p",
        "id": "right",
        "width": 100,
        "height": 100,
        "onclick": "pipes(this)",
        "class": "carousel-step-right",
        "insert": "idtag1",
        "textContent": "HI!",
        "set-attr": "idtag1.auto:false;idtag1.direction:right"
    },
    "chexMix0": {
        "tagname": "div",
        "id": "get",
        "insert": "left",
        "textContent": "HEY!",
        "set-var": "taking:out;messing:with;redoing:oldcode"
    },
    "chexMix1": {
        "tagname": "div",
        "id": "set",
        "insert": "left",
        "textContent": "HEY!",
        "get-var": "taking;messing;redoing"
    }
}
modala(f, document.body);
</script>
>>>>>>> eac0d6ca2a6e780254b5d52c5468dfcb9489c42b
