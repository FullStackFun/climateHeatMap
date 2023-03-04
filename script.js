let url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let request = new XMLHttpRequest()

let startTemp
let arrayValues = []

let xScale
let yScale

let firstYear
let lastYear
let yearCount = lastYear - firstYear


let height = 500
let width = 1000
let padding = 50

let board = d3.select('#board')
                .attr('height', height)
                .attr('width', width)

let makeScales = function() {

    tooltip = d3.select('#tooltip')
    firstYear = d3.min(arrayValues, (x) => {
        return x['year']
    })

    lastYear = d3.max(arrayValues, (x) => {
        return x['year']
    })

    xScale = d3.scaleLinear()
                .domain([firstYear, lastYear +1])
                .range([padding, width-padding])

    yScale = d3.scaleTime()
                .domain ([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
                .range([padding, height-padding])

    

}

let makeCells = () => {

    board.selectAll('rect')
            .data(arrayValues)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('fill', (x) => {
                v = x['variance']
                    if (v <= -2) {
                        return 'royalblue'
                    } else if (v <= -1) {
                        return 'steelblue'
                    } else if (v <= 0) {
                        return 'powderblue'
                    } else if (v <= 1) {
                        return 'wheat' 
                    } else if (v <= 2) {
                        return 'coral'
                    } else {
                        return 'gold'
                    }
            })
            .attr('data-year', (x) => {
                return x['year']
            })
            .attr('data-month', (x) => {
                return x['month']-1
            })
            .attr('data-temp', (x) => {
                return startTemp + x['variance']
            })
            .attr('height', (height - (2 * padding))/12)
            .attr('y', (x) => {
                return yScale(new Date(0, x['month']-1, 0, 0, 0, 0, 0))
            })
            .attr('width', (x) => {
                let yearCount = lastYear - firstYear
          //      console.log(yearCount, lastYear, firstYear, width, padding)
               return ((width - (2 * padding)) / yearCount)
            })

          .attr('x', (x) => {
                return xScale(x['year'])
            })
            .on('mouseover', (x) => {
                tooltip.transition()
                    .style('visibility', 'visible')
                    let monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    tooltip.text(x['year'] + ' ' + monthList[x['month'] -1] + ' ' + (startTemp + x['variance']) + ' degrees C')
                    .attr('data-year', x['year'])
            })
          .on('mouseout', (x) => {
                tooltip.transition()
                        .style('visibility', 'hidden')
                        
                
          })

}

let makeAxes = function() {

    let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
        board.append('g')
            .call(xAxis)
            .attr('transform', 'translate(0,' + (height-padding) + ')')
            .attr('id', 'x-axis')
           

    let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%B'))
        board.append('g')
            .call(yAxis)
            .attr('transform', 'translate(' + padding + ',0)')
            .attr('id', 'y-axis')
          

}

request.open('GET', url, true)
request.onload = () => {
  //  console.log(request.responseText)
  preValues = JSON.parse(request.responseText)
  //console.log(preValues)
    startTemp = preValues['baseTemperature']
    arrayValues = preValues['monthlyVariance']
    console.log(startTemp, arrayValues)
   makeScales()
   makeCells()
   makeAxes()
}
request.send()
