let React = require('react');
let $ = require('jquery');
let tinycolor = require('tinycolor2');

import DrawStoreActions from '../actions/draw_store_actions';
import ManageDrawList from './manage_draw_list';
import ResizePrompt from './resize_prompt';
import Pixel from '../models/pixel';
import Transparency from '../mixins/transparency';

let DrawSurface = React.createClass({
  propTypes: {
    primaryColor: React.PropTypes.string.isRequired,
    secondaryColor: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    grid: React.PropTypes.array.isRequired,
    totalWidth: React.PropTypes.number.isRequired,
    totalHeight: React.PropTypes.number.isRequired,
    actualWidth: React.PropTypes.number.isRequired,
    actualHeight: React.PropTypes.number.isRequired,
    tileWidth: React.PropTypes.number.isRequired,
    tileHeight: React.PropTypes.number.isRequired,
    bgTileSize: React.PropTypes.number.isRequired,
    zoom: React.PropTypes.number.isRequired,
    minZoom: React.PropTypes.number.isRequired,
    maxZoom: React.PropTypes.number.isRequired,
    isMouseDown: React.PropTypes.bool.isRequired
  },

  getDefaultProps: function () {
    return {
      bgTileSize: 8,
      minZoom: 0.125,
      maxZoom: 8
    };
  },

  componentDidMount: function () {
    let bgCtx = this.refs.bgCanvas.getDOMNode().getContext('2d');
    let drawCtx = this.refs.drawCanvas.getDOMNode().getContext('2d');
    let overlayCtx = this.refs.overlayCanvas.getDOMNode().getContext('2d');

    DrawStoreActions.setContexts({
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx
    });

    DrawStoreActions.rescale();
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.bgCtx &&
        this.props.bgCtx !== prevProps.bgCtx &&
        !prevProps.bgCtx) {
      this.drawBackground();
    }

    if (this.props.actualWidth !== prevProps.actualWidth ||
        this.props.actualHeight !== prevProps.actualHeight ||
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height) {
      this.updateGrid();
      this.redraw();
    }
  },

  render: function () {
    let surfaceTop = (this.props.totalHeight - this.props.actualHeight) / 2;
    let surfaceLeft = (this.props.totalWidth - this.props.actualWidth) / 2;
    let surfaceStyle = {
      width: this.props.actualWidth,
      height: this.props.actualHeight,
      top: surfaceTop,
      left: surfaceLeft
    };

    return (
      <div className="render-container">
        <div id="render">
          <div className="background">
            <div className="surface"
                 style={surfaceStyle}
                 onMouseMove={this.highlightPixel}
                 onMouseOut={this.clearHighlight}
                 onMouseDown={this.drawPixel}
                 onContextMenu={this.drawPixel}
                 onMouseUp={this.setMouseUp}
                 onWheel={this.onZoom}>
              <canvas id="bg-canvas"
                      className="draw"
                      ref="bgCanvas"
                      width={this.props.actualWidth}
                      height={this.props.actualHeight}>
              </canvas>
              <canvas id="draw-canvas"
                      className="draw"
                      ref="drawCanvas"
                      width={this.props.actualWidth}
                      height={this.props.actualHeight}>
              </canvas>
              <canvas id="overlay-canvas"
                      className="draw"
                      ref="overlayCanvas"
                      width={this.props.actualWidth}
                      height={this.props.actualHeight}>
              </canvas>
            </div>
          </div>
        </div>

        <div className="manage-surface">
          <ManageDrawList onResizeClick={this.onResizeClick}
                          onExportClick={this.onExportClick}/>
        </div>
      </div>
    );
  },

  redraw: function () {
    let bgCtx = this.props.bgCtx;
    let drawCtx = this.props.drawCtx;
    let overlayCtx = this.props.overlayCtx;
    let zoom = this.props.zoom;
    let grid = this.props.grid;

    this.rescale(function () {
      this.drawBackground(function () {
        drawCtx.clearRect(0, 0, this.props.width, this.props.height);

        for (let x = 0; x < this.props.width; x++) {
          for (let y = 0; y < this.props.height; y++) {
            let pixel = grid[x][y];
            if (pixel.color) {
              drawCtx.fillStyle = pixel.color;
              drawCtx.fillRect(x, y, 1, 1);
            }
          }
        }
      });

    });

  },

  highlightPixel: function (ev) {
    let overlayCtx = this.props.overlayCtx;
    let { x, y } = this.getTileCoordinates(ev);
    let grid = this.props.grid;
    let numPixels = grid.length;
    let currentPixel = grid[x][y];

    if (!currentPixel.highlighted) {
      overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      overlayCtx.fillRect(x, y, 1, 1);
      currentPixel.highlighted = true;
    }

    DrawStoreActions.setGrid(grid);

    this.clearHighlight(null, currentPixel);

    if (this.props.isMouseDown) {
      this.drawPixel(ev);
    }
  },

  clearHighlight: function (ev, currentPixel) {
    let overlayCtx = this.props.overlayCtx;
    let grid = this.props.grid;

    overlayCtx.clearRect(0, 0, this.props.width, this.props.height);
    overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    overlayCtx.fillRect(currentPixel.x, currentPixel.y, 1, 1);

    for (let x = 0; x < this.props.width; x++) {
      for (let y = 0; y < this.props.height; y++) {
        let pixel = grid[x][y];
        if (pixel === currentPixel) {
          continue;
        }

        pixel.highlighted = false;
      }
    }

    DrawStoreActions.setGrid(grid);
  },

  drawPixel: function (ev) {
    let {x, y} = this.getTileCoordinates(ev);
    let grid = this.props.grid;
    let drawCtx = this.props.drawCtx;

    let color = this.props.primaryColor;
    let button = ev.which || ev.button;
    if (button === 2) {
      color = this.props.secondaryColor;
    }

    grid[x][y].color = color;
    drawCtx.fillStyle = color;
    drawCtx.fillRect(x, y, 1, 1);

    DrawStoreActions.setGrid(grid);
    DrawStoreActions.setMouseDown(true);
  },

  setMouseUp: function (ev) {
    DrawStoreActions.setMouseDown(false);
  },

  onZoom: function (ev, data) {
    let zoom = this.props.zoom;
    let actualWidth = this.props.actualWidth;
    let actualHeight = this.props.actualHeight;
    let tileWidth = this.props.tileWidth;
    let tileHeight = this.props.tileHeight;

    if (ev) {
      ev.preventDefault();
      if (ev.deltaY > 0) {
        zoom /= 2;
      } else if (ev.deltaY < 0) {
        zoom *= 2;
      } else {
        return;
      }
    } else if (data) {
      if (data.delta) {
        zoom += data.delta;
      } else if (data.zoom) {
        zoom = data.zoom;
      } else {
        return;
      }
    } else {
      return;
    }

    if (zoom < this.props.minZoom || zoom > this.props.maxZoom) {
      return;
    }

    DrawStoreActions.setZoom();
    DrawStoreActions.rescale();
  },

  onResizeClick: function () {
    React.render(<ResizePrompt width={this.props.width}
                               height={this.props.height}
                               handleResize={this.handleResize}/>,
                 document.getElementById('modal-container'));
  },

  handleResize: function (width, height) {
    DrawStoreActions.setSize({ width: width, height: height });
    DrawStoreActions.resize();
    DrawStoreActions.rescale();
  },

  onExportClick: function () {
    // TODO: export the actual PNG represented by grid
  },

  rescale: function () {
    DrawStoreActions.rescale();
  },

  drawBackground: function (callback) {
    let bgCtx = this.props.bgCtx;
    let bgTileSize = this.props.bgTileSize;
    let numTilesH = this.props.actualWidth / bgTileSize;
    let numTilesV = this.props.actualHeight / bgTileSize;

    for (let x = 0; x < numTilesH; x++) {
      for (let y = 0; y < numTilesV; y++) {
        let fill = ((x + y) % 2 == 0) ? "#999" : "#777";

        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, 1, 1);
      }
    }

    DrawStoreActions.setContexts({
      bgCtx: bgCtx
    });
  },

  updateGrid: function () {
    let width = this.props.width;
    let height = this.props.height;
    let oldGrid = this.props.grid;
    let newGrid = [];

    for (let x = 0; x < width; x++) {
      newGrid[x] = [];
      for (let y = 0; y < height; y++) {
        if (x < oldGrid.length && y < oldGrid[x].length) {
          newGrid[x][y] = oldGrid[x][y];
        } else {
          newGrid[x].push(new Pixel(x, y));
        }
      }
    }

    DrawStoreActions.setGrid(newGrid);
  },

  getTileCoordinates: function (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.props.tileWidth);
    let tileY = Math.floor(y / this.props.tileHeight);

    return { x: tileX, y: tileY };
  },
});

export default DrawSurface;
