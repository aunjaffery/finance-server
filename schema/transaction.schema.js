const { object, string, number } = require("yup");

const createTransactionSchema = object({
  body: object({
    amount: number().positive().integer().required("amount is required"),
    type: string().required("type is required"),
    transaction_date: string().required("date is required"),
    client_id: number().positive().integer().required("client_id is required"),
  }),
});

const markTransactionSchema = object({
  body: object({
    paymentDate: string().required("paymentDate date is required"),
    id: number().positive().integer().required("id is required"),
    amount: number().positive().integer().required("amount is required"),
  }),
});

const transactionDetailSchema = object({
  query: object({
    trans_id: number().positive().integer().required("trans_id is required"),
  }),
});

module.exports = {
  createTransactionSchema,
  markTransactionSchema,
  transactionDetailSchema,
};
