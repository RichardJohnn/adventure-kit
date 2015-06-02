let React = require('react');

let ResizePrompt = React.createClass({
  getInitialState: function () {
    return {
      width: 512,
      height: 512
    };
  },

  render: function () {
    return (
      <div className="resize-prompt modal">
        <div className="modal-background">
          <div className="modal-content">
            <div className="header">
              <h2>Resize Canvas</h2>
            </div>

            <div className="content">
              <span className="close" onClick={this.closePrompt}>x</span>

              <div className="field">
                <label htmlFor="width">Width: </label>
                <input type="number"
                       value={this.state.width}
                       onChange={this.setWidth}/>
              </div>

              <div className="field">
                <label htmlFor="height">Height: </label>
                <input type="number"
                       value={this.state.height}
                       onChange={this.setHeight}/>
              </div>

              <button type="button" onClick={this.closePrompt}>Cancel</button>
              <button type="submit" onClick={this.handleResize}>Resize</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  setWidth: function (ev) {
    this.setState({ width: ev.target.value });
  },

  setHeight: function (ev) {
    this.setState({ height: ev.target.value });
  },

  handleResize: function () {
    this.props.handleResize(this.state.width, this.state.height);
    this.closePrompt();
  },

  closePrompt: function () {
    let container = document.getElementById('modal-container');
    React.unmountComponentAtNode(container);
  }
});

export default ResizePrompt;