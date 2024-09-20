<html>
<head>

    <script src="dotpipe.js"></script>
</head>
</html>
<script>
var f = {
    "buttons": [
        {
        "id": "left",
        "width": 100,
        "height": 100,
        "class": "carousel-step-left",
        "insert": "idtag1",
        "innerHTML": "&lt;"
        },
        {
            "id": "right",
            "width": 100,
            "height": 100,
            "class": "carousel-step-right",
            "insert": "idtag1",
            "value": ">"
        }
    ],
    "carousel": {
        "tagname": "card",
        "id": "idtag1",
        "type": "img",
        "sources": "headstockfront.jpg;headstockback.jpg;backheel.jpg;headstockback.jpg",
        "auto": false,
        "delay": 1500,
        "boxes": 4,
        "iter": 1,
        "vertical": true,
        "insert": "idtag1",
        "width": 100,
        "height": 100
    }
}
modala(f, document.body);
</script>
