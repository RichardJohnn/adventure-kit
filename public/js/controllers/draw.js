let angular = require('angular');
let $ = require('jquery');

let app = angular.module('app');

exports = module.exports = function ($scope) {
  $scope.WIDTH = 512;
  $scope.HEIGHT = 512;

  $scope.initCanvas = function (el) {
    $scope.BG_TILE_SIZE = 8;

    let $el = $(el);
    $scope.bgCtx = $el.find("#bg-canvas")[0].getContext('2d');
    $scope.drawCtx = $el.find("#draw-canvas")[0].getContext('2d');
    $scope.overlayCtx = $el.find("#overlay-canvas")[0].getContext('2d');
    console.log($scope.bgCtx);

    let NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
    let NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

    for (let i = 0; i < NUM_TILES_HORIZ; i++) {
      for (let j = 0; j < NUM_TILES_VERT; j++) {
        let x = i * this.BG_TILE_SIZE;
        let y = j * this.BG_TILE_SIZE;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        this.bgCtx.fillStyle = fill;
        this.bgCtx.fillRect(x, y, this.BG_TILE_SIZE, this.BG_TILE_SIZE);
      }
    }

    this.isMouseDown = false;

    let NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
    let NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
    this.grid = [];

    for (let x = 0; x < NUM_PIXELS_HORIZ; x++) {
      this.grid[x] = [];

      for (let y = 0; y < NUM_PIXELS_VERT; y++) {
        this.grid[x].push(new Pixel(x, y));
      }

    }
  };

  $scope.mouseMoved = function (ev) {
    let { x, y } = this.getTileCoordinates(ev);
    let NUM_PIXELS = this.grid.length;

    let currentPixel = this.grid[x][y];
    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * this.TILE_SIZE;
      let fillY = currentPixel.y * this.TILE_SIZE;

      this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.overlayCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
      currentPixel.highlighted = true;
    }

    this.clearHighlight(null, currentPixel);

    if (this.isMouseDown) {
      this.paintPixel(ev);
    }
  };

  $scope.clearHighlight = function (ev) {
    let NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
    let NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
    for (let ix = 0; ix < NUM_PIXELS_HORIZ; ix++) {
      for (let iy = 0; iy < NUM_PIXELS_VERT; iy++) {
        let pixel = this.grid[ix][iy];
        if (pixel === currentPixel) {
          continue;
        }

        if (pixel.highlighted) {
          let clrX = pixel.x * this.TILE_SIZE;
          let clrY = pixel.y * this.TILE_SIZE;

          this.overlayCtx.clearRect(clrX, clrY, this.TILE_SIZE, this.TILE_SIZE);
          pixel.highlighted = false;
        }
      }
    }
  };

  $scope.paintPixel = function (ev) {
    this.isMouseDown = true;
    let { x, y } = this.getTileCoordinates(ev);

    let color = "#000000";
    let pixel = this.grid[x][y];

    let fillX = x * this.TILE_SIZE;
    let fillY = y * this.TILE_SIZE;
    this.drawCtx.fillStyle = color;
    this.drawCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
    pixel.color = color;
  };

  $scope.setMouseUp = function (ev) {
    this.isMouseDown = false;
  };
};
