# Examples & Recipes

## Dynamic Shopping Cart
```html
<cart id="cart">
  <item id="prod1" name="Widget" price="10"></item>
</cart>
```

## Load JSON Modal
```html
<button inline="|modala:data.json:target">Load</button>
```

## Tabs with AJAX
```html
<tabs id="mainTabs" tab="Home:home:home.html;About:about:about.html"></tabs>
```

## Auto-refresh Dashboard
```html
<refresh id="refresh1" target="stats:stats.html" interval="30">Refresh</refresh>
```

## Custom Function Call
```html
<button id="btn" inline="|&n:42|call:process:!n">Run</button>
<script>
function process(val){ alert(val); }
</script>
```
