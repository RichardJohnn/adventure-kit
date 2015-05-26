exports = module.exports = function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/directives/draw.html',
    link: function link(scope, element, attrs) {
      scope.initCanvas(element);
      element.bind('mousemove', scope.mouseMoved);
      element.bind('mouseout', scope.clearHighlight);
      element.bind('mousedown', scope.paintPixel);
      element.bind('mouseup', scope.setMouseUp);
    }
  };
};
