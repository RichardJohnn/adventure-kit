require('babel/polyfill');
let Router = require('react-router');
let DefaultRoute = Router.DefaultRoute;
let Link = Router.Link;
let Route = Router.Route;
let RouteHandler = Router.RouteHandler;

import DrawSurface from'./draw_surface';

document.addEventListener('DOMContentLoaded', function () {
  let App = React.createClass({
    render: function () {
      return (
        <div id="root">
          <header id="header">
            <h1 class="title">Adventure Kit</h1>
            <nav>
              <ul class="tabs">
                <li class="tab active"><Link to="draw">Draw</Link></li>
                <li class="tab"><Link to="map">Map</Link></li>
                <li class="tab"><Link to="music">Music</Link></li>
              </ul>
            </nav>
          </header>

          <div id="content"></div>

          <footer id="footer">
            <ul class="links">
              <li>
                "<a href="http://glyphicons.com/">GLYPHICONS</a>"
                is licensed under
                <a href="https://creativecommons.org/licenses/by/3.0/us/">
                  CC BY 3.0
                </a>
              </li>
            </ul>
          </footer>

          <RouteHandler/>
        </div>
      );
    }
  });

  let routes = (
      <Route name="app" path="/" handler={App}>
        <Route name="draw" handler={Draw}/>
        <Route name="map" handler={Map}/>
        <Route name="music" handler={Music}/>
        <DefaultRoute handler={Draw}/>
      </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });

  let drawSurface = new DrawSurface(document.getElementById('render'));
});
