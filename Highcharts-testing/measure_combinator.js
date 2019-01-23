/*$(document).ready( function () {
    $('#test').DataTable();
} );*/

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
      xAxis: {
          categories: years
      },
      yAxis: {
        text: 'Verdi'
      },
      series: data
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
  url = 'http://172.26.241.40:8082/api/Custom';
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

/*** Henter data fra flere indikatorer og lager en figur for hver enkelt
 *
 * Bruker fetchData til å hente data for hver enkelt indikator og createHsData
 * for å få dataene på en form som Highcharts trenger. I tillegg bruker den
 * createContainer for å lage en ny container i html dokumentet og createChart
 * for å lage selve figuren.
 *
 * @param years - en kommaseparert liste over år
 * @param cities - en kommaseparert liste over byer
 * @param measure - et array med navnet på indikatorer man skal hente data til
 * @param measureNames - et array med navnene til alle indikatorene
 *
**/
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

        createContainer(counter);
        createChart('container'+counter, measureNames[counter], yearsArr, hsData)
        counter++;
    })
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

function createContainer(counter) {
  body = document.getElementById('figurer');
  div = document.createElement('div');
  div.id = 'container' + counter;
  body.appendChild(div);
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
testFetch();
