export function generateDataRecords(dataIndexFormat) {
  var dataRecords = [];
  dataIndexFormat.forEach((d) => {
    let obj = {};
    var headerName = Object.keys(d);
    headerName.forEach((h) => {
      obj[h] = d[h].value;
    });
    dataRecords.push(obj);
  });
  return dataRecords;
}

export function generateHighChartsDataSeries(dataRecordsInput) {
  let dataHighCharts = [];
  dataRecordsInput.forEach(function (d) {
    var rowValueOnly = [];
    var columnNames = Object.keys(d);
    columnNames.forEach(function (c) {
      rowValueOnly.push(d[c]);
    });
    dataHighCharts.push(rowValueOnly);
  });
  return dataHighCharts;
}

export function getFieldMetaInfoValue(queryResponse, fieldName) {
  const queryResponseFieldsDimensions = queryResponse.fields.dimensions;
  const queryResponseFieldsMeasures = queryResponse.fields.measures;

  let f_dimension = queryResponseFieldsDimensions.filter((d) => {
    return d.name == fieldName;
  });

  let f_measure = queryResponseFieldsMeasures.filter((d) => {
    return d.name == fieldName;
  });

  var f = f_dimension.length == 0 ? f_measure : f_dimension;

  return f;
}
