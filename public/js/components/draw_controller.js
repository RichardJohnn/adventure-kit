let React = require('react');

import DrawStoreActions from '../actions/draw_store_actions';
import Pixel from '../models/pixel';
import DrawStore from '../stores/draw_store';
import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

function getAppState() {
  return DrawStore.getState();
}

let DrawController = React.createClass({
  getInitialState: function () {
    return getAppState();
  },

  componentDidMount: function () {
    DrawStore.addChangeListener(this._onChange);
    this.createGrid();
  },

  componentWillUnmount: function () {
    DrawStore.removeChangeListener(this._onChange);
  },

  render: function () {
    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList activeTool={this.state.activeTool}/>

          <PaletteManager palettes={this.state.palettes}
                          activePalette={this.state.activePalette}
                          isEditingPalette={this.state.isEditingPalette}
                          editPalette={this.state.editPalette}
                          editPaletteName={this.state.editPaletteName}
                          activePaletteColor={this.state.activePaletteColor}/>

          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     secondaryColor={this.state.secondaryColor}
                     width={this.state.width}
                     height={this.state.height}
                     grid={this.state.grid}
                     bgCtx={this.state.bgCtx}
                     drawCtx={this.state.drawCtx}
                     overlayCtx={this.state.overlayCtx}
                     totalWidth={this.state.totalWidth}
                     totalHeight={this.state.totalHeight}
                     actualWidth={this.state.actualWidth}
                     actualHeight={this.state.actualHeight}
                     tileWidth={this.state.tileWidth}
                     tileHeight={this.state.tileHeight}
                     zoom={this.state.zoom}
                     isMouseDown={this.state.isMouseDown}/>
      </div>
    );
  },

  _onChange: function () {
    this.setState(getAppState());
  },

  createGrid: function () {
    let grid = [];

    for (let x = 0; x < this.state.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.state.height; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    DrawStoreActions.setGrid(grid);
  },
});

export default DrawController;
