const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Unauthorized");
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;

        next();
    } catch (err) {
        return res.status(401).json({
            user: null,
            errorMessage: "Unauthorized",
        });
    }
};

const signToken = (userId) => {
    return jwt.sign(
        {
            userId: userId,
        },
        process.env.JWT_SECRET
    );
};

module.exports = {
    verify,
    signToken,
};
