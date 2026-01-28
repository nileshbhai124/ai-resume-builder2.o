# AI Resume & Portfolio Builder

A full-stack web application that helps students and freshers create professional, ATS-friendly resumes with secure authentication and database storage.

## Features

- 🔐 User authentication (register/login)
- 💾 Secure database storage of user information
- 📄 AI-powered resume generation
- 🎯 ATS-friendly format
- 💼 Optimized for students and freshers
- 🔄 Save and update resume data anytime

## Tech Stack

**Backend:**
- Node.js & Express
- MongoDB (Database)
- JWT (Authentication)
- bcryptjs (Password hashing)

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive design

## Installation

1. **Install MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Install Dependencies**
   ```cmd
   npm install
   ```

3. **Configure Environment**
   - Edit `.env` file
   - Update `MONGODB_URI` if using MongoDB Atlas
   - Change `JWT_SECRET` to a secure random string

4. **Start MongoDB** (if using local installation)
   ```cmd
   mongod
   ```

5. **Start the Application**
   ```cmd
   npm run dev
   ```

6. **Open Browser**
   Navigate to: http://localhost:3000

## Usage

1. **Register** - Create a new account
2. **Login** - Access your dashboard
3. **Fill Details** - Enter your personal information, education, skills, projects
4. **Save** - Store your data securely
5. **Generate** - Create your professional resume
6. **Copy** - Copy the generated resume to clipboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume
- `POST /api/resume` - Save/update resume data
- `GET /api/resume` - Get user's resume data
- `POST /api/resume/generate` - Generate formatted resume

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Secure data storage

## Project Structure

```
├── models/           # Database models
│   ├── User.js
│   └── Resume.js
├── routes/           # API routes
│   ├── auth.js
│   └── resume.js
├── middleware/       # Custom middleware
│   └── auth.js
├── public/           # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js         # Main server file
├── .env              # Environment variables
└── package.json      # Dependencies

```

## Future Enhancements

- PDF export functionality
- Multiple resume templates
- Cover letter generation
- Portfolio website builder
- Email resume to employers
- LinkedIn integration

## License

MIT
