let React = require('react');

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
  },

  componentWillUnmount: function () {
    DrawStore.removeChangeListener(this._onChange);
  },

  render: function () {
    let actualWidth = this.state.totalWidth * this.state.zoom;
    let actualHeight = this.state.totalHeight * this.state.zoom;
    let tileWidth = actualWidth / this.state.width;
    let tileHeight = actualHeight / this.state.height;

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
  }
});

export default DrawController;
