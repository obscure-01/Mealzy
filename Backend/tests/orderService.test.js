import {vi, test, expect, beforeEach, describe} from "vitest";
import {createOrder, getUserOrderDetails, getCanteenOrderDetails, getUserOrderHistory, getCanteenOrderHistory} from "../services/orderService.js";
import * as orderModel from "../models/orderModel.js";
import * as userModel from "../models/userModel.js"
import pool from "../config/db.js";


vi.mock("../config/db.js");
vi.mock("../models/orderModel.js");
vi.mock("../models/userModel.js");
 
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
            connect : vi.fn().mockResolvedValue({
                query,
                release
            })
        }
        vi.clearAllMocks();
    })

    test("reutrns correct", async () => {
        orderModel.createOrder.mockResolvedValue(4);

        await createOrder(order_values, order_items);

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

        expect(query).toHaveBeenCalledWith("COMMIT");

        expect(release).toHaveBeenCalled();
    })

    test("when error occurs", async () => {
        const err = new Error("new error");
        orderModel.createOrder.mockRejectedValue(err);

        try {
            await createOrder(order_values, order_items);        
        }
        catch (err) {}

        expect(orderModel.createOrder).toHaveBeenCalledWith({
                query,
                release
            }, 
            order_values
        );

        expect(query).toHaveBeenCalledWith("ROLLBACK");

        expect(release).toHaveBeenCalled();
    })

    test("when error occurs in createorderitem", async () => {
        orderModel.createOrder.mockResolvedValue(4);
        const err = new Error("new error");
        orderModel.createOrderItems.mockRejectedValue({});

        try {
            await createOrder(order_values, order_items);        
        }
        catch (err) {}

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

        expect(query).toHaveBeenCalledWith("ROLLBACK");

        expect(release).toHaveBeenCalled();
    })

})


describe("getUserOrderDetails", () => {
    let user_id;
    let order_id;

    beforeEach(() => {
        user_id = 1;
        order_id = 2;

        vi.clearAllMocks();
    })

    test("return object when successfully retreiving values", async () => {
        orderModel.getUserOrder.mockResolvedValue({rowCount : 1, rows : [1]});

        await getUserOrderDetails(user_id, order_id);

        expect(orderModel.getUserOrder).toHaveBeenCalledWith(1,2);
        expect(orderModel.getOrderItems).toHaveBeenCalledWith(2);

        
    })


    test("return empty object when unsuccessfully retreiving values", async () => {
        orderModel.getUserOrder.mockResolvedValue({rowCount : 0 });

        await getUserOrderDetails(user_id, order_id);

        expect(orderModel.getUserOrder).toHaveBeenCalledWith(1,2);
        expect(orderModel.getOrderItems).not.toHaveBeenCalled();   
    })

})

describe("getCanteenOrderDetails", () => {
    let canteen_id;
    let order_id;

    beforeEach(() => {
        canteen_id = 1;
        order_id = 2;

        vi.clearAllMocks();
    })

    test("return object when successfully retreiving values", async () => {
        orderModel.getCanteenOrder.mockResolvedValue([{user_id : 1}]);
        userModel.getUser.mockResolvedValue({rowCount : 1, rows : []});
                    
        await getCanteenOrderDetails(canteen_id, order_id);

        expect(orderModel.getCanteenOrder).toHaveBeenCalledWith(1,2);
        expect(userModel.getUser).toHaveBeenCalledWith(1);
        expect(orderModel.getOrderItems).toHaveBeenCalledWith(2);

        
    })

    test("return empty object when successfully retreiving values", async () => {
        orderModel.getCanteenOrder.mockResolvedValue([]);

        await getCanteenOrderDetails(canteen_id, order_id);

        expect(orderModel.getCanteenOrder).toHaveBeenCalledWith(1,2);
        expect(orderModel.getOrderItems).not.toHaveBeenCalled();   
    })

})

describe("getUserOrderHistory", () => {
    let user_id;

    beforeEach(() => {
        user_id = 1

        vi.clearAllMocks();
    }) 

    test("return order details successfully", async () =>  {
        orderModel.getAllUserOrders.mockResolvedValue({rowCount : 1, rows : [
            {order_id : 1, status : "pending"},
            {order_id : 2, status : "pending"},
            {order_id : 3, status : "pending"}
        ]})
        orderModel.getMultipleOrdersItems.mockResolvedValue([
            {order_id : 1, item_name : "burger"},
            {order_id : 2, item_name : "plant"},
            {order_id : 3, item_name : "zombie"}
        ])

        await getUserOrderHistory(user_id);

        expect(orderModel.getMultipleOrdersItems).toHaveBeenCalledWith(["$1","$2", "$3"], [1,2,3]);
    })
})


describe("getCanteenOrderHistory", () => {
    let canteen_id;

    beforeEach(() => {
        canteen_id = 1

        vi.clearAllMocks();
    }) 

    test("return order details successfully", async () =>  {
        orderModel.getCanteenOrderHistory.mockResolvedValue({rowCount : 1, rows : [
            {order_id : 1, status : "pending"},
            {order_id : 2, status : "pending"},
            {order_id : 3, status : "pending"}
        ]})
        orderModel.getMultipleOrdersItems.mockResolvedValue([
            {order_id : 1, item_name : "burger"},
            {order_id : 2, item_name : "plant"},
            {order_id : 3, item_name : "zombie"}
        ])

        await getCanteenOrderHistory(canteen_id);

        expect(orderModel.getMultipleOrdersItems).toHaveBeenCalledWith(["$1","$2", "$3"], [1,2,3]);
    })
})

