const VERTEX_SHADER_TEXT = [
    "precision mediump float;",
    "attribute vec4 vertPosition;",
    "varying vec2 Position;",
    "void main()",
    "{",
    "    Position = vertPosition.xy;",
    "    gl_Position = vertPosition;",
    "}"
].join('\n')

const createWebglContext = (canvasId, FRAGMENT_SHADER_TEXT) => {
    // Canvas os a imagem será rederizada
    const canvas = document.getElementById(canvasId);
    if(!canvas)
        return

    //  salvar o contexto webGL usado
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if(!gl)
        throw new Error("webGL não suportado")

    // Ajustando a resolução do viewport ao tamanho da tela
    const resScale = 2
    canvas.width = resScale*canvas.clientWidth;
    canvas.height = resScale*canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Criando e compilando os shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, VERTEX_SHADER_TEXT);
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER_TEXT);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Erro ao compilar vertex shader', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Erro ao compilar fragment shader', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // Linkando shaders a um program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getprogramInfoLog(program));
        return;
    }
    gl.useProgram(program)

    // Dados dos vértices do quad
    const vertices =
        [ /*| X |  Y |*/
              1.,  1.,
             -1.,  1.,
             -1., -1.,
              1., -1.
        ];

    // Criando o buffer
    const vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Configurando como a informação é lida
    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition'); //buscando o índice do atributo no shader
    gl.vertexAttribPointer(positionAttribLocation, 2,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(positionAttribLocation);

    // Setando variáveis úteis
    //   Resolução
    const resLocation = gl.getUniformLocation(program, "Resolution")
    gl.uniform2fv(resLocation, [canvas.width, canvas.height])
    //   Tempo
    const timeLocation = gl.getUniformLocation(program, "Time")
    const begin = (new Date()).getTime()
    gl.uniform1f(timeLocation, 0)
    //   Posição do mouse
    const mouseLocation = gl.getUniformLocation(program, "Mouse")
    const mouse = [0,0]
    canvas.addEventListener('mousemove', e => {
        // Normaliza a posição do mouse no canvas
        mouse[0] = 2*resScale*e.offsetX/canvas.width - 1
        mouse[1] = 2*(canvas.height - resScale*e.offsetY)/canvas.height - 1
    });
    gl.uniform2fv(mouseLocation, mouse)

    // Main render loop
    const fps = 1000/24
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    const intervalId = window.setInterval(() => {
        gl.uniform1f(timeLocation, begin - (new Date()).getTime())
        gl.uniform2fv(mouseLocation, mouse)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    }, fps)

    // Retorna função que "limpa" o contexto e para o loop
    return (() => {
        window.clearInterval(intervalId);
        const pai = canvas.parentNode;
        pai.removeChild(canvas);
        const temp = document.createElement('canvas');
        temp.id = canvasId;
        pai.prepend(temp);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindRenderbuffer(gl.RENDERBUFFER, null)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.deleteProgram(program)
        gl.deleteShader(fragmentShader)
        gl.deleteShader(vertexShader)
        gl.deleteBuffer(vertexBufferObject)
        gl.canvas.width = gl.canvas.height = 1
        // console.log('contexto destruido')
    })
}

// Captura posição do mouse



// createWebglContext('c', VERTEX_SHADER_TEXT, FRAGMENT_SHADER_TEXT)



// Gambiarra pra trocar o shader ao atualizar a variavel, clicar na tela atualizar etc

let fragText = null
let shaderName = null
let destroyContext = () => null

Object.defineProperty(this, 'Shader', {
    get: function () { return shaderName;},
    set: async function (v) {
        !destroyContext || destroyContext()
        shaderName = v
        console.log(`Shader alterado para ${v}`)
        let res = await fetch(`fragments/${shaderName}.frag`)
        fragText = await res.text()
        destroyContext = createWebglContext('c', fragText)
    },
});

if(!shaderName)
    Shader = "initial"
else
    Shader = Shader

const atualizar = () => {
    Shader = Shader
}
