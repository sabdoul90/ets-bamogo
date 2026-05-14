const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifierToken = (req, res, next) => {
  let token;

  const authHeader = req.headers["authorization"];
  const cookie = req.cookies;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (cookie && cookie.jwt) {
    token = cookie.jwt;
  }

  console.log("Token :", token);

  if (!token) {
    return res.status(401).json({ data: { message: "Veuillez vous authentifier !" } });
  }

  try {
    const SECRET = process.env.SECRET;
    console.log("SECRET : ",SECRET);

    const dataDecoded = jwt.verify(token, SECRET);

    //console.log("Decoded User",dataDecoded);

    req.utilisateur = dataDecoded;

    next();

  } catch (err) {
    return res.status(401).json({ data: { message: "Token invalide ou expiré !" } });
  }
};

module.exports = verifierToken;
