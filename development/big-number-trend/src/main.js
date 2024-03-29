//Dependencies:
//https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js
//https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js
//https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js
//https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js
//https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.2.1/highcharts.js
//https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.2.1/modules/accessibility.min.js
//https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.2.1/modules/data.min.js
//https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.2.1/modules/export-data.min.js
//https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.2.1/modules/exporting.min.js
//https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.2.1/highcharts-more.min.js

//https://cdn.jsdelivr.net/gh/hongkuiw/looker-viz-package/preview/big-number-trend/util.js
//https://cdn.jsdelivr.net/npm/d3-array@3.0.1/dist/d3-array.min.js
//https://www.unpkg.com/@tidyjs/tidy/dist/umd/tidy.min.js

// ANCHOR: Global Input Parameters
// NOTE: this is the naming to follow in .lkml

import * as utils from "./util.js";
import * as d3 from "d3";
import * as Highcharts from "highcharts";

const visObject = {
  options: {
    chart_type: {
      type: "string",
      display: "select",
      label: "1. Select Line Chart Style",
      default: "line",
      values: [
        { Line: "line" },
        { Bar: "column" },
        { Spline: "spline" },
        { Area: "area" },
      ],
    },
    is_enable_marker: {
      type: "boolean",
      label: "1.1. Toggle for Marker",
      default: false,
    },
    line_color: {
      type: "string",
      display: "color",
      label: "2. Choose Primary Color",
      default: "#3259F9",
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
    is_show_moving_average_line: {
      type: "boolean",
      label: "7. Toggle for Moving Average Line?",
      default: false,
    },
    line_color_secondary: {
      type: "string",
      display: "color",
      label: "7.1 Choose Secondary Color",
      default: "#85E0FF",
    },
    line_style_secondary: {
      type: "string",
      display: "select",
      label: "7.2 Choose Secondary Line Style",
      default: "Solid",
      values: [{ Solid: "Solid" }, { Dash: "Dash" }, { Dot: "Dot" }],
    },
    moving_average_window: {
      type: "string",
      display: "select",
      label: "7.3 Select window size for Moving Average Line",
      default: "7",
      values: [
        { 3: "3" },
        { 4: "4" },
        { 6: "6" },
        { 7: "7" },
        { 14: "14" },
        { 30: "30" },
      ],
    },
    prefix: {
      type: "string",
      display: "text",
      label: "8. Prefix of Metrics",
      default: " ",
    },
    suffix: {
      type: "string",
      display: "text",
      label: "9. Suffix of Metrics",
      default: " ",
    },
  },
  create: function (element, config) {
    element.innerHTML = `
      <style>
      .highcharts-figure #container{
        height: 90%;
        width: 90%;
        margin-left: -20px;
        position: absolute;
        // fully responsiveness
      }
      .highcharts-figure #container:hover {
      }
      
      .highcharts-figure #container .highcharts-container {
        // border-radius: 20px;
        // filter: drop-shadow(2px 2px 2px #999999);
      }
      
      .highcharts-title {
        // font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 24px !important;
        margin-bottom: 10px;
        font-weight: 400;
      }
      
      .highcharts-metrics-value-latest {
        // font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 50px;
        line-height: 52px;
      }
      
      .highcharts-subtitle {
        // font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 14px;
      }
      
      .highcharts-subtitle text {
        // font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 14px;
        fill: #999999 !important;
      }
      
      .highcharts-axis-title {
        // font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
      }
      
      .highcharts-axis-labels {
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
      }
      
      .highcharts-axis-labels .highcharts-yaxis-labels {
        // font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        font-family: "Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
        fill: #999999 !important;
      }
      
      .highcharts-axis-labels .highcharts-xaxis-labels {
        // font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
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
      
      .highcharts-as-of-date {
        font-size: 12px;
        font-style: italic;
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
    1 dimension in Date ISO format (yyyy-mm-dd)
    e.g.: 2021-01-03
    1 measure
    Please contact Hong Wu(@hongkuiw) if you still facing errors
    `;

    if (
      queryResponse.fields.dimensions.length == 0 ||
      (queryResponse.fields.dimensions.length == 1 &&
        queryResponse.fields.measures.length > 1)
    ) {
      console.error(errorMessage);
      return;
    }

    function prepareChartInputParameters(data, queryResponse) {
      var dataRecords = utils.generateDataRecords(data);
      var highchartsFigureWidth =
        document.getElementsByClassName("highcharts-figure")[0].offsetWidth;
      var pointWidthResponsive = parseInt(
        (highchartsFigureWidth / dataRecords.length) * 0.8
      );

      var viewName =
        queryResponse.fields.dimensions.length > 0
          ? queryResponse.fields.dimensions[0].view
          : queryResponse.fields.measures[0].view;
      var measureName = queryResponse.fields.measures[0].name;
      measureMetaInfoValue = utils.getFieldMetaInfoValue(
        queryResponse,
        measureName
      );

      var xHeaderName = queryResponse.fields.dimensions[0].name;
      //BUG: There has to be a better way to do this to know which dimension is the date field and what date type
      var xHeaderNameRoot = xHeaderName.split(".")[1].split("_");
      xHeaderNameRoot.pop();
      xHeaderNameRoot = xHeaderNameRoot.join("_");
      var xHeaderNameDate = viewName + "." + xHeaderNameRoot + "_date";
      var xHeaderNameMonth = viewName + "." + xHeaderNameRoot + "_month";
      var xHeaderNameQuarter = viewName + "." + xHeaderNameRoot + "_quarter";
      var xHeaderNameWeek = viewName + "." + xHeaderNameRoot + "_week";
      var xHeaderNameYear = viewName + "." + xHeaderNameRoot + "_year";
      switch (xHeaderName) {
        case xHeaderNameDate:
          dataRecords.forEach((d) => {
            d[xHeaderName] = Date.parse(d[xHeaderNameDate]);
          });
          break;
        case xHeaderNameWeek:
          dataRecords.forEach((d) => {
            d[xHeaderName] = Date.parse(d[xHeaderNameWeek]);
          });
          break;
        case xHeaderNameMonth:
          dataRecords.forEach((d) => {
            d[xHeaderName] = Date.parse(d[xHeaderNameMonth] + "-01");
          });
          break;
        case xHeaderNameQuarter:
          dataRecords.forEach((d) => {
            d[xHeaderName] = Date.parse(d[xHeaderNameQuarter] + "-01");
          });
          break;
        case xHeaderNameYear:
          dataRecords.forEach((d) => {
            d[xHeaderName] = Date.parse(d[xHeaderNameYear] + "-01-01");
          });
          break;
      }

      var dataRecordsSorted = dataRecords
        .slice()
        .sort((a, b) => d3.descending(a.xHeaderName, b.xHeaderName));
      dataHighCharts = utils.generateHighChartsDataSeries(dataRecordsSorted);
      var chartTitle = queryResponse.fields.measures[0].label_short;
      var asOfDate = data[0][xHeaderName]["value"];
      var asOfDateValue = dataRecordsSorted[0][measureName];

      var dataRecordsSorted1D = [];
      dataHighCharts.forEach((d) => {
        dataRecordsSorted1D.push(d[1]);
      });

      switch (xHeaderName) {
        case xHeaderNameDate:
          growthRateArrayWoW = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            7
          );
          growthRateArrayMoM = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            30
          );
          growthRateArrayQoQ = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            90
          );
          growthRateArrayYoY = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            365
          );
          break;
        case xHeaderNameWeek:
          growthRateArrayWoW = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            1
          );
          growthRateArrayMoM = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            4
          );
          growthRateArrayQoQ = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            12
          );
          growthRateArrayYoY = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            52
          );
          break;
        case xHeaderNameMonth:
          growthRateArrayWoW = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            0
          );
          growthRateArrayMoM = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            1
          );
          growthRateArrayQoQ = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            3
          );
          growthRateArrayYoY = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            12
          );
          break;
        case xHeaderNameQuarter:
          growthRateArrayWoW = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            0
          );
          growthRateArrayMoM = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            0
          );
          growthRateArrayQoQ = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            1
          );
          growthRateArrayYoY = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            4
          );
          break;
        case xHeaderNameYear:
          growthRateArrayWoW = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            0
          );
          growthRateArrayMoM = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            0
          );
          growthRateArrayQoQ = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            0
          );
          growthRateArrayYoY = utils.calculateGrowthVsNPeriodAgo(
            dataRecordsSorted1D,
            1
          );
          break;
      }

      var measureArray = [];
      var dataHighChartsMovingWindowAvgLine = [];

      if (dataHighCharts.length > 7) {
        dataHighCharts.map((d) => {
          measureArray.push(d[1]);
        });
        var measureArrayMovingWindowAvg = utils
          .movingAverage(measureArray, config.moving_average_window)
          .slice(config.moving_average_window - 1, -1);
        dataHighCharts.map((e, i) => {
          dataHighChartsMovingWindowAvgLine.push([
            e[0],
            measureArrayMovingWindowAvg[i],
          ]);
        });
      }

      return {
        measureMetaInfoValue: measureMetaInfoValue,
        chartTitle: chartTitle,
        xHeaderName: xHeaderName,
        asOfDateValue: asOfDateValue,
        asOfDate: asOfDate,
        growthRateArrayWoW: growthRateArrayWoW,
        growthRateArrayMoM: growthRateArrayMoM,
        growthRateArrayQoQ: growthRateArrayQoQ,
        growthRateArrayYoY: growthRateArrayYoY,
        dataHighCharts: dataHighCharts,
        dataHighChartsMovingWindowAvgLine: dataHighChartsMovingWindowAvgLine,
        pointWidthResponsive: pointWidthResponsive,
      };
    }

    var chartInputParameters = prepareChartInputParameters(data, queryResponse);
    var measureMetaInfoValue = chartInputParameters.measureMetaInfoValue;
    var chartTitle = chartInputParameters.chartTitle;
    var xHeaderName = chartInputParameters.xHeaderName;
    var asOfDateValue = chartInputParameters.asOfDateValue;
    var asOfDate = chartInputParameters.asOfDate;
    var growthRateArrayWoW = chartInputParameters.growthRateArrayWoW;
    var growthRateArrayMoM = chartInputParameters.growthRateArrayMoM;
    var growthRateArrayQoQ = chartInputParameters.growthRateArrayQoQ;
    var growthRateArrayYoY = chartInputParameters.growthRateArrayYoY;
    var dataHighCharts = chartInputParameters.dataHighCharts;
    var dataHighChartsMovingWindowAvgLine =
      chartInputParameters.dataHighChartsMovingWindowAvgLine;
    var pointWidthResponsive = chartInputParameters.pointWidthResponsive;

    Highcharts.chart("container", {
      chart: {
        zoomType: "x",
        panning: "true",
        panKey: "shift",
        type: config.chart_type,
        events: {
          load: function () {
            let myLabel;
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
                  "font-family":
                    "Circular Spotify Text, Helvetica, Arial, sans-serif",
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
          "<br>" +
          '<p class="highcharts-metrics-by">by ' +
          xHeaderName.split(".")[1].split("_")[1] +
          "</p>" +
          "<br>" +
          "<br>" +
          "<br>" +
          '<p class="highcharts-metrics-value-latest">' +
          config.prefix +
          utils.humanReadableNumber(
            utils.percentageNumber(
              asOfDateValue.toFixed(4),
              config.is_percentage_number
            ),
            config.is_human_readable
          ) +
          '<span class="highcharts-metrics-value-suffix">' +
          " " +
          config.suffix +
          "</span>",
        align: "left",
      },
      subtitle: {
        text:
          '<p class="highcharts-metrics-growth-rate" style="color:' +
          utils.dynamicColor(growthRateArrayWoW[0], config.positive_is_bad) +
          '">' +
          (growthRateArrayWoW[3] + growthRateArrayWoW[1]) +
          "</p>" +
          " WoW" +
          ";    " +
          '<p class="highcharts-metrics-growth-rate" style="color:' +
          utils.dynamicColor(growthRateArrayMoM[0], config.positive_is_bad) +
          '">' +
          (growthRateArrayMoM[3] + growthRateArrayMoM[1]) +
          "</p>" +
          " MoM" +
          "; <br>" +
          '<p class="highcharts-metrics-growth-rate" style="color:' +
          utils.dynamicColor(growthRateArrayQoQ[0], config.positive_is_bad) +
          '">' +
          (growthRateArrayQoQ[3] + growthRateArrayQoQ[1]) +
          "</p>" +
          " QoQ" +
          ";    " +
          '<p class="highcharts-metrics-growth-rate" style="color:' +
          utils.dynamicColor(growthRateArrayYoY[0], config.positive_is_bad) +
          '">' +
          (growthRateArrayYoY[3] + growthRateArrayYoY[1]) +
          "</p>" +
          " YoY" +
          "; <br>" +
          '<p class="highcharts-as-of-date"> as of ' +
          xHeaderName.split(".")[1].split("_")[1] +
          ": " +
          asOfDate +
          "</p>",
        align: "left",
        useHTML: false,
      },
      xAxis: {
        type: "datetime",
      },
      yAxis: {
        title: {
          text: undefined,
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: true,
        text: "Metrics Widget by Hong",
      },
      exporting: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [
                1,
                Highcharts.color(Highcharts.getOptions().colors[0])
                  .setOpacity(0)
                  .get("rgba"),
              ],
            ],
          },
          marker: {
            enabled: false,
          },
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      },

      series: [
        {
          id: "default",
          name: chartTitle,
          color: config.line_color,
          data: dataHighCharts,
          pointWidth: pointWidthResponsive,
          lineWidth: 3,
          step: config.is_step_line,
          marker: {
            enabled: config.is_enable_marker,
          },
        },
        {
          id: "movingWindowAvgLine",
          name:
            "Moving " +
            config.moving_average_window +
            xHeaderName.split(".")[1].split("_")[1].charAt(0) +
            " Avg. " +
            chartTitle,
          color: config.line_color_secondary,
          data: dataHighChartsMovingWindowAvgLine,
          pointWidth: pointWidthResponsive,
          lineWidth: 2,
          dashStyle: config.line_style_secondary,
          marker: {
            enabled: false,
          },
          visible: config.is_show_moving_average_line,
        },
      ],
      tooltip: {
        formatter: function () {
          return (
            this.series.name +
            ": " +
            utils.humanReadableNumber(
              utils.percentageNumber(
                parseFloat(this.y),
                config.is_percentage_number
              ),
              config.is_human_readable
            ) +
            "<br> on: " +
            new Date(this.x).toISOString().split("T")[0]
          );
        },
        style: {
          color: "#000000",
          fontFamily:
            '"Google Sans", Roboto, "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif',
        },
      },
    });
    done();
  },
};

looker.plugins.visualizations.add(visObject);
