const svg = d3.select('body').append('svg').attr('height','100%').attr('width','100%')
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

// function to plot the *spiro array*, this will be the hardest part
function getSpiroArray() {
    let spiroArray = []

    return spiroArray
}

// define a line
const line = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

// define function that animates a path based on that line USING the *get spiro array* function

function drawSpiro() {
    let path = svg.append('path')
                    .attr('fill', 'none')
                    .style('stroke', 'black')
                    // .attr('d', line(spiroArray))
                    .attr('d', line(getSpiroArray()))
    
    let totalLength = path.node().getTotalLength()
    console.log('total length', totalLength)
    path.transition().duration(2000).ease(d3.easeLinear)
        .attrTween("stroke-dasharray", function() {
            return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`);
        })
}
// setTimeout(function () {
//     drawSpiro()
// }, 1000)