const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next) => {
    let authHeader = req.headers.token;
    //console.log("vf token st 2");
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_PASS, (err, user) => {
            if (err) {res.status(403).json("Token is not valid");}
            req.user = user;
            next()
        });
        //next();
    } else {
        return [res.status(401).json("You are not authenticated")]
    }
};

const varifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("you are not alowed to do that! ")
        }
    });
};

const varifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("you are not alowed to do that! ")
        }
    });
};
module.exports = {
    varifyTokenAndAuthorization,
    varifyTokenAndAdmin,
    verifyToken};