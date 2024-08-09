from flask import Flask, render_template, redirect,url_for,request,jsonify

app = Flask(__name__)
app.config.from_pyfile("../config.py")
from .models import getAll
from .models import getCate
from .models import getCourseByID
from .models import getCateByID
from .models import getCourseList
from .models import getCoursePrice
from .models import getUsers, CourseList, db, getVideosByCourseID,Video,existence_cours
@app.route("/")
def home():
    cours=getAll()
    categorie=getCate()
    return render_template("Student/home.html",ici=cours,categories=categorie)
    
@app.route("/panier")
def cart():
    categorie=getCate()
    return render_template("Student/panier.html",categories=categorie)

@app.route('/api/course/<int:course_id>')
def getcourseById(course_id):
    course = getCourseByID(course_id)
    if course:
        return jsonify({
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'price': course.price,
            'image': course.image
        })
    return jsonify({'error': 'Course not found'}), 404

@app.route('/course/<int:course_id>')
def course_description(course_id):
    course = getCourseByID(course_id)
    if course:
        return render_template('Student/description.html', ici=course)
    return "Course not found", 404

@app.route('/category/<int:category_id>')
def category_courses(category_id):
    categorie = getCate()
    category = getCateByID(category_id)
    cours=getAll()
    if category:
        return render_template('Student/categoriesPage.html', category=category, cours=cours, categories=categorie)
    return "Category not found", 404

@app.route('/validate_cart', methods=['POST'])
def validate_cart():
    app.logger.info("validate_cart route hit")
    try:
        data = request.json
        if not data or 'cartItems' not in data:
            app.logger.error("No cart items in request")
            return jsonify({'error': 'Invalid request'}), 400

        cart_items = data['cartItems']
        app.logger.info(f"Cart items: {cart_items}")
        total_price = 0

        for course_id in cart_items:
            course = getCourseByID(course_id)
            if course:
                total_price += course.price

        if total_price == 0:
           
            for course_id in cart_items:
                course = getCourseByID(course_id)
                if course:
                    existe = existence_cours(course_id=course.id, user_id=1)  
                    if not existe:
                        new_course = CourseList(cours_id=course.id, user_id=1) 
                        db.session.add(new_course)
                        app.logger.info(f"Course {course.id} added to CourseList")
                    else:
                        app.logger.info(f"Course {course.id} is already in CourseList")
            db.session.commit()
            return jsonify({'redirect': '/mescours'}), 200
        else:
            return jsonify({'redirect': '/stripe'}), 200
    except Exception as e:
        app.logger.error(f"y'a erreur: {str(e)}")
        return jsonify({'error': 'erreur de server'}), 500

@app.route('/mescours')
def mes_cours():  
    categorie=getCate()
    mes_cours= getCourseList(user_id=1)
    return render_template('Student/mesCours.html', mes_cours=mes_cours,categories=categorie)
@app.route('/stripe')
def paiement():
    return render_template('Student/paiementStripe.html')

def extract_video_id(url):
    if "youtube.com/watch?v=" in url:
        return url.split("watch?v=")[-1]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[-1]
    return url 

@app.route('/course_details/<int:course_id>')
def course_details(course_id):
    course = getCourseByID(course_id)
    videos = course.videos  
    categorie=getCate()
    for video in videos:
        video.url = extract_video_id(video.url)
    return render_template('Student/detailsCours.html', course=course, videos=videos,categories=categorie)
