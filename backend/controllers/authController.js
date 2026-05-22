import User from '../models/User.js';
import CandidateProfile from '../models/CandidateProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (!['candidate', 'employer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (role === 'employer' && !companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required for employers' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    if (role === 'candidate') {
      await CandidateProfile.create({ userId: user._id });
    } else if (role === 'employer') {
      await EmployerProfile.create({ userId: user._id, companyName });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      const tokens = generateTokens(user);

      res.status(200).json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      });
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  // In a more robust system, we would blacklist the refresh token in the DB or Redis.
  // For now, client just deletes it.
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
