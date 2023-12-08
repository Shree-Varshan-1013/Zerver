import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "../css/style.css";

import Alpine from "alpinejs";
import persist from '@alpinejs/persist'
import flatpickr from "flatpickr";
import chart01 from "./components/chart-01";
import chart02 from "./components/chart-02";
import chart03 from "./components/chart-03";
import chart04 from "./components/chart-04";
import statistics from "./components/statistics";
import map01 from "./components/map-01";
import progress from "./components/progress";

Alpine.plugin(persist)
window.Alpine = Alpine;
Alpine.start();

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

// Document Loaded
document.addEventListener("DOMContentLoaded", () => {
  chart01();
  chart02();
  chart03();
  chart04();
  map01();
});

if (window.location.pathname === '/performance.html') {
  statistics();
  progress();
}

if (window.location.pathname === '/settings.html') {
  class Slider {
    constructor(rangeElement, valueElement, options) {
      this.rangeElement = rangeElement
      this.valueElement = valueElement
      this.options = options

      // Attach a listener to "change" event
      this.rangeElement.addEventListener('input', this.updateSlider.bind(this))
    }

    // Initialize the slider
    init() {
      this.rangeElement.setAttribute('min', options.min)
      this.rangeElement.setAttribute('max', options.max)
      this.rangeElement.value = options.cur

      this.updateSlider()
    }

    // Format the money
    asMoney(value) {
      return '$' + parseFloat(value)
        .toLocaleString('en-US', { maximumFractionDigits: 2 })
    }

    generateBackground(rangeElement) {
      if (this.rangeElement.value === this.options.min) {
        return
      }

      let percentage = (this.rangeElement.value - this.options.min) / (this.options.max - this.options.min) * 100
      return 'background: linear-gradient(to right, #50299c, #7a00ff ' + percentage + '%, #d3edff ' + percentage + '%, #dee1e2 100%)'
    }

    updateSlider(newValue) {
      this.valueElement.innerHTML = this.asMoney(this.rangeElement.value)
      this.rangeElement.style = this.generateBackground(this.rangeElement.value)
    }
  }

  let rangeElement = document.querySelector('.range [type="range"]')
  let valueElement = document.querySelector('.range .range__value span')

  let options = {
    min: 2000,
    max: 75000,
    cur: 37500
  }

  if (rangeElement) {
    let slider = new Slider(rangeElement, valueElement, options)

    slider.init()
  }

}
