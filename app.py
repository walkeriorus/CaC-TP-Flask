from flask import Flask, render_template,request, redirect, url_for,flash
from flaskext.mysql import MySQL
from flask_login import LoginManager, login_user, logout_user, login_required
from user import User
from categorias import categorias as CAT

app = Flask(__name__)
app.config.from_object('config.DefaultSettings')

mysql = MySQL()
mysql.init_app( app )

def conectarDb( mysqlObj ):
    conn = mysqlObj.connect()
    cursor = conn.cursor()
    return conn, cursor


@app.route('/')
def index():
    return render_template('index.html')#si no funciona volver a agregar , usuario = ""

@app.route('/sound')
def sound():
    return render_template('sound.html', categorias = CAT )

@app.route('/nosotros')
def nosotros():
    return render_template('nosotros.html')

@app.route('/registro')
def registro():
    return render_template('registro.html')

@app.route('/guardarUsuario', methods=['POST'])
def guardarUsuario():
    _userName = request.form['user-name']
    _userPass = request.form['user-pass']
    _userEmail = request.form['user-email']
    
    conn, cursor = conectarDb( mysql )
    usuario = User(0,_userName,_userEmail,_userPass)
    sql = f'''INSERT INTO `sounds`.`usuarios` (`user_name`,`user_email`,`user_pass`)
    VALUES('{usuario.name}','{usuario.email}','{usuario.password}')'''
    cursor.execute(sql)
    
    conn.commit()
    
    return redirect(url_for('index'))

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(userId):
    return User.get( mysql, userId )

@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('loginForm.html')
    #Si el método no es GET, entonces es POST :-)
    else:
        #Construir un objeto usuario con los datos que llegan del formulario
        _userName = request.form.get('user-name')
        _userPass = request.form.get('user-pass')
        
        sql = f"""SELECT * FROM `sounds`.`usuarios`
        WHERE `user_name`= '{_userName}'"""
        
        conn,curr = conectarDb(mysql)
        
        curr.execute(sql)
        dbUserInfo = curr.fetchone()
        if dbUserInfo != None:
            dbUserId,dbUserName, dbUserEmail, dbUserPass = dbUserInfo
            usuario = User(dbUserId,dbUserName,dbUserEmail,_userPass)
        
            #Si el nuevo password hasheado es igual al que estaba en la base de datos entonces el usuario puse bien la contraseña
            logged_in = User.check_password( dbUserPass,_userPass )
            print("logged_in: ", logged_in)
            if logged_in:
                login_user(usuario)
                return redirect(url_for('index'))
            else:
                flash('Usuario o contraseña incorrectos')
                return render_template(url_for('index'))
        else:
            #el nombre del usuario no existe
            flash('El usuario no existe')
            return redirect(url_for('login'))

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))
#Nota: al definir que la ruta recibe una parte variable, dentro de la declaracion <variable> no puede haber espacios

@app.route('/user/<int:idUsuario>')
def verCuenta(idUsuario):
    sql = f'''SELECT `user_id`,`user_name`,`user_pass`,`user_email` FROM `sounds`.`usuarios`
    WHERE `user_id` ={idUsuario}'''
    
    conn, cursor = conectarDb( mysql )
    cursor.execute( sql )
    datos = cursor.fetchone() #Aca tendria los datos del usuario como un array
    conn.commit()#cierro la conexion con la base de datos
    if datos != None:
        usuario = {
            'id': datos[0],
            'user_name': datos[1],
            'user_pass': datos[2],
            'user_email': datos[3]
        }
    else:
        #Si el usuario no se encontro mando None
        usuario = None
        
    return render_template('viewAccountInfo.html', usuario = usuario)

@app.route('/edit', methods=['POST'] )
def edit():
    _userID = request.form.get("userId", None)
    _userName = request.form.get('userName', None)
    _userPass = request.form.get('userPass', None)
    _userEmail = request.form.get('userEmail', None)
    usuario = {
        'id': _userID,
        'user_name': _userName,
        'user_pass': _userPass,
        'user_email': _userEmail
    }
    return render_template('edit.html', usuario = usuario )

@app.route('/guardarCambios',methods=["POST"])
def guardarCambios():
    _userID = request.form.get("userId", None)
    _userName = request.form.get('userName', None)
    _userPass = request.form.get('userPass', None)
    _userEmail = request.form.get('userEmail', None)
    
    sql = f"""UPDATE `sounds`.`usuarios` 
    SET `user_name` = '{_userName}', `user_pass` = '{_userPass}', `user_email` = '{_userEmail}'
    WHERE `id`='{_userID}'"""
    print(sql)
    conn, cursor = conectarDb(mysql)
    cursor.execute(sql)
    conn.commit()
    
    return render_template('index.html')

@app.route('/agregarAlCarrito')
def agregarAlCarrito():
    pass


if __name__=='__main__':
    app.run()