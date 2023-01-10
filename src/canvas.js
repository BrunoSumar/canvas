const createWebglContext = ( canvasElement ) => {
    if(!canvasElement)
        throw new Error("Canvas não encontrado");
    canvasElement.style.display = 'block';

    const gl = canvasElement.getContext('webgl') || canvasElement.getContext('experimental-webgl');
    if(!gl)
        throw new Error("webGL não suportado");

    return gl;
};

const createShader = ( gl, shader_type, shader_text ) => {
    const shader = gl.createShader( shader_type );

    gl.shaderSource( shader, shader_text );

    gl.compileShader( shader );
    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
        throw new Error(`Erro ao compilar shader (${ shader_type }): ${ gl.getShaderInfoLog(shader) }`);

    return shader;
};

const attachShaderProgram = ( gl, program, ...shaders ) => {
    shaders.forEach( shader => gl.attachShader(program, shader) );

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error('ERROR linking program!' + gl.getProgramInfoLog(program));

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        throw new Error('ERROR validating program!' + gl.getprogramInfoLog(program));

    return program;
};

const updateShaderFunc = ( gl, program ) => {
    return ( frag_text ) => {
        const new_frag = createShader( gl, gl.FRAGMENT_SHADER, frag_text );
        const [ vertex, old_frag ]  = gl.getAttachedShaders( program );
        gl.detachShader( program, old_frag );
        // gl.deleteShader( program, old_frag );
        program = attachShaderProgram( gl, program, new_frag, vertex );
        gl.useProgram( program );
    };
};

const createVBO = ( gl ) => {
    const vertex_buffer_object = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_object);

    return vertex_buffer_object;
};

const setResolutionAttr = ( gl, program, width, height ) => {

};

const destroyContext = ( gl , canvas ) => {
    const canvas_id = canvas.id;
    const pai = canvas.parentNode;
    pai.removeChild(canvas);
    const new_canvas = document.createElement('canvas');
    new_canvas.style.display = 'none';
    new_canvas.id = canvas_id;
    pai.prepend( new_canvas );

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteBuffer(vertexBufferObject);
    gl.canvas.width = gl.canvas.height = 1;
};

const createFragCanvas = ( canvas_id, FRAGMENT_SHADER_TEXT, resScale ) => {
    const canvas = document.getElementById( canvas_id );
    const gl = createWebglContext( canvas );

    // Ajustando a resolução do viewport ao tamanho da tela
    canvas.width = resScale*canvas.clientWidth;
    canvas.height = resScale*canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Criando e compilando os shaders
    const vertex_shader = createShader( gl, gl.VERTEX_SHADER, VERTEX_SHADER_TEXT );
    const fragment_shader = FRAGMENT_SHADER_TEXT ? createShader( gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_TEXT ) : null;

    // Linkando shaders a um program
    const program = attachShaderProgram( gl, gl.createProgram(), vertex_shader, fragment_shader );
    gl.useProgram( program );

    // Criando e usando buffer
    const vertex_buffer_object = createVBO( gl );

    const quad_vertices = [
    /* | X |  Y |*/
         1.,  1.,
        -1.,  1.,
        -1., -1.,
         1., -1.
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad_vertices), gl.STATIC_DRAW);

    // Configurando atributos do vertex shader
    const position_attrib_location = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(position_attrib_location, 2,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray( position_attrib_location );

    const begin = (new Date()).getTime();
    const mouse_pos = [0,0];

    const drawFrag = ( time = begin ) => {
        const res_location = gl.getUniformLocation(program, "Resolution");
        gl.uniform2fv(res_location, [canvas.width, canvas.height]);
        const time_location = gl.getUniformLocation(program, "Time");
        gl.uniform1f(time_location, begin - time);
        const mouse_location = gl.getUniformLocation(program, "Mouse");
        gl.uniform2fv(mouse_location, mouse_pos);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    };

    return {
        draw: drawFrag,
        destroy: () => destroyContext( gl, canvas ),
        update: updateShaderFunc( gl, program ),
        mouse: mouse_pos,
        resScale,
        canvas,
        gl,
    };
};
