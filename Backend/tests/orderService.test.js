import {vi, test, expect, beforeEach, describe} from "vitest";
import {createOrder} from "../services/orderService.js";
import * as orderModel from "../models/orderModel.js";
import pool from "../config/db.js";

vi.mock("../config/db.js");
vi.mock("../models/orderModel.js");

describe("orderService createOrder", () => {
    let order_values;
    let order_items;
    let query = vi.fn(); 
    let release = vi.fn();

    beforeEach(() => {
        order_values = [1,1,100];
        order_items = [
            {item_id:1, quantity : 1, price : 40},
            {item_id:2, quantity : 2, price : 50},
            {item_id:3, quantity : 3, price : 60}
        ];
        pool = {
            client : vi.fn().mockResolvedValue({
                query,
                release
            })
        }
        vi.clearAllMocks();
    })

    test("reutrns correct", async () => {
        orderModel.createOrder.mockResolvedValue(4)

        await createOrder(order_values, order_items);

        console.log(orderModel.createOrderItems.mock.calls);
        

        expect(orderModel.createOrder).toHaveBeenCalledWith({
                query,
                release
            }, 
            order_values
        );
        expect(orderModel.createOrderItems).toHaveBeenCalledWith({
                query,
                release
            }, 
            ["($1, $2, $3, $4)","($5, $6, $7, $8)","($9, $10, $11, $12)"],
            [4,1,1,40,4,2,2,50,4,3,3,60]
        );

        expect(release).toHaveBeenCalled();
    })

    test("when error occurs", async () => {
        orderModel.createOrder.mockResolvedValue(4)

        await createOrder(order_values, order_items);

        console.log(orderModel.createOrderItems.mock.calls);
        

        expect(orderModel.createOrder).toHaveBeenCalledWith({
                query,
                release
            }, 
            order_values
        );
        expect(orderModel.createOrderItems).toHaveBeenCalledWith({
                query,
                release
            }, 
            ["($1, $2, $3, $4)","($5, $6, $7, $8)","($9, $10, $11, $12)"],
            [4,1,1,40,4,2,2,50,4,3,3,60]
        );

        expect(release).toHaveBeenCalled();
    })

})
