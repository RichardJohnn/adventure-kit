let React = require('react');
let $ = require('jquery');
let PNG = require('pngjs').PNG;
let tinycolor = require('tinycolor2');

import ManageDrawList from './manage_draw_list';
import ResizePrompt from './resize_prompt';
import Pixel from '../models/pixel';
import Transparency from '../lib/transparency';

let DrawSurface = React.createClass({
  propTypes: {
    primaryColor: React.PropTypes.string.isRequired,
    secondaryColor: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    let zoom = 0.875;
    let width = 32;
    let height = 32;
    let actualWidth = this.props.totalWidth * zoom;
    let actualHeight = this.props.totalHeight * zoom;
    let tileWidth = actualWidth / width;
    let tileHeight = actualHeight / height;

    return {
      isMouseDown: false,
      width: 32,
      height: 32,
      zoom: 0.875,
      actualWidth: actualWidth,
      actualHeight: actualHeight,
      tileWidth: tileWidth,
      tileHeight: tileHeight
    };
  },

  getDefaultProps: function () {
    return {
      totalWidth: 1024,
      totalHeight: 1024,
      bgTileSize: 8,
      minZoom: 0.125,
      maxZoom: 4
    };
  },

  componentDidMount: function () {
    let bgCtx = this.refs.bgCanvas.getDOMNode().getContext('2d');
    let drawCtx = this.refs.drawCanvas.getDOMNode().getContext('2d');
    let overlayCtx = this.refs.overlayCanvas.getDOMNode().getContext('2d');

    let bgScale = this.props.bgTileSize;
    bgCtx.scale(bgScale, bgScale);

    this.setState({
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx
    }, function () {
      this.initGrid(function () {
        this.update();
      });
    });
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.bgCtx &&
        this.state.bgCtx !== prevState.bgCtx &&
        !prevState.bgCtx) {
      // contexts have been saved for the first time
      this.drawBackground();
    }

    if (this.state.actualWidth !== prevState.actualWidth ||
        this.state.actualHeight !== prevState.actualHeight ||
        this.state.width !== prevState.width ||
        this.state.height !== prevState.height) {
      this.resizeGrid();
    }
  },

  render: function () {
    let surfaceTop = (this.props.totalHeight - this.state.actualHeight) / 2;
    let surfaceLeft = (this.props.totalWidth - this.state.actualWidth) / 2;
    let surfaceStyle = {
      width: this.state.actualWidth,
      height: this.state.actualHeight,
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
                      width={this.state.actualWidth}
                      height={this.state.actualHeight}>
              </canvas>
              <canvas id="draw-canvas"
                      className="draw"
                      ref="drawCanvas"
                      width={this.state.actualWidth}
                      height={this.state.actualHeight}>
              </canvas>
              <canvas id="overlay-canvas"
                      className="draw"
                      ref="overlayCanvas"
                      width={this.state.actualWidth}
                      height={this.state.actualHeight}>
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

  update: function () {
    requestAnimationFrame(this.update);

    let bgCtx = this.state.bgCtx;
    let drawCtx = this.state.drawCtx;
    let overlayCtx = this.state.overlayCtx;
    let zoom = this.state.zoom;

    let bgScale = this.props.bgTileSize;
    bgCtx.scale(bgScale, bgScale);

    let scaleWidth = this.state.tileWidth;
    let scaleHeight = this.state.tileHeight;
    drawCtx.scale(scaleWidth, scaleHeight);
    overlayCtx.scale(scaleWidth, scaleHeight);

    let grid = this.state.grid;
    drawCtx.clearRect(0, 0, this.state.width, this.state.height);

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        let pixel = grid[x][y];
        if (pixel.color) {
          drawCtx.fillStyle = pixel.color;
          drawCtx.fillRect(x, y, 1, 1);
        }

        if (pixel.highlighted) {
          overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          overlayCtx.fillRect(x, y, 100, 100);
        }
      }
    }

    this.setState({
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx
    });
  },

  highlightPixel: function (ev) {
    let { x, y } = this.getTileCoordinates(ev);
    let grid = this.state.grid;
    grid[x][y].highlighted = true;

    this.setState({
      grid: grid
    });

    // TODO: rewrite to use onDrag (is that name right?)
    if (this.state.isMouseDown) {
      this.drawPixel(ev);
    }
  },

  clearHighlight: function (ev) {
    let grid = this.state.grid;

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        grid[x][y].highlighted = false;
      }
    }

    this.setState({
      grid: grid
    });
  },

  drawPixel: function (ev) {
    let {x, y} = this.getTileCoordinates(ev);
    let grid = this.state.grid;

    let color = this.props.primaryColor;
    let button = ev.which || ev.button;
    if (button === 2) {
      color = this.props.secondaryColor;
    }

    grid[x][y].color = color;

    this.setState({
      grid: grid,
      isMouseDown: true
    });
  },

  setMouseUp: function (ev) {
    this.setState({ isMouseDown: false });
  },

  onZoom: function (ev, data) {
    let zoom = this.state.zoom;
    let actualWidth = this.state.actualWidth;
    let actualHeight = this.state.actualHeight;
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;

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

    this.setState({
      zoom: zoom,
      actualWidth: actualWidth,
      actualHeight: actualHeight,
      tileWidth: tileWidth,
      tileHeight: tileHeight
    });

    this.updateDimensions();
  },

  onResizeClick: function () {
    React.render(<ResizePrompt width={this.state.width}
                               height={this.state.height}
                               handleResize={this.handleResize}/>,
                 document.getElementById('modal-container'));
  },

  handleResize: function (width, height) {
    this.setState({
      width: width,
      height: height
    });

    this.updateDimensions();
  },

  updateDimensions: function () {
    let zoom = this.state.zoom;
    let actualWidth = this.props.totalWidth * zoom;
    let actualHeight = this.props.totalHeight * zoom;
    let tileWidth = actualWidth / this.state.width;
    let tileHeight = actualHeight / this.state.height;

    this.setState({
      actualWidth: actualWidth,
      actualHeight: actualHeight,
      tileWidth: tileWidth,
      tileHeight: tileHeight
    });
  },

  onExportClick: function () {
    // TODO: export a PNG with the width and height in this.state
  },

  drawBackground: function (callback) {
    let bgCtx = this.state.bgCtx;
    let bgTileSize = this.props.bgTileSize;
    let numTilesH = this.state.actualWidth / bgTileSize;
    let numTilesV = this.state.actualHeight / bgTileSize;

    for (let x = 0; x < numTilesH; x++) {
      for (let y = 0; y < numTilesV; y++) {
        let fill = ((x + y) % 2 == 0) ? "#999" : "#777";

        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, 1, 1);
      }
    }

    this.setState({ bgCtx: bgCtx }, callback);
  },

  initGrid: function (callback) {
    let grid = [];

    for (let x = 0; x < this.state.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.state.height; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    this.setState({ grid: grid }, callback);
  },

  resizeGrid: function () {
    let width = this.state.width;
    let height = this.state.height;
    let oldGrid = this.state.grid;
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

    this.setState({ grid: newGrid });
  },

  getTileCoordinates: function (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.state.tileWidth);
    let tileY = Math.floor(y / this.state.tileHeight);

    return { x: tileX, y: tileY };
  },
});

export default DrawSurface;
