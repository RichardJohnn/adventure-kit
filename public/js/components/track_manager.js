let React = require('react');

import Track from './track';

let TrackManager = React.createClass({
  getDefaultProps: function () {
    return {
      trackCount: 4
    };
  },

  render: function () {
    let trackViews = [];
    for (let i = 0; i < this.props.trackCount; i++) {
      trackViews.push(
        <Track data={this.props.tracks[i]}
               key={i}/>
      );
    }

    return (
      <ul className="track-list">
        {trackViews}

        <Track data={this.props.recording} isRecording={true}/>
      </ul>
    );
  }
});

export default TrackManager;