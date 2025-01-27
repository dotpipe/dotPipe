<html>
<head>

    <script src="dotpipe.js"></script>
</head>
</html>
<script>
var f = {
    "button-left": {
        "tagname": "p",
        "id": "left",
        "width": 100,
        "height": 100,
        "class": "time-active carousel-step-left",
        "insert": "idtag1",
        "textContent": "HI!"
    },
    "carousel": {
        "tagname": "card",
        "id": "idtag1",
        "type": "img",
        "sources": "headstockfront.jpg;headstockback.jpg;backheel.jpg;headstockback.jpg",
        "auto": true,
        "delay": 1500,
        "boxes": 1,
        "class": "time-active carousel",
        "iter": 1,
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
        "class": "time-active carousel-step-right",
        "insert": "idtag1",
        "textContent": "HI!"
    }
}
modal(f, document.body);
</script>
