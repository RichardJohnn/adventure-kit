let React = require('react');

let ExportDrawing = React.createClass({
  propTypes: {
    exportDrawing: React.PropTypes.func.isRequired
  },

  render: function() {
    let grid = this.props.grid;
    return (
      <a id="download" className="export-button"
              onClick={this.exportDrawing.bind(this, grid)}>
      Export to PNG
      </a>
    );

  },

  exportDrawing: function (grid) {
    var link = document.getElementById('download');
    link.href = document.getElementsByTagName('canvas')[0].toDataURL();
    link.download = 'export.png';
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
