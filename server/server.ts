import express from "express"
asd
import * as bodyParser from "body-parser"

const app = express();

const PORT:any = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: true}))

app.use(bodyParser.json())

app.listen(() => {
    console.log("Connected to port: " + PORT)
})
