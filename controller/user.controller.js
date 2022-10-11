const model = require("../models/index");
const utils = require("../utils/index");

const methods = {
  signUpUser: async (req, res) => {
    console.log("<== Signup Called*");
    let data = req.body;
    try {
      if (!data || !data.email || !data.password || !data.password2)
        throw "Error! Invalid request";
      if (data.password !== data.password2)
        throw "Error! Password do not match";
      data.password = await utils.hashPassword(data.password);
      delete data.password2;
      let user = await model.Users.create(data);
      if (!user) throw "Error! Cannot create user";
      let access_token = await utils.issueToken({ id: user.dataValues.id });
      let result = {
        user: {
          id: user.dataValues.id,
          fullName: user.dataValues.fullName,
          email: user.dataValues.email,
        },
        access_token,
      };
      return res.status(200).json({
        success: true,
        result,
        msg: "You have Registered Successfully",
      });
    } catch (error) {
      console.log(error);
      if (error.original && error.original.errno === 1062) {
        return res
          .status(501)
          .json({ success: false, msg: "This Email already exists" });
      }
      return res
        .status(501)
        .json({ success: false, msg: "Error! Cannot create user", error });
    }
  },
  changeName: async (req, res) => {
    console.log("<== Change Name Called");
    try {
      if (!req.token?.id) throw "Error! Invalid request";
      let name = req.body?.fullName;
      if (!name) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token.id);
      if (!user) throw "Error! Invalid request";
      await user.update({ fullName: name });
      return res
        .status(200)
        .json({ success: true, msg: "Name changed Successfully" });
    } catch (error) {
      return res
        .status(501)
        .json({ success: false, msg: "Error! Cannot Change Name", error });
    }
  },
  changePass: async (req, res) => {
    console.log("<== Change Pass Called");
    try {
      let data = req.body;
      if (!req.token?.id) throw "Error! Invalid request";
      if (!data || !data.oldPass || !data.newPass || !data.newPass2)
        throw "Error! Invalid request";
      if (data.newPass !== data.newPass2) throw "Error! Password do not match";
      let user = await model.Users.findByPk(req.token.id);
      if (!user) throw "Error! Invalid request";
      let match = await utils.comparePassword(
        data?.oldPass,
        user.dataValues.password
      );
      if (!match) throw "Error! Invalid credentials";
      let pass = await utils.hashPassword(data.newPass);
      await user.update({ password: pass });
      return res
        .status(200)
        .json({ success: true, msg: "password changed Successfully" });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Error! Cannot Change password", error });
    }
  },
  loginUser: async (req, res) => {
    console.log("<== User login Called");
    const { email, password } = req.body;
    try {
      if (!email || !password) throw "Error! Invalid request";
      let user = await model.Users.findOne({
        where: { email },
      });
      if (!user || !user.dataValues.status) throw "Error! Invalid credentials";
      let match = await utils.comparePassword(
        password,
        user.dataValues.password
      );
      if (!match) throw "Error! Invalid credentials";
      let access_token = await utils.issueToken({ id: user.dataValues.id });
      let result = {
        user: {
          id: user.dataValues.id,
          fullName: user.dataValues.fullName,
          email: user.dataValues.email,
        },
        access_token,
      };
      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Error! Invalid request", error });
    }
  },
  validation: async (req, res) => {
    console.log("<== User Validation called");
    try {
      const { id } = req.token;
      let user = await model.Users.findByPk(id);
      if (!user) throw "Error! Invalid token";
      let access_token = await utils.issueToken({
        id: user.dataValues.id,
      });
      let result = {
        user: {
          id: user.dataValues.id,
          fullName: user.dataValues.fullName,
          email: user.dataValues.email,
        },
        access_token,
      };
      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ success: false, msg: "Invalid Token", error });
    }
  },
};

module.exports = methods;
