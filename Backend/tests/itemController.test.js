// add input validation tests later


import { describe, beforeEach, test, expect, vi } from "vitest";
import * as itemController from "../controllers/itemController.js";
import * as itemModel from "../models/itemModel.js";
import * as cloudinaryService from "../services/cloudinaryService.js";

vi.mock("../models/itemModel.js");
vi.mock("../services/cloudinaryService.js")
vi.mock("fs")

describe("createItem", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            canteen_id: 2,
            body: {
                item_name: "Burger",
                description: "Delicious veg burger",
                price: "40",
                category: "snack",
                is_vegetarian: "true"
            },
            file : {
                path : "burger.jpg"
            }
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        next = vi.fn();

        vi.clearAllMocks();
    });

    test("should create a new items", async () => {
        itemModel.createItem.mockResolvedValue({});
        cloudinaryService.uploadImage.mockResolvedValue({url : "burger_url", public_id : "image_id"})

        await itemController.createItem(req, res, next);

        expect(itemModel.createItem).toHaveBeenCalledWith(
            2,
            "Burger",
            "Delicious veg burger",
            "40",
            "burger_url",
            "image_id",
            "snack",
            true
        );

        expect(itemModel.createItem).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Created new item"
        });

        expect(next).not.toHaveBeenCalled();

    });

    test("return 400 if  there is no canteen id", async () => {
        req.canteen_id = undefined;

        await itemController.createItem(req, res, next);

        expect(itemModel.createItem).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "no canteen id found" });

        expect(next).not.toHaveBeenCalled();
    })

    test.each([
        "item_name",
        "description",
        "price",
        "category",
        "is_vegetarian"
    ])("returns 400 if %s is missing", async (field) => {
        req.body[field] = undefined;

        await itemController.createItem(req, res, next);

        expect(itemModel.createItem).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "necessary fields missing"
        });
    });

    test.each([
        ["item_name", 12, "string"],
        ["description", 20, "string"],
        ["category", 23, "string"],
        ["is_vegetarian", "b", "boolean"]
    ])("returns 400 if %s is not %s", async (feild, value) => {
        req.body[feild] = value;

        await itemController.createItem(req, res, next);

        expect(itemModel.createItem).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "necessary fields missing"
        });
    });

    test("if DataBase raises an error", async () => {
        const error = new Error("database error");

        itemModel.createItem.mockRejectedValue(error);

        await itemController.createItem(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    })


});

describe("getItem", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            params: {
                item_id: 1
            }
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    })

    test("should return item", async () => {
        const item = {
            item_id: 1,
            canteen_id: 2,
            item_name: "Burger",
            description: "Delicious veg burger",
            price: 40,
            image_url: "burger.jpg",
            category: "snack",
            is_vegetarian: true,
            created_at: "2026-07-17 23:23:45.010007",
            updated_at: "2026-07-17 23:23:45.010007"
        }

        itemModel.getItem.mockResolvedValue([item]);

        await itemController.getItem(req, res, next);



        expect(itemModel.getItem).toHaveBeenCalledWith(1);
        expect(itemModel.getItem).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ item_data: item });

        expect(next).not.toHaveBeenCalled();
    });

    // works with true, therefore values that can be converted to Number
    test.each([undefined, "abc"])("return 400 if item_id is not number", async (value) => {
        req.params.item_id = value;

        await itemController.getItem(req, res, next);

        expect(itemModel.getItem).not.toHaveBeenCalled();


        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "item_id must be a number" });

        expect(next).not.toHaveBeenCalled();

    })

    test("handle database error", async () => {
        const error = new Error("database error");

        itemModel.getItem.mockRejectedValue(error);

        await itemController.getItem(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    })

    test("item not found", async () => {
        itemModel.getItem.mockResolvedValue([]);

        await itemController.getItem(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });

        expect(next).not.toHaveBeenCalled();
    })
});

describe("updateItem", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            canteen_id: 1,
            params: {
                item_id: 1,
            },
            body: {
                item_name: "Big Burger",
                description: "Big Juicy Burger",
                price: "120",
                category: "snack",
                is_vegetarian: "false",
                is_available: "true"
            },
            file : {
                path : "burger.jpg"
            }
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        next = vi.fn();

        vi.clearAllMocks();
    });

    test("update all fields", async () => {
        itemModel.updateItem.mockResolvedValue({ rowsCount: 1 });
        itemModel.getItem.mockResolvedValue([{item_id:2, image_id : 2}])
        cloudinaryService.uploadImage.mockResolvedValue({url : "burger_url", public_id : "image_id"});


        await itemController.updateItem(req, res, next);        

        expect(itemModel.updateItem).toHaveBeenCalledWith(1, 1,
            [
                "item_name = $1",
                "description = $2",
                "price = $3",
                "category = $4",
                "is_vegetarian = $5",
                "is_available = $6",
                "image_url = $7",
                "image_id = $8"
            ],
            [
                'Big Burger',
                'Big Juicy Burger',
                "120",
                'snack',
                false,
                true,
                'burger_url',
                "image_id"
            ]
        );

        expect(res.status).toHaveBeenCalled(200);
        expect(res.json).toHaveBeenCalled({ message: "item updated" });

        expect(next).not.toHaveBeenCalled();

    });

    test.each([undefined, "abc"])("canteen_id issues gives 400", async (value) => {
        req.canteen_id = value;

        await itemController.updateItem(req, res, next);

        expect(itemModel.updateItem).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Canteen_id" });

        expect(next).not.toHaveBeenCalled();
    });

    test.each([undefined, "abc"])("item_id issues gives 400", async (value) => {
        req.params.item_id = value;

        await itemController.updateItem(req, res, next);

        expect(itemModel.updateItem).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid item_id" });

        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        "item_name", 
        "description", 
        "price", 
        "category", 
        "is_vegetarian", 
        "is_available"
    ])("returns 200 when missing %s", async (field) => {
        delete req.body[field];

        itemModel.updateItem.mockResolvedValue({rowsCount: 1});

        await itemController.updateItem(req, res, next);

        expect(itemModel.updateItem).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"item updated"});

        expect(next).not.toHaveBeenCalled();

        const [item_id, canteen_id, fields, values] = itemModel.updateItem.mock.calls[0];

        if (field === "image") {
            expect(fields.some(f => f.startsWith(`image_url = `))).toBe(false);
        }
        else {
            expect(fields.some(f => f.startsWith(`${field} = `))).toBe(false);
        }
    });

    // no fields in the body

    test("return 400 if no fields passed", async () => {
        req.body = {};
        req.file = {}

        await itemController.updateItem(req, res, next);
        
        expect(itemModel.updateItem).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "No fields provided"});
    });


    test("handle database error", async () => {
        const error = new Error("database error");

        itemModel.updateItem.mockRejectedValue(error);

        await itemController.updateItem(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });
});

describe("deleteItem", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            canteen_id : 1,
            params : {
                item_id : 1
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    });

    test("return 200 when item is deleted", async () => {
        itemModel.deleteItem.mockResolvedValue({rowsCount : 1});

        await itemController.deleteItem(req, res, next);        

        expect(itemModel.deleteItem).toHaveBeenCalledWith(1,1);
        expect(itemModel.deleteItem).toHaveBeenCalledTimes(1);
 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Item deleted"});

        expect(next).not.toHaveBeenCalled();


    })

    test("return 404 when item is not found", async () => {
        itemModel.deleteItem.mockResolvedValue({rowCount : 0});

        await itemController.deleteItem(req, res, next);

        

        expect(itemModel.deleteItem).toHaveBeenCalledWith(1,1);
        expect(itemModel.deleteItem).toHaveBeenCalledTimes(1);
 

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"item does not exist"});

        expect(next).not.toHaveBeenCalled();


    })

    test.each([undefined, "abc"])("return 400 if item_id is not number", async (value) => {
        req.params.item_id = value;

        await itemController.deleteItem(req, res, next);

        expect(itemModel.deleteItem).not.toHaveBeenCalled();
 

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid item_id"});

        expect(next).not.toHaveBeenCalled();

    })

    test.each([undefined, "abc"])("return 400 if canteen_id is not number", async (value) => {
        req.canteen_id = value;

        await itemController.deleteItem(req, res, next);

        expect(itemModel.deleteItem).not.toHaveBeenCalled();
 

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid Canteen_id"});

        expect(next).not.toHaveBeenCalled();

    })

    test("handle database error", async () => {
        const error = new Error("database error");

        itemModel.deleteItem.mockRejectedValue(error);

        await itemController.deleteItem(req, res, next);

        expect(itemModel.deleteItem).toHaveBeenCalledTimes(1);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });

});

describe("changeItemAvailability", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            canteen_id : 1,
            params : {
                item_id : 1
            },
            body : {
                is_available : true
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();

    });

    test.each([true, false])("return 200 when availability is updated", async (value) => {
        req.body.is_available = value;
        itemModel.changeItemAvailability.mockResolvedValue({rowsCount:1});

        await itemController.changeAvailability(req, res, next);
        
        expect(itemModel.changeItemAvailability).toHaveBeenCalledWith(1,1,value);
        expect(itemModel.changeItemAvailability).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: `Availability set to ${value}`});
    });


    test("return 404 when item is not found", async () => {
        itemModel.changeItemAvailability.mockResolvedValue({rowCount : 0});

        await itemController.changeAvailability(req, res, next);

        

        expect(itemModel.changeItemAvailability).toHaveBeenCalledWith(1,1, true);
        expect(itemModel.changeItemAvailability).toHaveBeenCalledTimes(1);
 

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"item does not exist"});

        expect(next).not.toHaveBeenCalled();


    })

    test.each([undefined, "abc", 0 , 1 ])("return 400 if is_available is not boolean", async (value) => {
        req.body.is_available = value;

        await itemController.changeAvailability(req, res, next);

        expect(itemModel.changeItemAvailability).not.toHaveBeenCalled();
 

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "is_available must be a boolean"});

        expect(next).not.toHaveBeenCalled();

    })

    test.each([undefined, "abc"])("return 400 if item_id is not number", async (value) => {
        req.params.item_id = value;

        await itemController.changeAvailability(req, res, next);

        expect(itemModel.changeItemAvailability).not.toHaveBeenCalled();
 

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid item_id"});

        expect(next).not.toHaveBeenCalled();

    })

    test.each([undefined, "abc"])("return 400 if canteen_id is not number", async (value) => {
        req.canteen_id = value;

        await itemController.deleteItem(req, res, next);

        expect(itemModel.deleteItem).not.toHaveBeenCalled();
 

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid Canteen_id"});

        expect(next).not.toHaveBeenCalled();

    })

    test("handle database error", async () => {
        const error = new Error("database error");

        itemModel.changeItemAvailability.mockRejectedValue(error);

        await itemController.changeAvailability(req, res, next);

        expect(itemModel.changeItemAvailability).toHaveBeenCalledTimes(1);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });
})