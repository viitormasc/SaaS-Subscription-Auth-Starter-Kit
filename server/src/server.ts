import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import csrf from 'csurf';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import configurePassport from './config/passport';
import connectDB from './database/database';
import authRoute from './routes/authRoute';
import stripeWebhookRoute from './routes/stripeWebhookRoute';
import subscriptionRoute from './routes/subscriptionsRoute';
import userRoute from './routes/userRoutes';
dotenv.config();
const app = express();
//cors policy to make request from other servers

const whiteList = ['https://react2.vitormascarenhas.online', 'http://localhost:3000', 'http://localhost:5174', 'http://localhost:5173', process.env.FRONT_END_URL];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (
      !origin || // allow requests like curl or Postman
      whiteList.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 400, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // keyGenerator: (req, res) => ipKeyGenerator(req.ip as string)
})

app.use(limiter);
// this route need to come before express.json() because it uses raw data not json()
app.use('/webhook', express.raw({ type: 'application/json' }))
app.use('/webhook', stripeWebhookRoute)

app.use(cors(corsOptions));


app.use(cookieParser())
app.use(limiter);
app.use(morgan('short'))
app.use(helmet())
app.use(csrf({ cookie: { httpOnly: true, sameSite: 'strict' } }))
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  next()
})


app.use(
  session({
    secret: process.env.EXPRESS_SECTION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING as string,
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native',
    }),
  }),
);

configurePassport(passport);

app.use(flash());

// Passport middleware
app.use(passport.initialize())
app.use(passport.session());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/subscriptions', subscriptionRoute)

const startServer = async () => {
  await connectDB();

  const PORT = process.env.APP_PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});