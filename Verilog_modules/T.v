`timescale 1ns/1ns

module T(input clk, input A, output reg B, output reg C);

always @ (negedge clk) begin
    B <= A;
    C <= B + A;
end

endmodule
