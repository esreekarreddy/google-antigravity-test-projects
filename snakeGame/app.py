from flask import Flask, render_template, send_from_directory

app = Flask(__name__, 
            static_url_path='/projects/neon-snake/static',
            static_folder='static')

@app.route('/')
@app.route('/projects/neon-snake/')
def index():
    return render_template('index.html')

@app.route('/robots.txt')
@app.route('/projects/neon-snake/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')

@app.route('/sitemap.xml')
@app.route('/projects/neon-snake/sitemap.xml')
def sitemap():
    return send_from_directory('static', 'sitemap.xml')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
