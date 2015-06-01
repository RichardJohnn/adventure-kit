let React = require('react');

let ManageDrawList = React.createClass({
  getDefaultProps: function () {
    return {
      tools: [
        {
          name: 'Resize',
          imgUrl: '/img/icons/glyphicons-216-resize-full.png'
        },
        {
          name: 'Export',
          imgUrl: '/img/icons/glyphicons-420-disk-export.png'
        }
      ]
    };
  },

  render: function () {
    let toolList = [];
    for (let i = 0; i < this.props.tools.length; i++) {
      let tool = this.props.tools[i];

      toolList.push(
        <li className="tool" key={i}>
          <button className="btn"
                  onClick={this.handleClick.bind(this, tool.name)}>
            <div className="img-container">
              <img className="icon" src={tool.imgUrl}/>
            </div>
          </button>
        </li>
      );
    }

    return (
      <ul className="manage-buttons">
        {toolList}
      </ul>
    );
  },

  handleClick: function (name) {
    switch (name) {
      case 'Resize':
        this.props.onResizeClick();
        break;

      default:
        return true;
    }
  }
});

export default ManageDrawList;
