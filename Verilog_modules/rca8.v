`timescale 1ns/1ns

// 8-bit ripple carry adder

module rca8 (
    input [7:0] a,
    input [7:0] b,
    input Cin,          // Carry in
    output [7:0] s,     // Sum
    output Cout         // Carry out
);

wire c;

rca4 r0 (a[3:0], b[3:0], Cin, s[3:0], c);
rca4 r1 (a[7:4], b[7:4], c, s[7:4], Cout);

endmodule
