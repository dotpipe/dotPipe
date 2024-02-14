<html>
<head>

<script src="irondocks.js"></script>
</head>
</html>
<p id="thisone" style="display:block" onclick="pipes(this)" ajax-multi="j.json:thisone@modala;j.json:thatone@json">THICK</p>
<p id="thatone">THIN</p>
<script>
var f = {
    "carousel": {
        "tagname": "card",
        "id": "idtag1",
        "type": "img",
        "sources": "headstockfront.jpg;headstockback.jpg;backheel.jpg;headstockback.jpg",
        "auto": true,
        "delay": 1500,
        "boxes": 4,
        "iter": 0,
        "vertical": true,
        "insert": "idtag1",
        "width": 100,
        "height": 100,
        "direction": "right"
    }
}
modala(f, document.body);
</script>