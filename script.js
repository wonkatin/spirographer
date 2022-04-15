// variables for width x height
let width = window.innerWidth;
let height = window.innerHeight;
// console.log('width', width, 'height', height)

// svg element
const svg = d3.select('#svg').append('svg').attr('height','100%').attr('width','100%')

//////////////////////////////WELCOME TO SPIROGRAPH CITY home of the SPIROGRAPHER///////////////////////
// start slideshow-- deactivate so slideshow doesn't start
// setTimeout(function () {
//     slideshow()
// }, 1000)
// function to get random numbers between two numbers 
function getRandomNumber(min, max) { // get random number between range
    return Math.round((Math.random()*(max-min)+min)/10)*10 ; // don't go under the min or over the max // return a multiple of 10
    // return (Math.floor((Math.random() * (max-min))) + min);

}
function getRandomSmallNumber(min, max) {
    return Math.round(Math.random()*(max-min)+min)
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

// global variables
let R = 110
let r = 30
let d = 120
let color = ''
let stroke = 0
let stopSlideshow = false;

updateFixed(R)
updateRotating(r)
updatePen(d)

// event listener for start slideshow button
d3.select('#startrandom').on('click', function(){
    stopSlideshow = false;
    slideshow()
})

// event listener for stop slideshow button
d3.select('#stoprandom').on('click', function(){
    stopSlideshow = true;
})
// function for random color //http://bl.ocks.org/jdarling/06019d16cb5fd6795edf
var randomColor = (function(){
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();
  
    var hslToRgb = function (h, s, l){
        var r, g, b;
  
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
  
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
  
        return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
    };
    
    return function(){
      h += golden_ratio_conjugate;
      h %= 1;
      return hslToRgb(h, 0.5, 0.60);
    };
  })();

// function for random spirograph slideshow 
function slideshow() {
    svg.selectAll('*').remove()
    // trying to keep the spirograph on the page
    if (width <= 500) {
        R = getRandomNumber(10, 80)
        r = getRandomNumber(30, 80)
        d = getRandomNumber(1, 80)
    } 
    if (width <= 1500) {
        R = getRandomNumber(60, 150)
        r = getRandomNumber(30, 150)
        d = getRandomNumber(40, 150)
    } else {
        R = getRandomNumber(10, 300)
        r = getRandomNumber(30, 250)
        d = getRandomNumber(40, 250)
    }
    if (r===R){
        R += 10
    }
    color = '#0A5AFF'
    stroke = getRandomSmallNumber(1,6)
    // dynamically update range inputs (appears on screen like magic)
    updateFixed(R)
    updateRotating(r)
    updatePen(d)
    updateColor(color)
    let randoColor = randomColor()
    updateColor(randoColor)
    updateStroke(stroke)

    // console.log('R:', R, 'r:', r, 'd:', d, 'color:', color)
    let computedSpiroArray = getSpiroArray()
    let path = svg.append('path') //this is the path
        .attr('fill', 'none') // not sure if i need this 
        .style('stroke', randoColor)
        // .style('fill', randomColor) // this is the best bug by far! **********
        .attr('stroke-width', stroke) // stroke is the color 
        // .attr('d', line(spiroArray))
        .attr('d', line(computedSpiroArray)) // tells path where to draw the line using x & y coordinates 
    
    let totalLength = Math.round(path.node().getTotalLength()) // needs to know the entire length of the line for lines below to work
 
    // console.log('total path length', totalLength)
    // console.log('random color', randomColor())
    
    
    path.transition().duration(5000).ease(d3.easeLinear) // transitions create animations by rendering element over a duration of time
        .attrTween('stroke-dasharray', function() { // https://github.com/d3/d3-transition#transition_attrTween
            return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`); // https://observablehq.com/@palewire/svg-path-animations-d3-transition
        }).transition().duration(3000).on('end', function(){
            if(!stopSlideshow){
                slideshow()
            }
        })
}


// user inputs
if (width <= 500) {
    d3.select('#fixed').property('max', '80').property('min', '10')
    d3.select('#rotating').property('max', '80').property('min', '30')
    d3.select('#pen').property('max', '80').property('min', '1')
    d3.selectAll('button').style('padding', '0px 10px')
} 
if (width <= 1500) {
    d3.select('#fixed').property('max', '150').property('min', '60')
    d3.select('#rotating').property('max', '150').property('min', '30')
    d3.select('#pen').property('max', '150').property('min', '40')
    d3.selectAll('button').style('padding', '0px 20px')
   
} else {
    d3.select('#fixed').property('max', '300').property('min', '10')
    d3.select('#rotating').property('max', '250').property('min', '30')
    d3.select('#pen').property('max', '250').property('min', '40')
}
// set fixed gear event listener
d3.select('#fixed').on('input', function(){
    updateFixed(+this.value)
})
// update fixed gear text display and value
function updateFixed(fixed) {
    d3.select('#fixed-gear-value').text(fixed);
    d3.select('#fixed').property('value', fixed)
    // console.log('fixed', fixed)
}
// sets default fixed gear value
// updateFixed(230)

// set rotating gear event listener 
d3.select('#rotating').on('input', function(){
    updateRotating(+this.value)
})
// update rotating gear text display and value
function updateRotating(rotating) {
    d3.select('#rotating-gear-value').text(rotating);
    d3.select('#rotating').property('value', rotating)
    // console.log('rotating', rotating)
}
// set default for rotating gear
// updateRotating(100)


// set pen position event listener
d3.select('#pen').on('input', function(){
    updatePen(+this.value)
})
// update pen position text display and value
function updatePen(pen) {
    d3.select('#pen-variable-value').text(pen);
    d3.select('#pen').property('value', pen)
    // console.log('pen', pen)
}
// set default for pen position
// updatePen(140)


// set color event listener 
d3.select('#color').on('input', function(){
    updateColor(this.value)
    // console.log('color value', this.value)
})
// update color value
function updateColor(color) {
    d3.select('#color').property('value', color)
    // console.log('color value', color)
}
// set default for color value
updateColor('#0A5AFF')

// set line stroke event listener
d3.select('#stroke').on('input', function(){
    updateStroke(+this.value)
})
// update line stroke display and value
function updateStroke(stroke) {
    d3.select('#stroke-value').text(stroke);
    d3.select('#stroke').property('value', stroke)
    // console.log('stroke', stroke)
}
// sets default line stroke value
// updateStroke(2)

// event listener for draw spiro button 
d3.select('#newspiro').on('click', function(){
    R = d3.select('#fixed').property('value');
    r = d3.select('#rotating').property('value');
    d = d3.select('#pen').property('value');
    color = d3.select('#color').property('value');
    stroke = d3.select('#stroke').property('value')
    console.log('R:', R, 'r:', r, 'd:', d, 'color:', color, 'stroke', stroke)
    drawSpiro()
})

// event listener for start over button
d3.select('#removespiro').on('click', function(){
    svg.selectAll('*').remove()
})

// event listener for dark mode

d3.select('#darkmode').on('click', function(){
    let background = d3.select('body').style('background-color')
    if (background === 'rgb(202, 198, 206)') {
        d3.select('body').style('background-color', 'rgb(31, 30, 34)')
        d3.select(this).text('light mode')
    }
    if (background === 'rgb(31, 30, 34)') {
        d3.select('body').style('background-color', 'rgb(202, 198, 206)')
        d3.select(this).text('dark mode')
    }
    
})

let fillColor
// update color value
function updateFillColor(color) {
    d3.select('#colorfill').property('value', color)
    fillColor = color
    // console.log('color value', fillColor)
}
// set default for color value
updateFillColor('#0A5AFF')

// set fill color event listener 


d3.select('#colorfill').on('input', function(){
    updateFillColor(this.value)
    // fillColor = this.value
    
})

// event listener for the fill button 
d3.select('#fill').on('click', function(){
    // d3.select('#colorfill').property('value', color)
    // console.log(color)
        // .style('fill', randomColor) // this is the best bug by far! **********
    svg.select('path').style('fill', fillColor)
})

// event listener to remove fill button
d3.select('#removefill').on('click', function(){
    svg.select('path').style('fill', 'none')
    
})

// event listener to remove lines button
d3.select('#removelines').on('click', function(){
    svg.select('path').style('stroke', 'none')
    
})


// function to plot the *spiro array*
function getSpiroArray() {
    let spiroArray = []
    let h 
    let w 
    if (width <= 500) {
        h = height
        w = width
    } 
    if (width <= 1500) {
        h = height/2.5
        w = width/3
    } else {
        h = height/2
        w = width/3
    }


    // console.log('w, h', w, h)
    // Hypotrochoid
    for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) {  //https://www.wikiwand.com/en/Hypotrochoid

        x = w + (R-r) * Math.cos(theta) + d * Math.cos(((R-r)/r) * theta)
        y = h + (R-r) * Math.sin(theta) - d * Math.sin(((R-r)/r) * theta)
    
        spiroArray.push({x: x, y: y})
    }
    // 2 styles checkbox? second style not displaying for some reason 
    // Epitrochoid 
    // for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) { //https://www.wikiwand.com/en/Epitrochoid
    //     x = 300 + (R+r) * Math.cos(theta) - d * Math.cos(((R+r)/r) * theta)
    //     y = 200 + (R+r) * Math.sin(theta) - d * Math.sin(((R+r)/r) * theta)
    //     spiroArray.push({x: x, y: y})
    // }

    // console.log('number of spiro-array points', spiroArray.length)
    // console.log('R:', R, 'r:', r, 'd:', d, 'LCM:', lcm(R,r), 'max-theta', Math.ceil((2 * Math.PI) * (lcm(R,r)/R)))
    // console.log('R:', R, 'r:', r, 'd:', d, 'color:', color, 'LCM:', lcm(R,r), 'max-theta', Math.ceil((2 * Math.PI) * (lcm(R,r)/R)))
    return spiroArray
}
            
// define a line
const line = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

// define function that animates a path based on that line USING the *get spiro array* function

function drawSpiro() {
    let computedSpiroArray = getSpiroArray()
    let path = svg.append('path') //this is the path
        .attr('fill', 'none') // not sure if i need this 
        .style('stroke', color)
        .attr('stroke-width', stroke) // stroke is the color 
        // .attr('d', line(spiroArray))
        .attr('d', line(computedSpiroArray)) // tells path where to draw the line using x & y coordinates 
    
    // let totalLength = Math.ceil(path.node().getTotalLength()) // needs to know the entire length of the line for lines below to work
    // let totalLength = Math.floor(path.node().getTotalLength()) // needs to know the entire length of the line for lines below to work
    let totalLength = Math.round(path.node().getTotalLength()) // needs to know the entire length of the line for lines below to work
    // let totalLength = path.node().getTotalLength() // needs to know the entire length of the line for lines below to work
    // console.log('total path length', totalLength)
    // let spiroSpeed = computedSpiroArray.length;
    
    path.transition().duration(5000).ease(d3.easeLinear) // transitions create animations by rendering element over a duration of time
        .attrTween('stroke-dasharray', function() { // https://github.com/d3/d3-transition#transition_attrTween
            return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`); // https://observablehq.com/@palewire/svg-path-animations-d3-transition
        })
}

// SAVE SVG FILE // http://bl.ocks.org/curran/7cf9967028259ea032e8        
// SAVE SVG AS PNG https://bl.ocks.org/mbostock/6466603
// event listener for save spiro button
d3.select('#savespiro').on('click', function() {
    //SAVE AS SVG
    // console.log('svg', svg.node())
    let svgAsXML = (new XMLSerializer).serializeToString(svg.node());
    let dataURL = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);

    let dl = d3.select('#download'); 
    
    dl.attr('href', dataURL);
    // console.log('dataURL', dataURL)
    dl.attr('download', 'spiro.svg');
    dl.node().click();

    //SAVE AS PNG 
    let canvas = d3.select('#canvas').append('canvas')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'hidden')
    context = canvas.node().getContext('2d');
    
    let image = new Image;
    image.src = dataURL;
    image.onload = function() {
        context.drawImage(image, 0, 0);
        let a = document.createElement('a');
        a.download = 'spiro.png';
        a.href = canvas.node().toDataURL('image/png');
        a.click();
    };
})            




//TEST RANGE INPUT
// svg.append('circle')
//     .attr('cx', 300)
//     .attr('cy', 150) 
//     .style('fill', 'none')   
//     .style('stroke', 'chartreuse') 
//     .attr('r', 120);

// d3.select('#nRadius').on('input', function(){
//     update(+this.value)
// })

// update(120) //default value
// function update(nRadius){
//     d3.select('#nRadius-value').text(nRadius);
//     d3.select('#nRadius').property('value', nRadius)
//     svg.selectAll('circle')
//         .attr('r', nRadius)
//     // console.log('nRadius', nRadius)
// }
//TEST
// svg.append('text')
//     .text('hello from the svg element')
//     .attr('x', 100)
//     .attr('y', 100)
//     .attr('fill', 'white')
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
//         .attrTween('stroke-dasharray', function() {
//             return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`);
//         })

// }
// setTimeout(function () {
//     addLine()
// }, 1000)


// TEST EQUATIONS
// function getSpiroArray() {
    
    
    //trial equation round one
    // for (let theta = 0; theta <= (2 * Math.PI) + .1 ; theta += 0.01) { //https://maissan.net/articles/javascript-spirograph
    //     x = 300 + r * Math.cos(theta) + (R - 10) * Math.cos(25 * theta)
    //     y = 200 + r * Math.sin(theta) - (R - 10) * Math.sin(25 * theta)
    //     spiroArray.push({x: x, y: y})
    // }
    //trial equation round two
    // Hypotrochoid
    // for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) {  //https://www.wikiwand.com/en/Hypotrochoid
    //     x = 500 + (R-r) * Math.cos(theta) + d * Math.cos(((R-r)/r) * theta)
    //     y = 400 + (R-r) * Math.sin(theta) - d * Math.sin(((R-r)/r) * theta)
        
    //     spiroArray.push({x: x, y: y})
    // }
    // Epitrochoid 
    // for (let theta = 0; theta <= Math.ceil((2 * Math.PI) * (lcm(R,r)/R)); theta += .01) { //https://www.wikiwand.com/en/Epitrochoid
    //     x = 500 + (R+r) * Math.cos(theta) - d * Math.cos(((R+r)/r) * theta)
    //     y = 400 + (R+r) * Math.sin(theta) - d * Math.sin(((R+r)/r) * theta)
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
    // console.log('spiro-array', spiroArray)
    // // console.log('R:', R, 'r:', r, 'd:', d, 'LCM:', lcm(R,r), 'max-theta', Math.ceil((2 * Math.PI) * (lcm(R,r)/R)))
    // console.log('R:', R, 'r:', r, 'd:', d)
    // // console.log('R: ' + R + ', r: ' + r + ', alpha: ' + alpha + ', l: ' + l + ', k: ' + k);
    // return spiroArray
// }