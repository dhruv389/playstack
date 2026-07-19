/**
 * Role-based access control middleware.
 * Usage: authorize('Super Admin', 'HR Manager')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not permitted to perform this action`,
      })
    }
    next()
  }
}
