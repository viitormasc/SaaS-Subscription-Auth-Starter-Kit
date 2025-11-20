#  Full Stack SaaS Starter Kit

> **A production-ready SaaS starter kit with authentication(google and local),subscription payments (stripe), and email integration(to recovery account, change passwords and confirm real account), google recaptcha and much more! Focus on building your product, and use this repo to make a faster app ready for prod!**

##  Demo Video

https://youtu.be/Hf3J6HceH1o


![alt text](https://github.com/viitormasc/SaaS-Subscription-Auth-Starter-Kit/blob/main/print1.png?raw=true)


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Email Service Setup](#email-service-setup)
- [Google OAuth Setup](#google-oauth-setup)
- [Google reCAPTCHA Setup](#google-recaptcha-setup)
- [Stripe Payment Setup](#stripe-payment-setup)
- [Cloudinary Setup](#cloudinary-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Common Issues](#common-issues)
- [Contributing](#contributing)
- [License](#license)


## 🎯 Overview

This is a **production-ready SaaS starter kit** designed to help developers launch their products faster. It includes all the essential features that every SaaS application needs:

✅ **Authentication System** (Local + Google OAuth)  
✅ **Password Management** (Recovery & Change Password)  
✅ **Email Integration** (AWS SES, Mailgun, or Nodemailer)  
✅ **Payment Processing** (Stripe Subscriptions)  
✅ **Security** (Google reCAPTCHA v3, Rate Limiting,csrf)  
✅ **Type-Safe** (100% TypeScript)  
✅ **Modern UI** (React 19, Tailwind CSS, shadcn/ui)
✅ **Caching api results** (uses react query to cache the results giving better performance to your app) 

**This is NOT a tutorial.** This is a **starter kit** that you can clone and build upon. All the boring infrastructure work is done – you can focus on your unique product features.

### What This Starter Kit Provides

 **Out of the box:**
- User registration with email verification
- Login with email/password or Google OAuth
- Forgot password & password reset flow
- Email notifications for all authentication events
- Stripe subscription management (monthly/annual billing)
- User profile management with photo upload
- Protected routes and role-based access
- RESTful API following best practices
- Security headers and CORS configuration
- Bot protection with reCAPTCHA v3
- CSRF protection to you requisitions

🛠️ **What you need to build:**
- Your unique application features
- Your business logic
- Your custom UI/UX on top of the foundation


## ✨ Features

### 🔐 Authentication & Security
- **Local Authentication**: Email/password with bcrypt hashing
- **Google OAuth 2.0**: One-click social login
- **Email Verification**: 6-digit verification codes
- **Password Recovery**: Secure password reset flow
- **Session Management**: Express sessions with MongoDB store
- **Rate Limiting**: Prevent brute force attacks
- **reCAPTCHA v3**: Bot protection on sensitive forms

### 💳 Payment & Subscriptions
- **Stripe Integration**: Full subscription lifecycle management
- **Multiple Plans**: Support for different pricing tiers (Free, Standard, Pro)
- **Billing Cycles**: Monthly and annual payment options
- **Webhook Handling**: Automatic subscription updates
- **Payment Portal**: Customer self-service billing management
- **Usage Tracking**: Monitor subscription status and limits

### 📧 Email System
- **Multiple Providers**: Choose between AWS SES, Mailgun, or Nodemailer
- **Transactional Emails**: Verification codes, password resets, welcome emails
- **Email Templates**: Professional HTML email designs
- **Retry Logic**: Automatic retry on failed sends
- **Development Mode**: Use Nodemailer for local testing

### 🎨 Modern Frontend
- **React 19**: Latest features and optimizations
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible components
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Form Validation**: Client and server-side validation

### 🏗️ Backend Architecture
- **Express.js**: Fast, minimalist web framework
- **MongoDB**: Document database with Mongoose ODM
- **TypeScript**: Type-safe API development
- **RESTful API**: Standard HTTP methods and status codes

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1
- **TypeScript** 5.8.3
- **Vite** 7.1.2
- **Tailwind CSS** 4.1.12
- **React Router** 7.8.2
- **React Query** 5.85.5
- **Axios** 1.11.0
- **shadcn/ui** components
- **Lucide Icons**

### Backend
- **Node.js** 18+
- **Express** 5.1.0
- **TypeScript** 5.9.2
- **MongoDB** with Mongoose 8.17.1
- **Passport.js** for authentication
- **Stripe** 19.1.0
- **Nodemailer** 7.0.6
- **AWS SES** SDK
- **Cloudinary** 2.7.0
- **bcryptjs** for password hashing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **MongoDB** account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - free tier available)
- **Stripe cli 1.3.1** 


### Required Services (Free Tiers Available)

You'll need accounts for these services:

1. **MongoDB Atlas** (Database) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
2. **Stripe** (Payments) - [Sign up](https://stripe.com/)
3. **Google Cloud Console** (OAuth & reCAPTCHA) - [Sign up](https://console.cloud.google.com/)
4. **Cloudinary** (Image hosting) - [Sign up](https://cloudinary.com/)
5. **Email Service** (Choose ONE):
   - **AWS SES** (Production) - [Sign up](https://aws.amazon.com/ses/)
   - **Mailgun** (Production) - [Sign up](https://www.mailgun.com/)
   - **Gmail/SMTP** (Development only) - Use your Gmail account


## 🚀 Installation

### Step 1: Clone the Repository

```bash
git https://github.com/viitormasc/SaaS-Subscription-Auth-Starter-Kit
cd SaaS-Subscription-Auth-Starter-Kit 
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies (client + server)
npm run install:all
```

This will install dependencies for both the client and server using npm workspaces.


## ⚙️ Environment Configuration

### Step 3: Create Environment Files

You need to create two `.env` files - one for the backend and one for the frontend.

#### Backend Environment Variables

Create `server/.env`:

```env
# Server Configuration
APP_PORT=2121
NODE_ENV=development

# Database
DB_STRING=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Session Secret (generate a random string)
EXPRESS_SECTION_SECRET=your-super-secret-key-change-this-in-production

# Frontend URL
FRONT_END_URL=http://localhost:5173

# Website Domain
WEBSITE_DOMAIN=localhost:2121

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CALLBACK_URL=http://localhost:2121/api/auth/google/callback

# Google reCAPTCHA v3
GOOGLE_RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Email Service (AWS SES)
AWS_SES_SMTP_USERNAME=your-aws-ses-smtp-username
AWS_SES_SMTP_PASSWORD=your-aws-ses-smtp-password
AWS_REGION=us-east-1

# Email Service (Mailgun) - Alternative to AWS SES
MAILGUN_ACCOUNT_KEY=your-mailgun-account-key
MAILGUN_API_KEY=your-mailgun-api-key

# Cloudinary (Image Upload)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Stripe Configuration
STRIPE_API_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Webhook Secrets (Production)
STRIPE_PROD_SNAP_WEBHOOK_SECRET=whsec_prod_snap_secret
STRIPE_PROD_THIN_WEBHOOK_SECRET=whsec_prod_thin_secret

# Stripe Price IDs (Create these in Stripe Dashboard)
STRIPE_STANDARD_MONTHLY_PRICE_ID=price_standard_monthly_id
STRIPE_STANDARD_ANNUAL_PRICE_ID=price_standard_annual_id
STRIPE_PRO_MONTHLY_PRICE_ID=price_pro_monthly_id
STRIPE_PRO_ANNUAL_PRICE_ID=price_pro_annual_id
```

#### Frontend Environment Variables

Create `client/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:2121

# Stripe (Frontend needs publishable key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Google reCAPTCHA v3 (Frontend Site Key)
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```
## Stripe webhook setup:

Open a terminal and run : 
```env
stripe listen --forward-to http://localhost:2121(or your backend port)/webhook
```

## 📧 Email Service Setup

You must choose **ONE** email provider. For development, you can use Nodemailer (Gmail). For production, use AWS SES or Mailgun.

### Option 1: Nodemailer (Development Only - Gmail)

**Best for:** Local development and testing

**Setup Steps:**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Navigate to "2-Step Verification" → "App passwords"
   - Generate a password for "Mail"
   - Copy the 16-character password

3. Update `server/.env`:
```env
# Use Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

4. Update `server/src/services/email/mailSender.ts`:
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

**⚠️ Gmail Limitations:**
- Max 500 emails/day
- Not recommended for production
- May be marked as spam

### Option 2: AWS SES (Production - Recommended)

**Best for:** Production applications with high email volume

**Setup Steps:**

1. **Create AWS Account**: [Sign up](https://aws.amazon.com/ses/)

2. **Verify Your Domain**:
   - Go to AWS SES Console → "Verified identities"
   - Click "Create identity" → Choose "Domain"
   - Add your domain (e.g., `yourdomain.com`)
   - Add the DNS records to your domain provider
   - Wait for verification (can take up to 72 hours)

3. **Verify Email Addresses** (for testing):
   - Go to "Verified identities" → "Create identity"
   - Choose "Email address"
   - Verify the email you'll use for sending

4. **Request Production Access** (removes sandbox limits):
   - Go to AWS SES Console → Account dashboard
   - Click "Request production access"
   - Fill out the form explaining your use case
   - Wait for approval (usually 24-48 hours)

5. **Create SMTP Credentials**:
   - Go to AWS SES Console → "SMTP settings"
   - Click "Create SMTP credentials"
   - Save the username and password

6. **Update `server/.env`**:
```env
AWS_SES_SMTP_USERNAME=your-smtp-username
AWS_SES_SMTP_PASSWORD=your-smtp-password
AWS_REGION=us-east-1
WEBSITE_DOMAIN=yourdomain.com
```

7. **Configure SPF and DKIM** (improves deliverability):
   - AWS provides DKIM records automatically
   - Add SPF record to your DNS:
   ```
   TXT @ "v=spf1 include:amazonses.com ~all"
   ```

**💰 Pricing:**
- First 62,000 emails/month: **FREE** (if sent from EC2)
- After that: $0.10 per 1,000 emails
- [Full pricing](https://aws.amazon.com/ses/pricing/)

**📊 Sandbox Limits (before production approval):**
- Max 200 emails/day
- Max 1 email/second
- Can only send to verified addresses

### Option 3: Mailgun (Production - Alternative)

**Best for:** Easier setup than AWS, good for small to medium apps

**Setup Steps:**

1. **Create Mailgun Account**: [Sign up](https://signup.mailgun.com/)

2. **Verify Your Domain**:
   - Go to Mailgun Dashboard → "Sending" → "Domains"
   - Click "Add New Domain"
   - Add your domain (e.g., `mg.yourdomain.com`)
   - Add the provided DNS records to your domain provider
   - Wait for verification (usually within minutes)

3. **Get API Credentials**:
   - Go to Dashboard → "Settings" → "API Keys"
   - Copy your "Private API key"
   - Find your "Account SID" in settings

4. **Update `server/.env`**:
```env
MAILGUN_ACCOUNT_KEY=your-account-sid
MAILGUN_API_KEY=your-private-api-key
WEBSITE_DOMAIN=mg.yourdomain.com
```

5. **Update Mail Sender** in `server/src/services/email/mailSender.ts`:
```typescript
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const data = {
    from: `Your App <noreply@${process.env.WEBSITE_DOMAIN}>`,
    to,
    subject,
    html
  };

  return await mg.messages.create(process.env.WEBSITE_DOMAIN!, data);
};
```

**💰 Pricing:**
- First 5,000 emails/month: **FREE**
- After that: $0.80 per 1,000 emails
- [Full pricing](https://www.mailgun.com/pricing/)

**📊 Free Tier Limits:**
- 5,000 emails/month
- Pay-as-you-go after that

---

### Email Service Comparison

| Feature | Nodemailer (Gmail) | AWS SES | Mailgun |
|---------|-------------------|---------|---------|
| **Setup Difficulty** | ⭐ Easy | ⭐⭐⭐ Complex | ⭐⭐ Moderate |
| **Free Tier** | 500/day | 62,000/month | 5,000/month |
| **Production Ready** | ❌ No | ✅ Yes | ✅ Yes |
| **Deliverability** | ⭐⭐ Low | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Great |
| **Cost** | Free | Very low | Low |
| **Best For** | Development | High volume | Small-medium |

**Recommendation:**
- **Development**: Use Nodemailer (Gmail)
- **Production**: Use AWS SES (best value) or Mailgun (easier setup)

---

## 🔐 Google OAuth Setup

Google OAuth allows users to sign in with their Google accounts.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "SaaS Starter Kit")
4. Click "Create"

### Step 2: Enable Google+ API

1. In the sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have Google Workspace)
3. Fill in the required information:
   - **App name**: Your SaaS App Name
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email) for development
6. Click "Save and Continue"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - **Name**: SaaS App OAuth Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (frontend dev)
     - `http://localhost:2121` (backend dev)
   - **Authorized redirect URIs**:
     - `http://localhost:2121/api/auth/google/callback`
5. Click "Create"
6. **Copy** the Client ID and Client Secret

### Step 5: Update Environment Variables

Add to `server/.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
CALLBACK_URL=http://localhost:2121/api/auth/google/callback
```

### Step 6: Update for Production

When deploying to production:

1. Add production URLs to authorized origins and redirect URIs:
   - `https://yourdomain.com`
   - `https://api.yourdomain.com/api/auth/google/callback`

2. Update `.env` with production URLs

3. Complete OAuth consent screen verification (required for public apps)

---

## 🤖 Google reCAPTCHA Setup

reCAPTCHA v3 protects your app from bots without requiring user interaction. It's used on registration, login, and password reset forms.

### Step 1: Register Your Site

1. Go to [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "+" to create a new site
3. Fill in the form:
   - **Label**: Your App Name
   - **reCAPTCHA type**: Select "reCAPTCHA v3"
   - **Domains**: 
     - `localhost` (for development)
     - `yourdomain.com` (for production)
   - Accept the terms
4. Click "Submit"

### Step 2: Copy Your Keys

You'll receive two keys:
- **Site Key** (public, goes in frontend)
- **Secret Key** (private, goes in backend)

### Step 3: Update Environment Variables

**Backend** (`server/.env`):
```env
GOOGLE_RECAPTCHA_SECRET_KEY=your-secret-key-here
```

**Frontend** (`client/.env`):
```env
VITE_RECAPTCHA_SITE_KEY=your-site-key-here
```

### Step 4: Configure Score Threshold

reCAPTCHA v3 returns a score from 0.0 (bot) to 1.0 (human). 

In `server/src/middleware/recaptcha.ts`:
```typescript
const SCORE_THRESHOLD = 0.5; // Adjust based on your needs
// 0.5 is recommended as a starting point
// Higher = stricter (may block real users)
// Lower = more lenient (may allow bots)
```

### How reCAPTCHA v3 Works

- ✅ **Invisible to users** - No "I'm not a robot" checkbox
- ✅ **Scores actions** - Rates likelihood of bot (0.0-1.0)
- ✅ **Adaptive** - Learns from your site's traffic
- ✅ **No false positives** - Doesn't block legitimate users

**Protected Forms in This Starter:**
- Registration form
- Login form
- Password reset request
- Contact forms (if you add them)

---

## 💳 Stripe Payment Setup

Stripe handles all subscription payments and billing.

### Step 1: Create Stripe Account

1. Sign up at [Stripe](https://stripe.com/)
2. Complete account verification (for production)
3. Use **test mode** for development (toggle in dashboard)

### Step 2: Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click "Developers" → "API keys"
3. Copy both keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Create Products and Prices

#### Option A: Using Stripe Dashboard (Recommended)

1. Go to "Products" → "Add product"

2. **Create Standard Plan**:
   - Name: "Standard Plan"
   - Description: "Perfect for individuals"
   - Pricing:
     - Monthly: $9.99/month (recurring)
     - Annual: $99/year (recurring)
   - Click "Save product"
   - **Copy the Price IDs** from the pricing section

3. **Create Pro Plan**:
   - Name: "Pro Plan"
   - Description: "For power users"
   - Pricing:
     - Monthly: $19.99/month (recurring)
     - Annual: $199/year (recurring)
   - Click "Save product"
   - **Copy the Price IDs**

#### Option B: Using Stripe CLI (Advanced)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Create products
stripe products create --name="Standard Plan" --description="Perfect for individuals"
stripe prices create --product=prod_xxx --unit-amount=999 --currency=usd --recurring=month
stripe prices create --product=prod_xxx --unit-amount=9900 --currency=usd --recurring=year
```

### Step 4: Update Environment Variables

**Backend** (`server/.env`):
```env
STRIPE_API_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Add the Price IDs you copied
STRIPE_STANDARD_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_STANDARD_ANNUAL_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_ANNUAL_PRICE_ID=price_xxxxxxxxxxxxx
```

**Frontend** (`client/.env`):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### Step 5: Set Up Webhooks (Local Development)

Webhooks notify your server when subscription events occur.

#### Install Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget -O - https://github.com/stripe/stripe-cli/releases/latest/download/stripe_1.8.0_linux_x86_64.tar.gz | tar -xz

# Windows
scoop install stripe
```

#### Forward Webhooks to Localhost:

```bash
stripe listen --forward-to localhost:2121/api/webhooks/
```

This will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

#### Update Your `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Keep the CLI running** while developing. It will show you webhook events in real-time.

### Step 6: Production Webhooks

For production:

1. Go to Stripe Dashboard → "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Enter your URL: `https://api.yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **signing secret** and update production `.env`

### Subscription Flow

Here's how the payment flow works in this starter:

1. User clicks "Subscribe" button
2. Frontend calls `/api/subscriptions/create-checkout`
3. Backend creates Stripe Checkout session
4. User is redirected to Stripe's hosted payment page
5. User enters payment information
6. On success, Stripe redirects to success page
7. Webhook updates subscription status in database
8. User gains access to premium features

### Testing Cards

Use these test cards in development:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined payment |
| `4000 0025 0000 3155` | Requires authentication |

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code

---

## 🖼️ Cloudinary Setup

Cloudinary hosts user profile pictures and other images.

### Step 1: Create Cloudinary Account

1. Sign up at [Cloudinary](https://cloudinary.com/users/register/free)
2. Verify your email
3. Complete the setup

### Step 2: Get Your Credentials

1. Go to your [Dashboard](https://cloudinary.com/console)
2. You'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Get Cloudinary URL

Your Cloudinary URL has this format:
```
cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

Example:
```
cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz123456@mycloud
```

### Step 4: Update Environment Variables

Add to `server/.env`:
```env
CLOUDINARY_URL=cloudinary://your-api-key:your-api-secret@your-cloud-name
```

### Step 5: Configure Upload Presets (Optional)

For better security:

1. Go to Settings → Upload
2. Enable "Unsigned uploading"
3. Create an upload preset:
   - Name: `profile_pictures`
   - Folder: `saas-app/profiles`
   - Allowed formats: `jpg, png, webp`
   - Max file size: 5 MB
   - Transformations: Resize to 400x400

4. Update your backend code to use the preset

**Free Tier Limits:**
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

Perfect for most SaaS apps!

---

## 🏃 Running the Application

Now that everything is configured, let's run the app!

### Development Mode

#### Option 1: Run Both Frontend and Backend Together

```bash
npm run dev
```

This will start:
- **Backend** on `http://localhost:2121`
- **Frontend** on `http://localhost:5173`

#### Option 2: Run Separately

**Terminal 1** (Backend):
```bash
npm run server
```

**Terminal 2** (Frontend):
```bash
npm run client
```

#### Option 3: Using Workspace Commands

```bash
# Backend only
npm run dev --workspace=server

# Frontend only
npm run dev --workspace=client
```

### First Time Setup

1. **Start the servers**:
```bash
npm run dev
```

2. **Open your browser**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:2121](http://localhost:2121)

3. **Register a new account**:
   - Click "Sign Up"
   - Enter your email and password
   - Check your email for the verification code
   - Enter the code to verify your account

4. **Test the features**:
   - ✅ Login with email/password
   - ✅ Login with Google
   - ✅ Reset password
   - ✅ Update profile
   - ✅ Subscribe to a plan
   - ✅ Manage subscription

### Build for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately
npm run build:client
npm run build:server
```

### Run Production Build Locally

```bash
# Start backend (serves frontend too)
npm run start

# Or start both with preview
npm run start:both
```

---


### Key Directories Explained

#### Frontend (`client/`)

- **`components/`**: Reusable UI components following atomic design
  - `auth/`: Login form, register form, password reset
  - `layout/`: Header, footer, sidebar
  - `ui/`: shadcn/ui components (buttons, inputs, modals)
  
- **`pages/`**: Top-level page components mapped to routes
  
- **`hooks/`**: Custom React hooks for shared logic
  
- **`services/`**: API calls to backend endpoints
  
- **`store/`**: Zustand stores for global state management
  
- **`types/`**: TypeScript interfaces and types

#### Backend (`server/`)

- **`controllers/`**: Handle HTTP requests and responses
  
- **`models/`**: Mongoose schemas for MongoDB collections
  
- **`routes/`**: Define API endpoints and map to controllers
  
- **`middleware/`**: Request processing pipeline (auth, validation, etc.)
  
- **`services/`**: Business logic separated from controllers
  
- **`config/`**: App configuration (database, passport, stripe)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**:
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier (run `npm run lint`)
- Write meaningful commit messages
- Keep PRs focused on a single feature/fix
- Update README if you add new features

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**What this means:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ No liability or warranty provided


## 📧 Support

If you have questions or need help:

1. **Check the documentation** above
2. **Review Common Issues** section
3. **Open an issue** on GitHub
4. **Join our Discord** (coming soon)


## 🎯 What's Next?

Now that you have your SaaS infrastructure ready, here are some ideas for what to build:

## 🌟 Star This Repo!

If this starter kit helped you, please give it a ⭐️ on GitHub!

It helps others discover this project and motivates continued development.


