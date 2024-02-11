<html>
<head>

<script src="irondocks.js"></script>
</head>
</html>

<script>
var f = {
    "carousel": {
        "tagname": "card",
        "id": "idtag1",
        "type": "img",
        "sources": "headstockfront.jpg;headstockback.jpg;backheel.jpg;headstockback.jpg",
        "auto": true,
        "delay": 1500,
        "boxes": 3,
        "iter": 2,
        "vertical": true,
        "insert": "idtag1",
        "width": 200,
        "height": 200,
        "direction": "right"
    }
}
modala(f, document.body);
</script>