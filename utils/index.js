const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret = "financeb055_s3cr3t";

const methods = {
  hashPassword: (password) => {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(password, 10, (err, passwordHash) => {
        if (err) {
          reject(err);
        } else {
          resolve(passwordHash);
        }
      });
    });
  },

  comparePassword: (pw, hash) => {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(pw, hash, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  issueToken: (payload) => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn: "2d" }, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  timer: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  },

  verifyToken: (token, cb) => jwt.verify(token, secret, {}, cb),

  generateRandomToken: (length) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, function (err, buffer) {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString("hex"));
        }
      });
    });
  },
  //Upload Image File
  uploadImage: (file, path) => {
    return new Promise((resolve) => {
      try {
        let sampleFile = file;
        let x = new Date();
        let filename =
          file.name +
          "" +
          x.getDate() +
          "" +
          x.getMonth() +
          "" +
          x.getFullYear() +
          "" +
          x.getHours() +
          "" +
          x.getMinutes() +
          "" +
          x.getSeconds() +
          ".jpg";
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(path + filename, (err) => {
          if (err) {
            throw err;
          }
          resolve(filename);
        });
      } catch (err) {
        throw err;
      }
    });
  },
};

module.exports = methods;
