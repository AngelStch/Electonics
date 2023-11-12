const router = require("express").Router();
const userService = require("../services/userService.js")
const { ExactErrorMsgs } = require("../utils/errorHandler.js")


router.get("/register", (req, res) => {
    res.render('user/register')
});
router.post("/register", async (req, res) => {
    const { username, email, password, repeatPassword } = req.body
    try {
       const token = await userService.register({ username, email, password, repeatPassword })
        res.cookie('token', token, { httpOnly: true })
        res.redirect('/')
    } catch (error) {
        const errorMessages = ExactErrorMsgs(error)
        res.status(404).render('user/register', { errorMessages })
    }

});

router.get("/login", (req, res) => {
    res.render('user/login')
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const token = await userService.login(email, password)
        res.cookie('token', token, { httpOnly: true })
        res.redirect('/')
    } catch (error) {
        const errorMessages = ExactErrorMsgs(error)
        res.status(404).render('user/login', { errorMessages })
    }


});

router.get("/logout", (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
});


module.exports = router