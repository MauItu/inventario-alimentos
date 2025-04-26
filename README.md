# 🍳 KomidaGPT

**Your Smart Pantry Assistant & Meal Planner**  
🚀 Generate Weekly Recipes from Your Ingredients Using AI & Download as PDF!

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?logo=next.js)](https://nextjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4o-412991?logo=openai)](https://openai.com/)

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/meal.png" alt="KomidaGPT Logo"/>
</div>

## ✨ Features

- 🔐 **Email-based Auth** - Simple login/registration flow
- 🥦 **Smart Inventory Management**  
  Track food items with categories, quantities, and expiration dates
- 🤖 **AI-Powered Meal Planning**  
  GPT-4o generates 7 customized recipes from your pantry
- 📥 **Instant PDF Export**  
  Automatic download of beautifully formatted recipe plans
- 🚀 **Full-Stack Architecture**  
  Next.js 15 + TypeScript + Tailwind CSS + Prisma + PostgreSQL

## 🛠 Tech Stack

| **Layer**       | **Technologies**                                                                 |
|------------------|---------------------------------------------------------------------------------|
| **Frontend**     | Next.js 15 (App Router), TypeScript, shadcn/ui, Tailwind CSS                    |
| **Backend**      | Next.js API Routes, OpenAI SDK v4, jsPDF                                        |
| **Database**     | PostgreSQL (NeonDB Serverless), Prisma ORM                                      |
| **Auth**         | Session-less email-based auth with localStorage                                 |
| **Deployment**   | Vercel (Recommended)                                                            |

## 🚀 Getting Started

### Prerequisites
- Node.js ≥18.x
- PostgreSQL database ([NeonDB](https://neon.tech/) recommended)
- OpenAI API key

### Installation
```bash
# Clone repository
git clone https://github.com/K-Forge/KomidaGPT.git
cd KomidaGPT

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Fill your credentials in .env

# Initialize database
npx prisma migrate deploy
npx prisma generate

# Start development server
npm run dev
📂 Project Structure
text
/
├── app/                # App router routes
│   ├── dashboard/      # Protected area after login
│   └── contexts/       # Auth & application state
├── components/         # Reusable UI components
├── pages/api/          # API endpoints
├── prisma/             # Database schema & client
└── public/             # Static assets
🔄 Core Workflow
Authentication

Users login with email (auto-registration if new)

Inventory Management

Add/remove food items with detailed metadata

AI Meal Generation

GPT-4o analyzes inventory → Creates 7-day meal plan

PDF Export

Automatic download of formatted recipe book

🗃 Database Schema
prisma
model User {
  id    String  @id @default(cuid())
  email String  @unique
  foods Food[]
}

model Food {
  id             String   @id @default(cuid())
  foodName       String
  category       String   // (Dairy, Fruits, Meats...)
  quantity       Int
  expirationDate DateTime?
  user           User     @relation(fields: [email], references: [email])
}
🌐 Deployment
Vercel Recommended Configuration:

Set environment variables:

DATABASE_URL

OPENAI_API_KEY

Build command: npm run build

Output directory: .next

Deploy with Vercel

📜 License
This project is licensed under the ISC License - see LICENSE.md for details.

Hungry for Better Meal Planning? 🍽️
Let KomidaGPT transform your pantry into culinary inspiration!
Contribute | Report Issues


This README features:
1. **Visual Hierarchy**: Clear sections with emoji icons
2. **Interactive Elements**: Badges, deployment button
3. **Code Readiness**: Ready-to-copy env setup and commands
4. **Technical Depth**: Schema details + architecture diagram
5. **Call to Action**: Clear deployment and contribution paths
6. **Mobile-Friendly Formatting**: Clean tables and code blocks
7. **Personality**: Food-themed emojis and engaging language
