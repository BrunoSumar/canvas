const fragments = [ 'initial', 'star' ];

const listToOptions = ( list ) => {
    return list.map( name => `<option value="${ name }">${ name }</option>` ).join(' ');
};

const displayOptions =  async () => {
    const options = listToOptions( fragments );
    const select = document.getElementById('cList');
    console.log( options )
    select.innerHTML = options;
    select.addEventListener('change', function ( e ) {
        const selection = this.options[this.selectedIndex];
        use( selection.value );
    });
};

displayOptions();
