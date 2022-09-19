const model = require("../models/index");
const { timer } = require("../utils");
const Op = model.Sequelize.Op;

const methods = {
  createTransaction: async (req, res) => {
    console.log("<== Create transaction Called");
    let data = req.body;
    try {
      if (!data || !data.amount || !data.client_id)
        throw "Error! Invalid request";
      if (!req.token?.id) throw "Error! Invalid request";
      data.user_id = req.token?.id;
      data.remaining_amount = data.amount;
      data.status = 0;
      let client = await model.Clients.findByPk(data.client_id);
      if (!client) throw "Error! Client not found";
      await model.Transactions.create(data);
      return res.status(200).json({
        success: true,
        msg: "transaction created Successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot create transaction", error });
    }
  },
  getTransactionDetails: async (req, res) => {
    console.log("<== Get transactionDetails Called");
    try {
      console.log(req.query);
      if (!req.token?.id) throw "Error! Invalid request";
      let id = req.query?.trans_id;
      if (!id) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token?.id);
      if (!user) throw "Error! Invalid request";
      let transaction = await model.Transactions.findOne({
        where: { id, user_id: req.token?.id },
        include: [
          {
            model: model.Clients,
            as: "transactionclient",
            attributes: ["id", "fullName", "relation"],
          },
          {
            model: model.Payments,
            as: "transactionpayment",
          },
        ],
      });
      return res.status(200).json({
        success: true,
        msg: "Transaction found Successfully",
        result: transaction,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        success: false,
        msg: "Cannot fetch transaction details",
        error,
      });
    }
  },
  getTransactions: async (req, res) => {
    console.log("<== Get transactions Called");
    let sorting = ["id", "desc"];
    try {
      let data = req.body;
      if (!req.token?.id) throw "Error! Invalid request";
      let condition = {
        user_id: req.token?.id,
      };
      if (data.status && data.status === "pending") {
        condition.status = [0, 2];
      }
      if (data.status && data.status === "done") {
        condition.status = 1;
      }
		console.log(condition)
      let user = await model.Users.findByPk(req.token?.id);
      if (!user) throw "Error! Invalid request";
      let transactions = await model.Transactions.findAll({
        where: condition,
        include: [
          {
            model: model.Clients,
            as: "transactionclient",
            attributes: ["id", "fullName", "relation"],
          },
        ],
        order: [sorting],
      });
      return res.status(200).json({
        success: true,
        msg: "Transactions found Successfully",
        result: transactions,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot fetch transactions", error });
    }
  },
  deleteTransaction: async (req, res) => {
    console.log("<== Delete transactions Called");
    try {
      if (!req.token?.id || !req.params.id) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token?.id);
      if (!user) throw "Error! Invalid request";
      let transaction = await model.Transactions.findOne({
        where: { id: req.params?.id, user_id: req.token?.id },
      });
      await transaction.destroy();
      return res.status(200).json({
        success: true,
        msg: "Transaction deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot deleted transaction", error });
    }
  },
  markTransaction: async (req, res) => {
    console.log("<== Mark transactions Called");
    const data = req.body;
    console.log(data);
    try {
      if (!req.token?.id || !data || !data.id || !data.amount)
        throw "Error! Invalid request";
      let transaction = await model.Transactions.findOne({
        where: { id: data.id, user_id: req.token?.id },
      });
      if (!transaction) throw "Error! No transaction found";
      let { status, amount, remaining_amount } = transaction?.dataValues;
      console.log(remaining_amount);
      if (!remaining_amount) throw "Error! Already completed";
      if (status !== 0 && status !== 2) throw "Error! Invalid status";
      if (data.amount >= amount || !data.amount) {
        await transaction.update({
          status: 1,
          last_transaction: data.paymentDate,
          remaining_amount: 0,
        });
      } else {
        let remainCalc = Math.max(0, remaining_amount - data.amount);
        await model.Payments.create({
          paid_amount: data.amount,
          total_amount: amount,
          remaining_amount: remainCalc,
          transaction_date: data.paymentDate,
          transaction_id: transaction.dataValues.id,
        });
        await transaction.update({
          status: remainCalc ? 2 : 1,
          remaining_amount: remainCalc,
          last_transaction: data.paymentDate,
        });
      }
      return res.status(200).json({
        success: true,
        msg: "Transaction completed Successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot complete transaction", error });
    }
  },
};

module.exports = methods;
