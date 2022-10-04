const model = require("../models/index");
const { fakeClients } = require("../utils/faker");
const createBulkClients = async () => {
  try {
    await model.Clients.bulkCreate(fakeClients());
  } catch (err) {
    console.log(err);
  }
};
const methods = {
  createClient: async (req, res) => {
    console.log("<== Create Client Called");
    let data = req.body;
    try {
      if (!data || !data.fullName || !data.relation)
        throw "Error! Invalid request";
      if (!req.token?.id) throw "Error! Invalid request";
      data.user_id = req.token.id;
      let client = await model.Clients.create(data);
      if (!client) throw "Error! Cannot create client";
      return res.status(200).json({
        success: true,
        msg: "Client created Successfully",
        result: client,
      });
    } catch (error) {
      return res
        .status(501)
        .json({ success: false, msg: "Cannot create client", error });
    }
  },
  getUserClients: async (req, res) => {
    console.log("<== Get User Clients Called");
    let sorting = ["id", "desc"];
    try {
      if (!req.token?.id) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token?.id);
      if (!user) throw "Error! Invalid request";
      let clients = await model.Clients.findAll({
        where: { user_id: req.token?.id },
        order: [sorting],
      });
      return res.status(200).json({
        success: true,
        msg: "Clients found Successfully",
        result: clients,
      });
    } catch (error) {
      return res
        .status(501)
        .json({ success: false, msg: "Cannot fetch clients", error });
    }
  },
  deleteClient: async (req, res) => {
    console.log("<== Delete Clients Called");
    try {
      if (!req.token?.id || !req.params.id) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token?.id);
      if (!user) throw "Error! Invalid request";
      let client = await model.Clients.findOne({
        where: { id: req.params?.id, user_id: req.token?.id },
      });
      await client.destroy();
      return res.status(200).json({
        success: true,
        msg: "Client deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot delete client", error });
    }
  },
};

module.exports = methods;
