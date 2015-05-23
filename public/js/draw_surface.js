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
