from flask import jsonify, request
from app import app, db
from database.models import Project, Skill, BlogPost, Message

# Project routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'tech_stack': project.tech_stack,
        'github_link': project.github_link
    } for project in projects])

@app.route('/api/projects', methods=['POST'])
def add_project():
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

# Skills routes
@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    return jsonify([{
        'id': skill.id,
        'title': skill.title,
        'description': skill.description,
        'icon': skill.icon
    } for skill in skills])

@app.route('/api/skills', methods=['POST'])
def add_skill():
    data = request.json
    new_skill = Skill(
        title=data['title'],
        description=data['description'],
        icon=data.get('icon')
    )
    db.session.add(new_skill)
    db.session.commit()
    return jsonify({'message': 'Skill added successfully'}), 201

# Blog routes
@app.route('/api/blog-posts', methods=['GET'])
def get_blog_posts():
    posts = BlogPost.query.all()
    return jsonify([{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'image_url': post.image_url,
        'link': post.link,
        'created_at': post.created_at.isoformat()
    } for post in posts])

@app.route('/api/blog-posts', methods=['POST'])
def add_blog_post():
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

# Contact form route
@app.route('/api/contact', methods=['POST'])
def submit_message():
    data = request.json
    new_message = Message(
        name=data['name'],
        email=data['email'],
        message=data['message']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'message': 'Message sent successfully'}), 201 