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

function getFieldMetaInfoValue(queryResponse, fieldName) {
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
