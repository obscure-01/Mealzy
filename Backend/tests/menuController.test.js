import {getAvailableMenu, getCompleteMenu, updateMenu} from "../controllers/menuController.js";
import {describe, test, vi, beforeEach, expect} from "vitest";
import * as menuModel from "../models/menuModel.js";

vi.mock("../models/menuModel.js");

describe("getAvailableMenu", () => {
    
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            params : {
                canteen_id : 1
            }
        };

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        };

        next = vi.fn();

        vi.clearAllMocks();
    });

    test("returns 200 when succussful", async () => {        
        menuModel.getAvailableMenu.mockResolvedValue(["item 1", "item 2"]);

        await getAvailableMenu(req, res, next);

        expect(menuModel.getAvailableMenu).toHaveBeenCalledWith(1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({menu : ["item 1", "item 2"]});

        expect(next).not.toHaveBeenCalled();
    });

    test.each([undefined, "abc"])("return 400 if canteen_id is %s", async (value) => {
        
        req.params.canteen_id = value;

        await getAvailableMenu(req, res, next);

        expect(menuModel.getAvailableMenu).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message:"Invalid canteen_id"});

        expect(next).not.toHaveBeenCalled();
    });

    test("return 404 when item not found", async () => {
        menuModel.getAvailableMenu.mockResolvedValue([]);

        await getAvailableMenu(req,res,next);

        expect(menuModel.getAvailableMenu).toHaveBeenCalledWith(1);
        expect(menuModel.getAvailableMenu).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message:"no available items found"});

        expect(next).not.toHaveBeenCalled();
    });

    test("handle Database error", async () => {
        const err = new Error("app error");

        menuModel.getAvailableMenu.mockRejectedValue(err);

        await getAvailableMenu(req, res, next);

        expect(menuModel.getAvailableMenu).toHaveBeenCalledWith(1);
        expect(menuModel.getAvailableMenu).toHaveBeenCalledTimes(1);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(err);
    })
});

describe("getCompleteMenu", () => {
    
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            canteen_id : 1
        };

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        };

        next = vi.fn();

        vi.clearAllMocks();
    });

    test("returns 200 when succussful", async () => {  

        menuModel.getCompleteMenu.mockResolvedValue(["item 1", "item 2"]);

        await getCompleteMenu(req, res, next);

        expect(menuModel.getCompleteMenu).toHaveBeenCalledWith(1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({menu : ["item 1", "item 2"]});

        expect(next).not.toHaveBeenCalled();
    });

    test.each([undefined, "abc"])("return 400 if canteen_id is %s", async (value) => {

        req.canteen_id = value;

        await getCompleteMenu(req, res, next);

        expect(menuModel.getCompleteMenu).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message:"Invalid canteen_id"});

        expect(next).not.toHaveBeenCalled();
    });

    test("return 404 when item not found", async () => {
        menuModel.getCompleteMenu.mockResolvedValue([]);

        await getCompleteMenu(req,res,next);

        expect(menuModel.getCompleteMenu).toHaveBeenCalledWith(1);
        expect(menuModel.getCompleteMenu).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message:"no available items found"});

        expect(next).not.toHaveBeenCalled();
    });

    test("handle Database error", async () => {
        const err = new Error("app error");

        menuModel.getCompleteMenu.mockRejectedValue(err);

        await getCompleteMenu(req, res, next);

        expect(menuModel.getCompleteMenu).toHaveBeenCalledWith(1);
        expect(menuModel.getCompleteMenu).toHaveBeenCalledTimes(1);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(err);
    })
});


describe("updateMenu", async () => {
    
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            canteen_id : 1,
            body : {
                items : [
                    ["1", true],
                    ["2", false],
                    ["3", true]
                ]
            } 
        };

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    });

    // success
    test("return 200 when successfully updated", async () => {
        menuModel.updateMenu.mockResolvedValue({rowsCount : 3});

        
        
        await updateMenu(req, res, next);

        expect(menuModel.updateMenu).toHaveBeenCalledWith(1, ["($1, $2)", "($3, $4)", "($5, $6)"], [1, true, 2, false, 3, true]);
        expect(menuModel.updateMenu).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:`updated 3 items`});

        expect(next).not.toHaveBeenCalled();

    });


    test.each([undefined, "abc"])("return 400 if canteen_id is %s", async (value) => {
        
        req.canteen_id = value;

        await updateMenu(req, res, next);

        expect(menuModel.updateMenu).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message:"Invalid canteen_id"});

        expect(next).not.toHaveBeenCalled();
    });

    test("return 404 when item not found", async () => {
        menuModel.updateMenu.mockResolvedValue({rowsCount : 0});

        await updateMenu(req,res,next);

        expect(menuModel.updateMenu).toHaveBeenCalledWith(1, ["($1, $2)", "($3, $4)", "($5, $6)"], [1, true, 2, false, 3, true]);
        expect(menuModel.updateMenu).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"no available items found"});

        expect(next).not.toHaveBeenCalled();
    });

    test("handle Database error", async () => {
        const err = new Error("app error");

        menuModel.updateMenu.mockRejectedValue(err);

        await updateMenu(req, res, next);

        expect(menuModel.updateMenu).toHaveBeenCalledTimes(1);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(err);
    });

    test("return 400 when item_id is not number", async () => {
        req.body.items = [
            ["abc", true]
        ]

        await updateMenu(req, res, next);
        
        expect(menuModel.updateMenu).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message:"invalid item_id"});

        expect(next).not.toHaveBeenCalled();
    });

    test("return 400 when is_available is not boolean", async () => {
        req.body.items = [
            [1, "true"]
        ]

        await updateMenu(req, res, next);

        expect(menuModel.updateMenu).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message:"is_available must be a boolean"});

        expect(next).not.toHaveBeenCalled();
    });
    

});