const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Token is not valid!" });
            } else {
                req.user = user;
                next();
            }
        })
    } else {
        return res.status(401).json({ message: "You are not authenticated!" });
    }
};
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "Operation Not allowed!" })
        }
    });
};
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "Only ADMINS are allowed to do that!" })
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};