
const pieChartSecurity = () => {
  var chartDom = document.getElementById('piechart');
  var myChart = echarts.init(chartDom);
  var darkMode = JSON.parse(localStorage.getItem('darkMode'));
  var option;

  // Initialize with dummy data
  var initialData = [
    { value: 0, name: 'Low' },
    { value: 0, name: 'Important' },
    { value: 0, name: 'Moderate' },
    { value: 0, name: 'Critical' },
  ];

  option = {
    title: {
      text: 'Security Risk Levels', // Add your desired title here
      left: '0',
      textStyle: {
        color: darkMode ? '#af5aff' : 'black',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: 'grey',
      }, 
    },
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
        },
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: initialData, // Use the initial data
        
      },
    ],
  };

  // Listen for WebSocket messages
  
  window.soc.addEventListener('vCount', (event) => {
    let newData = {Low:0,Critical:0,Moderate:0,Important:0};
    newData = {newData, ...event.data}
    const newLow=newData.Low;
    const newCritical=newData.Critical;
    const newImportant=newData.Important;
    const newModerate=newData.Moderate;
    // console.log("Low ",newLow);
    // Map the WebSocket data to the format expected by ECharts
    const mappedData = [
      { value: newData.Low, name: 'Low' },
      { value: newData.Important, name: 'Important' },
      { value: newData.Moderate, name: 'Moderate' },
      { value: newData.Critical, name: 'Critical' },
     
    ];

    // Update the chart with new data
    myChart.setOption({
      series: [
        {
          data: mappedData,
        },
      ],
    });
  });
  option && myChart.setOption(option);

  // WebSocket connection
  

  // Handle WebSocket close event
 
};

export default pieChartSecurity;
