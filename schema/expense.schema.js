const { object, string, number } = require("yup");

const createExpenseSchema = object({
  body: object({
    amount: number().positive().integer().required("amount is required"),
    title: string().required("title is required"),
    expense_date: string().required("expense_date is required"),
  }),
});
const getExpenseSchema = object({
  body: object({
    date: string().required("date is required"),
  }),
});

module.exports = {
  createExpenseSchema,
  getExpenseSchema,
};
