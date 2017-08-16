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
    this.postAjax('/api/v1/draw/png', grid, function(data){ console.log(data)});

  },

  postAjax: function (url, data, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    let params = JSON.stringify(data)
    xhr.send(params);
    return xhr;
  }
});

export default ExportDrawing;
