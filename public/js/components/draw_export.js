let React = require('react');

let ExportDrawing = React.createClass({
  propTypes: {
    exportDrawing: React.PropTypes.func.isRequired
  },

  render: function() {
    let grid = this.props.grid;
    return (
      <button className="export-button"
              onClick={this.exportDrawing.bind(this, grid)}>
      Export to PNG
      </button>
    );

  },

  exportDrawing: function (grid) {
    console.log(grid);
    debugger;
    //this.props.onExportDrawing(grid);
  }
});

export default ExportDrawing;
