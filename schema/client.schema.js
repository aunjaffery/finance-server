const { object, string } = require("yup");

const createClientSchema = object({
  body: object({
    fullName: string().required("fullName is required"),
    relation: string().required("relation is required"),
  }),
});

module.exports = { createClientSchema };
