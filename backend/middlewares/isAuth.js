// const jwt = require("jsonwebtoken");

// const isAuthenticated = async (req, res, next) => {
//   //! Get the token from the header
//   const headerObj = req.headers;
//   const token = headerObj?.authorization?.split(" ")[1];
//   //!Verify the token
//   const verifyToken = jwt.verify(token, "tracker", (err, decoded) => {
//     if (err) {
//       return false;
//     } else {
//       return decoded;
//     }
//   });
//   if (verifyToken) {
//     //!Save the user req obj
//     req.user = verifyToken.id;
//     next();
//   } else {
//     const err = new Error("Token expired, login again");
//     next(err);
//   }
// };

// module.exports = isAuthenticated;
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "tracker");
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

module.exports = isAuthenticated;
