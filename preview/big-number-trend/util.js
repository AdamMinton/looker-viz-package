var generateDataRecords = (dataIndexFormat) => {
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
  dataHighCharts = []
  dataRecordsInput.forEach(function(d) {
    var rowValueOnly = []
    var columnNames = Object.keys(d);
    columnNames.forEach(function(c) {
      rowValueOnly.push(d[c])
    })
    dataHighCharts.push(rowValueOnly)
  });
  return dataHighCharts;
}

var calculateGrowthVsNPeriodAgo = (inputDataArraySortBasedOnTimeDescending, nPeriodAgo) => {
  if (inputDataArraySortBasedOnTimeDescending.length > nPeriodAgo && nPeriodAgo != 0) {
    var valueCurrent = parseFloat(inputDataArraySortBasedOnTimeDescending[0])
    var valueNPeriodAgo = parseFloat(inputDataArraySortBasedOnTimeDescending[nPeriodAgo])
    var valueGrowth = valueCurrent - valueNPeriodAgo
    var valueGrowthFormatted = "(" + numeral(valueGrowth).format('0.00a') + ")"
    var valueGrowthRate = valueNPeriodAgo != 0 ? valueGrowth / valueNPeriodAgo : 1.0
    var valueGrowthRateFormatted = (valueGrowth < 0 ? "⬇" : "⬆") + (valueGrowthRate*100).toFixed(2) + "%"
    return [valueGrowth, valueGrowthFormatted, valueGrowthRate, valueGrowthRateFormatted]
  } else {
    return [NaN, NaN, NaN, NaN]
  }
}

function movingAverage(values, N) {
  let i = 0;
  let sum = 0;
  const means = new Float64Array(values.length).fill(NaN);
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    sum += values[i];
  }
  for (let n = values.length; i < n; ++i) {
    sum += values[i];
    means[i] = sum / N;
    sum -= values[i - N + 1];
  }
  return means;
}

var dynamicColor = (value, positive_is_bad) => {
  if (positive_is_bad == false) {
    if (value <= 0) {
      return "#FF5722";
    } else {
      return "#1db954";
    }
  } else {
    if (value <= 0) {
      return "#1db954";
    } else {
      return "#FF5722";
    }
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

function getFieldMetaInfoValue(queryResponse, fieldName) {
  const queryResponseFieldsMeasures = queryResponse.fields.measures
  f_measure = queryResponseFieldsMeasures.filter(d=>{
    return d.name == fieldName
  })

  return f_measure
}