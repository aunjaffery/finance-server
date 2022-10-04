const { object, ref, string } = require("yup");

const createUserSchema = object({
  body: object({
    fullName: string().required("fullName is required"),
    password: string()
      .required("password is required")
      .min(6, "password is too short - should be 6 character minimum"),
    password2: string()
      .required("password2 is required")
      .oneOf([ref("password"), null], "passwords do not match"),
    email: string()
      .email("must be a valid email")
      .required("email is required"),
  }),
});
const changeUserNameSchema = object({
  body: object({
    fullName: string().required("fullName is required"),
  }),
});
const changePassSchema = object({
  body: object({
    oldPass: string().required("oldPass is required"),
    newPass: string().required("newPass is required"),
    newPass2: string()
      .required("newPass2 is required")
      .oneOf([ref("newPass"), null], "passwords do not match"),
  }),
});

const loginUserSchema = object({
  body: object({
    email: string()
      .email("must be a valid email")
      .required("email is required"),
    password: string()
      .required("password is required")
      .min(6, "password is too short - should be 6 character minimum"),
  }),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  changeUserNameSchema,
  changePassSchema,
};
