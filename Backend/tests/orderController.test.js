import {createOrder} from "../controllers/orderController.js";
import * as orderService from "../services/orderService.js";
import { getMultipleItems } from "../models/itemModel.js";
import {vi, test, expect, beforeEach, describe} from "vitest";

vi.mock("../services/orderService.js");
vi.mock("../models/itemModel.js");


describe("OrderController create order",() => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            user_id : 1,
            body : {
                canteen_id : 1,
                items : {
                    "1":1,
                    "2":2,
                    "3":3
                }
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })

    test("return 200 when successfully created", async () => {
        
        getMultipleItems.mockResolvedValue([
            {item_id:1, price : 40},
            {item_id:2, price : 50},
            {item_id:3, price : 60}
        ])


        await createOrder(req, res, next);

        expect(getMultipleItems).toHaveBeenCalledWith(["$1","$2","$3"],[1,2,3,]);

        expect(orderService.createOrder).toHaveBeenCalledWith([1,1,320], [{item_id:1, quantity : 1, price : 40},{item_id:2, quantity : 2, price : 50},{item_id:3, quantity : 3, price : 60}]);
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message: "order placed"})

        expect(next).not.toHaveBeenCalled();
    });

    test("return 400 when item_id is invalid", async () => {

        req.body.items = {
                    "ABC":1,
                    "2":2,
                    "3":3
        }


        await createOrder(req, res, next);

        console.log(next.mock.calls);
        
        expect(getMultipleItems).not.toHaveBeenCalled();
        expect(orderService.createOrder).not.toHaveBeenCalled();
    
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: "invalid user_id"})

        expect(next).not.toHaveBeenCalled();
    });


    test("return 400 when quantity is invalid", async () => {

        req.body.items = {
                    "1":"asd",
                    "2":2,
                    "3":3
        }

        getMultipleItems.mockResolvedValue([
            {item_id:1, price : 40},
            {item_id:2, price : 50},
            {item_id:3, price : 60}
        ])


        await createOrder(req, res, next);
        
        console.log(next.mock.calls);
        

        expect(getMultipleItems).toHaveBeenCalledWith(["$1","$2","$3"],[1,2,3,]);
        expect(orderService.createOrder).not.toHaveBeenCalled();
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid qunatity"});

        expect(next).not.toHaveBeenCalled();
    });

})