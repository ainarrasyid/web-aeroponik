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

let tanggal = document.getElementById("date");
let waktu = document.getElementById("time");

let now = new Date();
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
tanggal.innerHTML = `${now.getDay() - 2} ${
  monthList[now.getMonth()]
} ${now.getFullYear()}`;

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
  temp.innerHTML = data.suhu.toFixed(2);
  humidity.innerHTML = data.humid.toFixed(2);
  waterLevel.innerHTML = data.level;
  motorPump.innerHTML = data.pompa;
});

// database.ref("data/log").on("value", (snapshot) => {
//   let data = snapshot.val();
// //   console.log(data);
// });
