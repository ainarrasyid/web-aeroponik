const firebaseConfig = {
  apiKey: "AIzaSyBexRjuT80GNHcUYdanVP1ObEqnleOFe2E",
  authDomain: "latihan-ta-85ba4.firebaseapp.com",
  databaseURL:
    "https://latihan-ta-85ba4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "latihan-ta-85ba4",
  storageBucket: "latihan-ta-85ba4.appspot.com",
  messagingSenderId: "389108660217",
  appId: "1:389108660217:web:48971790da27bb86d6ef28",
  measurementId: "G-X7WGDRJK0Z",
};

let lamp = document.getElementById("lamp");
let temp = document.getElementById("temp");
let humidity = document.getElementById("humid");
let waterLevel = document.getElementById("water");
let motorPump = document.getElementById("pump");
let tanggalan = document.getElementById("date");
let waktu = document.getElementById("time");

let humidChart = document.getElementById("humidChart");
let tempChart = document.getElementById("tempChart");
let labels = [];
let tempData = [];
let humidData = [];
let dataToDownload = [];

let dateNow = new Date();
let monthList = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
tanggalan.innerHTML = `${dateNow.getDate()} ${
  monthList[dateNow.getMonth()]
} ${dateNow.getFullYear()}`;

console.log(dateNow.getDate());

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  waktu.innerHTML =
    ("0" + h).substr(-2) +
    ":" +
    ("0" + m).substr(-2) +
    ":" +
    ("0" + s).substr(-2);
}

setInterval(time, 1000);

firebase.initializeApp(firebaseConfig);
let database = firebase.database();

database.ref("data/realtime").on("value", (snapshot) => {
  let data = snapshot.val();
  //   console.log(data);
  lamp.innerHTML = data.growLight;
  temp.innerHTML = `${data.suhu.toFixed(2)} &#176C`;
  humidity.innerHTML = `${data.humid.toFixed(2)}%`;
  waterLevel.innerHTML = data.level;
  motorPump.innerHTML = data.pompa;
});

let humidGraphic = new Chart(humidChart, {
  type: "line",
  data: {
    labels: labels.slice(labels.length - 10, labels.length),
    datasets: [
      {
        label: "Kelembaban (%)",
        data: humidData.slice(humidData.length - 10, humidData.length),
        backgroundColor: ["rgba(43, 96, 27, 0.5)"],
        borderColor: ["rgba(43, 96, 27, 1)"],
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0.1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

let tempGraphic = new Chart(tempChart, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Suhu (Celcius)",
        data: tempData,
        backgroundColor: ["rgba(43, 96, 27, 0.5)"],
        borderColor: ["rgba(43, 96, 27, 1)"],
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0.1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

database.ref("data/log").on("child_added", (snapshot) => {
  let tanggal = new Date();
  let data = snapshot.val();
  let dd = tanggal.getDate();
  let mm = tanggal.getMonth();
  let yyyy = tanggal.getFullYear();
  let hh = tanggal.getHours() - 1;
  let m = tanggal.getMinutes();
  let waktu = new Date(yyyy, mm, dd, hh, m, 00, 00);
  let epochs = Math.floor(waktu / 1000);
  let timestamp = new Date(parseInt(data.timestamp) * 1000 - 25200000);

  // console.log(data);
  if (parseInt(data.timestamp) - 25200 >= epochs) {
    addData(
      humidGraphic,
      timestamp.toString().split(" ")[4].slice(0, 5),
      data.humid
    );
    addData(
      tempGraphic,
      timestamp.toString().split(" ")[4].slice(0, 5),
      data.suhu
    );
  }
});

database.ref("data/log").on("value", (snapshot) => {
  dataToDownload = [];
  for (let value of Object.entries(snapshot.val())) {
    dataToDownload.push(value[1]);
  }
  // console.log(dataToDownload);
});

const download = function (data) {
  const blob = new Blob([data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "Data-Sensor.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const objectToCsv = function () {
  const csvRows = [];
  const headers = Object.keys(dataToDownload[0]);
  csvRows.push(headers.join(","));

  for (const row of dataToDownload) {
    const values = headers.map((header) => {
      const escaped = ("" + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  // console.log(csvRows.join("\n"));
  download(csvRows.join("\n"));
};

(function () {
  const button = document.getElementById("downloadCSV");
  button.addEventListener("click", objectToCsv);
})();
