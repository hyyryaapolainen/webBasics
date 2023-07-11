
var chartData = {}
var chart;

var jsonQuery = {
  "query": [
        {
          "code": "Vuosi",
          "selection": {
              "filter": "item",
              "values": [
                  "2000",
                  "2001",
                  "2002",
                  "2003",
                  "2004",
                  "2005",
                  "2006",
                  "2007",
                  "2008",
                  "2009",
                  "2010",
                  "2011",
                  "2012",
                  "2013",
                  "2014",
                  "2015",
                  "2016",
                  "2017",
                  "2018",
                  "2019",
                  "2020",
                  "2021"
              ]
          }
      },
      {
          "code": "Alue",
          "selection": {
              "filter": "item",
              "values": [
                  "SSS"
              ]
          }
      },
      {
          "code": "Tiedot",
          "selection": {
              "filter": "item",
              "values": [
                  "vaesto"
              ]
          }
      }
  ],
  "response": {
      "format": "json-stat2"
  }
}


const postAPIURL = `https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px`

const areaCodeURL = 'https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px'

async function findCountryCode(countryToFind)
{
    const stringToFind = (element) => element.toUpperCase() == countryToFind.toUpperCase();
    var index = 0;
    const munCodePromise = await fetch(areaCodeURL)
    .then((response) => 
    {
      const jsonPromise = response.json()
      .then((data) => {
        index = data.variables[1].valueTexts.findIndex(stringToFind)
        jsonQuery.query[1].selection.values = [data.variables[1].values[index]]
        setUpChart()
      })
    })
}

async function setUpDocument()
{
    const submitForm = document.getElementById("submit-data");
    const textInput = document.getElementById("input-area");

    const addData = document.getElementById("add-data")

    submitForm.addEventListener("click", function(event){
      event.preventDefault()
      try{
        findCountryCode(textInput.value)
      }   
      catch{
        console.log("Invalid name")
      }
    })
    addData.addEventListener("click" , function(event){

      addDataPointToChart();

    })
}
function addDataPointToChart()
{
  const values = chartData.datasets[0].values
  const latestYear = chartData.labels[chartData.labels.length-1]
  var newLabel = (parseInt(latestYear)+1).toString()
  chartData.labels.push(newLabel)
  chartData.datasets[0].values.push(calculateMeanValue(values))
  chart.update(chartData)

}
function calculateMeanValue(array)
{
  var sumDelta = 0;
  for (var i = 1; i < array.length; i++) {
    var delta = array[i] - array[i - 1];
    sumDelta += delta;
  }
  var meanDelta = sumDelta / (array.length - 1);
  var lastDataPoint = array[array.length - 1];
  var result = lastDataPoint + meanDelta;
  return result;
}

async function setUpChart() {

    const data = await getData();
    const tiedot = Object.values(data.dimension.Alue.category.label);
    const labels = Object.values(data.dimension.Vuosi.category.label);
    const values = data.value;
    
    tiedot.forEach((luku, index) => {
      let tietoTietue = []
      for(let i = 0; i < jsonQuery.query[0].selection.values.length; i++) {
          tietoTietue.push(values[i+ index])
      }
      tiedot[index] = {
          name: tiedot,
          values: tietoTietue
      }
     })

    chartData = {labels: labels, datasets: tiedot}

    chart = new frappe.Chart("#chart", {
      title: "ChartTest",
      data: chartData,
      type: "line",
      height: 450,
      colors: ['#7cd6fd']
    })
}

const getData = async () => {
  const res = await fetch(postAPIURL, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(jsonQuery)
  })
  if(!res.ok){
    return
  }
  const data = await res.json()
  return data

}

if (document.readyState !== "loading") {
  console.log("Document is ready!");
  setUpDocument()
  findCountryCode("Akaa")
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready after waiting!");
    setUpDocument()
    findCountryCode("Akaa")
  });
}
