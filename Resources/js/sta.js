  	function dfs(node, graph, path, start, end_node) {
            var arrow = "<b style=\"color: yellow;\"> → </b>";

            var end = end_node.filter(function(obj) {
                return obj.bits == node.bits;
            })[0];

            if (end != null) {
                var current_node = graph.node(node);
                path += (arrow + current_node.id);
                var next_cells = graph.successors(node);
                for (cell in next_cells) dfs(cell, graph, path, start, end_node);
            } else {
                path += (arrow + end.id + arrow + "End")
                document.write("<br/>", "Path from ", start, " to ", end.type, ": ", path, "<br/>");
            }
        }

        function main_func() {
            var bytes = document.getElementById("synth_file");
            var reader = new FileReader();

            reader.readAsText(bytes.files[0]);

            reader.onerror = function() {
                document.write("File Loading error");
            }

            reader.onload = function() {
                document.write("<title>DAG Generator</title><body style=\"background:#000000; color:#FFFFFF;\">");

                var text = reader.result; //the letters of the file are in this variable
                var json = JSON.parse(text); //here we have the json objects we just need to index them correctly

                var start_node = [{}];
                var end_node = [];
       
                var sequential = false; // Boolean variable indicating whether or not the circuit is clocked
                var clk_bit = 0; // Clock input port's bit value
                var sequentialID = 0;

                var Celliez = [];

                var CellsCount = 0;

		var DAG = new graphlib.Graph({directed: true});

                for (property in json.modules) {
         var traverse_ports = json.modules[property]["ports"];

                    document.write("<br/><b style=\"color:#39A8DC;\">", "=== Analyzing Module: ", property, " ===</b><br/>");

                    for (port in traverse_ports) {
                        document.write("<br/><p style=\"color:#39A8DC;\">", "Analyzing ", traverse_ports[port]["direction"], " port:</p> ", port, "<br/>");

                        var bits_val = traverse_ports[port]["bits"];

                        DAG.setNode(bits_val.toString(), {
                            id: port,
                            type: traverse_ports[port]["direction"]
                        });

                        if (traverse_ports[port]["direction"] == "input") {

				start_node.push({
                            	id: port,
                            	bits: bits_val.toString(),
                            	type: "input"
                       		 });
			}
                        else if (traverse_ports[port]["direction"] == "output") {
				end_node.push({
                        	    id: port,
                        	    bits: bits_val.toString(),
                        	    type: "output"
                        	});
			}
                        if (port.toLowerCase() == "clk") {
                            sequential = true;
                            clk_bit = traverse_ports[port]["bits"];
                        }
                    }
            		
			var theCells = json.modules[property]["cells"];
                    for (cell in theCells) {
                        var connects = theCells[cell]["connections"];
                        var conny_per_cell = [];
                        var IOCount = 0;
                        var cell_type = theCells[cell]["type"];

                        for (conny in connects) {
                            conny_per_cell.push(connects[conny]);
                            IOCount++;
                        }

                        var output_bits = conny_per_cell[IOCount - 1];

                        DAG.setNode(output_bits.toString(), {
                            id: cell_type,
                            type: "cell"
                        });

                        for (var i = 0; i < IOCount - 1; ++i) {
                            DAG.setEdge(conny_per_cell[i], output_bits);

                            if (sequential && conny_per_cell[i] == clk_bit) {
                                ++sequentialID;
                                start_node.push({
                                    id: cell_type + sequentialID.toString() + "_D",
                                    bits: output_bits,
                                    type: "register"
                                });
                                end_node.push({
                                    id: cell_type + sequentialID.toString() + "_Q",
                                    bits: output_bits,
                                    type: "register"
                                });
                            }
                        }
                    	for (node in start_node) { document.write(node.id); dfs(node, DAG, "Start", node.type, end_node); }
                    }
                }
                document.write("</body>");
            }
        };
