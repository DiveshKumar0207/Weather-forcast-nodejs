const fs = require("fs");
const express = require("express");
const axios = require("axios");
const path = require("path");
var hbs = require("hbs");

const port = 8080;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();
app.use(express.static(staticPath));

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath, (err) => {});

const d = new Date();
const weekands = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// prettier-ignore
function futureDataUpdate(DataArr) {

  const futureData =[];

  for(i=1; i<=2; i++){
    const nextDayIndex = (d.getDay() + i) % 7; //to get days of week

    if(d.getDate()+i === 1){            //setting next month
      d.setMonth(d.getMonth()+1);
    }


    futureData.push({
      day_weekDay: weekands[nextDayIndex],
      day_date: [d.getDate()+i],
      day_month: months[d.getMonth()],
      day_humidity: DataArr[0].forecast.forecastday[i].day.avghumidity,
      day_icon : DataArr[0].forecast.forecastday[i].day.condition.icon,
      day_minTemp : Math.round(DataArr[0].forecast.forecastday[i].day.mintemp_c),
      day_maxTemp : Math.round(DataArr[0].forecast.forecastday[i].day.maxtemp_c),


    })
    // changeData = changeData.replace(`{%day${i+1}_weekDay}`, weekands[nextDayIndex]);
    // changeData = changeData.replace(`{%day${i+1}_date}`, [d.getDate()+i]);
    // changeData = changeData.replace(`{%day${i+1}_month}`, months[d.getMonth()]);
    // changeData = changeData.replace(`{%day${i+1}_humidity}`, orgVal.forecast.forecastday[i].day.avghumidity);
    // changeData = changeData.replace(`{%day${i+1}_icon%}`, orgVal.forecast.forecastday[i].day.condition.icon);
    // changeData = changeData.replace(`{%day${i+1}_minTemp%}`, Math.round(orgVal.forecast.forecastday[i].day.mintemp_c));
    // changeData = changeData.replace(`{%day${i+1}_maxTemp%}`, Math.round(orgVal.forecast.forecastday[i].day.maxtemp_c));
  }
  return futureData;

}

function currentDataUpdate(DataArr) {
  const currentTimeData = [];

  currentTimeData.push({
    current_temp: DataArr[0].current.temp_c,
    place: DataArr[0].location.name,
    state: DataArr[0].location.region,
    current_icon: DataArr[0].current.condition.icon,
  });
  return currentTimeData;
}

// prettier-ignore
function futureHoursUpdate(DataArr) {
  const changeData = [];
  for (let i = 1; i <= 5; i++) {
    let hrr = d.getHours();
    hrr = hrr + 2 * i;
    let forecastIndex = 0; // Initialize with the current day's forecast data

    // Check if the calculated hour goes beyond 23 (into the next day)
    if (hrr >= 24) {
      hrr -= 24;
      forecastIndex = 1; // Use forecast data for the next day
    }

    const periods = hrr < 12 ? "A.M" : "P.M";

    let hrr12 = hrr > 12 ? hrr - 12 : hrr;

    if (hrr === 0) {
      hrr12 = 12;
    }

    changeData.push({
      current_temp_1: DataArr[0].forecast.forecastday[forecastIndex].hour[hrr].temp_c,
      current_icon_1: DataArr[0].forecast.forecastday[forecastIndex].hour[hrr].condition.icon,
      current_hour_1: hrr12,
      periods_1: periods,
    });
  }
  return changeData;
}

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.weatherapi.com/v1/forecast.json?key=2d6d75692baf4c25bf815310231309&q=sonipat,haryana&days=7&aqi=yes&alerts=yes",
    );

    if (response.status === 200) {
      var DataArr = [response.data];

      const RealTimeData = currentDataUpdate(DataArr);
      const futureHoursData = futureHoursUpdate(DataArr);
      const futureDaysData = futureDataUpdate(DataArr);

      res.render("home", {
        HbsRealTimeData: RealTimeData,
        HbsfutureHoursData: futureHoursData,
        HbsfutureDaysData: futureDaysData,
      });
    } else {
      console.error(
        "Weather API request failed with status code",
        response.status,
      );
      res.status(400).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
