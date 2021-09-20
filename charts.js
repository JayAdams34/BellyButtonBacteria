function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    // console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var s_array = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var s_filter = s_array.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sample_1 = s_filter[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_i = sample_1.otu_ids;
    var otu_l = sample_1.otu_labels.slice(0, 10).reverse();
    var otu_v = sample_1.sample_values.slice(0, 10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_i.map(sampleObj => "OTU #" + sampleObj).slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: otu_v, 
      y: yticks,
      type: "bar", 
      orientation: "h",
      text: otu_l
      
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 bacterical species (OTUs)"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    ///DELIVERABLE 2
    var otu_bubble_v = sample_1.sample_values;
    var otu_bubble_l = sample_1.otu_labels;

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_i, 
      y: otu_bubble_v,
      text: otu_bubble_l,
      mode: "markers",
      marker: { 
        color: otu_i,
        size: otu_bubble_v,
        colorscale: "Earth"
      }
    
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "otu_i"}, 
      yaxis: {title: "otu_bubble_v"},
      hovermode: "closest",
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // DELIVERABLE 3
    
    // 1.
    // Create a variable that holds the samples array. 
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var gArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var g_first = gArray[0];
    

    // 3. Create a variable that holds the washing frequency.
    var g_wfreq = g_first.wfreq;

    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: g_wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<u> Weekly Frequency on Belly Button Washing</u>"},
      gauge: {axis: {range: [null, 10]},
             bar: {color: "darkgray"}},
             steps:[
              {range: [0, 2], color: "red"},
              {range: [2, 4], color: "yellow"},
              {range: [4, 6], color: "green"},
              {range: [6, 8], color: "blue"},
              {range: [8, 10], color: "violet"}
            ]}
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      "title": "Belly Button Washing Frequency"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
