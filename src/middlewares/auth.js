export const auth = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).redirect("/unauthorized");
    }

    const userRole = req.user.user.role;
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).redirect("/unauthorized");
  };
};