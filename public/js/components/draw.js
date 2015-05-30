let React = require('react');

import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';
import ManageDrawList from './manage_draw_list';
import DrawStore from '../stores/draw_store';

let Draw = React.createClass({
  getInitialState: function () {
    return DrawStore.getState();
  },

  componentDidMount: function () {
    DrawStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    DrawStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(DrawStore.getState());
  },

  render: function () {
    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList/>
          <PaletteManager onColorChange={this.setPrimaryColor}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}
                       onPrimaryColorChange={this.setPrimaryColor}
                       onSecondaryColorChange={this.setSecondaryColor}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     primaryColorAlpha={this.state.primaryColorAlpha}
                     secondaryColor={this.state.secondaryColor}
                     secondaryColorAlpha={this.state.secondaryColorAlpha}/>

        <div className="manage-surface">
          <ManageDrawList/>
        </div>
      </div>
    );
  },



  setPrimaryColor: function (color) {
    console.log('setting primary color ' + color);
    this.setState({
      primaryColor: color
    });
  },

  setSecondaryColor: function (color) {
    this.setState({
      secondaryColor: color
    });
  }
});

export default Draw;
