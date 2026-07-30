import multer from "multer";
import { mkdir } from 'node:fs/promises';

const folderName = new URL("../temp", import.meta.url);
await mkdir(folderName, { recursive: true });

const storage = multer.diskStorage({
    destination : async function (req, file, cb) {    
        cb(null, './temp')
    },
    filename : function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({storage})