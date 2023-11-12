const router= require("express").Router();

const homeControler = require("./controllers/homeController.js")
const userConroller = require("./controllers/userController.js")
const electronicContoller = require("./controllers/electronicController.js")


router.use(homeControler)
router.use("/users",userConroller)
router.use("/electronics",electronicContoller)

router.get("*",(req,res) =>{
    res.redirect('/404')
})


module.exports = router