`timescale 1ns/1ns

// 4-bit ripple carry adder

module rca4 (
    input [3:0] a,
    input [3:0] b,
    input Cin,          // Carry in
    output [3:0] s,     // Sum
    output Cout         // Carry out
);

wire [2:0] c;

FA1 f0 (a[0], b[0], Cin, s[0], c[0]);
FA1 f1 (a[1], b[1], c[0], s[1], c[1]);
FA1 f2 (a[2], b[2], c[1], s[2], c[2]);
FA1 f3 (a[3], b[3], c[2], s[3], Cout);

endmodule
