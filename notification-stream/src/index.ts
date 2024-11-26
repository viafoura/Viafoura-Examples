import router from "./routes";
import featuredContentRouter from "./routes/featuredContent";
import path from 'path';

import { Request, Response, NextFunction } from 'express'

require('dotenv').config({path: path.join(__dirname, '..', '.env')})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use("/", router);
app.use("/", featuredContentRouter);

app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
  return res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
