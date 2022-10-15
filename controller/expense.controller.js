const model = require("../models/index");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");
//SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
//let date = moment("12-10 01am", "DD-MM hhA").utc(false).format("hha DD-MM")
//console.log(date)

const func = async () => {
  let span = 6;
  let f = "HH:mm DD-MM-YYYY";
  let dateNow = moment().utc().format("HH:mm DD-MM-YYYY");
  let zeroTime = moment().utc().format("00:00 DD-MM-YYYY");
  console.log("c --->", dateNow, zeroTime);
  let start = moment(zeroTime, f).utc(true).subtract(span, "days").toDate();
  let end = moment(dateNow, f).utc(true).toDate();
  console.log("start -->", start);
  console.log("end -->", end);
  console.log("res -->", moment(start).format(f), moment(end).format(f));
};
func();
const methods = {
  weekGraph: async (req, res) => {
    console.log("<== Week Graph Called");
    console.log("<== WIHTOUT", moment().format("hhA DD-MMM"));
    console.log("<== UTC FALSE", moment().utc().format("hhA DD-MMM"));
    try {
      let span = 6;
      if (!req.token?.id) throw "Error! Invalid request";
      let f = "HH:mm DD-MM-YYYY";
      let dateNow = moment().utc().format("HH:mm DD-MM-YYYY");
      let zeroTime = moment().utc().format("00:00 DD-MM-YYYY");
      console.log("c --->", dateNow, zeroTime);
      let start = moment(zeroTime, f).utc(true).subtract(span, "days").toDate();
      let end = moment(dateNow, f).utc(true).toDate();
      console.log("start -->", start);
      console.log("end -->", end);
      console.log("res -->", moment(start).format(f), moment(end).format(f));
      let weekly = await model.Expenses.findAll({
        where: {
          user_id: req.token.id,
          expense_date: {
            [Op.between]: [start, end],
          },
        },
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total_sum"],
          [Sequelize.fn("day", Sequelize.col("expense_date")), "day"],
          [Sequelize.fn("month", Sequelize.col("expense_date")), "month"],
          [Sequelize.fn("year", Sequelize.col("expense_date")), "year"],
        ],
        group: ["day", "month", "year"],
        order: ["month", "day"],
        raw: true,
      });
      if (!weekly) throw "Error! Cannot fetch expenses";
      if (!weekly.length) {
        return res.status(200).json({
          success: true,
          msg: "Expenses fetched Successfully",
          result: null,
        });
      }
      console.log(weekly);
      const fmt_week = weekly.map((x) => ({
        sum: x.total_sum,
        date: moment(`${x.day}-${x.month}-${x.year}`, "D-M-YYYY").format(
          "DD-MM-YYYY"
        ),
      }));
      console.log(fmt_week);
      let labels = [];
      let vals = [];
      for (let i = span; i >= 0; i--) {
        let date = moment().subtract(i, "days").format("DD-MM-YYYY");
        let found = false;
        labels.push(date);
        for (let j = 0; j < fmt_week.length; j++) {
          if (fmt_week[j].date === date) {
            found = true;
            vals.push(fmt_week[j].sum);
            break;
          }
        }
        if (!found) vals.push(0);
      }
      return res.status(200).json({
        success: true,
        msg: "Expenses fetched Successfully",
        result: { labels, vals },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot fetch expense", error });
    }
  },
  monthGraph: async (req, res) => {
    console.log("<== Month Graph Called");
    try {
      let span = 11;
      if (!req.token?.id) throw "Error! Invalid request";
      let month = moment().format("DD-MM-YYYY");
      let start = moment(moment().format("01-MM-YYYY"), "DD-MM-YYYY")
        .utc()
        .subtract(span, "months")
        .toDate();
      let end = moment(`${month}`, "DD-MM-YYYY").add(1, "day").utc().toDate();
      console.log(start, end);
      let monthly = await model.Expenses.findAll({
        where: {
          user_id: req.token.id,
          expense_date: {
            [Op.between]: [start, end],
          },
        },
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total_sum"],
          [Sequelize.fn("month", Sequelize.col("expense_date")), "month"],
          [Sequelize.fn("year", Sequelize.col("expense_date")), "year"],
        ],
        group: ["month", "year"],
        order: ["year", "month"],
        raw: true,
      });
      if (!monthly) throw "Error! Cannot fetch expenses";
      if (!monthly.length) {
        return res.status(200).json({
          success: true,
          msg: "Expenses fetched Successfully",
          result: null,
        });
      }
      const fmt_month = monthly.map((x) => ({
        sum: x.total_sum,
        date: moment(`${x.month}-${x.year}`, "M-YYYY").format("MM-YYYY"),
      }));
      let labels = [];
      let vals = [];
      for (let i = span; i >= 0; i--) {
        let date = moment().subtract(i, "months").format("MM-YYYY");
        let found = false;
        labels.push(date);
        for (let j = 0; j < fmt_month.length; j++) {
          if (fmt_month[j].date === date) {
            found = true;
            vals.push(fmt_month[j].sum);
            break;
          }
        }
        if (!found) vals.push(0);
      }
      return res.status(200).json({
        success: true,
        msg: "Expenses fetched Successfully",
        result: { labels, vals },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot fetch expense", error });
    }
  },
  createExpense: async (req, res) => {
    console.log("<== Create Expense Called");
    let data = req.body;
    console.log(data);
    try {
      if (!req.token?.id) throw "Error! Invalid request";
      if (!data || !data.amount || !data.title || !data.expense_date)
        throw "Error! Invalid request";
      data.user_id = req.token.id;
      let expense = await model.Expenses.create(data);
      return res.status(200).json({
        success: true,
        msg: "Expense created Successfully",
        expense,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot create expense", error });
    }
  },
  getExpenses: async (req, res) => {
    console.log("<== Get Expense Called");
    try {
      if (!req.token?.id) throw "Error! Invalid request";
      let { date } = req.body;
      if (!date) throw "Error! No date found";
      let start = moment(`01-${date}`, "DD-MMM-YYYY").utc().toDate();
      let end = moment(`01-${date}`, "DD-MMM-YYYY")
        .utc()
        .add("1", "month")
        .toDate();
      let expenses = await model.Expenses.findAll({
        where: {
          user_id: req.token.id,
          expense_date: {
            [Op.between]: [start, end],
          },
        },
        attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
        order: [["expense_date", "desc"]],
      });
      expenses.map((x) => console.log(`<== ${x.id} ${x.expense_date}`));
      if (!expenses || !expenses.length) {
        return res.status(200).json({
          success: true,
          msg: `You dont have any expenses for ${date}`,
          total_expense: null,
          expenses: [],
        });
      }
      let total_expense = await model.Expenses.sum("amount", {
        where: {
          user_id: req.token.id,
          expense_date: {
            [Op.between]: [start, end],
          },
        },
      });
      return res.status(200).json({
        success: true,
        msg: "Expense fetched Successfully",
        total_expense,
        expenses,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot fetch expenses", error });
    }
  },
  deleteExpense: async (req, res) => {
    console.log("<== Delete Expense Called");
    try {
      if (!req.token?.id || !req.params.id) throw "Error! Invalid request";
      let user = await model.Users.findByPk(req.token?.id);
      if (!user) throw "Error! Invalid request";
      let expense = await model.Expenses.findOne({
        where: { id: req.params?.id, user_id: req.token.id },
      });
      await expense.destroy();
      return res.status(200).json({
        success: true,
        msg: "Expense deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ success: false, msg: "Cannot deleted expense", error });
    }
  },
};

module.exports = methods;
