(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pixel = function Pixel(x, y) {
  _classCallCheck(this, Pixel);

  this.x = x;
  this.y = y;
  this.highlighted = false;
  this.color = null;
};

;

exports["default"] = Pixel;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pixel = require('./pixel');

var _pixel2 = _interopRequireDefault(_pixel);

document.addEventListener('DOMContentLoaded', function () {
  var bgCanvas = document.getElementById('bg-canvas');
  var drawCanvas = document.getElementById('draw-canvas');
  var overlayCanvas = document.getElementById('overlay-canvas');

  var bgCtx = bgCanvas.getContext('2d');
  var drawCtx = drawCanvas.getContext('2d');
  var overlayCtx = drawCanvas.getContext('2d');

  var WIDTH = bgCanvas.width;
  var HEIGHT = bgCanvas.height;
  var BG_TILE_SIZE = 8;
  var PIXEL_SIZE = 32;

  var PixelGrid = [];

  function drawBackground() {
    var NUM_TILES_HORIZ = WIDTH / BG_TILE_SIZE;
    var NUM_TILES_VERT = HEIGHT / BG_TILE_SIZE;

    for (var i = 0; i < NUM_TILES_HORIZ; i++) {
      for (var j = 0; j < NUM_TILES_VERT; j++) {
        var x = i * BG_TILE_SIZE;
        var y = j * BG_TILE_SIZE;

        var fill = (i + j) % 2 == 0 ? '#999' : '#777';

        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, BG_TILE_SIZE, BG_TILE_SIZE);
      }
    }
  }

  function initializeDrawSurface() {
    var NUM_PIXELS_HORIZ = WIDTH / PIXEL_SIZE;
    var NUM_PIXELS_VERT = HEIGHT / PIXEL_SIZE;

    for (var x = 0; x < NUM_PIXELS_HORIZ; x++) {
      for (var y = 0; y < NUM_PIXELS_VERT; y++) {
        PixelGrid.push(new _pixel2['default'](x, y));
      }
    }
    console.log(PixelGrid);
  }

  function highlightPixel(ev) {
    var elRect = ev.target.getBoundingClientRect();
    var absX = ev.clientX;
    var absY = ev.clientY;
    var x = absX - elRect.left;
    var y = absY - elRect.top;

    var pixelX = Math.floor(x / PIXEL_SIZE);
    var pixelY = Math.floor(y / PIXEL_SIZE);

    var NUM_PIXELS = PixelGrid.length;

    for (var i = 0; i < NUM_PIXELS; i++) {
      var pixel = PixelGrid[i];
      if (pixel.x === pixelX && pixel.y === pixelY) {
        if (!pixel.highlighted) {
          var fillX = pixel.x * PIXEL_SIZE;
          var fillY = pixel.y * PIXEL_SIZE;

          overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          overlayCtx.fillRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
          pixel.highlighted = true;
        }
      } else {
        if (pixel.highlighted) {
          var clearX = pixel.x * PIXEL_SIZE;
          var clearY = pixel.y * PIXEL_SIZE;

          overlayCtx.clearRect(clearX, clearY, PIXEL_SIZE, PIXEL_SIZE);
          pixel.highlighted = false;
        }
      }
    }
  }

  function paintPixel(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
  }

  drawBackground();
  initializeDrawSurface();
  drawCanvas.addEventListener('mousemove', highlightPixel, false);
  drawCanvas.addEventListener('click', paintPixel, false);
});

},{"./pixel":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvaGlyby9wdWJsaWMvanMvcGl4ZWwuanMiLCIvaG9tZS9hdXN0aW4vcHJvamVjdHMvaGlyby9wdWJsaWMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxLQUFLLEdBQ0csU0FEUixLQUFLLENBQ0ksQ0FBQyxFQUFFLENBQUMsRUFBRTt3QkFEZixLQUFLOztBQUVQLE1BQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsTUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxNQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUN6QixNQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztDQUNuQjs7QUFDRixDQUFDOztxQkFFYSxLQUFLOzs7O0FDVHBCLFlBQVksQ0FBQzs7OztxQkFFSyxTQUFTOzs7O0FBRTNCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZO0FBQ3hELE1BQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEQsTUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN4RCxNQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRTlELE1BQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsTUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxNQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU3QyxNQUFNLEtBQUssR0FBRyxRQUFRLENB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Y0FBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7O0FBRWpDLG9CQUFVLENBQUMsU0FBUyxHQUFHLDBCQUEwQixDQUFDO0FBQ2xELG9CQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzFELGVBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQzFCO09BQ0YsTUFBTTtBQUNMLFlBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUNyQixjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUNsQyxjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQzs7QUFFbEMsb0JBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDN0QsZUFBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDM0I7T0FDRjtLQUNGO0dBQ0Y7O0FBRUQsV0FBUyxVQUFVLENBQUUsRUFBRSxFQUFFO0FBQ3ZCLFFBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFDbkIsUUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztHQUNwQjs7QUFFRCxnQkFBYyxFQUFFLENBQUM7QUFDakIsdUJBQXFCLEVBQUUsQ0FBQztBQUN4QixZQUFVLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRSxZQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztDQUN6RCxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgUGl4ZWwge1xuICBjb25zdHJ1Y3RvciAoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gICAgdGhpcy5jb2xvciA9IG51bGw7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBpeGVsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUGl4ZWwgZnJvbSAnLi9waXhlbCc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gIGxldCBiZ0NhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZy1jYW52YXMnKTtcbiAgbGV0IGRyYXdDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhdy1jYW52YXMnKTtcbiAgbGV0IG92ZXJsYXlDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheS1jYW52YXMnKTtcblxuICBsZXQgYmdDdHggPSBiZ0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBsZXQgZHJhd0N0eCA9IGRyYXdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgbGV0IG92ZXJsYXlDdHggPSBkcmF3Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgY29uc3QgV0lEVEggPSBiZ0NhbnZhcy53aWR0aDtcbiAgY29uc3QgSEVJR0hUID0gYmdDYW52YXMuaGVpZ2h0O1xuICBjb25zdCBCR19USUxFX1NJWkUgPSA4O1xuICBjb25zdCBQSVhFTF9TSVpFID0gMzI7XG5cbiAgbGV0IFBpeGVsR3JpZCA9IFtdO1xuXG4gIGZ1bmN0aW9uIGRyYXdCYWNrZ3JvdW5kKCkge1xuICAgIGNvbnN0IE5VTV9USUxFU19IT1JJWiA9IFdJRFRIIC8gQkdfVElMRV9TSVpFO1xuICAgIGNvbnN0IE5VTV9USUxFU19WRVJUID0gSEVJR0hUIC8gQkdfVElMRV9TSVpFO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1fVElMRVNfSE9SSVo7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBOVU1fVElMRVNfVkVSVDsgaisrKSB7XG4gICAgICAgIGxldCB4ID0gaSAqIEJHX1RJTEVfU0laRTtcbiAgICAgICAgbGV0IHkgPSBqICogQkdfVElMRV9TSVpFO1xuXG4gICAgICAgIGxldCBmaWxsID0gKChpICsgaikgJSAyID09IDApID8gXCIjOTk5XCIgOiBcIiM3NzdcIjtcblxuICAgICAgICBiZ0N0eC5maWxsU3R5bGUgPSBmaWxsO1xuICAgICAgICBiZ0N0eC5maWxsUmVjdCh4LCB5LCBCR19USUxFX1NJWkUsIEJHX1RJTEVfU0laRSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZURyYXdTdXJmYWNlKCkge1xuICAgIGNvbnN0IE5VTV9QSVhFTFNfSE9SSVogPSBXSURUSCAvIFBJWEVMX1NJWkU7XG4gICAgY29uc3QgTlVNX1BJWEVMU19WRVJUID0gSEVJR0hUIC8gUElYRUxfU0laRTtcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgTlVNX1BJWEVMU19IT1JJWjsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IE5VTV9QSVhFTFNfVkVSVDsgeSsrKSB7XG4gICAgICAgIFBpeGVsR3JpZC5wdXNoKG5ldyBQaXhlbCh4LCB5KSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFBpeGVsR3JpZCk7XG4gIH1cblxuICBmdW5jdGlvbiBoaWdobGlnaHRQaXhlbCAoZXYpIHtcbiAgICBsZXQgZWxSZWN0ID0gZXYudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCBhYnNYID0gZXYuY2xpZW50WDtcbiAgICBsZXQgYWJzWSA9IGV2LmNsaWVudFk7XG4gICAgbGV0IHggPSBhYnNYIC0gZWxSZWN0LmxlZnQ7XG4gICAgbGV0IHkgPSBhYnNZIC0gZWxSZWN0LnRvcDtcblxuICAgIGxldCBwaXhlbFggPSBNYXRoLmZsb29yKHggLyBQSVhFTF9TSVpFKTtcbiAgICBsZXQgcGl4ZWxZID0gTWF0aC5mbG9vcih5IC8gUElYRUxfU0laRSk7XG5cbiAgICBjb25zdCBOVU1fUElYRUxTID0gUGl4ZWxHcmlkLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNX1BJWEVMUzsgaSsrKSB7XG4gICAgICBsZXQgcGl4ZWwgPSBQaXhlbEdyaWRbaV07XG4gICAgICBpZiAocGl4ZWwueCA9PT0gcGl4ZWxYICYmIHBpeGVsLnkgPT09IHBpeGVsWSkge1xuICAgICAgICBpZiAoIXBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgICAgICAgbGV0IGZpbGxYID0gcGl4ZWwueCAqIFBJWEVMX1NJWkU7XG4gICAgICAgICAgbGV0IGZpbGxZID0gcGl4ZWwueSAqIFBJWEVMX1NJWkU7XG5cbiAgICAgICAgICBvdmVybGF5Q3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCI7XG4gICAgICAgICAgb3ZlcmxheUN0eC5maWxsUmVjdChmaWxsWCwgZmlsbFksIFBJWEVMX1NJWkUsIFBJWEVMX1NJWkUpO1xuICAgICAgICAgIHBpeGVsLmhpZ2hsaWdodGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgICAgICAgbGV0IGNsZWFyWCA9IHBpeGVsLnggKiBQSVhFTF9TSVpFO1xuICAgICAgICAgIGxldCBjbGVhclkgPSBwaXhlbC55ICogUElYRUxfU0laRTtcblxuICAgICAgICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KGNsZWFyWCwgY2xlYXJZLCBQSVhFTF9TSVpFLCBQSVhFTF9TSVpFKTtcbiAgICAgICAgICBwaXhlbC5oaWdobGlnaHRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFpbnRQaXhlbCAoZXYpIHtcbiAgICBsZXQgeCA9IGV2LmNsaWVudFg7XG4gICAgbGV0IHkgPSBldi5jbGllbnRZO1xuICB9XG5cbiAgZHJhd0JhY2tncm91bmQoKTtcbiAgaW5pdGlhbGl6ZURyYXdTdXJmYWNlKCk7XG4gIGRyYXdDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGlnaGxpZ2h0UGl4ZWwsIGZhbHNlKTtcbiAgZHJhd0NhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBhaW50UGl4ZWwsIGZhbHNlKTtcbn0pO1xuIl19
