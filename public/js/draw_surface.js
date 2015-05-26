let $ = require('jquery');

import Pixel from './pixel';
import TileSurface from './tile_surface';
import ColorPicker from './color_picker';

class DrawSurface extends TileSurface {
  constructor (container, params={}) {
    super(container, params);


  }

  mouseMoved (ev) {
  }

  clearHighlight (ev, currentPixel) {
  }

  paintPixel (ev) {
  }

  setMouseUp () {

  }
}

export default DrawSurface;
