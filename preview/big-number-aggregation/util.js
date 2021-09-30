var generateDataRecords = (dataIndexFormat) => {
  //HELP: convert looker response data into common records format
  //NOTE: used by metrics-widget__big-number
  var dataRecords = []
  dataIndexFormat.forEach(d=>{
    obj = {}
    var headerName = Object.keys(d);
    headerName.forEach(h=>{
      obj[h] = d[h].value
    });
    dataRecords.push(obj)
  })
  return dataRecords  
}

function generateHighChartsDataSeries(dataRecordsInput) {
  //HELP: convert DataRecords into HighChart DataSeries without Header/Column Name
  //NOTE: used by metrics-widget__big-number
  dataHighCharts = []
  dataRecordsInput.forEach(function(d) {
    var rowValueOnly = []
    var columnNames = Object.keys(d);
    // console.log(columnNames);
    columnNames.forEach(function(c) {
      rowValueOnly.push(d[c])
    })
    dataHighCharts.push(rowValueOnly)
  });
  return dataHighCharts;
}

function getFieldMetaInfoValue(queryResponse, fieldName) {
  //HELP: look up meta info of looker fields
  // @queryResponse: looker Response
  // @fieldName: viewName.fieldTechicalName
  // @return: array of metainfo of this field
  const queryResponseFieldsDimensions = queryResponse.fields.dimensions
  const queryResponseFieldsMeasures = queryResponse.fields.measures

  f_dimension = queryResponseFieldsDimensions.filter(d=>{
    return d.name == fieldName
  })

  f_measure = queryResponseFieldsMeasures.filter(d=>{
    return d.name == fieldName
  })

  var f = f_dimension.length == 0 ? f_measure : f_dimension

  return f
}

function calculateAggregatedValue(inputArray1D, aggregationType) {
  // HELP
  // @aggregationType - String: sum, average, min, max, median
  switch (aggregationType) {
    case "sum":
      return d3.sum(inputArray1D);
      break;
    case "average":
      return d3.mean(inputArray1D);
      break;
    case "min":
      return d3.min(inputArray1D);
      break;
    case "max":
      return d3.max(inputArray1D);
      break;
    case "median":
      return d3.median(inputArray1D);
      break;
    case "major-between":
      return ( d3.quantile(inputArray1D, 0.25) + " ~ " + d3.quantile(inputArray1D, 0.75));
      break;
  }
}

function humanReadableNumber(value, is_human_readable) {
  if (is_human_readable == true) {
    return numeral(value).format("0.00a")
  } else {
    return value
  }
}

function percentageNumber(value, is_percentage_number) {
  if (is_percentage_number == true) {
    return numeral(value).format("0.00%")
  } else {
    return value
  }
}

function translateAggregationType(aggregationType) {
  switch (aggregationType) {
    case "sum":
      return "Total";
      break;
    case "average":
      return "Average";
      break;
    case "max":
      return "Max";
      break;
    case "min":
      return "Min";
      break;
    case "median":
      return "Median";
      break;
  }
}