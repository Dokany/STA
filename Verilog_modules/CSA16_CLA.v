`timescale 1ns/1ns

// 16-bit Carry Select Adder using 4-bit Carry Lookahead Adder blocks

module CLA4 (
    input [3:0] a,
    input [3:0] b,
    input Cin,
    output [3:0] y,
    output Cout
);

wire [3:0] g, p, c;

assign g = a & b;
assign p = a | b;

assign c[0] = Cin;
assign c[1] = g[0] | (Cin & p[0]);
assign c[2] = g[1] | (g[0] & p[1]) | (Cin & p[0] & p[1]);
assign c[3] = g[2] | (g[1] & p[2]) | (g[0] & p[1] & p[2]) | (Cin & p[0] & p[1] & p[2]);
assign Cout = g[3] | (g[2] & p[3]) | (g[1] & p[2] & p[3]) | (g[0] & p[1] & p[2] & p[3]) | (Cin & p[0] & p[1] & p[2] & p[3]);

assign y = a ^ b ^ c;

endmodule

module CSA16_CLA (
    input [15:0] a,
    input [15:0] b,
    input Cin,
    output [15:0] y,
    output Cout
);

wire [2:0] c;
wire [3:0] tempY [5:0];
wire [5:0] tempC;

CLA4 adder4_0 (a[3:0], b[3:0], Cin, y[3:0], c[0]);
CLA4 adder4_1_1 (a[7:4], b[7:4], 1'b0, tempY[0], tempC[0]);
CLA4 adder4_1_2 (a[7:4], b[7:4], 1'b1, tempY[1], tempC[1]);
CLA4 adder4_2_1 (a[11:8], b[11:8], 1'b0, tempY[2], tempC[2]);
CLA4 adder4_2_2 (a[11:8], b[11:8], 1'b1, tempY[3], tempC[3]);
CLA4 adder4_3_1 (a[15:12], b[15:12], 1'b0, tempY[4], tempC[4]);
CLA4 adder4_3_2 (a[15:12], b[15:12], 1'b1, tempY[5], tempC[5]);

assign c[1] = (c[0])? tempC[1] : tempC[0];
assign y[7:4] = (c[0])? tempY[1] : tempY[0];
assign c[2] = (c[1])? tempC[3] : tempC[2];
assign y[11:8] = (c[1])? tempY[3] : tempY[2];
assign Cout = (c[2])? tempC[5] : tempC[4];
assign y[15:12] = (c[1])? tempY[5] : tempY[4];

endmodule
