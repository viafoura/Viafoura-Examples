import router from "./routes";
import path from 'path';

require('dotenv').config({path: path.join(__dirname, '..', '.env')})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use("/", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
