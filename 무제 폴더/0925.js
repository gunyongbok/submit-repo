const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(404).json(err.array());
  }
};

// 로그인
router.post(
  "/login",
  [
    body("email").notEmpty().isInt().withMessage("이메일 확인 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    validate,
  ],
  function (req, res) {
    const { email, password } = req.body;

    let sql = `SELECT * FROM users Where email = ?`;
    conn.query(sql, email, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      var loginUser = results[0];

      if (loginUser && loginUser.password == password) {
        // 토큰 발급
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "30m",
            issuer: "gunyong",
          }
        );

        res.cookie("token", token, {
          httpOny: true,
        });

        res.status(200).json({
          message: "로그인 되었습니다.",
          token: token,
        });
      } else {
        res.status(404).json({
          message: "이메일 또는 비밀번호가 틀렸습니다.",
        });
      }
    });
  }
);
