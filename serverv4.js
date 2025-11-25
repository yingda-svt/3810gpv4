require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/database');
const ensureAdminUser = require('./config/admin');
const { attachUser } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const assignmentRoutes = require('./routes/assignments');
const gradeRoutes = require('./routes/grades');
const apiRoutes = require('./routes/api');

const app = express();

process.env.PORT = 4000;
process.env.MONGODB_URI = 'mongodb+srv://s1404001:14040010@cluster0.llkhaon.mongodb.net/ole_system?retryWrites=true&w=majority';
process.env.SESSION_SECRET = 'change_me_session_secret';
process.env.ADMIN_USER_ID = 'Admin';
process.env.ADMIN_NAME = 'OLE Admin';
process.env.ADMIN_PASSWORD = 'Admin';


const PORT = process.env.PORT;

async function bootstrap() {
  try {
    await connectDB(process.env.MONGODB_URI);
    await ensureAdminUser();

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.set('layout', 'layouts/main');
    app.use(expressLayouts);

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(morgan('dev'));

    app.use(
      cookieSession({
        name: 'oleSession',
        secret: process.env.SESSION_SECRET || 'ole_secret',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
    );

    app.use(attachUser);

    app.get('/', (req, res) => {
      if (req.session.user) {
        return res.redirect('/dashboard');
      }
      return res.redirect('/login');
    });

    app.use('/', authRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.use('/courses', courseRoutes);
    app.use('/students', studentRoutes);
    app.use('/teachers', teacherRoutes);
    app.use('/assignments', assignmentRoutes);
    app.use('/grades', gradeRoutes);
    app.use('/api', apiRoutes);

    app.use((req, res) => {
      res.status(404).render('404', { title: 'Page Not Found' });
    });

    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).render('500', { title: 'Server Error', error: err.message });
    });

    app.listen(PORT, () => {
      console.log(`🚀 OLE server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Application startup failed:', error);
    process.exit(1);
  }
}

bootstrap();

