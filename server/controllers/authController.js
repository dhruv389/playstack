import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Helper — sign a JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

// @route  POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with that email' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Try again.' })
    }

    const token = signToken(user._id)

    // Build the AuthUser shape the frontend expects
    const authUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      employeeRecordId: user.employeeRecordId ? user.employeeRecordId.toString() : null,
    }

    res.status(200).json({
      success: true,
      token,
      user: authUser,
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
}

// @route  POST /api/auth/logout
// @access Private
export const logout = async (_req, res) => {
  // JWT is stateless — client just drops the token.
  // For completeness we acknowledge the request.
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const authUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      employeeRecordId: user.employeeRecordId ? user.employeeRecordId.toString() : null,
    }

    res.status(200).json({ success: true, user: authUser })
  } catch (err) {
    console.error('GetMe error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
