module.exports = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false }
    );
    return next();
  } catch (e) {
    return res.status(501).json({ succes: false, error: e.errors });
  }
};
