// svg element
const svg = d3.select('body').append('svg').attr('height','100%').attr('width','100%')
//
let width = window.innerWidth;
let height = window.innerHeight;
// add margins
maxSize = Math.min((width/2.5), (height/2.5))
console.log('max-size', maxSize)

// add variables for inputs R, r, d, color, animation speed, stop, start, clear, and max size? or at least size of the spiro
// add inputs //https://bl.ocks.org/d3noob search for input examples
//https://github.com/d3/d3-selection/blob/master/README.md#handling-events

// add ability to download or save

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

// function to get random numbers between two numbers
function getRandomNumber(start, end) { // get random number between range
    return (Math.floor((Math.random() * (end-start))) + start); // don't go under the start or over the end
}

// function to find lcm of R & r
function lcm(num1, num2) {
      //Find the smallest and biggest number from both the numbers
    let lar = Math.max(num1, num2);
    let small = Math.min(num1, num2);
    //Loop till you find a number by adding the largest number which is divisible by the smallest number
    let i = lar;
    while(i % small !== 0){
      i += lar;
    }
    //return the number
    return i;
}
// let helper = lcm(3,5)
// console.log('lcm', helper)


// function to plot the *spiro array*
function getSpiroArray() {

    let spiroArray = []
    let R = getRandomNumber(60, maxSize)
    let r = getRandomNumber(40, (R * 0.5))
    let d = getRandomNumber(5, R)
    
    //trial equation round one
    // for (let theta = 0; theta <= (2 * Math.PI) + .1 ; theta += 0.01) { //https://maissan.net/articles/javascript-spirograph
    //     x = 300 + r * Math.cos(theta) + (R - 10) * Math.cos(25 * theta)
    //     y = 200 + r * Math.sin(theta) - (R - 10) * Math.sin(25 * theta)
    //     spiroArray.push({x: x, y: y})
    // }
    //trial equation round two
    // Hypotrochoid
    for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) {  //https://www.wikiwand.com/en/Hypotrochoid
        x = 300 + (R-r) * Math.cos(theta) + d * Math.cos(((R-r)/r) * theta)
        y = 200 + (R-r) * Math.sin(theta) - d * Math.sin(((R-r)/r) * theta)
        
        spiroArray.push({x: x, y: y})
    }
    // Epitrochoid 
    // for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) { //https://www.wikiwand.com/en/Epitrochoid
    //     x = 300 + (R+r) * Math.cos(theta) - d * Math.cos(((R+r)/r) * theta)
    //     y = 200 + (R+r) * Math.sin(theta) - d * Math.sin(((R+r)/r) * theta)
    //     spiroArray.push({x: x, y: y})
    // }
    // trial equation round three // https://www.youtube.com/watch?v=n7T91LDJ--E

    // for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) { 
    //     x = 300 + (R-r) * Math.cos(theta) + d *(Math.cos(( (R/r) - 1) * theta))
    //     y = 200 + (R-r) * Math.sin(theta) - d *(Math.sin(( (R/r) - 1) * theta))
    //     spiroArray.push({x: x, y: y})
    // } 

    // trial four // this formula crashed chrome // https://observablehq.com/@syaleni/spirograph?collection=@syaleni/parametric-geometry
    // for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) {  
    //     x = R * ((1 - r) * Math.cos(theta) + (d * r) * Math.cos(((1-r)/r) * theta))
    //     y = R * ((1 - r) * Math.sin(theta) + (d * r) * Math.sin(((1-r)/r) * theta))
    //     spiroArray.push({x: x, y: y})
    // }  

    //trial five // I want to know what her equation is doing that mine is not. https://github.com/nbremer/spirograph-easy & https://github.com/nbremer/spirograph/blob/gh-pages/js/script.js
    // var R = getRandomNumber(60, maxSize);
    // var r = getRandomNumber(40, (R * 0.75));
    // var alpha = getRandomNumber(25, r);
    // var l = alpha / r;
    // var k = r / R;
	
    // for(var theta=1; theta<=20000; theta += 1){
    //     var t = ((Math.PI / 180) * theta);
    //     var ang = ((l-k)/k) * t;

    //     var x = 400 + (R * ((1-k) * Math.cos(t) + ((l*k) * Math.cos(ang))));
    //     var y = 300 + (R * ((1-k) * Math.sin(t) - ((l*k) * Math.sin(ang))));
		
    //     spiroArray.push({x: x, y: y});                               
    // }  
    console.log('spiro-array', spiroArray)
    // console.log('R:', R, 'r:', r, 'd:', d, 'LCM:', lcm(R,r), 'max-theta', Math.ceil((2 * Math.PI) * (lcm(R,r)/R)))
    console.log('R:', R, 'r:', r, 'd:', d)
    // console.log("R: " + R + ", r: " + r + ", alpha: " + alpha + ", l: " + l + ", k: " + k);
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
                    .style('stroke', 'chartreuse') // stroke is the color 
                    // .attr('d', line(spiroArray))
                    .attr('d', line(getSpiroArray())) // tells path where to draw the line using x & y coordinates 
                                                
    
    let totalLength = path.node().getTotalLength() // needs to know the entire length of the line for lines below to work
    console.log('total length', totalLength)
    path.transition().duration(2000).ease(d3.easeLinear) // transitions create animations by rendering element over a duration of time
        .attrTween("stroke-dasharray", function() { // https://github.com/d3/d3-transition#transition_attrTween
            return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`); // https://observablehq.com/@palewire/svg-path-animations-d3-transition
        })
}
setTimeout(function () {
    drawSpiro()
}, 1000)