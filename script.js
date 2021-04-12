var svg = d3.select('body').append('svg').attr('height','100%').attr('width','100%')

svg.append('text')
    .text('hello from the svg element')
    .attr('x', 100)
    .attr('y', 100)
    .attr("fill", "white")

    
    