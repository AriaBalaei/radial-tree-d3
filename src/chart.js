const canvas = d3.select(".canva")
const width = window.innerWidth
const height = window.innerHeight
const radiusPercent = 40
const innerRadius = (radiusPercent / 100) * d3.min([width, height]) / 2

//create svg
const svg = canvas.append("svg").attr("width", width).attr("height", height)

//create rect
const rect = svg.selectAll("rect")

//get the data
d3.csv("./data.csv", function (d) {
  return d
}).then(drawChart)

function getRadialTree(data) {
  var nodeCount = data.length
  var theta = (Math.PI * 2) / nodeCount
  var nodes = []
  var height = innerRadius*(Math.sqrt(2*(1-Math.cos(theta))))
  //(Math.sqrt((nodes[1].x-nodes[0].x)**2+(nodes[1].y-nodes[0].y)**2))
console.log()
  for (let i = 0; i < nodeCount; i++) {
    var nodeTheta = theta * i
    var x = innerRadius * Math.cos(nodeTheta)
    var y = innerRadius * Math.sin(nodeTheta)
    var valueColName = data["columns"][1]
    var node = {
      x,
      y,
      theta: nodeTheta,
      r: innerRadius,
      height,
      data: data[i],
      value: parseFloat(data[i][valueColName]),
    }
    nodes.push(node)
  }
  return nodes.sort()
}
//draw the chart
function drawChart(data) {
  
  var nodes = getRadialTree(data)
  var nodeValues = nodes.map(d=> d.value)
  var nodeMax = d3.max(nodeValues)
  var nodeMin = d3.min(nodeValues)

  //scalelinear
  const y = d3.scaleLinear()
  .domain([0, nodeMax])
  .range([0,nodeMax]);

  //scaleband
  const z = d3.scaleBand()
       .paddingInner(0.2)
       .paddingOuter(0.2)

  console.log(z(10))

  console.log(nodes)
  var rects = svg
    .append("g")
    .attr("class", "rects")
    .selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("width", d=> y(d.value))
    .attr("height", d => z.bandwidth()*(d.height))
   //console.log(Math.sqrt((nodes[1].x-nodes[0].x)**2+(nodes[1].y-nodes[0].y)**2))
  rects
    .attr("transform", function(d){
      return `rotate(${(d.theta * (180 / Math.PI) + 8)} ${d.x} ${d.y})`
    })
  var dots = d3
    .select(".rects")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .on('mouseover',function(event){
      d3.select(event.target)
          .transition()
          .duration(100)
          .style('opacity', '0.7')
    })
    
    .on('mouseout',function(event){
        d3.select(event.target)
            .transition()
            .duration(100)
            .style('opacity', '1')
      })
      
}


