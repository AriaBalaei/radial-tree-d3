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
console.log()
  for (let i = 0; i < nodeCount; i++) {
    var nodeTheta = theta * i
    var x = innerRadius * Math.cos(nodeTheta)
    var y = innerRadius * Math.sin(nodeTheta)
    var valueColName = data["columns"][1]
    var node = {
      x,
      y,
      r: innerRadius,
      theta: nodeTheta,
      data: data[i],
      value: parseFloat(data[i][valueColName])
    }
    nodes.push(node)
  }
  return nodes
}
//draw the chart
function drawChart(data) {
  var nodes = getRadialTree(data)
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
    .attr("width", d=>d.value)
    .attr("height", 3)
  rects
    .attr("transform", function(d){
      return `rotate(${d.theta * (180 / Math.PI)} ${d.x} ${d.y})`
    })
  var dots = d3
    .select(".rects")
    .attr("transform", `translate(${width / 2},${height / 2})`)
}
