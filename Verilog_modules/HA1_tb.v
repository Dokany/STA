// CSCE 230 - Assignment 3
// file: HA1_tb.v
// author: Yasmin ElDokany
// ID no. 900131538

`timescale 1ns/1ns

// Testbench for 1-bit Half Adder

module HA1_tb;

	//Inputs
	reg a;
	reg b;

	//Outputs
    wire s;
    wire Cout;

	//Instantiation of Unit Under Test
	HA1 uut (.a(a),.b(b),.s(s),.Cout(Cout));


	initial begin
	//Inputs initialization
		a = 0; b = 0;


	//Wait for the reset
		#100
        
        a = 0; b = 0;                      

        #10 a = 0; b = 1;                       

        #10 a = 1; b = 0;                       

        #10 a = 1; b = 1;                        

	end

endmodule