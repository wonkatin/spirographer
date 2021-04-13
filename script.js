var svg = d3.select('body').append('svg').attr('height','100%').attr('width','100%')

svg.append('text')
    .text('hello from the svg element')
    .attr('x', 100)
    .attr('y', 100)
    .attr("fill", "white")

svg.append('line') 
    .attr('x1', 100)
    .attr('x2', 300 )
    .attr('y1', 150)
    .attr('y2', 300)
    .attr('stroke', 'yellow')
    
const dataArray = [{ x: 5, y: 5 }, { x: 10, y: 15 }, { x: 20, y: 7 }, { x: 30, y: 18 }, { x: 40, y: 10 }, ]
let line = d3.line()
    .x(function(d, i) { return d.x * 10; })
    .y(function(d, i) { return d.y * 10; })
    .curve(d3.curveNatural)
function addLine() {
    let path = svg.append('path')
        .attr('fill', 'none')
        .style('stroke', 'blue')
        .attr('d', line(dataArray));
        
    let totalLength = path.node().getTotalLength()
    console.log(totalLength)
    // let dashArray = totalLength + '' + totalLength
    path.transition().duration(1000).ease(d3.easeLinear)
        .attrTween("stroke-dasharray", function() {
            // const length = this.getTotalLength();
            return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`);
        })
        // .attr("stroke-dasharray", dashArray)
        // .attr("stroke-dashoffset", totalLength)
        // .attr("stroke-dashoffset", 0);
}
setTimeout(function () {
    addLine()
}, 1000)