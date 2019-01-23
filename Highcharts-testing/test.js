/** Creates a simple chart with grouping
 *
 *
 * @param variabel - the object describing the yAxis
 * @param years - an array containing ints
 * @param data - an array containing objects with the fields name, data and
 *               stack (optional)
 */
function createChart(variabel, years, data) {
  var myChart = Highcharts.chart('container', {
      chart: {
          type: 'column'
      },
      title: variabel,
      xAxis: {
          categories: years
      },
      yAxis: variabel,
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: data
  });
}

function createDrillDownChart(variabel, years, data, drilldown) {
  var myChart = Highcharts.chart('container', {
      chart: {
          type: 'column'
      },
      title: variabel,
      xAxis: {
          categories: years
      },
      yAxis: variabel,
      series: data,
      drilldown: drilldown
  });
}


function testCreateChart() {
  var years = [2015, 2016, 2017];
  var variabel = {
    title: {
      text: 'Verdier'
    }
  }

  var data = [{
    name: 'Drammen',
    data: [1, 2, 3],
    stack: 'hei'
  }, {
    name: 'Oslo',
    data: [2, 3, 4],
    stack: 'hei2'
  }, {
    name: 'Asker',
    data: [3, 4, 5],
    stack: 'hei3'
  }]

  createChart(variabel, years, data);
}

function createDrillDown(name, data) {

}


/**
  drilldown: {
    series: [{
      name:
      id:
      data:
    }]
  }
*/

function testDrillDownLevel() {

  var years = [2015, 2016, 2017];
  var variabel = {
    title: {
      text: 'Mengde'
    }
  }
  var data = [{
    name: 'Mat',
    data: [{
      name: 'Frukt',
      y: 6, //verdien
      drilldown: 'Frukt',
      stack: 'test'
    }, {
        name: 'Grønnsaker',
        y: 4,
        drilldown: 'Grønnsaker',
        stack: 'test'
    }],
    stack: 'test'
  }, {
    name: 'Stash',
    data: [10],
    stack: 'test'
  }]

  var drilldown = {
    series:[{
      name: 'Frukt',
      id: 'Frukt',
      data: [{
        name: 'Sitrusfrukter',
        y: 3,
        drilldown: 'Sitrusfrukter'
      }]
    }, {
      name: 'Grønnsaker',
      id: 'Grønnsaker',
      data: [{
        name: 'Rotgrønnsaker',
        y: 3,
        drilldown: 'Rotgrønnsaker'
      }]
    }, {
      name: 'Sitrusfrukter',
      id: 'Sitrusfrukter',
      data: [{
        name: 'Appelsin',
        y: 1
      }, {
        name: 'Sitron',
        y: 2
      }]
    }, {
      name: 'Rotgrønnsaker',
      id: 'Rotgrønnsaker',
      data: [{
        name: 'Kålrot',
        y: 1
      }, {
        name: 'Sellerirot',
        y: 2
      }]
    }]
  }
  /*var data = [{
    name: 'Fylker',
    data: [{
      name: 'Fylker',
      y: 5,
      drilldown: 'Buskerud'
    }],
  },
  {
    name: 'Kommuner',
    data: [{
      name: 'Test',
      y: 5
    }],
  }];

  var drilldown = {
    series: [{
      name: 'Buskerud',
      id: 'Buskerud',
      data: [{
        name: 'Drammen',
        y: 3,
        drilldown: 'Drammen'
      }]
    }, {
      id: 'Drammen',
      name: 'Drammen',
      data: [{
        name: 'Aaskollen',
        y: 1
      }, {
        name: 'Fjell',
        y: 2
      }]
    }
  ]};*/

  createDrillDownChart(variabel, years, data, drilldown);
}
testCreateChart();
//testDrillDownLevel();
