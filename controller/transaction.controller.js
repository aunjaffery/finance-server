const model = require("../models/index");

const methods = {
  pieTransaction: async (req, res) => {
    console.log("<== Pie Transaction called");
    try {
      if (!req.token?.id) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token.id);
      if (!user) throw "Error! Invalid request";
      const total_lent = await model.Transactions.count({
        where: {
          user_id: req.token.id,
          type: "lent",
        },
      });
      const total_borrowed = await model.Transactions.count({
        where: {
          user_id: req.token.id,
          type: "borrowed",
        },
      });
      const lent_pending = await model.Transactions.count({
        where: {
          user_id: req.token.id,
          type: "lent",
          status: [0, 2],
        },
      });
      const borrowed_pending = await model.Transactions.count({
        where: {
          user_id: req.token.id,
          type: "borrowed",
          status: [0, 2],
        },
      });
      const labels = [
        "Total lent",
        "Total borrowed",
        "Lent pending",
        "Borrowed pending",
      ];
      const vals = [total_lent, total_borrowed, lent_pending, borrowed_pending];
      let check = vals.every((x) => x === 0);
      if (check) {
        return res.status(200).json({
          success: true,
          msg: "transaction pie fetched Successfully",
          result: null,
        });
      } else {
        return res.status(200).json({
          success: true,
          msg: "transaction pie fetched Successfully",
          result: { labels, vals },
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot fetch pie transaction", error });
    }
  },
  createTransaction: async (req, res) => {
    console.log("<== Create transaction Called");
    let data = req.body;
	  console.log(data)
    try {
      if (!data || !data.amount || !data.client_id)
        throw "Error! Invalid request";
      if (!req.token?.id) throw "Error! Invalid request";
      data.user_id = req.token.id;
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
      if (!req.token?.id) throw "Error! Invalid request";
      let id = req.query?.trans_id;
      if (!id) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token.id);
      if (!user) throw "Error! Invalid request";
      let transaction = await model.Transactions.findOne({
        where: { id, user_id: req.token.id },
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
        order: [
          [
            { model: model.Payments, as: "transactionpayment" },
            "remaining_amount",
            "asc",
          ],
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
        user_id: req.token.id,
      };
      if (data.status && data.status === "pending") {
        condition.status = [0, 2];
      }
      if (data.status && data.status === "done") {
        condition.status = 1;
      }
      let user = await model.Users.findByPk(req.token.id);
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
      let user = await model.Users.findByPk(req.token.id);
      if (!user) throw "Error! Invalid request";
      let transaction = await model.Transactions.findOne({
        where: { id: req.params?.id, user_id: req.token.id },
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
    try {
      if (!req.token?.id || !data || !data.id || !data.amount)
        throw "Error! Invalid request";
      let transaction = await model.Transactions.findOne({
        where: { id: data.id, user_id: req.token.id },
      });
      if (!transaction) throw "Error! No transaction found";
      let { status, amount, remaining_amount } = transaction?.dataValues;
      if (!remaining_amount) throw "Error! Already completed";
      if (status !== 0 && status !== 2) throw "Error! Invalid status";
      if (data.amount >= amount || !data.amount) {
        await transaction.update({
          status: 1,
          last_transaction: data.paymentDate,
          remaining_amount: 0,
        });
        await model.Payments.create({
          paid_amount: amount,
          total_amount: amount,
          remaining_amount: 0,
          transaction_date: data.paymentDate,
          transaction_id: transaction.dataValues.id,
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
