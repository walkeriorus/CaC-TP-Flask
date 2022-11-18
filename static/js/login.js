window.addEventListener('load',()=>{
    let defaultUser = {
        'user-name': 'sounds',
        'user-pass':'sounds123',
        'user-email':'sounds@mail.com',
        'intereses':['brass','strings'],
        'loggedIn': false,
    }
    sessionStorage.setItem( defaultUser["user-name"], JSON.stringify( defaultUser ));
    let session = detectarSesionIniciada();
    if( session ){
        //Alguien tiene la sesion iniciada
        let loggedUser = document.getElementById('loggedUser');
        loggedUser.innerText = JSON.parse(sessionStorage.getItem(session))['user-name'];
        mostrarElemento(loggedUser, true);
        mostrarElemento(document.getElementById('loginButton'), false)
        mostrarElemento( document.getElementById('registerLink'),false)
        mostrarElemento( document.getElementById('logOutButton'),true)
    }
})
const login = function( event ){
    let userName = document.getElementById('login-user');
    let userPass = document.getElementById('login-pass');
    let error = document.getElementById('login-error');
    if( sessionStorage.getItem( userName.value ) !== null ){
        //obtengo los datos desde sessionStorage
        let datosUsuario = JSON.parse( sessionStorage.getItem(userName.value) );
        if( userName.value === datosUsuario['user-name'] && userPass.value === datosUsuario['user-pass'] ){
            //puede iniciar sesión
            let loggedUser = document.getElementById('loggedUser');
            loggedUser.innerText = datosUsuario['user-name'];
            datosUsuario.loggedIn = true;
            sessionStorage.setItem( userName.value, JSON.stringify( datosUsuario ) );


            mostrarElemento(loggedUser, true);
            mostrarElemento(document.getElementById('loginButton'), false)
            mostrarElemento( document.getElementById('registerLink'),false)
            mostrarElemento( document.getElementById('logOutButton'),true)
            mostrarElemento( error, false);
            event.preventDefault();
            mostrarLoginForm();
        }
        else{
            event.preventDefault();
            error.innerText= 'Error, usuario o contraseña invalidos';
            error.classList.remove('noMostrar')
            setTimeout(()=>{
                error.classList.add('noMostrar')
            }, 2000);
        }
    }
    else{
        event.preventDefault();
        error.innerText = 'El usuario no existe';
        mostrarElemento( error, true);
        setTimeout(()=>{
            mostrarElemento(error, false);
        }, 2000);
    }
}
const mostrarLoginForm = function(){
    let form = document.getElementById('loginForm');
    form.classList.toggle('noMostrar');
    form.classList.toggle('flex');
    form.reset();
}
const mostrarElemento = function( el, bool){
    if(bool){
        el.classList.remove('noMostrar');
    }
    else{
        el.classList.add('noMostrar');
    }
}
const detectarSesionIniciada = function(){
    //Recorro sessionStorage obteniendo todas las claves (key) que son los nombres de usuarios
    for(let i = 0; i<sessionStorage.length; i++){
        let clave = sessionStorage.key(i);
        if( clave ==='IsThisFirstTime_Log_From_LiveServer'){
            //Esto lo agrega la extension liveServer y no me interesa revisarlo
            continue
        }
        else{
            let datosUsuario = JSON.parse( sessionStorage.getItem( clave ) );
            if( datosUsuario.loggedIn ){
                return datosUsuario['user-name']
            }
        }
    }
    //En este caso no habria ningun usuario con sesion iniciada, es decir su clave loggedIn != true
    return false
}
const logOut = function(){
    mostrarElemento( document.getElementById('registerLink'),true);
    mostrarElemento( document.getElementById('loggedUser'),false);
    mostrarElemento( document.getElementById('logOutButton'),false);
    mostrarElemento( document.getElementById('loginButton'),true);
    let datosUsuario = JSON.parse( sessionStorage.getItem( document.getElementById('loggedUser').innerText ) )
    datosUsuario.loggedIn = false;
    sessionStorage.setItem( datosUsuario['user-name'], JSON.stringify(datosUsuario));
}

const logOutButton = document.getElementById('logOutButton');
let loginButton = document.getElementById('loginButton');
let formularioInicio = document.getElementById('loginForm');

//Event listeners
loginButton.addEventListener('click', mostrarLoginForm );
logOutButton.addEventListener('click', logOut );
formularioInicio.addEventListener('submit', login )