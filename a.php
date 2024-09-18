<html>
<head>

    <script src="dotpipe.js"></script>
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
        "class": "carousel-slide-left",
        "insert": "idtag1",
        "textContent": "HI!"
    },
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
    },
    "button-right": {
        "tagname": "p",
        "id": "right",
        "width": 100,
        "height": 100,
        "class": "carousel-slide-right",
        "insert": "idtag1",
        "textContent": "HI!"
    }
}
modala(f, document.body);
</script>
