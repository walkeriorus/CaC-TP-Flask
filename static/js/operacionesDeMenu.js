let actualPath = window.location
let pathName = actualPath.pathname
/*Cual menu estoy mostrando?? */
let identificarMenu = function () {
    //Devuelve el id del menu que se esta mostrando actualmente
    //Los valores posibles son 'menu-principal' y 'menu-secundario'

    //Como hay 3 elementos cuyo id comienza con la palabra 'menu', pero solo me interesan los 2 primeros
    //convierto el resultado de querySelectorAll a una lista y la recorto para no guardar el tercer elemento-que no me interesa-
    let menus = [...document.querySelectorAll(`div[id^=menu]`)].slice(0, 2);
    let idMenu;
    for (let pos = 0; pos < menus.length; pos++) {
        if (window.getComputedStyle(menus[pos]).display === 'none') {
            continue
        }
        else {
            idMenu = menus[pos].id;
        }
    }
    return idMenu
}
let desplegarMenuSecundario = function () {
    //Esta funcion muestra el elemento con id #menu-secundario-links
    let menuSecundarioLinks = document.querySelector('#menu-secundario-links');
    let displayValue = menuSecundarioLinks.classList;
    let anchoDePantalla = window.innerWidth;
    if (displayValue[0] === 'displayNone') {
        menuSecundarioLinks.classList.remove('displayNone')
        if (anchoDePantalla <= 420) {
            menuSecundarioLinks.classList.toggle('grid');
        }
        else {
            menuSecundarioLinks.classList.toggle('flex');
        }
    }
    else {
        menuSecundarioLinks.classList.toggle(displayValue);
        menuSecundarioLinks.classList.add('displayNone');
    }

}
let elementoExiste = function ( idElemento ){
    let selector = '#'+ idElemento
    if ( document.querySelector( selector ) !== null ) {
        return true
    }
    else {
        return false
    }
}
let esHijoDe = function( idPadre, idHijo ){
    let selector = `#${ idPadre } #${ idHijo }`;
    if( document.querySelector (selector ) !== null){
        return true
    }
    else{
        return false
    }
}

let agregaLoginEnMenu = function ( idMenu ) {
    //Agrega la seccion login sobre el menu con id = idElemento
    //La funcion no hace ninguna comprobacion

    let loginDiv = document.createElement('div');
    loginDiv.setAttribute('id', 'login');
    let plantilla = `
    <label for="hideShowLogin">Login</label>
    <input type="checkbox" id="hideShowLogin">
    <form id="user-login" action="/login" method="post"
    enctype="multipart/form-data">
        <label for="user-name">Nombre de usuario</label>
        <input type="text" name="user-name" id="user-name" autocomplete="off">
        <label for="user-password">Contraseña</label>
        <input type="password" name="user-pass" id="user-pass" autocomplete="off">
        <button type="submit" class="button">Iniciar sesion</button>
        <a href="{{url_for('registro)}}">Registrarse</a>
    </form>
    `;
    loginDiv.innerHTML = plantilla;
    document.querySelector(`#${idMenu}`).appendChild( loginDiv );
    console.log('Agregando login en :', idMenu );
    
}
let borrarLoginEnMenu = function( idMenu ){
    let menu = document.querySelector(`#${idMenu}`);
    let hijo = document.querySelector(`#${idMenu} #login`);
    menu.removeChild( hijo );
    console.log('Se elimino el login en', idMenu );
}

let operacionesSobreHeader = function () {
    resaltarNavLink();
    let idMenu = identificarMenu(); //esto devuelve un id
    //
    idMenu = ( idMenu === 'menu-secundario')? idMenu+'-links' : idMenu;
    if( !esHijoDe( idMenu, 'login' ) ){
        agregaLoginEnMenu( idMenu );
    }
    else{
        console.log('Login esta en: ', idMenu );
        if( idMenu === 'menu-principal'){
            if( esHijoDe('menu-secundario-links','login') ){
                borrarLoginEnMenu('menu-secundario-links')
            }
        }
        else{
            if( esHijoDe('menu-principal','login')){
                borrarLoginEnMenu('menu-principal')
            }
        }
    }
}


let resaltarNavLink = function(){
    let navLink = document.querySelector(`.nav-link[href="${pathName}"]`);
    navLink.style.backgroundColor = "white";
    navLink.style.color = "black";
}



window.addEventListener('resize', operacionesSobreHeader );
window.addEventListener('load', operacionesSobreHeader );

let desplegarMenu = document.querySelector('#desplegar-menu');
desplegarMenu.addEventListener( 'click', desplegarMenuSecundario );