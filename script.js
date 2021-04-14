// svg element
const svg = d3.select('body').append('svg').attr('height','100%').attr('width','100%')
//
let width = window.innerWidth / 2;
let height = window.innerHeight /2;
maxSize = Math.min(width, height)
console.log(maxSize)
//TEST
// svg.append('text')
//     .text('hello from the svg element')
//     .attr('x', 100)
//     .attr('y', 100)
//     .attr("fill", "white")
//TEST
// svg.append('line') 
//     .attr('x1', 100)
//     .attr('x2', 300 )
//     .attr('y1', 150)
//     .attr('y2', 300)
//     .attr('stroke', 'yellow')
  
////////////////BABY'S FIRST LINE ANIMATION////////////////////////
// const dataArray = [{ x: 5, y: 5 }, { x: 10, y: 15 }, { x: 20, y: 7 }, { x: 30, y: 18 }, { x: 40, y: 10 }, ]
// let line = d3.line()
//     .x(function(d, i) { return d.x * 10; })
//     .y(function(d, i) { return d.y * 10; })
//     .curve(d3.curveNatural)
// function addLine() {
//     let path = svg.append('path')
//         .attr('fill', 'none')
//         .style('stroke', 'blue')
//         .attr('d', line(dataArray));
        
//     let totalLength = path.node().getTotalLength()
//     console.log(totalLength)
//     path.transition().duration(2000).ease(d3.easeLinear)
//         .attrTween("stroke-dasharray", function() {
//             return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`);
//         })

// }
// setTimeout(function () {
//     addLine()
// }, 1000)

//////////////////////////////////////WELCOME TO SPIROGRAPH CITY home of the SPIROGRAPHER///////////////////////

// function to plot the *spiro array*
function getRandomNumber(start, end) { // get random number between range
    return (Math.floor((Math.random() * (end-start))) + start); // don't go under the start or over the end
}	
function getSpiroArray() {
    let spiroArray = []
    let R = getRandomNumber(60, maxSize)
    let r = getRandomNumber(40, (R * 0.75));

    for (let theta = 0; theta < (2 * Math.PI); theta += 0.01) { //https://maissan.net/articles/javascript-spirograph
        x = (R-r) * Math.cos(theta) + Math.cos(((R-r)/r) * theta)
        y = (R-r) * Math.sin(theta) - Math.sin(((R-r)/r) * theta)
        spiroArray.push({x: x, y: y})
    }
    return spiroArray
}

// define a line
const line = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

// define function that animates a path based on that line USING the *get spiro array* function

function drawSpiro() {
    let path = svg.append('path') //this is the path
                    .attr('fill', 'none') // not sure if i need this 
                    .style('stroke', 'black') // stroke is the color 
                    // .attr('d', line(spiroArray))
                    .attr('d', line(getSpiroArray())) // tells path where to draw the line using x & y coordinates 
                                                
    
    let totalLength = path.node().getTotalLength() // needs to know the entire length of the line for lines below to work
    console.log('total length', totalLength)
    path.transition().duration(2000).ease(d3.easeLinear) // transitions create animations by rendering element over a duration of time
        .attrTween("stroke-dasharray", function() { // https://github.com/d3/d3-transition#transition_attrTween
            return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`); // https://observablehq.com/@palewire/svg-path-animations-d3-transition
        })
}
// setTimeout(function () {
//     drawSpiro()
// }, 1000)