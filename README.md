# Personal Portfolio Website

A modern, responsive portfolio website showcasing my professional experience, projects, and skills. Features a full-stack implementation with a Flask backend and MySQL database.

## Features
- Responsive design
- Professional timeline
- Project showcase
- Skills section
- Blog integration
- Contact information
- Counter section with space theme
- Admin dashboard for content management
- RESTful API endpoints
- Secure authentication system

## Technologies Used
### Frontend
- HTML5
- CSS3
- JavaScript
- Font Awesome
- Bootstrap

### Backend
- Python 3.x
- Flask
- MySQL
- SQLAlchemy
- JWT Authentication
- CORS support

## Backend Features
- RESTful API endpoints for projects, skills, and blog posts
- Admin dashboard for content management
- Secure authentication using JWT
- Database integration with MySQL
- CORS enabled for frontend integration

## API Endpoints
- `GET /api/projects` - Retrieve all projects
- `POST /api/projects` - Add a new project
- `GET /api/skills` - Retrieve all skills
- `POST /api/skills` - Add a new skill
- `GET /api/blog-posts` - Retrieve all blog posts
- `POST /api/blog-posts` - Add a new blog post
- `POST /api/contact` - Submit a contact message

## Setup
### Frontend
1. Clone the repository
2. Open `index.html` in your browser

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables in `.env`:
   ```
   DATABASE_URL=mysql+mysqlconnector://username:password@localhost/portfolio_db
   SECRET_KEY=your-secret-key
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-admin-password
   ```
5. Create MySQL database:
   ```sql
   CREATE DATABASE portfolio_db;
   ```
6. Run the Flask application:
   ```bash
   python app.py
   ```

## Database Schema
The application uses the following main tables:
- Projects (id, title, description, tech_stack, github_link, created_at)
- Skills (id, title, description, icon)
- BlogPosts (id, title, content, image_url, link, created_at)
- Messages (id, name, email, message, created_at)

## Live Demo
[View Live Demo](#) <!-- Add your deployed website URL here -->

## Contact
For any inquiries, please reach out to me at chandrasekhar090591@gmail.com 