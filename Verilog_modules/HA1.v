
`timescale 1ns/1ns

// 1-bit Half adder

module HA1 (
    input a,
    input b,
    output s,       // Sum
    output Cout     // Carry out
);

assign s = a ^ b;
assign Cout = a & b;

endmodule
