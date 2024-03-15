const margin = { top: 50, right: 190, bottom: 10, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data_by_genres.csv").then(data => {
    const topGenres = ['basshall', 'south african house', 'trap venezolano', 'turkish edm', 'alberta hip hop', 'chinese electropop', 'afroswing', 'afro soul', 'circuit', 'guaracha']; 
    const filteredData = data.filter(d => topGenres.includes(d.genres));
    console.log(filteredData);

    const dimensions = ['danceability', 'energy', 'valence', 'instrumentalness', 'acousticness'];
    const y = {}; 
    dimensions.forEach(d => {
        y[d] = d3.scaleLinear()
            .domain([0,1])
            .range([height, 0]);
    });
    const x = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);
        
    const path = d => d3.line()(dimensions.map(p => [x(p), y[p](d[p])]));

    const highlight = function(event, d){
        svg.selectAll("path")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", 0.2)
            
        d3.select(this)
            .transition().duration(200)
            .style("stroke", d => d3.schemeCategory10[filteredData.indexOf(d)])
            .style("opacity", 1);
    }; 

    const doNotHighlight = function(event, d){
        svg.selectAll("path")
            .transition().duration(200)
            .style("stroke", d => d3.schemeCategory10[filteredData.indexOf(d)])
            .style("opacity", 0.8);
    };

    svg.selectAll("myPath")
        .data(filteredData) 
        .enter().append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", (d, i) => d3.schemeCategory10[i])
        .style("opacity", 0.8)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight);


    svg.selectAll("myAxis")
        .data(dimensions).enter()
        .append("g")
        .attr("class", "axis")
        .attr("transform", d => `translate(${x(d)}, 0)`)
        .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
        .attr("x", 0)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text(d => d)
        .style("fill", "black")
        .style("font-size", "12px");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 200},${height - 20})`)
        .selectAll("legend")
        .data(filteredData)
        .enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", 230)
        .attr("y", -300)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", (d, i) => d3.schemeCategory10[i]);
    
    legend.append("text")
        .attr("x", 250)
        .attr("y", -295)
        .attr("dy", ".35em")
        .style("font-family", "Arial")
        .text(d => d.genres);


});

