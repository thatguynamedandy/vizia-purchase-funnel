function View() {
  this.el = document.createElement('div');
  this.el.id = 'funnel2';
}

View.prototype.render = function render(data) {
  document.getElementById('main').appendChild(this.el);

  var colours = [
  '#F4E8AE','#FAC5B8','#CAE8EA','#69BF2F',
  '#950040','#D6538C','#948671','#DEE1CF',
  ];

  var data = [{
    count: 3000,
    title: 'Awareness',
  }, {
    count: 1000,
    title: 'Interest',
  }, {
    count: 200,
    title: 'Desire',
  }, {
    count: 50,
    title: 'Action',
  },];

  var opts = {
    height: 300,
    width: 600,
  };

  var max = 5000; //FIXME
  var segmentHeight = opts.height / data.length;

  var svg = d3.select('#funnel2')
    .append('svg')
    .attr({
      width: opts.width,
      height: opts.height,
    });

  var mentionScale = d3.scale.linear()
    .domain([0, max])
    .range([0, opts.width]);

  var stages = svg.selectAll('g')
    .data(data)
    .enter();

  var stageGroups = stages.append('g')
    .attr('transform', function(d, idx) {
      var width = mentionScale(d.count);
      var prevPoint = data[idx - 1];
      var offset = ((opts.width - width) / 2);
      return 'translate(' + offset + ',' + (segmentHeight * idx) + ')';
    });

  stageGroups.append('polygon')
    .attr('points', function(d, idx) {
      var topWidth = mentionScale(d.count);
      var nextPoint = data[idx + 1];
      var bottomWidth = (nextPoint) ? mentionScale(nextPoint.count) : topWidth;
      var offset = ((topWidth - bottomWidth) / 2);
      return [
        '0,0',
        topWidth + ',0',
        (offset + bottomWidth) + ',' + segmentHeight,
        offset + ',' + segmentHeight,
      ].join(' ');
    })
    .attr('fill', function(d, idx) {
      return colours[idx];
    });

  var labels = stageGroups.append('text')
    .attr('dy', function(d) {
      return segmentHeight / 2;
    })
    .attr('dx', function(d) {
      var topWidth = mentionScale(d.count);
      return topWidth / 2;
    });

  labels.append('tspan')
    .attr('class', 'funnel__label')
    .text(function(d) {
      return d.title;
    });

  labels.append('tspan')
    .attr('dy', 14)
    .attr('dx', 0)
    .attr('class', 'funnel__count')
    .text(function(d) {
      return '(' + d.count + ')';
    });
};

export default View;
