const jwt = require("../lib/jwt.js")
const { SECRET } = require("../constants.js")


exports.auth = async (req, res, next) => {
    const token = req.cookies["token"]
    if (token) {
        try {
            const decodettoken = await jwt.verify(token, SECRET)
            req.user = decodettoken;
            res.locals.user = decodettoken
            res.locals.isAuthenticated = true

            next()
        }catch (err) {
            res.clearCookie("auth")
            res.redirect("/users/login")
        }
    }
    else {
        next()
    }
}
exports.isAuth = (req, res, next) => {
    if (!req.user) {
      return res.redirect("/users/login");
    }
  
    next();
  };