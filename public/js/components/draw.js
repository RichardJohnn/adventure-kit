let React = require('react');

import DrawStore from '../stores/draw_store';
import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

let Draw = React.createClass({
  getInitialState: function () {
    return DrawStore.getState();
  },

  componentDidMount: function () {
    DrawStore.listen(this.onChange);
  },

  componentWillUnmount: function () {
    DrawStore.unlisten(this.onChange);
  },

  onChange: function (state) {
    this.setState(state);
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
                          paletteCopy={this.state.paletteCopy}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     secondaryColor={this.state.secondaryColor}
                     activeTool={this.state.activeTool}
                     width={this.state.width}
                     height={this.state.height}
                     zoom={this.state.zoom}
                     totalWidth={this.state.totalWidth}
                     totalHeight={this.state.totalHeight}
                     actualWidth={this.state.actualWidth}
                     actualHeight={this.state.actualHeight}
                     tileWidth={this.state.tileWidth}
                     tileHeight={this.state.tileHeight}
                     isMouseDown={this.state.isMouseDown}
                     title={this.state.title}/>
      </div>
    );
  }
});

export default Draw;
