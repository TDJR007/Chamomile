# 🍵 Chamomile

A step up on my previous project with user authentication, persistent database and type safety. Built with TypeScript, Express, SQLite, and vanilla JavaScript.

![Chamomile Screenshot](https://via.placeholder.com/800x400.png?text=Add+Your+Screenshot+Here)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 🤖 **Anti-Bot Protection** - Honeypot fields and timing analysis
- 💾 **Persistent Storage** - SQLite database with automatic backups
- 🚀 **Type-Safe** - Full TypeScript backend with compile-time safety
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 🏗️ Tech Stack

**Backend:**
- TypeScript + Express
- SQLite (better-sqlite3)
- JWT authentication
- bcrypt password hashing
- express-rate-limit for DDoS protection

**Frontend:**
- Vanilla JavaScript (no frameworks)
- HTML5 drag-and-drop API
- CSS3 animations
- LocalStorage for token persistence

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chamomile
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.sample .env
```

Edit `.env` and set your values:
```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
DB_FILE=./data/chamomile.db
NODE_ENV=development
```

⚠️ **IMPORTANT:** Change `JWT_SECRET` to a strong random string in production!

4. **Initialize the database**
```bash
npm run db:init
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 🚀 Production Deployment

### Build for production
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Start production server
```bash
NODE_ENV=production npm start
```

### Environment Variables for Production

Make sure to set these in your production environment:

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - **MUST be a strong random string**
- `DB_FILE` - Path to SQLite database file
- `NODE_ENV` - Set to `production`

## 📁 Project Structure
```
chamomile/
├── public/              # Frontend files
│   ├── index.html       # Main kanban board
│   ├── auth.html        # Login/signup page
│   ├── auth.js          # Auth logic
│   ├── api.js           # API wrapper
│   ├── drag.js          # Drag-and-drop
│   ├── todo.js          # Task creation
│   ├── utils.js         # Helper functions
│   ├── storage.js       # Data loading
│   ├── star-background.js
│   └── styles.css
│
├── src/                 # TypeScript backend
│   ├── types/           # Type definitions
│   ├── middleware/      # Auth & security middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (JWT, bcrypt, validation)
│   ├── db/              # Database layer
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
│
├── data/                # SQLite database
│   └── chamomile.db
│
├── dist/                # Compiled JavaScript (after build)
│
├── .env                 # Environment variables (not in git)
├── .env.sample          # Template for .env
└── package.json         # Node.js project’s metadata, scripts, and dependencies.
└── package-lock.json    # Locks the exact versions of installed dependencies to ensure reproducibility
└── tsconfig.json
└── chamomile.rest       # Contains HTTP request definitions used for testing
```

## 🔒 Security Features

### Authentication
- JWT tokens with 7-day expiration
- Bcrypt password hashing (10 rounds)
- Passwords must be 8+ characters

### CORS Configuration
- **Same-origin policy:** Our app uses `origin: true` which reflects the request origin; this works because frontend and backend share the same domain.
- This is more secure than `origin: '*'` (allows everything) and simpler than whitelisting specific domains.

### Anti-Bot Protection
- **Honeypot field** - Hidden form field that bots auto-fill
- **Timing analysis** - Detects forms filled too quickly
- **Rate limiting:**
  - Signup: 3 attempts per 24 hours
  - Login: 10 attempts per 15 minutes
  - API: 100 requests per 15 minutes

### Database Security
- SQL injection protection via prepared statements
- Foreign key constraints with CASCADE deletion
- User data isolation (users can only access their own tasks)

## 🧪 API Testing

Use the included `chamomile.rest` file with VS Code's REST Client extension:

1. Install [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
2. Open `chamomile.rest`
3. Update the `@token` variable after logging in
4. Click "Send Request" above any endpoint

Or use curl:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","timestamp":'$(date +%s)000'}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get tasks (replace YOUR_TOKEN)
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks (All require authentication)
- `GET /api/todos` - Get all tasks
- `POST /api/todos` - Create new task
- `PUT /api/todos/:id` - Update task
- `DELETE /api/todos/:id` - Delete task

## 🐛 Troubleshooting

**Server won't start:**
- Check that port 3000 isn't already in use
- Verify `.env` file exists and has valid values
- Run `npm run db:init` to ensure database is initialized

**"Invalid token" errors:**
- Token may have expired (7-day limit)
- Log out and log back in to get a new token
- Check that `JWT_SECRET` is set in `.env`

**Tasks not persisting:**
- Check `data/` folder exists and is writable
- Verify database file was created: `ls data/chamomile.db`
- Check server logs for database errors

## 📄 License

MIT License - feel free to use this for personal or commercial projects!

## 🙏 Acknowledgments

Built with patience, TypeScript, and way too much coffee ☕

---
