  // Deliverable 3

  var Graph = new graphlib.Digraph();
  var count = 1;

  // Function that computes the closest value in an array to given value
  function match(match_in, match_arr) { //document.write(match_arr[1]);
      var closest = 1000;
      var f;
      for (var i = 0; i < match_arr.length; i++) {
          var s = Math.abs(match_in - match_arr[i]);
          if (s < closest) {
              f = match_arr[i];
              closest = s;
          }
      }
      return f;
  }

  // Function that parses the JSON net capacitances file and return cell_cap
  function parse_cap() {
      var cap = document.getElementById("net_capacitance");
      var reader = new FileReader();
      reader.readAsText(cap.files[0]);
      reader.onload = function() {
          var text = reader.result;
          var json = JSON.parse(text);

          var cell_cap = [];

          for (cell in json) {
              cell_cap.push({
                  name: cell["name"],

              });
          }
      }
  }

  // Function that returns the capacitance of a given cell name
  function get_capacitance(name) {
      return cap;
  }

  // Function that returns the cell delay using the worst delay from the cell rise and fall values
  function getRiseTransitionTableVal(beta3_1, input_trans, net_cap) {
      var found = false;

      var lib = document.getElementById("lib_file");
      var reader = new FileReader();
      reader.readAsText(lib.files[0]);
      reader.onload = function() {
          var text = reader.result;
          var json = JSON.parse(text);
          for (cell in json.cells) {
              // document.write(json.cells[cell].name, "<br />");

              var NAME = json.cells[cell].name;
              if (NAME.toString() == beta3_1.toString()) {
                  found = true;
              }

              var beta3 = json.cells[cell]["pins"];

              var max = null;
              var maxNum = 0;

              var hii = beta3["Y"]["timing"]["A"]["rise_transition"]["y_values"];
              var hii2 = beta3["Y"]["timing"]["A"]["rise_transition"]["x_values"];
              maxy = match(net_cap, hii);
              maxx = match(input_trans, hii2);

              ///////////////
              document.write(" x: ", maxx, " y: ", maxy);
              var hii2 = beta3["Y"]["timing"]["A"]["rise_transition"]["table"];
              var delay = hii2[maxy][maxx];
              if (found) {
                  document.write(delay);
                  break;
              }
          }
      }
  }


  function getFallTransitionTableVal(beta3_1, input_trans, net_cap) {
      var found = false;

      var lib = document.getElementById("lib_file");
      var reader = new FileReader();
      reader.readAsText(lib.files[0]);
      reader.onload = function() {
          var text = reader.result;
          var json = JSON.parse(text);

          for (cell in json.cells) {
              // document.write(json.cells[cell].name, "<br />");

              var NAME = json.cells[cell].name;
              if (NAME.toString() == beta3_1.toString()) {
                  found = true;
              }

              var beta3 = json.cells[cell]["pins"];

              var max = null;
              var maxNum = 0;

              var hii = beta3["Y"]["timing"]["A"]["fall_transition"]["y_values"];
              var hii2 = beta3["Y"]["timing"]["A"]["fall_transition"]["x_values"];
              maxy = match(net_cap, hii);
              maxx = match(input_trans, hii2);

              ///////////////
              document.write(" x: ", maxx, " y: ", maxy);
              var hii2 = beta3["Y"]["timing"]["A"]["fall_transition"]["table"];

              var delay = hii2[maxy][maxx];

              if (found) {
                  document.write(delay);
                  break;
              }
          }
      }
  }


  function delay_lut(beta3_1, input_trans, net_cap) {
      var found = false;

      var lib = document.getElementById("lib_file");
      var reader = new FileReader();
      reader.readAsText(lib.files[0]);
      reader.onload = function() {
          var text = reader.result;
          var json = JSON.parse(text);

          for (cell in json.cells) {
              // document.write(json.cells[cell].name, "<br />");

              var NAME = json.cells[cell].name;
              if (NAME.toString() == beta3_1.toString()) {
                  found = true;
              }

              var beta3 = json.cells[cell]["pins"];

              var max = null;
              var maxNum = 0;

              var hii = beta3["Y"]["timing"]["A"]["cell_rise"]["y_values"];
              var hii2 = beta3["Y"]["timing"]["A"]["cell_rise"]["x_values"];
              maxy = match(net_cap, hii);
              maxx = match(input_trans, hii2);

              ///////////////
              document.write(" x: ", maxx, " y: ", maxy);
              var hii2 = beta3["Y"]["timing"]["A"]["cell_rise"]["table"];

              var delay = hii2[maxy][maxx];

              if (found) {
                  document.write(delay);
                  break;
              }
          }
          //end of reader
      }
  }

  // Function that returns the cell's output transition using the worst delay from the transition rise and fall
  function output_trans(name, input_trans, net_cap) {
      // cell-rise and cell-fall
      return trans;
  }

  // Function that returns the cell's output transition using the worst delay from the transition rise and fall
  function setup_table(name, input_trans, clk) {
      // rise-transition and fall-transition
      return setup;
  }


  // Function that returns the cell's output transition using the worst delay from the transition rise and fall
  function hold_table(name, input_trans, clk) {
      return hold;
  }

  // Function that traverses DAG and computes the delays across the cells
  function dfs(cell, delay, input_trans, path, max_delay, max_path) {
      var next_cells = Graph.successors(cell);

      if (path.length > 1) {
          net_cap = capacitance(cell);
          cell_delay = delay_lut(Graph.node(cell).type, input_trans, net_cap.capacitance, net_cap.belongsto);
          cell_trans = output_trans(Graph.node(cell).type, input_trans, net_cap.capacitance, net_cap.belongsto);

          path.push({
              pin: cell + "/" + net_cap.beongsto,
              type: "(" + Graph.node(cell).type + ")",
              incr: 0.00,
              path_delay: delay,
              rf: "r"
          });

          delay += cell_delay;

          path.push({
              pin: cell + "/" + "Y",
              type: "(" + Graph.node(cell).type + ")",
              incr: 1.00,
              path_delay: delay,
              rf: "r"
          });
      } else {
          path.push({
              pin: cell + "[0]",
              type: "(in)",
              incr: 0.00,
              path_delay: 0.00,
              rf: "r"
          });
      }

      if (next_cells.length < 1 || next_cells === undefined) {
          if (delay > max_delay) {
              max_delay = delay;
              max_path = path;
          }
      } else {
          for (celll in next_cells) dfs(celll, delay, cell_trans, path, max_delay, max_path);
      }
  }

  // Function that prints the CPM report
  function print_cpm(max_path) {
      document.write("<table><tr><th>PIN</th><th>TYPE</th><th>INCR</th><th>Path Delay</th><th>Rise/Fall</th></tr>");

      for (cell in max_path) {
          document.write("<tr><td>", cell.pin, "</td><td>", cell.type, "</td><td>", cell.incr, "</td><td>", cell.path_delay, "</td><td>", rf, "</td></tr>");
      }

      document.write("</table>");
  }

  function eliminate_reps(Cellyy, Celliezz, cellyindex) {
      // document.write("hi!");//, Celliezz[cellyindex].name);

      if (cellyindex == 0) { return Cellyy; } else {
          for (var i = 0; i < cellyindex; i++) {

              //document.write("<br> checking: ", Cellyy, " against: ", Celliezz[i].name, "<br>");

              if (Cellyy.toString() == Celliezz[i].name.toString()) {

                  newname = Cellyy + count.toString();
                  //document.write("hi!", newname);
                  count++;
                  return newname;
              }

          }
          return Cellyy;
      }
  };

  function check_celliez_connect(Celliez, Celly, Outputs, start, pathy) {
      for (var ii = 0; ii < Outputs.length; ii++) {
          if (Celly.output.toString() == Outputs[ii].bits.toString()) {

              // graphy.setNode(Outputs[ii].name, Outputs[ii]);
              if (!Graph.hasNode(Outputs[ii].name))
                  Graph.addNode(Outputs[ii].name, Outputs[ii]);


              Graph.addEdge(null, Celly.name, Outputs[ii].name);
              if (Outputs[ii].type == 'reg') {
                  document.write("");
              } else
                  document.write("");
              return;
          }

          if (max)
              bigObj.push({ name: NAME, capacitance: max["capacitance"], belongsto: max.name });
          //document.write("Max: ", max["capacitance"], "belongs to pin: ", max.name, "<br /><br>");
          //cells end brace
          //end of parsley brace

      }

      JSONtoObj(bigObj);


      //end of reader
  }

  function JSONtoObj(obj) {
      // Get the JSON
      var str = jsonFromObj(obj);

      // Download the file
      downloadFile('info.json', str);

      return str;
  };

  // Generate JSON from a javascript object
  function jsonFromObj(obj) {
      return JSON.stringify(obj, "", 2);
  }

  var textFile;

  // Create link and "press it", to download a file.
  function downloadFile(name, str) {
      var data = new Blob([str], {
          type: 'application/json'
      });

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
      }

      // Create file and put link in textFile.
      textFile = window.URL.createObjectURL(data);

      var link = document.createElement('a');

      // Link to our created file
      link.href = textFile;

      // Set the name of the file
      link.setAttribute('download', name);

      // Create a temporary node and click it.
      document.body.appendChild(link);
      link.click();
      link.remove();
  }


  function cpm() {

  }

  function eliminate_reps(Cellyy, Celliezz, cellyindex) {
      // document.write("hi!");//, Celliezz[cellyindex].name);

      if (cellyindex == 0) { return Cellyy; } else {
          for (var i = 0; i < cellyindex; i++) {

              //document.write("<br> checking: ", Cellyy, " against: ", Celliezz[i].name, "<br>");

              if (Cellyy.toString() == Celliezz[i].name.toString()) {

                  newname = Cellyy + count.toString();
                  //document.write("hi!", newname);
                  count++;
                  return newname;
              }

          }
          return Cellyy;
      }
  };

  function check_celliez_connect(Celliez, Celly, Outputs, start, pathy) {
      for (var ii = 0; ii < Outputs.length; ii++) {
          if (Celly.output.toString() == Outputs[ii].bits.toString()) {

              // graphy.setNode(Outputs[ii].name, Outputs[ii]);
              if (!Graph.hasNode(Outputs[ii].name))
                  Graph.addNode(Outputs[ii].name, Outputs[ii]);


              Graph.addEdge(null, Celly.name, Outputs[ii].name);
              if (Outputs[ii].type == 'reg') {
                  document.write("");
              } else


                  document.write("");


              return;
          }
      }


      for (var outcell = 0; outcell < Celliez.length; outcell++) {

          for (var cell_con_i = 0; cell_con_i < Celliez[outcell].amount - 1; cell_con_i++) {


              // document.write(Celly.output, " and ", Celliez[outcell].connections[cell_con_i], "<br>");
              if (Celly.output.toString() == Celliez[outcell].connections[cell_con_i].toString()) {
                  if (!Graph.hasNode(Celliez[outcell].name))
                      Graph.addNode(Celliez[outcell].name, Celliez[outcell]);

                  Graph.addEdge(null, Celly.name, Celliez[outcell].name);

                  // document.write( "<b style=\"color: yellow;\"> → </b>", Celliez[outcell].name );


                  check_celliez_connect(Celliez, Celliez[outcell], Outputs, outcell);
              }
          }
      }
  };

  function main_func() {
      var wire_cap = document.getElementById('wire_cap').value;

      var bytes = document.getElementById("synth_file");
      var reader = new FileReader();

      reader.readAsText(bytes.files[0]);
      reader.onload = function() {
          document.write("<title>DAG Generator</title><body style=\"background:#ebf0fa; color:#000000;\">");
          document.write(wire_cap);
          var text = reader.result; //the letters of the file are in this variable
          var json = JSON.parse(text); //here we have the json objects we just need to index them correctly

          var ModuleNames = []; //the names of all our modules
          var HowManyModules = 0; //how many modules we have (might be useful, so why not lol)
          var meow = 0;
          for (property in json.modules) //here we're gonna know how many modules are in our top module, and their names will be stored in property
          {
              var traverse_ports = json.modules[property]["ports"];
              var Inputs = [];
              var Outputs = [];
              var InputCount = 0;
              var OutputCount = 0;
              for (portt in traverse_ports) //so here we are in the ports. we have an array of inputs and outputs. each of these we will push inside their: 
              //name: their actual name
              //bits: what JSON identifies them with...will be usful in connections
              //type: is it an input or output?
              //you can reference this by going Input[i].name, type whatever.
              {
                  //document.write("<br><b style=\"color:#39A8DC;\">", "Analyzing Port:</b> ", portt, "</br>");
                  if (traverse_ports[portt]["direction"] == "input") {
                      Inputs.push({
                          name: portt,
                          bits: traverse_ports[portt]["bits"],
                          type: 'input'
                      });
                      //document.write("Port: ", Inputs[InputCount].name, " is an ", Inputs[InputCount].type, "<br>" );
                      InputCount++;
                  } else
                  if (traverse_ports[portt]["direction"] == "output") {

                      Outputs.push({
                          name: portt,
                          bits: traverse_ports[portt]["bits"],
                          type: 'output'
                      });
                      // document.write("Port: ", Outputs[OutputCount].name, " is an ", Outputs[OutputCount].type, "<br>");
                      OutputCount++;
                  }
              }

              var theCells = json.modules[property]["cells"];
              var Celliez = [];
              //our array celliez will have all of the cells. their names will be in .name, there is an array of connections that has all of the "bits" of the inputs and outputs connected to them.
              //variable amount has how many of those are. connections[amount-1] is the output. all the rest are input..that's why i didn't make the name an object literal so that it doesn't get too confusing
              var HowManyCells = 0;
              var NoRepetition = true;

              for (celll in theCells) {
                  var regy = false;

                  var connects = theCells[celll]["connections"];
                  var conny_per_gate = [];
                  var howmanyinputsandoutputs = 0;
                  for (conny in connects) {

                      if (conny.toString() == 'D') {
                          //regy = true;
                          Outputs.push({
                              name: 'DPin',
                              bits: connects[conny],
                              type: 'reg'
                          });
                      } else
                      if (conny.toString() == 'Q') {
                          regy = true;
                          Inputs.push({
                              name: 'QPin',
                              bits: connects[conny],
                              type: 'reg'
                          });
                      }
                      conny_per_gate.push(connects[conny]);
                      howmanyinputsandoutputs++;
                  }
                  //add here the made array for connections in celliez of [howmnaycells]

                  if (HowManyCells > 0) {

                      var nom = eliminate_reps(theCells[celll]["type"], Celliez, HowManyCells);
                      //document.write("nom! ", nom);

                      if (nom.toString() == theCells[celll]["type"].toString()) {
                          NoRepetition = true;
                      } else {
                          NoRepetition = false;

                          // document.write("A rep found betweenin: ", theCells[celll]["type"], " new name: ", nom);
                      }
                  }
                  if (NoRepetition) {
                      Celliez.push({
                          name: theCells[celll]["type"],
                          connections: conny_per_gate,
                          amount: howmanyinputsandoutputs, //note that connections[amount-1] is an output. everything before then is an input
                          output: conny_per_gate[howmanyinputsandoutputs - 1],
                          reg: regy,
                          nomm: theCells[celll]["type"]
                      });
                  } else if (!NoRepetition) {
                      Celliez.push({
                          name: nom,
                          connections: conny_per_gate,
                          amount: howmanyinputsandoutputs, //note that connections[amount-1] is an output. everything before then is an input
                          output: conny_per_gate[howmanyinputsandoutputs - 1],
                          reg: regy,
                          nomm: theCells[celll]["type"]
                      });
                  }
                  // document.write("<br><b style=\"color:#39A8DC;\">Cell:</b> ", Celliez[HowManyCells].name, "<br/>Found connections: <br/>");

                  HowManyCells++;
              }
          }

          //here we are left with an array of our inputs, array of our gates with all their connections. we need an algorithm to identify the paths. 

          //we will check, for every input. if it's connected to any of our cells. if it is, an edge exists between that input and that cell.

          //what idk how to do, is checking what THAT cell is connected to. even though we know it's output identifier is stored in Celliez[at it's index].connections[amount-1]
          for (var input_i = 0; input_i < Inputs.length; input_i++) {
              for (var cell_i = 0; cell_i < Celliez.length; cell_i++) {
                  for (var cell_con_i = 0; cell_con_i < Celliez[cell_i].amount; cell_con_i++) {
                      /*
                        document.write("Checking cell: ", Inputs[input_i].bits, " against connect ", Celliez[cell_i].connections[cell_con_i], " in cell: ",Celliez[cell_i].name); */
                      if (Inputs[input_i].bits.toString() == Celliez[cell_i].connections[cell_con_i].toString()) {

                          //ok so we put our name for our thing..and we asscoaite it with our struct data structure itsself for our usages.
                          if (!Graph.hasNode(Inputs[input_i].name))
                              Graph.addNode(Inputs[input_i].name, Inputs[input_i]);
                          if (!Graph.hasNode(Celliez[cell_i].name))
                              Graph.addNode(Celliez[cell_i].name, Celliez[cell_i]);

                          Graph.addEdge(null, Inputs[input_i].name, Celliez[cell_i].name);

                          if (Inputs[input_i].type == 'reg') {
                              if (!Celliez[cell_i].reg)
                                  document.write("");
                              else
                                  document.write("");

                          } else {
                              if (!Celliez[cell_i].reg) {

                                  //document.write("<br><b style=\"color:#39A8DC;\">", "Path: </b> ", "Input ", Inputs[input_i].name, " --> ", Celliez[cell_i].name);
                                  check_celliez_connect(Celliez, Celliez[cell_i], Outputs, cell_i, input_i);
                              } else
                                  document.write("");
                          }

                          //if(!Celliez[cell_i].reg)

                          //print_cell();
                      }

                  }

              }
          }

          //we checked each input is going to what...now what is the what going to?

          // for (var output_i = 0; output_i < Outputs.length; output_i++) {
          //  for (var cell_i = 0; cell_i < Celliez.length; cell_i++) {                        
          //          /*
          //      document.write("Checking cell: ", Inputs[input_i].bits, " against connect ", Celliez[cell_i].connections[cell_con_i], " in cell: ",Celliez[cell_i].name); */
          //      if (Outputs[output_i].bits.toString() == Celliez[cell_i].output.toString()) {

          //          //ok so we put our name for our thing..and we asscoaite it with our struct data structure itsself for our usages.
          //          Graph.addNode(Outputs[output_i].name, Outputs[output_i]);
          //          Graph.addEdge(Celliez[cell_i].name, Outputs[output_i].name);
          //          document.write(Celliez[cell_i].name, " --> ",Outputs[output_i].name,  "<br>");

          //      }



          //  }
          // }

          var nodeMap = {}
          Graph.eachNode(function(u, name) {
              nodeMap[u] = {
                  name: name.name
              };
          })
          var nodes = d3.values(nodeMap);
          var edges = Graph.edges().map(function(e) {
              return {
                  source: nodeMap[Graph.source(e)],
                  target: nodeMap[Graph.target(e)]
              };
          });

          // D3 stuff starts here
          var width = 600,
              height = 500

          var svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);

          svg.append("svg:defs").append("svg:marker")
              .attr("id", "arrowhead")
              .attr("viewBox", "0 -5 10 10")
              .attr("refX", 15)
              .attr("refY", -1.5)
              .attr("markerWidth", 6)
              .attr("markerHeight", 6)
              .attr("orient", "auto")
              .append("svg:path")
              .attr("d", "M0,-5L10,0L0,5");

          var force = d3.layout.force()
              .gravity(.05)
              .distance(120)
              .charge(-250)
              .size([width, height]);

          force.nodes(nodes)
              .links(edges)
              .start();

          var link = svg.selectAll(".link")
              .data(edges)
              .enter().append("path")
              .attr("class", "link")
              .attr("marker-end", "url(#arrowhead)");

          var node = svg.selectAll(".node")
              .data(nodes)
              .enter()
              .append("g")
              .attr("class", "node");

          node.append("circle")
              .attr("r", 5)
              .call(force.drag);

          node.append("text")
              .attr("x", 12)
              .attr("y", ".31em")
              .attr("class", "shadow")
              .text(function(d) {
                  return d.name;
              });

          node.append("text")
              .attr("dx", 12)
              .attr("dy", ".35em")
              .text(function(d) {
                  return d.name
              });

          force.on("tick", function() {
              link.attr("d", function(d) {
                  var dx = d.target.x - d.source.x,
                      dy = d.target.y - d.source.y,
                      dr = Math.sqrt(dx * dx + dy * dy);
                  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
              });

              node.attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
              });
          });

          var trav = graphlib.json.write(graphy);
          var hi = JSON.stringify(trav);

          document.write(hi, " <br> ");
      }
  };