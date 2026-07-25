import {createOrder, getUserOrder, getUserOrderHistory, getCanteenOrderHistory, cancleOrderUser, cancleOrderCanteen, acceptOrder} from "../controllers/orderController.js";
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

        expect(getMultipleItems).toHaveBeenCalledWith(["$1","$2","$3"],[1,2,3,]);
        expect(orderService.createOrder).not.toHaveBeenCalled();
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid qunatity"});

        expect(next).not.toHaveBeenCalled();
    });

})

describe("getUserOrder", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            user_id : 1,
            params : {
                order_id : 1
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })


    test("return 200 when successfully returning order", async () => {
        orderService.getUserOrderDetails.mockResolvedValue({info : "order_data.rows[0]", items : "order_item_data"});

        await getUserOrder(req, res, next);

        expect(orderService.getUserOrderDetails).toHaveBeenCalledWith(1,1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({"order" : {info : "order_data.rows[0]", items : "order_item_data"}});
    })
})


describe("getUserOrderHistory", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            user_id : 1
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })


    test("return 200 when successfully returning order", async () => {
        orderService.getUserOrderHistory.mockResolvedValue([
            { order_id: 1, status: 'pending', items: [ [Object] ] },
            { order_id: 2, status: 'pending', items: [ [Object] ] },
            { order_id: 3, status: 'pending', items: [ [Object] ] }
        ])

        await getUserOrderHistory(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({order_history : [
            { order_id: 1, status: 'pending', items: [ [Object] ] },
            { order_id: 2, status: 'pending', items: [ [Object] ] },
            { order_id: 3, status: 'pending', items: [ [Object] ] }
        ]});
    })


    test("return 404 when successfully returning order", async () => {
        orderService.getUserOrderHistory.mockResolvedValue([])

        await getUserOrderHistory(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"No orders placed yet"});
    })
})

describe("getCanteenOrderHistory", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            canteen_id : 1
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })


    test("return 200 when successfully returning order", async () => {
        orderService.getCanteenOrderHistory.mockResolvedValue([
            { order_id: 1, status: 'pending', items: [ [Object] ] },
            { order_id: 2, status: 'pending', items: [ [Object] ] },
            { order_id: 3, status: 'pending', items: [ [Object] ] }
        ])

        await getCanteenOrderHistory(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({order_history : [
            { order_id: 1, status: 'pending', items: [ [Object] ] },
            { order_id: 2, status: 'pending', items: [ [Object] ] },
            { order_id: 3, status: 'pending', items: [ [Object] ] }
        ]});
    })


    test("return 404 when unsuccessfully returning order", async () => {
        orderService.getCanteenOrderHistory.mockResolvedValue([])

        await getCanteenOrderHistory(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"No orders placed yet"});
    })
})

describe("cancleOrderUser", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            user_id : 1,
            params : {
                order_id : 1
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })

    test("return 200 when successfully cancelled", async () => {

        orderService.cancelOrderUser.mockResolvedValue({rowCount : 1})
         
        await cancleOrderUser(req, res, next);

        expect(orderService.cancelOrderUser).toHaveBeenCalledWith(1,1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Order canceled"});
    })
})

describe("cancleOrderCanteen", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            user_id : 1,
            canteen_id : 1,
            params : {
                order_id : 1
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })

    test("return 200 when successfully cancelled", async () => {

        orderService.cancleOrderCanteen.mockResolvedValue({rowCount : 1})
         
        await cancleOrderCanteen(req, res, next);

        expect(orderService.cancleOrderCanteen).toHaveBeenCalledWith(1,1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Order canceled"});
    })
})

describe("acceptOrder", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            user_id : 1,
            canteen_id : 1,
            params : {
                order_id : 1
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })

    test("return 200 when successfully accepted", async () => {

        orderService.acceptOrder.mockResolvedValue({rowCount : 1})
        
        await acceptOrder(req, res, next);

        expect(orderService.acceptOrder).toHaveBeenCalledWith(1,1,1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Order accepted"});
    })
})