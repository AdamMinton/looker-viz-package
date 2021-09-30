function generateDataRecords(dataIndexFormat) {
  var dataRecords = [];
  dataIndexFormat.forEach(function (d) {
    obj = {};
    // console.log(d.length);
    // console.log(Object.keys(d));
    var headerNames = Object.keys(d);
    // console.log(headerNames);
    headerNames.forEach(function (h) {
      // console.log(h)
      // console.log(d[h].value);
      obj[h] = d[h].value;
      // console.log(obj)
    });
    dataRecords.push(obj);
  });
  return dataRecords;
}

function dynamicColor(value, positive_is_bad) {
  if (positive_is_bad == false) {
    if (value <= 0) {
      return "#ff5722";
    } else {
      return "#1db954";
    }
  } else {
    if (value <= 0) {
      return "#1db954";
    } else {
      return "#ff5722";
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