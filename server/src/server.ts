import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import methodOverride from 'method-override';
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
  windowMs: 1000 * 60 * 120,
  max: 1000,
});
app.use(limiter);
// this route need to come before express.json() because it uses raw data not json()
app.use('/webhook', stripeWebhookRoute)

app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json());
app.use(methodOverride('_method'));

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