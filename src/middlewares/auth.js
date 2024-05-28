export const auth = (role) => (req, res, next) => {
  if (req.user.user.role === role) return next();

  res.redirect("/unauthorized");
};