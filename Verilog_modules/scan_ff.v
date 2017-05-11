`timescale 1ns/1ns

module Scan_FF(clk ,select, sd, d, q);

input clk;
input select;
input sd;
input d;
output reg q;
wire f;


assign f = (select)? sd : d;

always @(negedge clk) begin
    q <= f;
end
    
endmodule
