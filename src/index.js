const fs = require("fs");
const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "../public")));

// accessing index-html file
const staticHtml = path.join(__dirname, "../public/home.html");
const homeFile = fs.readFileSync(staticHtml, "utf-8");

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
// function to replace html data with realtimedata
function replaceValue(homeFileData, orgVal) {
  let changeData = homeFileData.replace("{%current_temp%}", orgVal.current.temp_c);
  changeData = changeData.replace("{%place%}", orgVal.location.name);
  changeData = changeData.replace("{%state%}", orgVal.location.region);
  changeData = changeData.replace("{%current_icon%}", orgVal.current.condition.icon);

  // future hours forcast from current time
  for(let i=1; i<=5 ;i++){
    let hrr = d.getHours();
    hrr = (hrr + 2*i);
    let forecastIndex = 0; // Initialize with the current day's forecast data

  // Check if the calculated hour goes beyond 23 (into the next day)
  if (hrr >= 24) {
    hrr -= 24; // Normalize the hour
    forecastIndex = 1; // Use forecast data for the next day
  }

    const periods = hrr < 12 ? "A.M" : "P.M";

    let hrr12 = hrr > 12 ? hrr - 12 : hrr;

    if (hrr === 0) {
      hrr12 = 12;
    }

   
    changeData = changeData.replace(`{%current_temp_${i}%}`, orgVal.forecast.forecastday[forecastIndex].hour[ hrr].temp_c);
    changeData = changeData.replace(`{%current_icon_${i}%}`, orgVal.forecast.forecastday[forecastIndex].hour[ hrr].condition.icon);
  
    changeData = changeData.replace(`{%current_hour_${i}%}`, hrr12);
    changeData = changeData.replace(`{%periods_${i}%}`, periods);
  }
  // forecast update
  for(i=1; i<=2; i++){
    const nextDayIndex = (d.getDay() + i) % 7; //to get days of week
    
    if(d.getDate()+i === 1){            //setting next month 
      d.setMonth(d.getMonth()+1);
    }

    changeData = changeData.replace(`{%day${i+1}_weekDay}`, weekands[nextDayIndex]);
    changeData = changeData.replace(`{%day${i+1}_date}`, [d.getDate()+i]);
    changeData = changeData.replace(`{%day${i+1}_month}`, months[d.getMonth()]);
    changeData = changeData.replace(`{%day${i+1}_humidity}`, orgVal.forecast.forecastday[i].day.avghumidity);
    changeData = changeData.replace(`{%day${i+1}_icon%}`, orgVal.forecast.forecastday[i].day.condition.icon);
    changeData = changeData.replace(`{%day${i+1}_minTemp%}`, Math.round(orgVal.forecast.forecastday[i].day.mintemp_c));
    changeData = changeData.replace(`{%day${i+1}_maxTemp%}`, Math.round(orgVal.forecast.forecastday[i].day.maxtemp_c));
  }
  return changeData;
}

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.weatherapi.com/v1/forecast.json?key=2d6d75692baf4c25bf815310231309&q=sonipat,haryana&days=7&aqi=yes&alerts=yes",
    );

    if (response.status === 200) {
      res.writeHead(200, { "Content-Type": "text/html" });
      const DataArr = [response.data];
      // console.log(DataArr[0].forecast.forecastday[0].hour[0].temp_c);
      const RealTimeData = DataArr.map((value) => {
        return replaceValue(homeFile, value);
      }).join("");
      res.write(RealTimeData);
      res.end();
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
