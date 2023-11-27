const express= require("express");
const app = express();
const mergeRoute = express.Router();
const mergePDFs = require("../controller/mergeController");

mergeRoute.route('/mergefile')
.get((req,res)=>{
    res.end("merge end point")
})
.post(mergePDFs)




module.exports = mergeRoute