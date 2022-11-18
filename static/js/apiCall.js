let apiKey = "WNSWhsyB55gAM7J9btrA0o1qYaHHfl0rFwOBLYKM";
let baseUrl = "https://freesound.org/apiv2/";
const categorias = document.querySelectorAll(`div[id^=categoria]`); //trae los div cuyos id comiencen en categoria

let clicks = {
    categoria1: false,
    categoria2: false,
    categoria3: false,
    categoria4: false,
    categoria5: false,
    categoria6: false
}

const buscarSonidos = function ( event ) {
    let target = event.currentTarget.getAttribute('name');
    //console.log('target ',target)
    let id;
    for( categoria of categorias){
        if(target === categoria.getAttribute('name') ){
            id = categoria.getAttribute('id')
            break
        }
    }
    //console.log('id ',id)
    if ( clicks[id] ) {
        clicks[id] = false;
        let remover = document.querySelector(`#${id} .contenedorDeAudios`);
        //console.log( remover )
        document.getElementById(id).removeChild( remover )

    }
    else {
        fetch(`https://freesound.org/apiv2/search/text/?query=${target}&fields=name,images,previews&page_size=5`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${apiKey}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data.results);
                crearAudios(target, data.results);
            }
            )
    }
}
//Agrego un escucha de evento click al titulo dentro de cadea div con id categoriaX
categorias.forEach(categoria => { categoria.childNodes[1].addEventListener('click', buscarSonidos) })

const crearAudio = function (url) {
    let audio = document.createElement('audio');
    audio.preload = "none"
    audio.src = url;
    audio.controls = true;
    return audio
}

const crearAudios = function (contenedorName, soundList) {
    //console.log('ejecutando crearAudios')
    //console.log('nombreDeContenedor recibido ', contenedorName)
    let maxlength = 15;
    let contenedorDeAudios = document.createElement('div');
    contenedorDeAudios.classList.add('contenedorDeAudios');
    for (sound of soundList) {
        let pista = document.createElement('div');
        pista.classList.add('pista');
        let titulo = document.createElement('p');
        titulo.classList.add('titulo-cancion');
        let name = ( sound.name.length > maxlength ) ? sound.name.slice(0,maxlength) : sound.name; //Recorto los titulos a max 15 caracteres
        titulo.innerText = name;
        let imagen = document.createElement('img');
        imagen.src = sound.images["waveform_l"];
        let audio = crearAudio(sound.previews["preview-lq-mp3"]);
        pista.appendChild(titulo);
        pista.appendChild(imagen);
        pista.appendChild(audio);
        contenedorDeAudios.appendChild(pista);
    }
    switch (contenedorName) {
        case 'bass':
            clicks.categoria1 = true;
            document.getElementById('categoria1').appendChild(contenedorDeAudios);
            console.log('agregando a categoria1')
            //console.log(contenedorDeAudios)
            break
        case 'brass':
            clicks.categoria2 = true;
            document.getElementById('categoria2').appendChild(contenedorDeAudios)
            break
        case 'strings':
            clicks.categoria3 = true;
            document.getElementById('categoria3').appendChild(contenedorDeAudios)
            break
        case 'guitar':
            clicks.categoria4 = true;
            document.getElementById('categoria4').appendChild(contenedorDeAudios)
            break
        case 'piano':
            clicks.categoria5 = true;
            document.getElementById('categoria5').appendChild(contenedorDeAudios)
            break
        case 'sfx':
            clicks.categoria6 = true;
            document.getElementById('categoria6').appendChild(contenedorDeAudios)
            break
    }
}