import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';
import multer from 'multer';

const app = express();
const router = express.Router();
app.use(cors());

const diskStorage = multer.diskStorage({
    destination: 'images',
    filename(req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        callback(null, file.originalname);
    }
});
const upload = multer({storage: diskStorage});

router.get("/", async (req, res)=>{
    const fileNameList = await fs.readdir('images');
    res.json(fileNameList.map(fileName =>
        `${req.protocol}://${req.hostname}:8080/gallery/images/${fileName}`
    ));
});

router.post('/', upload.array('images'),  (req, res) => {
    res.status(201).json((req.files as Array<Express.Multer.File>).map(file =>
        `${req.protocol}://${req.hostname}:8080/gallery/images/${file.originalname}`
    ));
});

app.use('/gallery/images', router);


app.use('/gallery/images', express.static('images'));

app.listen(8080, () => console.log("Server has been started at 8080"));
