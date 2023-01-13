
const canvas_container = document.getElementById('cContainer');
// const canvas_title     = document.getElementById('cTitle');
const canvas_text      = document.getElementById('cText');

const frag_canvas = createFragCanvas( 'c', INITIAL_FRAGMENT_SHADER_TEXT, 2);

const fps = 24;
const draw_interval = window.setInterval(
    () => frag_canvas.draw( (new Date()).getTime() ),
    1000/fps,
);

const mouse_event = frag_canvas.canvas.addEventListener('mousemove', e => { // Normaliza a posição do mouse no canvas
    frag_canvas.mouse[0] = 2 * frag_canvas.resScale * e.offsetX / frag_canvas.canvas.width - 1;
    frag_canvas.mouse[1] = 2 * (frag_canvas.canvas.height - frag_canvas.resScale * e.offsetY) / frag_canvas.canvas.height - 1;
});

const fetchFrag = async ( name ) => {
    const res = await fetch(`fragments/${name}.frag`);
    return await res.text();
};

let current_shader = null;
const show = async (name) => {
    try{
        canvas_container.style.display = 'none';
        const frag_text = await fetchFrag( name );
        frag_canvas.update( frag_text );
        if( name !== current_shader ){
            // canvas_title.innerHTML = name;
            current_shader = name;
            canvas_text.innerHTML = frag_text;
            console.log(`Shader alterado para ${name}`);
        }
        canvas_container.style.display = 'block';
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
};

let watch = () => false;
const use = async name => await show(name) && await watch(name);

// displayOptions();
use('initial');
