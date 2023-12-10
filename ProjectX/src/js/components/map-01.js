import jsVectorMap from 'jsvectormap'
import '../us-aea-en'

const map01 = () => {
  const mapSelector = document.querySelectorAll('#mapOne')

  if (mapSelector.length) {
    const countryData = {
      // Example data with country ISO codes and values
      'ZA': 100,
      'EG': 50,
      'IN': 75,
      // Add more countries and their respective values
    };
    const mapOne = new jsVectorMap({
      selector: '#mapOne',
      map: 'world',
      zoomButtons: true,

      series: {
        regions: [{
          values: countryData,
          scale: ['#FFFFFF', '#FF0000'], // Scale of colors from white to red
          normalizeFunction: 'polynomial',
        }],
      },

      regionStyle: {
        initial: {
          fill: '#C8D0D8',
        },
        hover: {
          fillOpacity: 1,
          fill: '#3056D3',
        },
      },
      regionLabelStyle: {
        initial: {
          fontFamily: 'Satoshi',
          fontWeight: 'semibold',
          fill: '#fff',
        },
        hover: {
          cursor: 'pointer',
        },
      },

      labels: {
        regions: {
          render(code) {
            return code.split('-')[1]
          },
        },
      },
    })
  }
}

export default map01
