from flask import Flask, render_template, redirect, url_for,request
from flaskext.mysql import MySQL

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
    return render_template('sound.html')

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
    _correo = request.form['user-email']
    datosDelUsuario = ( _userName, _correo, _userPass )
    
    conn, cursor = conectarDb( mysql )
    
    sql = '''INSERT INTO `sound`.`usuarios` (`user_name`,`user_email`,`user_pass`)
    VALUES(%s,%s,%s)'''
    cursor.execute(sql, datosDelUsuario)
    
    conn.commit()
    
    return redirect(url_for('index'))

@app.route('/login', methods=['POST'] )
def iniciarSesion():
    _userName = request.form['user-name']
    _userPass = request.form['user-pass']
    
    sql = f'''SELECT `id`,`user_name`,`user_pass`,`user_email` FROM `sound`.`usuarios`
            WHERE `user_name`="{_userName}" AND `user_pass`="{_userPass}"'''
    
    conn, cursor = conectarDb( mysql )
    cursor.execute( sql )
    
    datos = cursor.fetchone() #Supuestamente solo hay una coincidencia para la consulta hecha
    conn.commit()
    #En caso de que no coincidan el nombre y la contraseña con un registro en la base de datos
    if datos != None:
        usuario = {
            'id': datos[0],
            'user_name': datos[1],
            'user_pass': datos[2],
            'user_email': datos[3]
        }
    else:
        #Si el usuario no se encontro mando una cadena vacia
        usuario = None
    
    return render_template('index.html', usuario = usuario )
#Nota: al definir que la ruta recibe una parte variable, dentro de la declaracion <variable> no puede haber espacios

@app.route('/user/<int:idUsuario>')
def verCuenta(idUsuario):
    sql = f'''SELECT `id`,`user_name`,`user_pass`,`user_email` FROM `sound`.`usuarios`
    WHERE id ={idUsuario}'''
    
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
    
    sql = f"""UPDATE `sound`.`usuarios` 
    SET `user_name` = '{_userName}', `user_pass` = '{_userPass}', `user_email` = '{_userEmail}'
    WHERE `id`='{_userID}'"""
    print(sql)
    conn, cursor = conectarDb(mysql)
    cursor.execute(sql)
    conn.commit()
    
    return render_template('index.html')


if __name__=='__main__':
    app.run()