const dispTime = document.querySelector("#dispTime");

// current time and day function
function getTime() {
  const d = new Date();
  const weekands = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  let hours = d.getHours();
  let minutes = d.getMinutes();
  const weekDay = weekands[d.getDay()];
  const periods = hours < 12 ? "A.M" : "P.M";

  hours = hours < 12 ? hours : hours - 12;
  if (hours === 0) {
    hours = 12;
  }
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutes} ${periods}, ${weekDay}`;
}

const CurrentTime = getTime();

// appending data to webpage

document.addEventListener("DOMContentLoaded", () => {
  try {
    setInterval(() => {
      dispTime.innerHTML = CurrentTime;
    }, 100);
  } catch (error) {
    console.error(error);
  }
});
