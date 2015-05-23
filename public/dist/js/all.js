(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports = module.exports = function () {
  if (!Element.prototype.addClass) {
    Element.prototype.addClass = function (className) {
      if (this.classList) {
        this.classList.add(className);
        return this.classList;
      } else {
        this.className += ' ' + className;
        return this.className.split(' ');
      }
    };
  }

  if (!Element.prototype.hasClass) {
    Element.prototype.hasClass = function (className) {
      if (this.classList) {
        return this.classList.contains(className);
      } else {
        return new RegExp('(^| )' +
                          className +
                          '( |$)', 'gi'
                         ).test(this.className);
      }
    };
  }

  if (!Element.prototype.removeClass) {
    Element.prototype.removeClass = function (className) {
      if (this.classList) {
        this.classList.remove(className);
        return this.classList;
      } else {
        this.className = this.className.replace(
          new RegExp('(^|\\b)' +
                     className.split(' ').join('|') +
                     '(\\b|$)', 'gi'
                    ),
          ' ');
        return this.className.split(' ');
      }
    };
  }
};

},{}],2:[function(require,module,exports){
var Pixel = require('./pixel');
var TileSurface = require('./tile_surface');

var DrawSurface = function (container, params) {
  TileSurface.call(this, container, params);

  params || (params = {});
  this.BG_TILE_SIZE = params.bgTileSize || 8;
  this.initBackground();

  this.container.addEventListener('mousemove', this.highlightPixel.bind(this),
                                  false);
  this.container.addEventListener('mouseout', this.clearHighlight.bind(this),
                                  false);
  this.container.addEventListener('mousedown', this.paintPixel.bind(this),
                                  false);

  console.log(this.hScale);
  console.log(this.vScale);
};

DrawSurface.prototype = Object.create(TileSurface.prototype);
DrawSurface.prototype.constructor = TileSurface;

DrawSurface.prototype.initCanvas = function () {
  this.bgCanvas = document.createElement('canvas');
  this.bgCanvas.setAttribute('width', this.WIDTH);
  this.bgCanvas.setAttribute('height', this.HEIGHT);
  this.bgCanvas.addClass('draw');
  this.container.appendChild(this.bgCanvas);

  this.drawCanvas = document.createElement('canvas');
  this.drawCanvas.setAttribute('width', this.WIDTH);
  this.drawCanvas.setAttribute('height', this.HEIGHT);
  this.drawCanvas.addClass('draw');
  this.container.appendChild(this.drawCanvas);

  this.overlayCanvas = document.createElement('canvas');
  this.overlayCanvas.setAttribute('width', this.WIDTH);
  this.overlayCanvas.setAttribute('height', this.HEIGHT);
  this.overlayCanvas.addClass('draw');
  this.container.appendChild(this.overlayCanvas);

  this.hScale = this.WIDTH / this.TILE_SIZE;
  this.vScale = this.HEIGHT / this.TILE_SIZE;

  this.bgCtx = this.bgCanvas.getContext('2d');
  this.drawCtx = this.drawCanvas.getContext('2d');
  this.drawCtx.scale(this.hScale, this.vScale);
  this.overlayCtx = this.overlayCanvas.getContext('2d');
  this.overlayCtx.scale(this.hScale, this.vScale);
};

DrawSurface.prototype.initBackground = function () {
  var NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
  var NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

  for (var i = 0; i < NUM_TILES_HORIZ; i++) {
    for (var j = 0; j < NUM_TILES_VERT; j++) {
      var x = i * this.BG_TILE_SIZE;
      var y = j * this.BG_TILE_SIZE;

      var fill = ((i + j) % 2 == 0) ? "#999" : "#777";

      this.bgCtx.fillStyle = fill;
      this.bgCtx.fillRect(x, y, this.BG_TILE_SIZE, this.BG_TILE_SIZE);
    }
  }
};

DrawSurface.prototype.initTiles = function () {
  this.grid = [];

  for (var x = 0; x < this.hScale; x++) {
    this.grid[x] = [];

    for (var y = 0; y < this.vScale; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
};


DrawSurface.prototype.highlightPixel = function (ev) {
  var coords = this.getTileCoordinates(ev);
  var x = coords.x;
  var y = coords.y;
  var NUM_PIXELS = this.grid.length;

  console.log(this.grid);
  var currentPixel = this.grid[x][y];
  if (!currentPixel.highlighted) {
    var fillX = currentPixel.x;
    var fillY = currentPixel.y;

    this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
    this.overlayCtx.fillRect(fillX, fillY, 1, 1);
    currentPixel.highlighted = true;
  }

  this.clearHighlight(null, currentPixel);
};

DrawSurface.prototype.clearHighlight = function (ev, currentPixel) {
  for (var ix = 0; ix < this.hSCale; ix++) {
    for (var iy = 0; iy < this.vScale; iy++) {
      var pixel = this.grid[ix][iy];
      if (pixel === currentPixel) {
        continue;
      }

      if (pixel.highlighted) {
        this.overlayCtx.clearRect(pixel.x, pixel.y, 1, 1);
        pixel.highlighted = false;
      }
    }
  }
};

DrawSurface.prototype.paintPixel = function(ev) {
  var coords = this.getTileCoordinates(ev);
  var x = coords.x;
  var y = coords.y;

  var color = "#000000";
  var pixel = this.grid[x][y];

  this.drawCtx.fillStyle = color;
  this.drawCtx.fillRect(pixel.x, pixel.y, 1, 1);
  pixel.color = color;
};

exports = module.exports = DrawSurface;

},{"./pixel":4,"./tile_surface":5}],3:[function(require,module,exports){
var FileHandler = function (el) {
  this.el = el;
  this.el.onchange = this.fileLoaded.bind(this);
}

FileHandler.prototype.fileLoaded = function (ev) {
  var file = this.el.files[0];
  var reader = new FileReader();

  reader.onload = this.onload || null;
  reader.readAsText(file);
};

exports = module.exports = FileHandler;

},{}],4:[function(require,module,exports){
var Pixel = function (x, y) {
  this.x = x;
  this.y = y;
  this.highlighted = false;
  this.color = null;
};

exports = module.exports = Pixel;

},{}],5:[function(require,module,exports){
var Pixel = require('./pixel');

var TileSurface = function (container, params) {
  params || (params = {});
  this.container = container;
  if (!this.container) {
    throw {
      name: "TileSurfaceException",
      message: "TileSurface requires a container parameter.",
      toString: function () { return this.name + ": " + this.message; }
    };
  }

  this.WIDTH = params.width || 512;
  this.HEIGHT = params.height || 512;
  this.TILE_SIZE = params.tileSize || 32;

  this.initCanvas();
  this.initBackground();
  this.initTiles();
};

TileSurface.prototype.initCanvas = function () {
  this.canvas = document.createElement('canvas');
  this.canvas.setAttribute('width', this.WIDTH);
  this.canvas.setAttribute('height', this.HEIGHT);

  this.container.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.hScale = this.WIDTH / this.TILE_SIZE;
  this.vScale = this.HEIGHT / this.TILE_SIZE;
  this.ctx.scale(this.hScale, this.vScale);
};

TileSurface.prototype.initBackground = function () {
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, this.hScale, this.vScale);
};

TileSurface.prototype.initTiles = function () {
  var NUM_TILES_HORIZ = this.WIDTH / this.TILE_SIZE;
  var NUM_TILES_VERT = this.HEIGHT / this.TILE_SIZE;
  this.grid = [];

  for (var x = 0; x < NUM_TILES_HORIZ; x++) {
    this.grid[x] = [];

    for (var y = 0; y < NUM_TILES_VERT; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
};

TileSurface.prototype.getTileCoordinates = function (ev) {
  var elRect = ev.target.getBoundingClientRect();
  var absX = ev.clientX;
  var absY = ev.clientY;
  var x = absX - elRect.left;
  var y = absY - elRect.top;
  var tileX = Math.floor(x / this.TILE_SIZE);
  var tileY = Math.floor(y / this.TILE_SIZE);

  return { x: tileX, y: tileY };
};

exports = module.exports = TileSurface;

},{"./pixel":4}],6:[function(require,module,exports){
var TMX = function (text) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(text, "text/xml");
  this.tree = {};

  var mapNode = doc.children[0];
  this.tree.map = TMX.objectFromAttributes(mapNode, [
    'width', 'height', 'tilewidth', 'tileheight'
  ]);

  var tilesetNodes = TMX.findChildrenByName(mapNode, 'tileset');
  this.tree.map.tilesets = [];
  for (var i = 0; i < tilesetNodes.length; i++) {
    var tilesetNode = tilesetNodes[i];
    this.tree.map.tilesets.push(
      TMX.objectFromAttributes(tilesetNode, [
        'firstgid', 'name', 'tilewidth', 'tileheight', 'spacing', 'margin'
      ])
    );
  }

  var layerNodes = TMX.findChildrenByName(mapNode, 'layer');
  this.tree.map.layers = [];
  for (i = 0; i < layerNodes.length; i++) {
    var layerNode = layerNodes[i];
    var layer = {
      data: []
    };

    var dataNodes = TMX.findChildrenByName(layerNode, 'data');
    for (var j = 0; j < dataNodes.length; j++) {
      var dataNode = dataNodes[j];
      for (var k = 0; k < dataNode.childElementCount; k++) {
        var tileNode = dataNode.children[k];
        var tile = TMX.objectFromAttributes(tileNode, ['gid']);
        layer.data.push(tile);
      }
    }

    this.tree.map.layers.push(layer);
  }
};

TMX.objectFromAttributes = function (node, attrs) {
  var obj = {};

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    obj[attr] = node.getAttribute(attr);
  }

  return obj;
};

TMX.findChildrenByName = function (node, name) {
  var children = [];
  for (var i = 0; i < node.childElementCount; i++) {
    var child = node.children[i];

    if (child.nodeName === name) {
      children.push(child);
    }
  }

  return children;
}
exports = module.exports = TMX;

},{}],7:[function(require,module,exports){
var addCustomMethods = require('./custom_methods');
var FileHandler = require('./file_handler');
var DrawSurface = require('./draw_surface');
var TMX = require('./tmx');

document.addEventListener('DOMContentLoaded', function () {
  addCustomMethods();
  var drawSurface = new DrawSurface(document.getElementById('render'));
  var tmxFileHandler = new FileHandler(document.getElementById('tmx-file'));

  tmxFileHandler.onload = function () {
    var tmx = new TMX(this.result);
    window.tmx = tmx;
  };
});

},{"./custom_methods":1,"./draw_surface":2,"./file_handler":3,"./tmx":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvY3VzdG9tX21ldGhvZHMuanMiLCJwdWJsaWMvanMvZHJhd19zdXJmYWNlLmpzIiwicHVibGljL2pzL2ZpbGVfaGFuZGxlci5qcyIsInB1YmxpYy9qcy9waXhlbC5qcyIsInB1YmxpYy9qcy90aWxlX3N1cmZhY2UuanMiLCJwdWJsaWMvanMvdG14LmpzIiwicHVibGljL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcykge1xuICAgIEVsZW1lbnQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0KSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAoIUVsZW1lbnQucHJvdG90eXBlLmhhc0NsYXNzKSB7XG4gICAgRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBpZiAodGhpcy5jbGFzc0xpc3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCgnKF58ICknICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJyggfCQpJywgJ2dpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICkudGVzdCh0aGlzLmNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlmICghRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQ2xhc3MpIHtcbiAgICBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIGlmICh0aGlzLmNsYXNzTGlzdCkge1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZS5yZXBsYWNlKFxuICAgICAgICAgIG5ldyBSZWdFeHAoJyhefFxcXFxiKScgK1xuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignfCcpICtcbiAgICAgICAgICAgICAgICAgICAgICcoXFxcXGJ8JCknLCAnZ2knXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgJyAnKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiIsInZhciBQaXhlbCA9IHJlcXVpcmUoJy4vcGl4ZWwnKTtcbnZhciBUaWxlU3VyZmFjZSA9IHJlcXVpcmUoJy4vdGlsZV9zdXJmYWNlJyk7XG5cbnZhciBEcmF3U3VyZmFjZSA9IGZ1bmN0aW9uIChjb250YWluZXIsIHBhcmFtcykge1xuICBUaWxlU3VyZmFjZS5jYWxsKHRoaXMsIGNvbnRhaW5lciwgcGFyYW1zKTtcblxuICBwYXJhbXMgfHwgKHBhcmFtcyA9IHt9KTtcbiAgdGhpcy5CR19USUxFX1NJWkUgPSBwYXJhbXMuYmdUaWxlU2l6ZSB8fCA4O1xuICB0aGlzLmluaXRCYWNrZ3JvdW5kKCk7XG5cbiAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oaWdobGlnaHRQaXhlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKTtcbiAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmNsZWFySGlnaGxpZ2h0LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UpO1xuICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLnBhaW50UGl4ZWwuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSk7XG5cbiAgY29uc29sZS5sb2codGhpcy5oU2NhbGUpO1xuICBjb25zb2xlLmxvZyh0aGlzLnZTY2FsZSk7XG59O1xuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRpbGVTdXJmYWNlLnByb3RvdHlwZSk7XG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUaWxlU3VyZmFjZTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLmluaXRDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuYmdDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdGhpcy5iZ0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gIHRoaXMuYmdDYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLkhFSUdIVCk7XG4gIHRoaXMuYmdDYW52YXMuYWRkQ2xhc3MoJ2RyYXcnKTtcbiAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iZ0NhbnZhcyk7XG5cbiAgdGhpcy5kcmF3Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gIHRoaXMuZHJhd0NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgdGhpcy5kcmF3Q2FudmFzLmFkZENsYXNzKCdkcmF3Jyk7XG4gIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZHJhd0NhbnZhcyk7XG5cbiAgdGhpcy5vdmVybGF5Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIHRoaXMub3ZlcmxheUNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5XSURUSCk7XG4gIHRoaXMub3ZlcmxheUNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcbiAgdGhpcy5vdmVybGF5Q2FudmFzLmFkZENsYXNzKCdkcmF3Jyk7XG4gIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMub3ZlcmxheUNhbnZhcyk7XG5cbiAgdGhpcy5oU2NhbGUgPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gIHRoaXMudlNjYWxlID0gdGhpcy5IRUlHSFQgLyB0aGlzLlRJTEVfU0laRTtcblxuICB0aGlzLmJnQ3R4ID0gdGhpcy5iZ0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB0aGlzLmRyYXdDdHggPSB0aGlzLmRyYXdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgdGhpcy5kcmF3Q3R4LnNjYWxlKHRoaXMuaFNjYWxlLCB0aGlzLnZTY2FsZSk7XG4gIHRoaXMub3ZlcmxheUN0eCA9IHRoaXMub3ZlcmxheUNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB0aGlzLm92ZXJsYXlDdHguc2NhbGUodGhpcy5oU2NhbGUsIHRoaXMudlNjYWxlKTtcbn07XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5pbml0QmFja2dyb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIE5VTV9USUxFU19IT1JJWiA9IHRoaXMuV0lEVEggLyB0aGlzLkJHX1RJTEVfU0laRTtcbiAgdmFyIE5VTV9USUxFU19WRVJUID0gdGhpcy5IRUlHSFQgLyB0aGlzLkJHX1RJTEVfU0laRTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IE5VTV9USUxFU19IT1JJWjsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBOVU1fVElMRVNfVkVSVDsgaisrKSB7XG4gICAgICB2YXIgeCA9IGkgKiB0aGlzLkJHX1RJTEVfU0laRTtcbiAgICAgIHZhciB5ID0gaiAqIHRoaXMuQkdfVElMRV9TSVpFO1xuXG4gICAgICB2YXIgZmlsbCA9ICgoaSArIGopICUgMiA9PSAwKSA/IFwiIzk5OVwiIDogXCIjNzc3XCI7XG5cbiAgICAgIHRoaXMuYmdDdHguZmlsbFN0eWxlID0gZmlsbDtcbiAgICAgIHRoaXMuYmdDdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5CR19USUxFX1NJWkUsIHRoaXMuQkdfVElMRV9TSVpFKTtcbiAgICB9XG4gIH1cbn07XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5pbml0VGlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZ3JpZCA9IFtdO1xuXG4gIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5oU2NhbGU7IHgrKykge1xuICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuXG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnZTY2FsZTsgeSsrKSB7XG4gICAgICB0aGlzLmdyaWRbeF0ucHVzaChuZXcgUGl4ZWwoeCwgeSkpO1xuICAgIH1cbiAgfVxufTtcblxuXG5EcmF3U3VyZmFjZS5wcm90b3R5cGUuaGlnaGxpZ2h0UGl4ZWwgPSBmdW5jdGlvbiAoZXYpIHtcbiAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0VGlsZUNvb3JkaW5hdGVzKGV2KTtcbiAgdmFyIHggPSBjb29yZHMueDtcbiAgdmFyIHkgPSBjb29yZHMueTtcbiAgdmFyIE5VTV9QSVhFTFMgPSB0aGlzLmdyaWQubGVuZ3RoO1xuXG4gIGNvbnNvbGUubG9nKHRoaXMuZ3JpZCk7XG4gIHZhciBjdXJyZW50UGl4ZWwgPSB0aGlzLmdyaWRbeF1beV07XG4gIGlmICghY3VycmVudFBpeGVsLmhpZ2hsaWdodGVkKSB7XG4gICAgdmFyIGZpbGxYID0gY3VycmVudFBpeGVsLng7XG4gICAgdmFyIGZpbGxZID0gY3VycmVudFBpeGVsLnk7XG5cbiAgICB0aGlzLm92ZXJsYXlDdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMilcIjtcbiAgICB0aGlzLm92ZXJsYXlDdHguZmlsbFJlY3QoZmlsbFgsIGZpbGxZLCAxLCAxKTtcbiAgICBjdXJyZW50UGl4ZWwuaGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICB9XG5cbiAgdGhpcy5jbGVhckhpZ2hsaWdodChudWxsLCBjdXJyZW50UGl4ZWwpO1xufTtcblxuRHJhd1N1cmZhY2UucHJvdG90eXBlLmNsZWFySGlnaGxpZ2h0ID0gZnVuY3Rpb24gKGV2LCBjdXJyZW50UGl4ZWwpIHtcbiAgZm9yICh2YXIgaXggPSAwOyBpeCA8IHRoaXMuaFNDYWxlOyBpeCsrKSB7XG4gICAgZm9yICh2YXIgaXkgPSAwOyBpeSA8IHRoaXMudlNjYWxlOyBpeSsrKSB7XG4gICAgICB2YXIgcGl4ZWwgPSB0aGlzLmdyaWRbaXhdW2l5XTtcbiAgICAgIGlmIChwaXhlbCA9PT0gY3VycmVudFBpeGVsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocGl4ZWwuaGlnaGxpZ2h0ZWQpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5Q3R4LmNsZWFyUmVjdChwaXhlbC54LCBwaXhlbC55LCAxLCAxKTtcbiAgICAgICAgcGl4ZWwuaGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkRyYXdTdXJmYWNlLnByb3RvdHlwZS5wYWludFBpeGVsID0gZnVuY3Rpb24oZXYpIHtcbiAgdmFyIGNvb3JkcyA9IHRoaXMuZ2V0VGlsZUNvb3JkaW5hdGVzKGV2KTtcbiAgdmFyIHggPSBjb29yZHMueDtcbiAgdmFyIHkgPSBjb29yZHMueTtcblxuICB2YXIgY29sb3IgPSBcIiMwMDAwMDBcIjtcbiAgdmFyIHBpeGVsID0gdGhpcy5ncmlkW3hdW3ldO1xuXG4gIHRoaXMuZHJhd0N0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgdGhpcy5kcmF3Q3R4LmZpbGxSZWN0KHBpeGVsLngsIHBpeGVsLnksIDEsIDEpO1xuICBwaXhlbC5jb2xvciA9IGNvbG9yO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRHJhd1N1cmZhY2U7XG4iLCJ2YXIgRmlsZUhhbmRsZXIgPSBmdW5jdGlvbiAoZWwpIHtcbiAgdGhpcy5lbCA9IGVsO1xuICB0aGlzLmVsLm9uY2hhbmdlID0gdGhpcy5maWxlTG9hZGVkLmJpbmQodGhpcyk7XG59XG5cbkZpbGVIYW5kbGVyLnByb3RvdHlwZS5maWxlTG9hZGVkID0gZnVuY3Rpb24gKGV2KSB7XG4gIHZhciBmaWxlID0gdGhpcy5lbC5maWxlc1swXTtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgcmVhZGVyLm9ubG9hZCA9IHRoaXMub25sb2FkIHx8IG51bGw7XG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRmlsZUhhbmRsZXI7XG4iLCJ2YXIgUGl4ZWwgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLmhpZ2hsaWdodGVkID0gZmFsc2U7XG4gIHRoaXMuY29sb3IgPSBudWxsO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gUGl4ZWw7XG4iLCJ2YXIgUGl4ZWwgPSByZXF1aXJlKCcuL3BpeGVsJyk7XG5cbnZhciBUaWxlU3VyZmFjZSA9IGZ1bmN0aW9uIChjb250YWluZXIsIHBhcmFtcykge1xuICBwYXJhbXMgfHwgKHBhcmFtcyA9IHt9KTtcbiAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gIGlmICghdGhpcy5jb250YWluZXIpIHtcbiAgICB0aHJvdyB7XG4gICAgICBuYW1lOiBcIlRpbGVTdXJmYWNlRXhjZXB0aW9uXCIsXG4gICAgICBtZXNzYWdlOiBcIlRpbGVTdXJmYWNlIHJlcXVpcmVzIGEgY29udGFpbmVyIHBhcmFtZXRlci5cIixcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2U7IH1cbiAgICB9O1xuICB9XG5cbiAgdGhpcy5XSURUSCA9IHBhcmFtcy53aWR0aCB8fCA1MTI7XG4gIHRoaXMuSEVJR0hUID0gcGFyYW1zLmhlaWdodCB8fCA1MTI7XG4gIHRoaXMuVElMRV9TSVpFID0gcGFyYW1zLnRpbGVTaXplIHx8IDMyO1xuXG4gIHRoaXMuaW5pdENhbnZhcygpO1xuICB0aGlzLmluaXRCYWNrZ3JvdW5kKCk7XG4gIHRoaXMuaW5pdFRpbGVzKCk7XG59O1xuXG5UaWxlU3VyZmFjZS5wcm90b3R5cGUuaW5pdENhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuV0lEVEgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuSEVJR0hUKTtcblxuICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgdGhpcy5oU2NhbGUgPSB0aGlzLldJRFRIIC8gdGhpcy5USUxFX1NJWkU7XG4gIHRoaXMudlNjYWxlID0gdGhpcy5IRUlHSFQgLyB0aGlzLlRJTEVfU0laRTtcbiAgdGhpcy5jdHguc2NhbGUodGhpcy5oU2NhbGUsIHRoaXMudlNjYWxlKTtcbn07XG5cblRpbGVTdXJmYWNlLnByb3RvdHlwZS5pbml0QmFja2dyb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMDAwMDAwXCI7XG4gIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuaFNjYWxlLCB0aGlzLnZTY2FsZSk7XG59O1xuXG5UaWxlU3VyZmFjZS5wcm90b3R5cGUuaW5pdFRpbGVzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgTlVNX1RJTEVTX0hPUklaID0gdGhpcy5XSURUSCAvIHRoaXMuVElMRV9TSVpFO1xuICB2YXIgTlVNX1RJTEVTX1ZFUlQgPSB0aGlzLkhFSUdIVCAvIHRoaXMuVElMRV9TSVpFO1xuICB0aGlzLmdyaWQgPSBbXTtcblxuICBmb3IgKHZhciB4ID0gMDsgeCA8IE5VTV9USUxFU19IT1JJWjsgeCsrKSB7XG4gICAgdGhpcy5ncmlkW3hdID0gW107XG5cbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IE5VTV9USUxFU19WRVJUOyB5KyspIHtcbiAgICAgIHRoaXMuZ3JpZFt4XS5wdXNoKG5ldyBQaXhlbCh4LCB5KSk7XG4gICAgfVxuICB9XG59O1xuXG5UaWxlU3VyZmFjZS5wcm90b3R5cGUuZ2V0VGlsZUNvb3JkaW5hdGVzID0gZnVuY3Rpb24gKGV2KSB7XG4gIHZhciBlbFJlY3QgPSBldi50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBhYnNYID0gZXYuY2xpZW50WDtcbiAgdmFyIGFic1kgPSBldi5jbGllbnRZO1xuICB2YXIgeCA9IGFic1ggLSBlbFJlY3QubGVmdDtcbiAgdmFyIHkgPSBhYnNZIC0gZWxSZWN0LnRvcDtcbiAgdmFyIHRpbGVYID0gTWF0aC5mbG9vcih4IC8gdGhpcy5USUxFX1NJWkUpO1xuICB2YXIgdGlsZVkgPSBNYXRoLmZsb29yKHkgLyB0aGlzLlRJTEVfU0laRSk7XG5cbiAgcmV0dXJuIHsgeDogdGlsZVgsIHk6IHRpbGVZIH07XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBUaWxlU3VyZmFjZTtcbiIsInZhciBUTVggPSBmdW5jdGlvbiAodGV4dCkge1xuICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICB2YXIgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCBcInRleHQveG1sXCIpO1xuICB0aGlzLnRyZWUgPSB7fTtcblxuICB2YXIgbWFwTm9kZSA9IGRvYy5jaGlsZHJlblswXTtcbiAgdGhpcy50cmVlLm1hcCA9IFRNWC5vYmplY3RGcm9tQXR0cmlidXRlcyhtYXBOb2RlLCBbXG4gICAgJ3dpZHRoJywgJ2hlaWdodCcsICd0aWxld2lkdGgnLCAndGlsZWhlaWdodCdcbiAgXSk7XG5cbiAgdmFyIHRpbGVzZXROb2RlcyA9IFRNWC5maW5kQ2hpbGRyZW5CeU5hbWUobWFwTm9kZSwgJ3RpbGVzZXQnKTtcbiAgdGhpcy50cmVlLm1hcC50aWxlc2V0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpbGVzZXROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0aWxlc2V0Tm9kZSA9IHRpbGVzZXROb2Rlc1tpXTtcbiAgICB0aGlzLnRyZWUubWFwLnRpbGVzZXRzLnB1c2goXG4gICAgICBUTVgub2JqZWN0RnJvbUF0dHJpYnV0ZXModGlsZXNldE5vZGUsIFtcbiAgICAgICAgJ2ZpcnN0Z2lkJywgJ25hbWUnLCAndGlsZXdpZHRoJywgJ3RpbGVoZWlnaHQnLCAnc3BhY2luZycsICdtYXJnaW4nXG4gICAgICBdKVxuICAgICk7XG4gIH1cblxuICB2YXIgbGF5ZXJOb2RlcyA9IFRNWC5maW5kQ2hpbGRyZW5CeU5hbWUobWFwTm9kZSwgJ2xheWVyJyk7XG4gIHRoaXMudHJlZS5tYXAubGF5ZXJzID0gW107XG4gIGZvciAoaSA9IDA7IGkgPCBsYXllck5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxheWVyTm9kZSA9IGxheWVyTm9kZXNbaV07XG4gICAgdmFyIGxheWVyID0ge1xuICAgICAgZGF0YTogW11cbiAgICB9O1xuXG4gICAgdmFyIGRhdGFOb2RlcyA9IFRNWC5maW5kQ2hpbGRyZW5CeU5hbWUobGF5ZXJOb2RlLCAnZGF0YScpO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGF0YU5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgZGF0YU5vZGUgPSBkYXRhTm9kZXNbal07XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IGRhdGFOb2RlLmNoaWxkRWxlbWVudENvdW50OyBrKyspIHtcbiAgICAgICAgdmFyIHRpbGVOb2RlID0gZGF0YU5vZGUuY2hpbGRyZW5ba107XG4gICAgICAgIHZhciB0aWxlID0gVE1YLm9iamVjdEZyb21BdHRyaWJ1dGVzKHRpbGVOb2RlLCBbJ2dpZCddKTtcbiAgICAgICAgbGF5ZXIuZGF0YS5wdXNoKHRpbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudHJlZS5tYXAubGF5ZXJzLnB1c2gobGF5ZXIpO1xuICB9XG59O1xuXG5UTVgub2JqZWN0RnJvbUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAobm9kZSwgYXR0cnMpIHtcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xuICAgIG9ialthdHRyXSA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cblRNWC5maW5kQ2hpbGRyZW5CeU5hbWUgPSBmdW5jdGlvbiAobm9kZSwgbmFtZSkge1xuICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkRWxlbWVudENvdW50OyBpKyspIHtcbiAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBuYW1lKSB7XG4gICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2hpbGRyZW47XG59XG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBUTVg7XG4iLCJ2YXIgYWRkQ3VzdG9tTWV0aG9kcyA9IHJlcXVpcmUoJy4vY3VzdG9tX21ldGhvZHMnKTtcbnZhciBGaWxlSGFuZGxlciA9IHJlcXVpcmUoJy4vZmlsZV9oYW5kbGVyJyk7XG52YXIgRHJhd1N1cmZhY2UgPSByZXF1aXJlKCcuL2RyYXdfc3VyZmFjZScpO1xudmFyIFRNWCA9IHJlcXVpcmUoJy4vdG14Jyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gIGFkZEN1c3RvbU1ldGhvZHMoKTtcbiAgdmFyIGRyYXdTdXJmYWNlID0gbmV3IERyYXdTdXJmYWNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXInKSk7XG4gIHZhciB0bXhGaWxlSGFuZGxlciA9IG5ldyBGaWxlSGFuZGxlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG14LWZpbGUnKSk7XG5cbiAgdG14RmlsZUhhbmRsZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0bXggPSBuZXcgVE1YKHRoaXMucmVzdWx0KTtcbiAgICB3aW5kb3cudG14ID0gdG14O1xuICB9O1xufSk7XG4iXX0=
