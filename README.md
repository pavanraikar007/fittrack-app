# FitTrack - Full-Stack Fitness Web Application

FitTrack is a comprehensive web-based fitness application designed to help users track their workouts, monitor progress, calculate calorie needs, and receive guidance from an AI-powered fitness coach. This project demonstrates modern full-stack web development capabilities using Next.js, TypeScript, Supabase, and AI integration.

## ✨ Features

### 🔐 Authentication System
- **Secure User Registration & Login** using Supabase Auth
- **Automatic Profile Creation** for new users with database triggers
- **Protected Routes** with role-based access control
- **Admin Panel Access** for users with admin privileges
- **Session Management** with logout and session clearing functionality

### 🏋️ Workout Tracker
- **Exercise Logging** with sets, reps, and weight tracking
- **Pre-defined Exercise Database** with 50+ exercises across categories:
  - Strength Training (Push, Pull, Legs)
  - Cardio (Running, Cycling, HIIT, etc.)
  - Flexibility (Yoga, Stretching, Mobility)
  - Functional Movement
- **Workout History** with detailed logging and progress tracking
- **Routine-based Workouts** with organized exercise groupings

### 🧮 Calorie Calculator
- **BMR Calculation** using the Mifflin-St Jeor equation
- **TDEE Estimation** based on activity level (1.2x to 1.9x multipliers)
- **Goal-based Calorie Recommendations**:
  - Maintenance calories
  - Weight loss (-250 to -500 calories)
  - Weight gain (+250 to +500 calories)
- **Progress Logging** with weight tracking integration

### 📈 Progress Dashboard
- **Interactive Data Visualizations** using Recharts:
  - Weight progression line charts
  - Calorie intake bar charts
  - Workout type distribution pie charts
- **Dynamic Progress Bars** calculated from actual workout data:
  - Strength training progress
  - Cardio endurance tracking
  - Flexibility improvement metrics
- **Quick Stats Display**:
  - Weekly workout count
  - Average daily metrics
  - Progress trends

### 🤖 AI Fitness Coach
- **Interactive Chatbot** powered by Google's Gemini Flash API
- **Real-time Responses** to fitness and nutrition questions
- **Conversation History** with persistent chat sessions
- **Intelligent Query Processing** with keyword matching and context awareness

### 🛡️ Admin Panel
- **User Management** with comprehensive user listings
- **Exercise Database Management** with CRUD operations
- **Role-based Access Control** (Admin users only)
- **System Analytics** and user activity monitoring

### 🌐 Responsive Design
- **Mobile-first Approach** with Tailwind CSS
- **Cross-device Compatibility** (desktop, tablet, mobile)
- **Modern UI/UX** with consistent design system
- **Accessibility Features** with proper ARIA attributes

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.2** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Recharts 2.15.3** - Data visualization library
- **Heroicons** - Beautiful SVG icons
- **React Markdown** - Markdown rendering for AI responses

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Auth** - Authentication and user management
- **Row Level Security (RLS)** - Database-level security policies
- **Database Triggers** - Automatic profile creation and data consistency

### AI Integration
- **Google Generative AI SDK** (`@google/generative-ai`)
- **Gemini Flash Model** - Fast, efficient AI responses
- **Streaming Responses** - Real-time chat experience

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Turbopack** - Fast development builds

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18.x or later)
- **npm** or **yarn**
- **Supabase Account** (free tier sufficient)
- **Google AI API Key** (Gemini access)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd fitness-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database:**
   
   **Create the following tables in your Supabase SQL Editor:**
   
   ```sql
   -- Profiles table (extends auth.users)
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     username TEXT UNIQUE,
     full_name TEXT,
     avatar_url TEXT,
     plan TEXT DEFAULT 'Free',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Exercises table
   CREATE TABLE exercises (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     category TEXT NOT NULL,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Workout logs table
   CREATE TABLE workout_logs (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     exercise_id INTEGER REFERENCES exercises(id),
     sets INTEGER,
     reps INTEGER,
     weight DECIMAL,
     date DATE DEFAULT CURRENT_DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Progress metrics table
   CREATE TABLE progress_metrics (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     metric_type TEXT NOT NULL,
     value DECIMAL NOT NULL,
     date DATE DEFAULT CURRENT_DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **Enable Row Level Security:**
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can view own workout logs" ON workout_logs FOR ALL USING (auth.uid() = user_id);
   CREATE POLICY "Users can view own progress metrics" ON progress_metrics FOR ALL USING (auth.uid() = user_id);
   ```

   **Create the profile creation trigger:**
   ```sql
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO profiles (id, username, full_name)
     VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION handle_new_user();
   ```

5. **Populate exercise data:**
   Run the provided `add_exercises.sql` file in your Supabase SQL Editor to add the exercise database.

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
fitness-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── admin/                    # Admin panel
│   ├── ai-coach/                 # AI chatbot interface
│   ├── api/                      # API routes
│   │   └── ai-coach/             # AI endpoint
│   ├── calorie-calculator/       # BMR/TDEE calculator
│   ├── progress/                 # Dashboard with charts
│   ├── workouts/                 # Workout tracker
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   ├── charts/                   # Chart components
│   ├── layout/                   # Layout components
│   └── ui/                       # UI components
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── lib/                          # Utilities and configurations
│   ├── formulas.ts               # Fitness calculations
│   ├── mockData.ts               # Type definitions and mock data
│   └── supabaseClient.ts         # Supabase configuration
├── public/                       # Static assets
├── add_exercises.sql             # Database seed data
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to [Vercel](https://vercel.com)
   - Configure environment variables in Vercel dashboard
   - Automatic deployments on every push

3. **Environment Variables for Production:**
   Add the same environment variables from `.env.local` to your Vercel project settings.

## 🔮 Future Enhancements

- **Social Features:** User profiles, workout sharing, community challenges
- **Advanced Analytics:** Detailed progress tracking, goal setting, achievement system
- **Nutrition Tracking:** Meal logging, macro tracking, nutrition analysis
- **Workout Plans:** Pre-built programs, progressive overload tracking
- **Mobile App:** React Native version for iOS and Android
- **Wearable Integration:** Sync with fitness trackers and smartwatches
- **Advanced AI Features:** Personalized workout recommendations, form analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**[Pavan Raikar]**
- GitHub: [@pavanraikar007](https://github.com/pavanraikar007) 

---

**Built with ❤️ using Next.js, TypeScript, Supabase, and AI**
