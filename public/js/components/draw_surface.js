let React = require('react');
let $ = require('jquery');
let PNG = require('pngjs').PNG;
let tinycolor = require('tinycolor2');
let PIXI = require('pixi.js');

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
      maxZoom: 4,
      zoomDelta: 0.125
    };
  },

  componentDidMount: function () {
    let interactive = true;
    let stage = new PIXI.Stage(0xebebeb, interactive);
    let renderer = PIXI.autoDetectRenderer(this.props.totalWidth,
                                           this.props.totalHeight);
    this.getDOMNode().querySelector('.surface').appendChild(renderer.view);

    let bgGfx = new PIXI.Graphics();
    let drawGfx = new PIXI.Graphics();
    let overlayGfx = new PIXI.Graphics();

    stage.addChild(bgGfx);
    stage.addChild(drawGfx);
    stage.addChild(overlayGfx);

    let bgTileSize = this.props.bgTileSize;
    bgGfx.scale = bgTileSize;

    let tileWidth = this.state.tileWidth;
    drawGfx.scale = tileWidth;
    overlayGfx.scale = tileWidth;

    this.setState({
      stage: stage,
      renderer: renderer,
      bgGfx: bgGfx,
      drawGfx: drawGfx,
      overlayGfx: overlayGfx
    });

    this.initGrid();
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.bgGfx &&
        this.state.bgGfx !== prevState.bgGfx &&
        !prevState.bgGfx) {
      requestAnimationFrame(this.animate);
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

  animate: function () {
    requestAnimationFrame(this.animate);

    let bgGfx = this.state.bgGfx;
    let drawGfx = this.state.drawGfx;
    let overlayGfx = this.state.overlayGfx;

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

    this.rescale();
    this.drawBackground();
    let grid = this.state.grid;

    drawGfx.beginFill(0x000000, 0);
    drawGfx.drawRect(0, 0, this.state.width, this.state.height);

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        let pixel = grid[x][y];

        if (pixel.color) {
          drawGfx.beginFill(pixel.color);
          drawGfx.drawRect(x, y, 1, 1);
        }

        if (pixel.highlighted) {
          overlayGfx.beginFill(0xffffff, 0.2);
          overlayGfx.drawRect(x, y, 1, 1);
        }
      }
    }

    this.state.renderer.render(this.state.stage);

    this.setState({
      bgGfx: bgGfx,
      drawGfx: drawGfx,
      overlayGfx: overlayGfx
    });
  },

  rescale: function (callback) {
    let bgGfx = this.state.bgGfx;
    let drawGfx = this.state.drawGfx;
    let overlayGfx = this.state.overlayGfx;
    let bgScale = this.props.bgTileSize;
    let tileWidth = this.state.tileWidth;

    bgGfx.scale = bgScale;
    drawGfx.scale = tileWidth;
    overlayGfx.scale = tileWidth;

    this.setState({
      bgGfx: bgGfx,
      drawGfx: drawGfx,
      overlayGfx: overlayGfx
    }, callback);
  },

  highlightPixel: function (ev) {
    let { x, y } = this.getTileCoordinates(ev);
    let grid = this.state.grid;

    if (!grid[x][y].highlighted) {
      grid[x][y].highlighted = true;
      this.setState({
        grid: grid
      })
    }

    if (this.state.isMouseDown) {
      this.drawPixel(ev);
    }
  },

  clearHighlight: function (ev, currentPixel) {
    let grid = this.state.grid;

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        if (grid[x][y] === currentPixel) {
          continue;
        }

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
    let delta = this.props.zoomDelta;

    if (ev) {
      ev.preventDefault();
      if (ev.deltaY > 0) {
        zoom -= delta;
      } else if (ev.deltaY < 0) {
        zoom += delta;
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
      zoom: zoom
    });
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
    }, function () {
      this.updateGrid();
    });
  },

  onExportClick: function () {
    // TODO: export an actual PNG with dimensions matching this.state
  },

  drawBackground: function (callback) {
    let bgGfx = this.state.bgGfx;
    let bgTileSize = this.props.bgTileSize;
    let numTilesH = this.state.actualWidth / bgTileSize;
    let numTilesV = this.state.actualHeight / bgTileSize;

    for (let x = 0; x < numTilesH; x++) {
      for (let y = 0; y < numTilesV; y++) {
        let fill = ((x + y) % 2 == 0) ? 0x999999 : 0x777777;

        bgGfx.beginFill(fill);
        bgGfx.drawRect(x, y, 1, 1);
      }
    }

    this.setState({ bgGfx: bgGfx }, callback);
  },

  initGrid: function () {
    let grid = [];

    for (let x = 0; x < this.state.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.state.height; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    this.setState({ grid: grid });
  },

  updateGrid: function (callback) {
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

    this.setState({ grid: newGrid }, callback);
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
