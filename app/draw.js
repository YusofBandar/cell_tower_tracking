const updateLocationMarker = (svg, pixelCoords) => {
  svg
    .selectAll(".centre")
    .data([pixelCoords])
    .enter()
    .append("g")
    .attr("class", "centre")
    .append("circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(255,255,255)")
    .transition()
    .style("opacity", 0.8)
    .style("stroke", "rgba(255, 255, 255")
    .attr("r", 7)
    .duration(1000)
    .ease(d3.easeElastic);

  d3.selectAll(".centre circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y);
};

const updateCalculatedLocationMarker = (
  svg,
  pixelCoords,
  accuracy,
  isProviderUpdate
) => {
  svg
    .selectAll(".calCentre")
    .data([pixelCoords])
    .enter()
    .append("g")
    .attr("class", "calCentre")
    .append("circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(181, 181, 181)")
    .transition()
    .style("opacity", 0.75)
    .attr("r", 7)
    .duration(1000)
    .ease(d3.easeElastic);

  svg
    .selectAll(".calCentre")
    .data([pixelCoords])
    .exit()
    .remove();

  svg
    .selectAll(".calAccuracy")
    .data([pixelCoords])
    .enter()
    .append("g")
    .attr("class", "calAccuracy")
    .append("circle")
    .attr("cx", pixelCoords.x)
    .attr("cy", pixelCoords.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(197, 197, 197)");

  if (isProviderUpdate) {
    d3.selectAll(".calAccuracy circle")
      .transition()
      .style("opacity", 0.2)
      .attr("r", 0);

    d3.selectAll(".calCentre circle")
      .transition()
      .style("opacity", 0.75)
      .attr("r", 7)
      .duration(1000)
      .attr("cx", pixelCoords.x)
      .attr("cy", pixelCoords.y)
      .on("end", () => {
        this.updateLocationAccuracy(pixelCoords, accuracy.x - pixelCoords.x);
      });
  } else {
    d3.selectAll(".calCentre circle")
      .attr("cx", pixelCoords.x)
      .attr("cy", pixelCoords.y);
    this.updateLocationAccuracy(pixelCoords, accuracy.x - pixelCoords.x);
  }
};

const updateLocationAccuracy = (coords, radius) => {
  d3.selectAll(".calAccuracy circle")
    .attr("cx", coords.x)
    .attr("cy", coords.y)
    .transition()
    .style("opacity", 0.2)
    .attr("r", radius);
};

const updateCellTowerMarkers = (svg, cellTowers, selectedProvider) => {
  node
    .selectAll(".cellTower")
    .data(cellTowers)
    .enter()
    .append("g")
    .attr("class", "cellTower")
    .append("circle")
    .attr("cx", (d, i) => d.x)
    .attr("cy", (d, i) => d.y)
    .attr("r", 0)
    .style("opacity", 0)
    .style("fill", "rgba(153, 241, 55)")
    .transition()
    .style("opacity", d => {
      return selectedProvider.net.indexOf(Number(d.net)) < 0 ? 0.1 : 0.7;
    })
    .attr("r", 8)
    .duration(1000)
    .delay(() => {
      return Math.random() * (3000 - 500) + 500;
    })
    .ease(d3.easeElastic);

  d3.selectAll(".cellTower circle")
    .attr("cx", (d, i) => cellTowers[i].x)
    .attr("cy", (d, i) => cellTowers[i].y)
    .style("opacity", d => {
      return selectedProvider.net.indexOf(Number(d.net)) < 0 ? 0.1 : 0.7;
    });
};

const updateProviders = (providers, selected, onClick) => {
    d3.select(".providers")
      .selectAll("button")
      .data(providers)
      .enter()
      .append("button")
      .html(d => d.provider)
      .on("click", d => {
        onClick(d);
        this.updateProviders(providers, d.provider);
      });
  
    d3.selectAll(".providers button").style("opacity", d =>
      d.provider === selected ? 1 : 0.2
    );
  };