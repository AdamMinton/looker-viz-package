// ANCHOR: Global Input Parameters
// NOTE: this is the naming to follow in .lkml

const { tidy, select, distinct, arrange, desc } = Tidy;

const visObject = {
  options: {
    bar_color: {
      type: "string",
      display: "color",
      label: "1. Choose Primary Color",
      default: "#3259F9",
    },
    is_human_readable: {
      type: "boolean",
      label: "2. Toggle for Readable Number",
      default: false,
    },
    is_percentage_number: {
      type: "boolean",
      label: "3. Toggle for Percentage Number",
      default: false,
    },
    is_showing_data_label: {
      type: "boolean",
      label: "4 Toggle for Show Data Label",
      default: true,
    },
    aggregation_type: {
      type: "string",
      display: "select",
      label: "5. Select Aggregation Type",
      default: "sum",
      values: [
        { sum: "sum" },
        { average: "average" },
        { min: "min" },
        { max: "max" },
        { median: "median" },
      ],
    },
    prefix: {
      type: "string",
      display: "text",
      label: "6. Prefix of Metrics",
      default: " "
    },
    suffix: {
      type: "string",
      display: "text",
      label: "7. Suffix of Metrics",
      default: " "
    },
    orientation: {
      type: "string",
      display: "select",
      label: "8. Orientation",
      default: "bar",
      values: [
        {horizontal: "bar"},
        {vertical: "column"}
      ]
    }
  },
  create: function (element, config) {
    element.innerHTML = `
    <style>
      .highcharts-figure #container{
        height: 90%;
        width: 90%;
        margin-left: -20px;
        position: absolute;
      }
      .highcharts-figure #container:hover {
      }
      
      .highcharts-figure #container .highcharts-container {
      }
      
      .highcharts-title {      
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 24px !important;
        margin-bottom: 10px;
        font-weight: 400;
      }
      
      .highcharts-metrics-value-latest {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 50px;
        line-height: 52px;
      }
      
      .highcharts-subtitle {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 14px;
      }

      .highcharts-subtitle text {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 14px;
        fill: #999999 !important;
      }
      
      .highcharts-axis-title {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
      }

      .highcharts-axis-labels {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
      }

      .highcharts-axis-labels .highcharts-yaxis-labels {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        fill: #999999 !important;
      }

      .highcharts-axis-labels .highcharts-xaxis-labels {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        fill: #999999 !important;
      }
      
      .highcharts-metrics-by {
        font-size: 14px;
        font-style: italic;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        fill: #999999 !important;
      }
      
      .highcharts-metrics-value-prefix {
        font-size: 14px;
        font-style: Italic;
      }

      .highcharts-metrics-value-suffix {
        font-size: 14px;
        font-style: italic;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        fill: #999999 !important;
      }

      .highcharts-data-label {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        font-weight: 200;
      }


      .highcharts-credits {
        font-style: italic;
      }
      
      </style>
      <figure class="highcharts-figure">
      <div id="container"></div>
      </figure>
    `;
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    this.clearErrors();
    var errorMessage = `
    Instructions🧭
    This viz package requires
    1 dimension in named _breakdown in .lkml
    1 measure
    Please contact Hong Wu(@hongkuiw) if you still facing errors
    `;

    if (
      queryResponse.fields.dimensions.length == 0 ||
      (queryResponse.fields.dimensions.length == 1 &&
        queryResponse.fields.measures.length > 1)
    ) {
      return;
    }

    dataInput = queryResponse.data;
    var dataRecords = generateDataRecords(dataInput);
    var highchartsFigureHeight = document.getElementById("container").offsetHeight;
    var pointHeightResponsive = parseInt((highchartsFigureHeight / dataRecords.length) * 0.45);

    var viewName = queryResponse.fields.dimensions.length > 0 ? queryResponse.fields.dimensions[0].view : queryResponse.fields.measures[0].view;
    var dimensionName = queryResponse.fields.dimensions[0].name;
    dimensionMetaInfoValue = getFieldMetaInfoValue(queryResponse, dimensionName);
    breakdownName = dimensionMetaInfoValue[0].label_short;
    breakdownDescription = dimensionMetaInfoValue[0].description;

    var measureName = queryResponse.fields.measures[0].name;

    measureMetaInfoValue = getFieldMetaInfoValue(queryResponse, measureName);

    metricsTitle = measureMetaInfoValue[0].label_short;
    chartTitle = metricsTitle;

    dataRecordsSortDescending = tidy(dataRecords, arrange((a, b) => b.measureName - a.measureName));

    var numberBreakdowns = dataRecordsSortDescending.length;

    var dataHighCharts = generateHighChartsDataSeries(dataRecordsSortDescending);

    var dataBreakdowns = [];
    var dataSeries = [];
    dataHighCharts.forEach((d) => {
      dataBreakdowns.push(d[0]);
      dataSeries.push(d[1]);
    });

    metricsValueAggregated = calculateAggregatedValue(dataSeries, config.aggregation_type);

    Highcharts.chart("container", {
      chart: {
        zoomType: "x",
        panning: "true",
        panKey: "shift",
        type: config.orientation,
        events: {
          load: function () {
            this.title.on("mouseover", (e) => {
              myLabel = this.renderer
                .label(
                  measureMetaInfoValue[0]["description"],
                  e.x,
                  e.y,
                  "rectangle"
                )
                .css({ color: "#FFFFFF" })
                .attr({
                  fill: "#181818",
                  "font-family": "Circular Spotify Text, Helvetica, Arial, sans-serif",
                })
                .add()
                .toFront();
            });
            this.title.on("mouseout", (e) => {
              if (myLabel) {
                myLabel.destroy();
              }
            });
          },
        },
      },
      title: {
        text:
          chartTitle +
          '<br> <p class="highcharts-metrics-by">by ' +
          breakdownName +
          "</p>" +
          "<br>" +
          "<br>" +
          "<br>" +
          "<p class='highcharts-metrics-value-prefix'>" + translateAggregationType(config.aggregation_type) + ": </p>" +
          '<p class="highcharts-metrics-value-latest">' + config.prefix 
          + humanReadableNumber(percentageNumber(metricsValueAggregated, config.is_percentage_number),config.is_human_readable) 
          + '<span class="highcharts-metrics-value-suffix">' + config.suffix + '</span>'
          +
          "</p>",
        align: "left",
      },
      subtitle: {
      },
      xAxis: {
        categories: dataBreakdowns,
        title: {
          text: undefined,
        },
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          overflow: "justify",
          enable: false,
        },
      },
      tooltip: {
        valuePrefix: metricsTitle + ": ",
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: config.is_showing_data_label,
            formatter: function() {
              return humanReadableNumber(percentageNumber(parseFloat(this.y), config.is_percentage_number),config.is_human_readable) 
            }
          },
          color: config.bar_color
        },
        column: {
          dataLabels: {
            enabled: config.is_showing_data_label,
            formatter: function() {
              return humanReadableNumber(percentageNumber(parseFloat(this.y), config.is_percentage_number),config.is_human_readable) 
            }
          },
          color: config.bar_color
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: true, 
        text: "Metrics Widget by Hong"
      },
      exporting: {
        enabled: false
      },
      series: [
        {
          pointWidth: pointHeightResponsive,
          name: breakdownName,
          data: dataSeries,
        },
      ],
      tooltip: {
        formatter: function() {
          return this.series.name + ":" + '<br>' + humanReadableNumber(percentageNumber(parseFloat(this.y), config.is_percentage_number),config.is_human_readable) 
        },
        style: {
          color: "#000000",
          fontFamily: '"Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif'
        }
      }
    });

    done();
  },
};

looker.plugins.visualizations.add(visObject);
