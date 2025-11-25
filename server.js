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

// 設定 trust proxy 以正確處理反向代理（Render 一般用於 HTTPS）
app.set('trust proxy', 1);

// 讀取環境變數，設定 port
const PORT = process.env.PORT || 4000;

// 讀取資料庫連線字串
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI 不存在！請在 Render 的環境變數中設定 MONGODB_URI');
  process.exit(1);
}

// 讀取 session secret
const SESSION_SECRET = process.env.SESSION_SECRET || 'change_me_session_secret';

async function bootstrap() {
  try {
    // 連線資料庫
    await connectDB(MONGODB_URI);
    console.log('MongoDB 連線成功');

    // 確保預設管理員帳號
    await ensureAdminUser();

    // 設定 view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.set('layout', 'layouts/main');
    app.use(expressLayouts);

    // 中介軟體
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(morgan('dev'));

    // Cookie session
    app.use(
      cookieSession({
        name: 'oleSession',
        secret: SESSION_SECRET,
        httpOnly: true,
        secure: false, // 測試用，正式請改為 true
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
    );

    // 信任反向代理（Render 一般用）
    // 已在上面用 app.set('trust proxy', 1);
    // 這有助於 secure cookies 正確傳送

    // 附加用戶資料中介
    app.use(attachUser);

    // 預設路由
    app.get('/', (req, res) => {
      if (req.session.user) {
        return res.redirect('/dashboard');
      }
      return res.redirect('/login');
    });

    // 其他路由
    app.use('/', authRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.use('/courses', courseRoutes);
    app.use('/students', studentRoutes);
    app.use('/teachers', teacherRoutes);
    app.use('/assignments', assignmentRoutes);
    app.use('/grades', gradeRoutes);
    app.use('/api', apiRoutes);

    // 404
    app.use((req, res) => {
      res.status(404).render('404', { title: 'Page Not Found' });
    });

    // 錯誤處理
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).render('500', { title: 'Server Error', error: err.message });
    });

    // 啟動伺服器
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('啟動失敗:', err);
    process.exit(1);
  }
}

bootstrap();
