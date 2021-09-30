const visObject = {
  options: {
    chart_type: {
      type: "string",
      display: "select",
      label: "1. Select Trendline Type",
      default: "line",
      values: [{ Line: "line" }, {Bar: "column"}, {Spline: "spline"}, {Area: "area"}],
    },
    line_color: {
      type: "string",
      display: "color",
      label: "2. Choose Trendline Color",
      default: "#3259f9",
    },
    is_human_readable: {
      type: "boolean",
      label: "3. Toggle for Readable Number",
      default: false,
    },
    is_percentage_number: {
      type: "boolean",
      label: "4. Toggle for Percentage Number",
      default: false,
    },
    positive_is_bad: {
      type: "boolean",
      label: "5. Toggle for Positive Value is Bad or not?",
      default: false,
    },
    is_step_line: {
      type: "boolean",
      label: "6. Toggle for Step for Line Chart",
      default: false,
    },
  },
  create: function (element, config) {
    element.innerHTML = `
      <style>
      .highcharts-title {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 18px;
        margin-bottom: 10px;
      }
      .highcharts-metrics-value-latest {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 50px;
      }
      .highcharts-subtitle {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 14px;
        font-style: italic;
      }
      .highcharts-axis-title {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
      }
      </style>
      <figure class="highcharts-figure">
      <div id="container"></div>
      <p class="highcharts-description">
      </p>
      </figure>
      `;
  },
  updateAsync: function (
    data,
    element,
    config,
    queryResponse,
    details,
    done
  ) {

    var dataRecords = generateDataRecords(data);

    var viewName = queryResponse.fields.dimensions[0].view;
    var xHeaderName = viewName + "._date_date";

    dataRecords.forEach(function(d){
      d[xHeaderName] = Date.parse(d[xHeaderName])
    })

    function generateHighChartsDataSeries(dataRecordsInput) {
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

    dataHighCharts = generateHighChartsDataSeries(dataRecords)
    var highchartsFigureWidth = document.getElementsByClassName("highcharts-figure")[0].offsetWidth;
    var pointWidthResponsive = parseInt((highchartsFigureWidth / dataHighCharts.length)*0.8)
    var metricsTitle = queryResponse.fields.measures[0].label_short;
    var metricsValueLatestDateMilliseconds = dataHighCharts[0][0];
    var formatDateISO = d3.timeFormat("%Y-%m-%d");
    var metricsValueLatestDate = formatDateISO(new Date(metricsValueLatestDateMilliseconds));
    var metricsValueLatest = dataHighCharts[0][1];

    function calculateGrowthRate(dayLengthInput, datasetInput) {
      if (dayLengthInput >= 7 && dayLengthInput < 31) {
        var metricsValueLatestBefore7d = null || datasetInput[6][1];
        var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
        var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "⬇" : "⬆") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
        return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, null, 'N/A', null, 'N/A', null, 'N/A']
      } else if (dayLengthInput >=31 && dayLengthInput < 91) {
        var metricsValueLatestBefore7d = null || datasetInput[6][1];
        var metricsValueLatestBefore30d = null || datasetInput[29][1];
        var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
        var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "⬇" : "⬆") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
        var metricsMetaComparisonMoM = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore30d)) / parseFloat(metricsValueLatestBefore30d);
        var metricsMetaComparisonMoMFormatted = (metricsMetaComparisonMoM < 0 ? "⬇" : "⬆") + (metricsMetaComparisonMoM * 100).toFixed(2) + "%";
        return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, metricsMetaComparisonMoM, metricsMetaComparisonMoMFormatted, null, 'N/A', null, 'N/A']
      } else if (dayLengthInput >= 91 && dayLengthInput < 366) {
        var metricsValueLatestBefore7d = null || datasetInput[6][1];
        var metricsValueLatestBefore30d = null || datasetInput[29][1];
        var metricsValueLatestBefore90d = null || datasetInput[89][1];
        var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
        var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "⬇" : "⬆") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
        var metricsMetaComparisonMoM = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore30d)) / parseFloat(metricsValueLatestBefore30d);
        var metricsMetaComparisonMoMFormatted = (metricsMetaComparisonMoM < 0 ? "⬇" : "⬆") + (metricsMetaComparisonMoM * 100).toFixed(2) + "%";
        var metricsMetaComparisonQoQ = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore90d)) / parseFloat(metricsValueLatestBefore90d);
        var metricsMetaComparisonQoQFormatted = (metricsMetaComparisonQoQ < 0 ? "⬇" : "⬆") + (metricsMetaComparisonQoQ * 100).toFixed(2) + "%";
        return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, metricsMetaComparisonMoM, metricsMetaComparisonMoMFormatted, metricsMetaComparisonQoQ, metricsMetaComparisonQoQFormatted, null, 'N/A']
      } else if (dayLengthInput >= 366) {
        var metricsValueLatestBefore7d = null || datasetInput[6][1];
        var metricsValueLatestBefore30d = null || datasetInput[29][1];
        var metricsValueLatestBefore90d = null || datasetInput[89][1];
        var metricsValueLatestBefore365d = null || datasetInput[364][1];
        var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
        var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "⬇" : "⬆") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
        var metricsMetaComparisonMoM = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore30d)) / parseFloat(metricsValueLatestBefore30d);
        var metricsMetaComparisonMoMFormatted = (metricsMetaComparisonMoM < 0 ? "⬇" : "⬆") + (metricsMetaComparisonMoM * 100).toFixed(2) + "%";
        var metricsMetaComparisonQoQ = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore90d)) / parseFloat(metricsValueLatestBefore90d);
        var metricsMetaComparisonQoQFormatted = (metricsMetaComparisonQoQ < 0 ? "⬇" : "⬆") + (metricsMetaComparisonQoQ * 100).toFixed(2) + "%";
        var metricsMetaComparisonYoY = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore365d)) / parseFloat(metricsValueLatestBefore365d);
        var metricsMetaComparisonYoYFormatted = (metricsMetaComparisonYoY < 0 ? "⬇" : "⬆") + (metricsMetaComparisonYoY * 100).toFixed(2) + "%";
        return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, metricsMetaComparisonMoM, metricsMetaComparisonMoMFormatted, metricsMetaComparisonQoQ, metricsMetaComparisonQoQFormatted, metricsMetaComparisonYoY, metricsMetaComparisonYoYFormatted]
      }
    }

    growthRateArray = calculateGrowthRate(dataHighCharts.length, dataHighCharts)

    Highcharts.chart('container', {
      chart: {
        zoomType: 'x',
        panning: 'true',
        panKey: 'shift',
        type: config.chart_type
      },
      title: {
        text: metricsTitle
        + '<br>'
        + '<br>'
        + '<br>'
        + '<p class="highcharts-metrics-value-latest">' + humanReadableNumber(percentageNumber(metricsValueLatest.toFixed(4), config.is_percentage_number), config.is_human_readable)
        + '</p>'
        ,
        align: 'left',
      },
      subtitle: {
        text:  'on ' + metricsValueLatestDate
          + '<br>'
          + '<br>' + '<p style="color:' + dynamicColor(growthRateArray[0], config.positive_is_bad) + '">' + growthRateArray[1] + '</p>' + ' WoW'
          + "    " + '<p style="color:' + dynamicColor(growthRateArray[2], config.positive_is_bad) + '">' + growthRateArray[3] + '</p>' + ' MoM'
          + '<br>' + '<p style="color:' + dynamicColor(growthRateArray[4], config.positive_is_bad) + '">' + growthRateArray[5] + '</p>' + ' QoQ'
          + "    " + '<p style="color:' + dynamicColor(growthRateArray[6], config.positive_is_bad) + '">' + growthRateArray[7] + '</p>' + ' YoY', 
        align: 'left',
        useHMTL: true
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: undefined
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        text: "Legacy Version"
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: [0, 0, 0, 200],
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            enabled: false
          },
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: [
        {
        id: 'default',
        color: config.line_color,
        data: dataHighCharts,
        pointWidth: pointWidthResponsive,
        step: config.is_step_line,
        },
    ]
    });

    done();
  },
};

looker.plugins.visualizations.add(visObject);
