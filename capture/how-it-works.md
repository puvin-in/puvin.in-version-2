# How it works

Deep mode: what the site's JavaScript is made of and what its start page did while we watched.

## Its JavaScript

Analysed 53 script(s) from https://puvin.in/: 43 module(s), 19 endpoint(s), 3 route(s), bundled with babel/browserify/esbuild.

Evidence ev_734dbb344f8fdc0e6b4cee5675121924ccec255b64e620af547275362c721a15.

```json
{
  "api_operations": [],
  "app_kind": "unknown",
  "bundlers": [
    "babel",
    "browserify",
    "esbuild"
  ],
  "edges": [
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#1",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#a.init@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#5"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#9"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#i.extra@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#i.main@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#i.promo@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#i.session@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#i.user@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#decodeData@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#destroy@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#encodeData@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#get@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#parse@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#set@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#setBase64Flag@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#unsbjs@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#4",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#getHost@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#4",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#getParam@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#4",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#parse@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#5",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#escapeRegexp@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#5",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#randomInt@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#5",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#setDate@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#5",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#setLeadingZeroToInt@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#4"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#5"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#9"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#D@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#H@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#R@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#j@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#6",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#t.exports@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#7",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#2"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#7",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#3"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#7",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#go@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#7",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#s@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#4"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#9"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#checkFloat@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#checkInt@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#fetch@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#isNumeric@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#8",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js#isString@1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#document.getAttribute@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#document.setAttribute@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#getAttribute@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#setAttribute@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.addClass@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.hasClass@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.off@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.on@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.param@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.removeClass@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.setVendor@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.trigger@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#t.wrap@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "requires",
      "to": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#1"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#e@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#g@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#lightGallery@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.addHtml@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.arrow@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.arrowDisable@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.build@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.closeGallery@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.counter@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.destroy@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.doCss@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.enableDrag@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.enableSwipe@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.goToNextSlide@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#s.prototype.goToPrevSlide@7"
    },
    {
      "from": "bundle-module:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js#2",
      "kind": "defines",
      "to": "fn:puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgal
```

## Ten seconds of it

Watched https://puvin.in/ for 10000ms: 0 request outline(s), 1 console entr(y/ies).

Evidence ev_61cec06cc3f1275b60c0ab7b441c43ea3f36a7fb581d542c7a0684fcae720ec1.

```json
{
  "accessibility": null,
  "console": {
    "count": 1,
    "entries": [
      {
        "level": "log",
        "source": "console-api"
      }
    ],
    "has_text": false
  },
  "dom": {
    "attribute_names": [
      "action",
      "alt",
      "aria-atomic",
      "aria-current",
      "aria-hidden",
      "aria-invalid",
      "aria-label",
      "aria-live",
      "aria-required",
      "async",
      "charset",
      "class",
      "cols",
      "content",
      "crossorigin",
      "data-cf-beacon",
      "data-e-type",
      "data-element_type",
      "data-elementor-device-mode",
      "data-elementor-id",
      "data-elementor-type",
      "data-id",
      "data-name",
      "data-status",
      "data-theme",
      "data-widget_type",
      "data-wp-strategy",
      "data-wpcf7-id",
      "decoding",
      "defer",
      "dir",
      "fetchpriority",
      "fill",
      "height",
      "href",
      "id",
      "integrity",
      "lang",
      "loading",
      "maxlength",
      "media",
      "method",
      "name",
      "novalidate",
      "placeholder",
      "points",
      "rel",
      "role",
      "rows",
      "size",
      "sizes",
      "src",
      "srcset",
      "stroke",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-width",
      "style",
      "target",
      "title",
      "type",
      "value",
      "viewbox",
      "width",
      "x1",
      "x2",
      "xmlns",
      "y1",
      "y2"
    ],
    "elements_by_name": {
      "a": 190,
      "body": 1,
      "br": 2,
      "div": 198,
      "fieldset": 1,
      "form": 1,
      "h1": 1,
      "h2": 6,
      "h4": 6,
      "h5": 4,
      "head": 1,
      "header": 1,
      "html": 1,
      "i": 12,
      "img": 19,
      "input": 10,
      "li": 165,
      "line": 5,
      "link": 38,
      "main": 1,
      "meta": 9,
      "nav": 2,
      "noscript": 1,
      "p": 18,
      "polyline": 4,
      "script": 55,
      "section": 10,
      "span": 34,
      "style": 13,
      "svg": 6,
      "textarea": 1,
      "title": 1,
      "ul": 22
    },
    "text_nodes": 230,
    "total_nodes": 1106,
    "truncated": false
  },
  "dropped_events": 0,
  "frame_origins": [
    "https://puvin.in"
  ],
  "network": {
    "request_count": 0,
    "requests": []
  },
  "origin": "https://puvin.in/",
  "resources": [
    {
      "mime_type": "image/png",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/elementor/thumbs/Portfolio-2-1-rtwyllhxnl9g9fgldqic7y3te6sj17zz1fe79klbm4.png"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/lightgallery.js?ver=1.6.4"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/fonts/fontawesome-free/webfonts/fa-brands-400.woff2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=4.3.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/vendor/jquery.style.switcher.js?ver=1.6.4"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Image",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/images/icons/sun-01.svg"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/imroz-core/assets/js/element-scripts.js?ver=1.0"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/uploads/elementor/css/post-6.css?ver=1793214640"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2021/12/pt-8-1-390x532.jpg"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/feather-icons.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/waypoints.js?ver=1.6.4"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/vendor/bootstrap.min.css?ver=1.6.4"
    },
    {
      "mime_type": "font/ttf",
      "type": "Font",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/fonts/Feather.ttf?sdxovp"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/cf-fonts/s/montserrat/5.2.8/latin/600/normal.woff2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/style.css?ver=7.1.4"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/uploads/elementor/css/post-270.css?ver=1793214640"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=6.1.7"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/js/chunks/background-video.min.js?ver=4.3.2"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/cf-fonts/s/poppins/5.2.7/latin/600/normal.woff2"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/cf-fonts/s/poppins/5.2.7/latin/300/normal.woff2"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2021/09/photo-editing-1-390x532.jpg"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2021/09/app-development-1-390x532.jpg"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/js/sourcebuster/sourcebuster.min.js?ver=11.1.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/jquery.magnific-popup.min.js?ver=1.6.4"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/cf-fonts/s/poppins/5.2.7/latin/400/normal.woff2"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2021/05/dp-big-portfolio-03-1-390x532.jpg"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/vendor/isotope.js?ver=1.6.4"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/vendor/slick-slider.css?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=4.3.2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/css/widget-heading.min.css?ver=4.3.2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/uploads/elementor/css/base-desktop.css?ver=6ae248b0ed44c"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/js/js-cookie/js.cookie.min.js?ver=2.1.4-wc.11.1.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/js/chunks/section-stretched-section.min.js?ver=4.3.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/vendor/bootstrap.min.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/vendor/stellar.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/admin/js/skip-link-focus-fix.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/js/jquery-blockui/jquery.blockUI.min.js?ver=2.7.0-wc.11.1.2"
    },
    {
      "mime_type": "image/png",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/Screenshot-2026-09-25-144607-1536x817.png"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/cf-fonts/s/poppins/5.2.7/latin/700/normal.woff2"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/Poornima-Logo-1.svg"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/vendor/animation.css?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/parallax.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/imroz-core/assets/css/feather.css?ver=1.0"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/slick.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/imroz-core/assets/js/ajax-scripts.js"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/dev-style.css?ver=1.6.4"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/style.css?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.min.js?ver=11.1.2"
    },
    {
      "mime_type": "image/png",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/Screenshot-2026-09-25-144607-768x409.png"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-includes/js/jquery/ui/core.min.js?ver=1.14.2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/woocommerce.css?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/contact-form-7/includes/js/index.js?ver=6.1.7"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/vendor/magnific-popup.css?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/vendor/js.cookie.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/js/frontend/order-attribution.min.js?ver=11.1.2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/css/widget-image.min.css?ver=4.3.2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/css/woocommerce-smallscreen.css?ver=11.1.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/counterup.js?ver=1.6.4"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/Poornima-Logo.svg"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2021/12/pt-7-1-390x532.jpg"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-includes/js/wp-emoji-release.min.js?ver=7.1.4"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Image",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/images/icons/vector.svg"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/vendor/fontawesome.css?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-includes/js/dist/i18n.min.js?ver=1dfe7db3940c23ea9216"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/vendor/lightbox.css?ver=1.6.4"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/cf-fonts/s/montserrat/5.2.8/latin/900/normal.woff2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-includes/js/imagesloaded.min.js?ver=5.0.0"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://puvin.in/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/css/woocommerce-layout.css?ver=11.1.2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=4.3.2"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/46159e470166ec54f57fd2e9acd27681-1-768x1058.jpg"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2021/09/photoshop-scaled-2-390x532.jpg"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://fonts.googleapis.com/css?family=Roboto+Slab:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&display=swap"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/main.js?ver=1.6.4"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/221e8b0482b25b0eed7ef906124efbbb-1.jpg"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/js/chunks/text-editor.min.js?ver=4.3.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=4.3.2"
    },
    {
      "mime_type": "image/png",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/portfolio-1-1.png"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/uploads/elementor/css/base-mobile.css?ver=6ae248b0ed44c"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/wow.js?ver=1.6.4"
    },
    {
      "mime_type": "image/jpeg",
      "type": "Image",
      "url": "https://puvin.in/wp-content/uploads/2026/09/46159e470166ec54f57fd2e9acd27681-1.jpg"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/admin/js/navigation.js?ver=1.6.4"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.min.js?ver=11.1.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/elementor/assets/js/chunks/background-slideshow.min.js?ver=4.3.2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/css/vendor/feather.css?ver=1.6.4"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://puvin.in/cf-fonts/s/poppins/5.2.7/latin/500/normal.woff2"
    },
    {
      "mime_type": "text/css",
      "type": "Stylesheet",
      "url": "https://puvin.in/wp-content/plugins/woocommerce/assets/css/woocommerce.css?ver=11.1.2"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/plugins/contact-form-7/includes/swv/js/index.js?ver=6.1.7"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-includes/js/dist/hooks.min.js?ver=f0f188028580e8dc1255"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/vendor/particles.js?ver=1.6.4"
    }
  ],
  "scripts": [
    {
      "length": 87553,
      "source_map_url": null,
      "url": "https://puvin.in/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
    },
    {
      "length": 13577,
      "source_map_url": null,
      "url": "https://puvin.in/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
    },
    {
      "length": 256,
      "source_map_url": null,
      "url": "wc-add-to-cart-js-extra"
    },
    {
      "length": 215,
      "source_map_url": null,
      "url": "woocommerce-js-extra"
    },
    {
      "length": 24050,
      "source_map_url": null,
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/vendor/stellar.js?ver=1.6.4"
    },
    {
      "length": 6668,
      "source_map_url": null,
      "url": "https://puvin.in/wp-content/themes/imroz/assets/js/plugins/parallax.js?ver=1.6.4"
    },
    {
      "length": 1239,
      "source_map_url": null,
      "url": "https://puvin.in/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"
    },
    {
      "length": 971,
      "source_map_url": null,
      "url": "https://puvin.in/"
    },
    {
      "length": 5107,
      "source_map_url": null,
      "url": "https://puvin.in/wp-includes/js/dist/hooks.min.js?ver=f0f188028580e8dc1255"
    },
    {
      "length": 5791,
      "source_map_url": null,
      "url": "https://puvin.in/wp-includes/js/dist/i18n.min.js?ver=1dfe7db3940c23ea9216"
    },
    {
      "length": 99,
      "source_map_url": null,
      "url": "wp-i18n-js-after"
    },
    {
      "length": 12512,
      "source_map_url": null,
      "url": "https://puvin.in/wp-content/plugins/contact-form-7/includes/swv/js/index.js?ver=6.1.7"
    },
    {
      "length": 167,
      "source_map_url": null,
      "url": "contact-form-7-js-before"
    },
    {
      "length": 13452,
      "source_map_url": nul
```
