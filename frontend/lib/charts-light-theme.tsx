const lightTheme = {
  textStyle: {
    color: '#141414'
  },
  title: {
    textStyle: {
      color: '#141414'
    }
  },
  legend: {
    textStyle: {
      color: '#141414'
    }
  },
  tooltip: {
    backgroundColor: '#f1f5f0',
    textStyle: {
      color: '#141414'
    },
    borderColor: '#afff9c',
    borderWidth: 1
  },
  series: [{
    type: 'pie',
    itemStyle: {
      borderColor: '#afff9c',
      borderWidth: 1
    },
    label: {
      color: '#141414'
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: '#dadbd9'
      },
      label: {
        color: '#141414'
      }
    }
  }]
};

export default lightTheme;
