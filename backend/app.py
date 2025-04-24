from flask import Flask, jsonify, request, render_template, redirect, url_for, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import sys
import mysql.connector
from functools import wraps
import jwt
from datetime import datetime, timedelta

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MySQL Configuration using mysql-connector-python
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+mysqlconnector://root:root@localhost/portfolio_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Import models
from database.models import Project, Skill, BlogPost, Message

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return redirect(url_for('admin_login'))
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated

# Admin routes
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        if (request.form['username'] == ADMIN_USERNAME and 
            request.form['password'] == ADMIN_PASSWORD):
            token = jwt.encode({
                'user': ADMIN_USERNAME,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            response = redirect(url_for('admin_dashboard'))
            response.set_cookie('token', token)
            return response
        return "Invalid credentials", 401
    return render_template('admin/login.html')

@app.route('/admin/dashboard')
@token_required
def admin_dashboard():
    projects = Project.query.all()
    skills = Skill.query.all()
    blog_posts = BlogPost.query.all()
    messages = Message.query.all()
    return render_template('admin/dashboard.html', 
                         projects=projects,
                         skills=skills,
                         blog_posts=blog_posts,
                         messages=messages)

# Root route
@app.route('/')
def root():
    return jsonify({
        'message': 'Portfolio Backend API',
        'status': 'running',
        'endpoints': {
            'test': '/api/test',
            'projects': '/api/projects',
            'skills': '/api/skills',
            'blog_posts': '/api/blog-posts',
            'contact': '/api/contact'
        }
    })

# Test route
@app.route('/api/test', methods=['GET'])
def test_route():
    try:
        # Test MySQL connection directly first
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="portfolio_db"
        )
        connection.close()
        
        # Then test SQLAlchemy connection
        db.session.execute('SELECT 1')
        return jsonify({
            'message': 'Backend is running and database is connected!',
            'status': 'success',
            'database': 'connected'
        }), 200
    except mysql.connector.Error as e:
        return jsonify({
            'error': 'MySQL Connection Error',
            'details': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'error': 'General Error',
            'details': str(e)
        }), 500

# Projects endpoints
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.all()
        return jsonify([{
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'tech_stack': project.tech_stack,
            'github_link': project.github_link,
            'created_at': project.created_at.isoformat()
        } for project in projects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['POST'])
def add_project():
    try:
        data = request.json
        new_project = Project(
            title=data['title'],
            description=data['description'],
            tech_stack=data['tech_stack'],
            github_link=data.get('github_link')
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify({'message': 'Project added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Skills endpoints
@app.route('/api/skills', methods=['GET'])
def get_skills():
    try:
        skills = Skill.query.all()
        return jsonify([{
            'id': skill.id,
            'title': skill.title,
            'description': skill.description,
            'icon': skill.icon
        } for skill in skills])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skills', methods=['POST'])
def add_skill():
    try:
        data = request.json
        new_skill = Skill(
            title=data['title'],
            description=data['description'],
            icon=data.get('icon')
        )
        db.session.add(new_skill)
        db.session.commit()
        return jsonify({'message': 'Skill added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Blog posts endpoints
@app.route('/api/blog-posts', methods=['GET'])
def get_blog_posts():
    try:
        posts = BlogPost.query.all()
        return jsonify([{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'image_url': post.image_url,
            'link': post.link,
            'created_at': post.created_at.isoformat()
        } for post in posts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/blog-posts', methods=['POST'])
def add_blog_post():
    try:
        data = request.json
        new_post = BlogPost(
            title=data['title'],
            content=data['content'],
            image_url=data.get('image_url'),
            link=data.get('link')
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'message': 'Blog post added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Contact endpoint
@app.route('/api/contact', methods=['POST'])
def submit_message():
    try:
        data = request.json
        new_message = Message(
            name=data['name'],
            email=data['email'],
            message=data['message']
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'message': 'Message sent successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask application...")
    print(f"Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    # Test database connection before starting the app
    try:
        print("Testing database connection...")
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="portfolio_db"
        )
        connection.close()
        print("Database connection successful!")
    except mysql.connector.Error as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

    with app.app_context():
        try:
            # Create all database tables
            db.create_all()
            print("Database tables created successfully!")
        except Exception as e:
            print(f"Error creating database tables: {e}")
            sys.exit(1)
    
    print("Starting development server...")
    app.run(debug=True, port=5000) 