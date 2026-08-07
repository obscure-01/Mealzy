import {vi, describe, test, expect, beforeEach} from "vitest";
import {createCanteen, updateCanteen, getCanteen, deleteCanteen, openCanteen} from "../controllers/canteenController.js";
import * as canteenModel from "../models/canteenModel.js";

vi.mock("../models/canteenModel.js");

describe("createCanteen", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body : {
                canteen_name : "fatso joint", 
                canteen_location : "up your a to the left", 
                opening_time : "5:00:00", 
                closing_time : "4:00:00"
            },
            file : {
                path : "image.jpg"
            }
        }

        res = {
            status : vi.fn().mockReturnThis(),
            json : vi.fn()
        }

        next = vi.fn();

        vi.clearAllMocks();
    });

    test("return 200 when canteen successfully created", async () => {
        
        await createCanteen(req, res, next);

        expect(canteenModel.createCanteen).toHaveBeenCalledWith("fatso joint","up your a to the left","5:00:00","4:00:00");        

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"New canteen created"});

        
    })

    test.each([["canteen_name", undefined], ["canteen_location", undefined], ["opening_time", undefined], ["canteen_name", 12], ["closing_time", undefined]])("return 400 if %s is not string", async (field, value) => {
            req.body[field] = value;
                    
            await createCanteen(req, res, next);
    
            expect(canteenModel.createCanteen).not.toHaveBeenCalled();
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message:"Invalid data"});
    
            expect(next).not.toHaveBeenCalled();
    })

    test("handle Database error", async () => {
        const err = new Error("app error");

        canteenModel.createCanteen.mockRejectedValue(err);

        await createCanteen(req, res, next);

        expect(canteenModel.createCanteen).toHaveBeenCalledWith("fatso joint","up your a to the left","5:00:00","4:00:00");
        expect(canteenModel.createCanteen).toHaveBeenCalledTimes(1);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(err);
    })
})

describe("Canteen Controller", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        next = vi.fn();

        vi.clearAllMocks();
    });

    describe("updateCanteen()", () => {

        test("returns 400 for invalid canteen_id", async () => {

            req.canteen_id = undefined;

            await updateCanteen(req, res, next);

            expect(canteenModel.updateCanteen).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid canteen_id"
            });

        });

        test("updates canteen successfully", async () => {

            req.canteen_id = 2;

            req.body = {
                canteen_name: "Central Cafe",
                canteen_location: "Block A",
                opening_time: "09:00",
                closing_time: "18:00"
            };

            canteenModel.updateCanteen.mockResolvedValue({
                rowsCount: 1
            });

            await  updateCanteen(req, res, next);

            expect(canteenModel.updateCanteen).toHaveBeenCalledWith(
                2,
                [
                    "canteen_name = $1",
                    "canteen_location = $2",
                    "opening_time = $3",
                    "closing_time = $4"
                ],
                [
                    "Central Cafe",
                    "Block A",
                    "09:00",
                    "18:00"
                ]
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Canteen updated"
            });

        });

        test("returns 404 when canteen not found", async () => {

            req.canteen_id = 2;

            canteenModel.updateCanteen.mockResolvedValue({
                rowsCount: 0
            });

            await  updateCanteen(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Canteen not found"
            });

        });

    });

    describe("getCanteen()", () => {

        test.each([
            ["abc"],
            [undefined]
        ])("returns 400 for invalid id (%s)", async (id) => {

            req.params.canteen_id = id;

            await  getCanteen(req, res, next);

            expect(canteenModel.getCanteen).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);

        });

        test("returns canteen", async () => {

            req.params.canteen_id = 1;

            const canteen = {
                canteen_id: 1,
                canteen_name: "Central"
            };

            canteenModel.getCanteen.mockResolvedValue([canteen]);

            await  getCanteen(req, res, next);

            expect(canteenModel.getCanteen).toHaveBeenCalledWith(1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                canteen_data: canteen
            });

        });

        test("returns 404 when canteen not found", async () => {

            req.params.canteen_id = 1;

            canteenModel.getCanteen.mockResolvedValue([]);

            await  getCanteen(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Canteen not found"
            });

        });

    });

    describe("deleteCanteen()", () => {

        test("returns 400 for invalid id", async () => {

            req.canteen_id = "abc";

            await  deleteCanteen(req, res, next);

            expect(canteenModel.deleteCanteen).not.toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(400);

        });

        test("deletes canteen", async () => {

            req.canteen_id = 5;

            canteenModel.deleteCanteen.mockResolvedValue({
                rowsCount: 1
            });

            await  deleteCanteen(req, res, next);

            expect(canteenModel.deleteCanteen).toHaveBeenCalledWith(5);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Canteen deleted"
            });

        });

        test("returns 404 if canteen doesn't exist", async () => {

            req.canteen_id = 5;

            canteenModel.deleteCanteen.mockResolvedValue({
                rowCount: 0
            });

            await  deleteCanteen(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);

        });

    });

    describe("openCanteen()", () => {

        test("returns 400 for invalid id", async () => {

            req.canteen_id = "abc";

            await  openCanteen(req, res, next);

            expect(canteenModel.openCanteen).not.toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(400);

        });

        test.each([
            ["true"],
            [1],
            [null],
            [undefined]
        ])("returns 400 when is_open is %o", async (value) => {

            req.canteen_id = 2;
            req.body = {
                is_open: value
            };

            await  openCanteen(req, res, next);

            expect(canteenModel.openCanteen).not.toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "is_open must be boolean"
            });

        });

        test("opens canteen", async () => {

            req.canteen_id = 2;
            req.body = {
                is_open: true
            };

            canteenModel.openCanteen.mockResolvedValue({
                rowsCount: 1
            });

            await  openCanteen(req, res, next);

            expect(canteenModel.openCanteen).toHaveBeenCalledWith(2, true);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Canteen open: true"
            });

        });

        test("returns 404 when canteen not found", async () => {

            req.canteen_id = 2;
            req.body = {
                is_open: false
            };

            canteenModel.openCanteen.mockResolvedValue({
                rowCount: 0
            });

            await  openCanteen(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Canteen not found"
            });

        });

    });

});