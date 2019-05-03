/*$(document).ready( function () {
    $('#test').DataTable();
} );*/

Highcharts.Chart.prototype.viewData = function () {
        if (!this.insertedTable) {
            var div = document.createElement('div');
            div.className = 'highcharts-data-table';
            // Insert after the chart container
            this.renderTo.parentNode.insertBefore(div, this.renderTo.nextSibling);
            div.innerHTML = this.getTable();
            this.insertedTable = true;
            var date_str = new Date().getTime().toString();
            var rand_str = Math.floor(Math.random() * (1000000)).toString();
            this.insertedTableID = 'div_' + date_str + rand_str
            div.id = this.insertedTableID;
        }
        else {
            $('#' + this.insertedTableID).toggle();
        }
    };
    Highcharts.setOptions({
            lang: {
                downloadCSV: 'Download CSV',
                downloadXLS: 'Download XLS',
                viewData: 'Toggle data table'
            }
        });

function createChart(name, variabel, years, data) {
  var myChart = Highcharts.chart(name, {
      chart: {
          type: 'column'
      },
      title: {
        text: variabel,
        style: {
          fontSize: '10px'
        }
      },
      credits: {
        enabled: false,
        text: 'ks.no',
        href: 'https://www.ks.no'
      },
      xAxis: {
          categories: years
      },
      yAxis: {
        title: null,
      },
      series: data,

      exporting: {
        allowTable: true,
    }
  });
}

/*** Henter data fra en measure i KS APIet og returner resultatet
 *
 * Tar imot parametre for å definere URLen man skal hente fra, oversetter
 * resultatet til JSON og returnerer dette.
 *
 * @param years - en String med årstall på formen År1,År2,...,ÅrN
 * @param cities - en String med byer på formen By1,By2,...,ByN
 * @param measure - en String med navnet på indikatoren
 * @param resolve - brukes for å takle asynkronhet
 *
 * @return resolve(result) - dataene som er blitt hentet i JSON format
 *
***/
function fetchData(years, cities, measure, resolve) {
  url = 'https://statistikk-test.ks.no/api/Custom';
  cols = '?cols=' + years;
  rows = '&rows=' + cities;
  model = '&model=Statistikkdatabase';
  filter = '&filter=[Measures].[' + measure + ']';

    fetch(url + cols + rows + model + filter)
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      resolve(result);
    })

}

function createHsData(measureData) {
  var obj = {};
  var dataval = [];

  measureData.map((values, index) => {
    if (index === 0) {
      obj.name = values;
    } else {
      dataval.push(values);
    }
  })
  obj.data = dataval;

  return obj;
}

function createHsDataAlt(measureData, index) {
  var obj = {};
  var dataval = [];

  measureData.map((values, curr) => {
    if (curr === 0) {
      obj.name = values[index];
    } else {
      dataval.push(values[index]);
    }
  })
  obj.data = dataval;

  return obj;
}

function createContainer(counter) {
  if (document.getElementById('container' + counter) !== null)
    return;

  body = document.getElementById('figurer');
  div = document.createElement('div');
  div.id = 'container' + counter;
  div.className = 'container';
  body.appendChild(div);
}

function fetchMultiple(years, cities, measures, measureNames) {
  var counter = 0;
  var yearsArr = years.split(',');

  let data = measures.map((item) => {
    new Promise((resolve) => {
      fetchData(years, cities, item, resolve);
    })
    .then(function(measure) {

        var hsData = [];
        data = measure.map((measureData, index) => {
          if (index === 0)
            return;

          hsData.push(createHsData(measureData));
        })
        yearsArr.sort();
        createContainer(counter);
        createChart('container'+counter, measureNames[counter], yearsArr, hsData)
        counter++;
    })
  })

  return data;
}

function fetchMultipleAlt(years, cities, measures, measureNames) {
  var counter = 0;
  var citiesArr = cities.split(',');

  let data = measures.map((item) => {
    new Promise((resolve) => {
      fetchData(years.split(',').sort().join(','), cities, item, resolve);
    })
    .then(function(measure) {

        var hsData = [];

        for (var i = 1; i < measure[0].length; i++)
          hsData.push(createHsDataAlt(measure, i))

        createContainer(counter);
        createChart('container'+counter, measureNames[counter], citiesArr, hsData)
        counter++;
    })
  })

  return data;
}

/*** Oversetter et indikatornavn til et navn som kan brukes i en URL
 *
 * Erstatter mellomrom med %20, og æøå med verdier som kan brukes i en URL.
 *
 * @param measurename - navnet på indikatoren
 *
 * @return newName - indikatornavnet som kan brukes i en URL
 *
**/
function transformMeasureToUrl(measurename) {
  newName = measurename.replace(/\ /g, '%20');
  newName = newName.replace(/æ/g, '%C3%A6')
  newName = newName.replace(/ø/g, '%C3%B8')
  newName = newName.replace(/å/g, '%C3%A5')

  return newName;
}

function createFigures(years, cities, measureNames) {
  var measures = measureNames.map((item) => {
    return transformMeasureToUrl(item);
  })

  fetchMultipleAlt(years, cities, measures, measureNames);
}

function testFetch() {
  var aar = '2016,2018';
  var cities = 'Drammen,Oslo';

  var measureNames = ['Andel ansatte med barnehagelærerutdanning/annen pedagogisk utdanning av alle ansatte (prosent)', 'Gruppestørrelse (antall)', 'Ledig liste-kapasitet', 'Netto driftsutgifter barnehager per innbygger 1-5 år (kroner)'];

  var measures = measureNames.map((item) => {
    return transformMeasureToUrl(item);
  })


  fetchMultiple(aar, cities, measures, measureNames);
}
