const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next) => {
    //console.log("vf token st 1",req.header) //, req.headers.token
    //const tokens = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjBjZjdjMTIzZDRmZjVhODYzNmE4NiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2OTAxMDEzMjcsImV4cCI6MTY5MDE4NzcyN30.hgNiQZ-daOGcEG8DPJVBo9zEIGxbu7zmnpFpH8k9-5k");
    const authHeader = req.header.token; // req.header['token'];
    //console.log("vf token st 2",authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_PASS, (err, user) => {
            if (err)res.status(403).json("Token is not valid");
            req.user = user;
            next()
        });
    } else {
        return res.status(401).json("You are not authenticated")
    }
};

const varifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req.res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("you are not alowed to do that! ")
        }
    })
}

module.exports = varifyTokenAndAuthorization ;