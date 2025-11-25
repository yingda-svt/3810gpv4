const bcrypt = require('bcrypt');
const User = require('../models/User');

function getLogin(req, res) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { title: 'Sign in to Online Learning Environment', error: null });
}

async function postLogin(req, res) {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.render('login', {
      title: 'Sign in to Online Learning Environment',
      error: 'Please enter both user ID and password.',
    });
  }

  const user = await User.findOne({ userId });
  if (!user) {
    return res.render('login', {
      title: 'Sign in to Online Learning Environment',
      error: 'Invalid user ID or password.',
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render('login', {
      title: 'Sign in to Online Learning Environment',
      error: 'Invalid user ID or password.',
    });
  }

  req.session.user = {
    id: user._id,
    name: user.name,
    userId: user.userId,
    role: user.role,
  };

  res.redirect('/dashboard');
}

function postLogout(req, res) {
  req.session = null;
  res.redirect('/login');
}

module.exports = {
  getLogin,
  postLogin,
  postLogout,
};

