import 'express-async-errors';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { MONGO_URI, PORT } from './globals/globals.js';
import { getBaseDirname } from './funcitions/index.js';
import { imageFilter } from './extras/multer/multerImageFilter.js';
const app = express();

// Rate limiter
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 4000, // 4000 every 40 mins
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const __dirname = getBaseDirname();

// Configurations
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(morgan('short'));
app.use('/api/v1/assets', express.static(path.join(__dirname, 'public/assets')));

// Multer configuration

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB in bytes
  fileFilter: imageFilter,
});

// Custom Middleware
import errorHandlerMiddleware from './middleware/error-handler.middleware.js';
import notFoundMiddleware from './middleware/not-found.middleware.js';
import authMiddleware from './middleware/auth.middleware.js';
import projectMiddleware from './middleware/project.middleware.js';
import totalRequests from './middleware/totalRequests.middleware.js';
import calculateResponseSize from './middleware/calculateResponseSize.middleware.js';

// Connect
import connect from './db/connect.js';

// Route Imports
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import publicRoute from './routes/public.route.js';
import projectRoute from './routes/project.route.js';
import portfolioRoute from './routes/portfolio.route.js';
import templateRoute from './routes/template.route.js';

// Routes
app.use(calculateResponseSize);

app.use(totalRequests);
// Public route
app.use('/api/v1', publicRoute);
// Template
app.use('/api/v1/template', upload.single('picture'), templateRoute);
// Auth route
app.use('/api/v1/auth', upload.single('picturePath'), authRoute);
//user route
app.use('/api/v1/user', upload.single('picture'), authMiddleware, userRoute);
// portfolio route
app.use('/api/v1/portfolio', authMiddleware, portfolioRoute);
//project route
app.use('/api/v1/project', upload.single('picture'), authMiddleware, projectMiddleware, projectRoute);

app.get('/', (req, res) => {
  res.status(200).send('<h1>Server Working</h1>');
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.listen(PORT, async () => {
  try {
    await connect(MONGO_URI);
    console.log(`Server listening at http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
