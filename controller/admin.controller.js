const model = require("../models/index");
const utils = require("../utils/index");

const methods = {
  superAdmin: async (req, res) => {
    console.log("SuperAdmin Called");
    try {
      const data = {
        fullName: "Super Admin",
        username: "superadmin",
        password: "qwe123",
      };
      data.password = await utils.hashPassword(data.password);
      console.log(data);
      await model.Admin.create(data);
      return res
        .status(200)
        .json({ success: true, msg: "Success! Admin created" });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Failed! Cannot create admin", error });
    }
  },
  getAdmin: async (req, res) => {
    console.log("Get Admin Called");
    try {
      const admins = await model.Admin.findAll({});
      return res.status(200).json({ success: true, data: admins });
    } catch (error) {
      console.log(error);
      return res
        .status(502)
        .json({ success: false, msg: "Failed! Cannot fetch admins" });
    }
  },
};

module.exports = methods;
