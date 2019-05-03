//True if the left navbar is open
var open = false;
//True if the left navbar has gotten filtervalues
//var populated = false;

//Example on how data could be stored and used in a filterbox
var years = {
  title: 'År',
  values: ['2015', '2016', '2017', '2018'],
}

var kommuner = {
  title: 'Kommuner',
  values: ['Bergen', 'Bærum', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Oslo', 'Sandnes', 'Stavanger', 'Trondheim', 'Tromsø', 'Snitt ASSS'],
}

var indikatorer = {
  title: 'Indikatorer',
  values: [
  'Andel menn av grunnbemanningen barnehager (prosent)',
  'Brutto driftsutgifter per EM (f252) (kroner)',
  'Sykefravær barnevern (PAI) (prosent)*',
  'Gruppestørrelse (antall)'
],
}

var test = {
  title: 'Test',
  values: ['10', '15', 'k'],
}


/** Toggles the navbar between closed and open
**/
function updateNav(width, margin, display) {
  var filterbox = document.getElementsByClassName('filterbox')
  for (var i = 0; i < filterbox.length; i++)
    filterbox[i].style.display = display;

  document.getElementById('filterNav').style.width = width;

  document.getElementById("main").style.marginLeft = margin;
}

/** Called when the navbar button is clicked

*/
function changeNav() {
  var filterNav = document.getElementById('filterNav');
  if (open) {
    open = !open;
    updateNav('60px', '60px', 'none');
  } else {
    var populated  = (filterNav.getAttribute('data-populated') === 'true' ? true : false);
    if (!populated) {
      filterNav.setAttribute('data-populated', true);
      populateNavBar();
    }

    open = !open;
    updateNav('250px', '250px', 'block');
  }
}


function collapseFilterBox(filterbox) {
  var collapsed;
  var filters = filterbox.childNodes;

  collapsed = (filterbox.getAttribute('data-collapsed') === 'true' ? true : false);

  collapsed = !collapsed;

  for (var i = 1; i < filters.length; i++) {
    if (filters[i].childNodes.length > 1)
      filters[i].style.display = (collapsed ? 'none' : 'block');
    else
      filters[i].style.display = (collapsed ? 'none' : 'inline-flex');
  }

  filterbox.setAttribute('data-collapsed', collapsed);
}

function getFilterValue(activeFilter) {
  var value = '';

  var filters =  Array.from(activeFilter.childNodes);
  for (var i = 1; i < filters.length; i++) {
    if (value === '')
      value += filters[i].childNodes[0].nodeValue;
    else
      value += ',' + filters[i].childNodes[0].nodeValue;
  }
  return value;
}

function getSelectedFilterValues(activeFilterbox) {
  var obj = {};
  var filters =  Array.from(activeFilterbox.childNodes);
  for (var i = 1; i < filters.length; i++) {
    if (filters[i].getAttribute('id') === 'activeÅr')
      obj.years = getFilterValue(filters[i]);
    else if (filters[i].getAttribute('id') === 'activeKommuner')
      obj.cities = getFilterValue(filters[i]);
    else if (filters[i].getAttribute('id') === 'activeIndikatorer')
      obj.measures = getFilterValue(filters[i]).split(',');
  }

  return obj;
}

function loadFigures() {
  var activeFilters = document.getElementById('activeFilters');
  var obj = getSelectedFilterValues(activeFilters);
  createFigures(obj.years, obj.cities, obj.measures);
}

function addFilterToSelectedFilterBox(filteritem, filterbox) {
  var activeFilters = document.getElementById('activeFilters');
  var filterheader = filterbox.childNodes[0];
  var activeFilterBox = document.getElementById('active' + filterheader.getAttribute('id'));

  if (activeFilterBox === null) {
    var test = document.createElement('div');
    test.setAttribute('id', 'active' + filterheader.getAttribute('id'));
    test.setAttribute('class', 'filterbox');
    test.setAttribute('data-collapsed', false);
    test.style.display = 'block';
    test.style.fontSize = '15px';

    test.appendChild(createFilterHeader(filterheader.getAttribute('id'), test));
    test.appendChild(filteritem);
    activeFilters.appendChild(test);

  } else {
    if (activeFilterBox.getAttribute('data-collapsed') === 'true') {
      filteritem.style.display = 'none';
    }

    activeFilterBox.appendChild(filteritem);
  }
  if (activeFilters.childNodes.length === 4)
    loadFigures();
}

function filterSelect(filteritem, fbox) {
  var filteritem, activeFilters, selected;
  activeFilters = document.getElementById('activeFilters');
  selected = filteritem.getAttribute('data-selected')

  //The filter has been selected
  if (selected == 'true') {
    filteritem.setAttribute('data-selected', false);
  } else {
    filteritem.setAttribute('data-selected', true);
  }

  if (selected == 'true') {
    if (filteritem.parentElement.childNodes.length === 2) {
      filteritem.parentElement.parentElement.removeChild(filteritem.parentElement);
    }

    fbox.appendChild(filteritem);

    if (activeFilters.childNodes.length === 4)
      loadFigures();

  } else {
    activeFilters.appendChild(filteritem)
    addFilterToSelectedFilterBox(filteritem, fbox);
  }
}

function createFilterItem(value, filterbox) {
  var filteritem = document.createElement('div');
  filteritem.setAttribute('id', value);
  filteritem.setAttribute('class', 'filteritem');
  filteritem.setAttribute('data-selected', false);
  filteritem.appendChild(document.createTextNode(value));
  filteritem.onclick = function() {
    filterSelect(filteritem, filterbox);
  }

  if (filterbox.getAttribute('id') === 'År')
    filteritem.style.width = '65px';
  else if (filterbox.getAttribute('id') === 'Kommuner')
    filteritem.style.width = '90px';

  return filteritem;
}

function createFilterHeader(title, filterbox) {
  var filterheader = document.createElement('div');
  filterheader.setAttribute('class', 'filterheader');
  filterheader.setAttribute('id', title);
  filterbox.setAttribute('data-collapsed', false);
  filterheader.appendChild(document.createTextNode(title));
  filterheader.onclick = function() {
    collapseFilterBox(filterbox);
  }
  return filterheader;
}

/** Adds filters to a filterbox

*/
function addFiltersToFilterBox(title, values, filterbox) {
  filterbox.appendChild(createFilterHeader(title, filterbox));

  values.forEach(function(element) {
    filterbox.appendChild(createFilterItem(element, filterbox));
  })
}

/** Creates a filterbox and adds it to the navbar
*/
function createFilterBox(data) {
  body = document.getElementById('filterNav');
  filterbox = document.createElement('div');
  filterbox.setAttribute('id', data.title);
  filterbox.setAttribute('class', 'filterbox');

  addFiltersToFilterBox(data.title, data.values, filterbox);
  body.appendChild(filterbox);
}

function createSelectedFiltersBox() {
  body = document.getElementById('filterNav');
  filterbox = document.createElement('div');
  filterbox.setAttribute('id', 'activeFilters');
  filterbox.setAttribute('class', 'filterbox');
  filterbox.setAttribute('data-populated', true);
  filterbox.appendChild(createFilterHeader('Valgte filter', filterbox));
  body.appendChild(filterbox);
}

function populateNavBar() {
  createSelectedFiltersBox();
  createFilterBox(years);
  createFilterBox(kommuner);
  createFilterBox(indikatorer);
}
