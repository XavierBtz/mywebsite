from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# 1. SETUP DATABASE CONFIGURATION FIRST
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studio.db'
db = SQLAlchemy(app)

# 2. DEFINE MODELS ONCE


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    album_name = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(100))

# 3. ROUTES


@app.route('/')
def login():
    return render_template('login.html')


@app.route('/login', methods=['POST'])
def process_login():
    artist_name = request.form.get('username')
    return redirect(url_for('studio'))


@app.route('/studio')
def studio():
    return render_template('studio.html')


@app.route('/curator')
def curator():
    return render_template('about.html')


@app.route('/natures-tales')
def natures_tales():
    comments = Comment.query.filter_by(
        album_name='natures_tales').order_by(Comment.timestamp.desc()).all()
    return render_template('natures_tales.html', comments=comments)


@app.route('/stargazing')
def stargazing():
    comments = Comment.query.filter_by(
        album_name='stargazing').order_by(Comment.timestamp.desc()).all()
    return render_template('stargazing.html', comments=comments)


@app.route('/post_comment', methods=['POST'])
def post_comment():
    name = request.form.get('name')
    text = request.form.get('text')
    # This must match the value in your HTML
    album_name = request.form.get('album_name')

    new_comment = Comment(name=name, text=text, album_name=album_name)
    db.session.add(new_comment)
    db.session.commit()

    # Redirects to the function name (e.g., 'natures_tales' or 'stargazing')
    return redirect(url_for(album_name))


@app.before_request
def log_visitor():
    ip = request.remote_addr
    if not Visitor.query.filter_by(ip_address=ip).first():
        new_visitor = Visitor(ip_address=ip)
        db.session.add(new_visitor)
        db.session.commit()


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This creates the DB automatically when you run the app
    app.run(debug=True)
