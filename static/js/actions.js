let cells = document.querySelectorAll('.cell-img-wrapper');

const togglePlayer = function( event ){
    event.stopPropagation
    let el = event.target;
    console.log('elemento: ', el);
    let player = el.nextElementSibling;
    console.log('hermano: ', player);
}


for( cell of cells){
    cell.addEventListener('click', togglePlayer );
}