// gambiarra pra atualizar o shader em caso de alteração no servidor
// só funciona com servidor local aberto
if( location.origin.includes('10001') ){
    const socketUrl = 'ws://localhost:10001/watch';
    const socket = new WebSocket(socketUrl);

    // socket.addEventListener('message',(e)=>{
    //     console.log('asdfasdf')
    //     show( canvas_title.innerHTML );
    // });
    socket.onmessage = e => {
        console.log('asdfasdf');
        show( canvas_title.innerHTML );
    };

    socket.onopen = e => {
    // socket.addEventListener('onopen',(e)=>{
        watch = async (name) => {
            try{
                await socket.send(name);
                return true;
            }catch(e){
                console.error(e);
                return false;
            }
        };
        watch(canvas_title.innerHTML);
    };
    // setTimeout( () => watch(canvas_title.innerHTML), 1500);
}

