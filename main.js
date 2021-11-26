//-----------------------------------------------

const WIDTH = 800;
const HEIGHT = 600;

let hanoi = null;
let numDiscos = null;
let sliderNumDiscos = null;

//-----------------------------------------------

function setup()
{
    sliderNumDiscos = createSlider(3, 6, 3, 1);
    createDiv("Número de discos");
    initHanoi();
    
    createCanvas(WIDTH, HEIGHT);
}

//-----------------------------------------------

function draw()
{
    background(255);

    if (numDiscos != sliderNumDiscos.value())
        initHanoi();

    hanoi.draw();
}

//-----------------------------------------------

// Reinicia las torres con el número de discos seleccionados
function initHanoi()
{
    numDiscos = sliderNumDiscos.value();
    hanoi = new Hanoi(numDiscos);
}

//-----------------------------------------------

// Con un clic de ratón se ejecuta siguiente paso de solución
function mouseClicked()
{
    if (mouseX < WIDTH && mouseY < HEIGHT)
    {
        hanoi.solucionPorPasos();
    }
}