let React = require('react');
let PIXI = require('pixi.js');

let Draw = React.createComponent({
  render: function () {
    return (
      <div id="draw">
        <div id="render"></div>
          <input type="color" id="flat-color" class="color">
          <input type="color" id="primary-color" class="color">
          <input type="color" id="secondary-color" class="color">
        </div>
      </div>
    );
  }
});
