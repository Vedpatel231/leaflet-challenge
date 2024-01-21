var myMap = L.map("map", {
    center: [37.09, -95.71], // This centers the map over the United States
    zoom: 5
  });
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(myMap);
  
  var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(earthquakeDataUrl).then(function(data) {
    //size of marker based on magnitude
    function markerSize(magnitude) {
      return magnitude * 5
    }
  
    // Function to determine color of marker based on depth
    function markerColor(depth) {
        if (depth > 90) return "#ea2c2c";
        else if (depth > 70) return "#ea822c";
        else if (depth > 50) return "#ee9c00";
        else if (depth > 30) return "#eecc00";
        else if (depth > 10) return "#d4ee00";
        else return "#98ee00";
      }
  
    // Function to create markers
    function createMarker(feature) {
      return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
  
    // GeoJSON layer containing the features array on the earthquakeData object
    L.geoJSON(data, {
      pointToLayer: createMarker,
      // Function to create popups
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag +
          "<br>Depth: " + feature.geometry.coordinates[2] +
          "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    //generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i]) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);

    });
