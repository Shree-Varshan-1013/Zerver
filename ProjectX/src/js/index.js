import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "../css/style.css";

import Alpine from "alpinejs";
import persist from '@alpinejs/persist'
import flatpickr from "flatpickr";
import io from "socket.io-client";
import performance from "./components/performance";
import chart01 from "./components/chart-01";
import '../js/components/chatBot';
// import io from "socket.io-client";
import chart02 from "./components/chart-02";
import chart03 from "./components/chart-03";
import chart04 from "./components/chart-04";
import statistics from "./components/statistics";
import map01 from "./components/map-01";
import progress from "./components/progress";
import pieChartSecurity from "./components/piechart";
import heatMap from "./components/heatmap";
import animatedBar from "./components/animatedbar";
import { followingDotCursor } from "./components/followingDotCursor";
import securityLine from "./components/securitylinechart";
import healthPie from "./components/healthpie";
import allGraphs from "./components/allGraphs";
// import healthBar from "./components/animatedbar";

Alpine.plugin(persist)
window.Alpine = Alpine;
Alpine.start();

// function updateFetchedData(data) {
//   const socket = io("http://localhost:2018");

//   socket.on("connect", () => {

//     console.log("Connected to socket.io server " + socket.id);
//   });

//   socket.on('documentData', (sas) => {
//     console.log(sas);
//   })


//   // var data1 = null;
//   // socket.on("documentData", (data) => {
//   //   console.log(data.log_entry);
//   //   data1 = data.log_entry;
//   //   console.log(Alpine);
//   //   console.log(document.querySelector("[x-text='fetchedData']"));
//   //   Alpine.data(
//   //     document.querySelector("[x-text='fetchedData']"),
//   //     "fetchedData",
//   //     () => data1
//   //   );
//   // });

//   const myDiv = document.querySelector("#myDiv");
//   console.log("DIV "+myDiv);
//   if (myDiv) {
//     Alpine.data(myDiv, 'fetchedData', () => data);
//   }
// }

// // Simulating receiving data from some source
// const receivedData = { message: "Hello, world!" };

// // Update the fetchedData property with the received data
// updateFetchedData(receivedData);
const myDiv = document.querySelector("#myDiv");

function updateFetchedData(data) {
  Alpine.data(myDiv, 'fetchedData', () => data.message);
  localStorage.setItem('fetchedData', JSON.stringify(data));
}

// const socket = io("http://localhost:2018");

// socket.on("connect", () => {
//   console.log("Connected to socket.io server " + socket.id);
// });

// socket.on('documentData', (data) => {
//   console.log("Received documentData:", data);
//   updateFetchedData(data);
// });

// Simulating receiving data from some source
const receivedData = { message: "Hello, world!" };

// Update the fetchedData property with the received data
updateFetchedData(receivedData);


// Init flatpickr
flatpickr(".datepicker", {
  mode: "range",
  static: true,
  monthSelectorType: "static",
  dateFormat: "M j, Y",
  defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()],
  prevArrow:
    '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
  nextArrow:
    '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
  onReady: (selectedDates, dateStr, instance) => {
    // eslint-disable-next-line no-param-reassign
    instance.element.value = dateStr.replace("to", "-");
    const customClass = instance.element.getAttribute("data-class");
    instance.calendarContainer.classList.add(customClass);
  },
  onChange: (selectedDates, dateStr, instance) => {
    // eslint-disable-next-line no-param-reassign
    instance.element.value = dateStr.replace("to", "-");
  },
});

const sock = io('http://localhost:3001',{query:"name="+window.Alpine.store('global').dbName});
window.soc=sock;

document.addEventListener("DOMContentLoaded", () => {
  
  Alpine.store('notification', {
    messages: Alpine.$persist([]),
    getNotification: function () {
    
      window.soc.on('getNotifications', data => {
        console.log("data from notification  :", data.data);
        this.messages = data.data;
      })
    },
    emptyNotifications: function() {
      this.messages = [];
    },
  })
  Alpine.store('notification').getNotification();
  console.log(Alpine.store('notification').messages);

//  Alpine.store('notification').emptyNotifications();
  chart01();
  chart02();
  chart03();
  chart04();
  map01();
});

if (window.location.pathname === '/') {
  followingDotCursor();
}


if (window.location.pathname === '/performance.html') {
  statistics();
  // progress();
  performance();
}

if (window.location.pathname === '/customize.html') {
  statistics();
  performance();
}

if (window.location.pathname === '/security.html') {
  pieChartSecurity();
  heatMap();
  securityLine();
}

if (window.location.pathname === '/customize.html') {
  allGraphs();
  pieChartSecurity();
  heatMap();
  securityLine();
}

if (window.location.pathname === '/health.html' || window.location.pathname === '/customize.html') {
  animatedBar();
  healthPie();
}


