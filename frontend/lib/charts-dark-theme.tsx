const darkTheme = {
  textStyle: {
    color: '#ffffff'
  },
  title: {
    textStyle: {
      color: '#ffffff'
    }
  },
  legend: {
    textStyle: {
      color: '#ffffff'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(50,50,50,0.8)',
    textStyle: {
      color: '#ffffff'
    },
    borderColor: '#555',
    borderWidth: 1
  },
  series: [{
    type: 'pie',
    itemStyle: {
      borderColor: '#1a1a1a',
      borderWidth: 1
    },
    label: {
      color: '#ffffff'
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(255, 255, 255, 0.5)'
      },
      label: {
        color: '#ffffff'
      }
    }
  }]
};

export default darkTheme;
