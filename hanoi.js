//-----------------------------------------------

class Hanoi
{
    //-------------------------------------------

    constructor(numDiscos = 3)
    {
        this.numDiscos = numDiscos;
        this.torres = [];

        this.separacionDiscos = 20; // Separación vertical entre discos

        this.crearTorres();
        this.crearDiscos();
        
        // Para controlar solución por pasos
        this.iPorPasos = 0;
        this.movs = Math.pow(2, this.numDiscos) - 1;
    }

    //-------------------------------------------

    // Crear las tres torres
    crearTorres()
    {
        this.torres.push(new Torre("A (origen)"));
        this.torres.push(new Torre("B (auxiliar)"));
        this.torres.push(new Torre("C (destino)"));

        // Posición en eje X de las torres
        const SEPARACION = WIDTH / 4;
        for (let i = 0; i < this.torres.length; i++)
            this.torres[i].setX(SEPARACION * (1 + i));
    }

    //-------------------------------------------

    // Crear los discos e insertarlos en torre origen
    crearDiscos()
    {
        let deltaY = this.numDiscos * this.separacionDiscos;
        for (let i = 0; i < this.numDiscos; i++)
        {
            this.torres[0].discos.push(new Disco(i, this.torres[0].posX, HEIGHT - deltaY));
            deltaY -= this.separacionDiscos;
        }
    }

    //-------------------------------------------

    // Dibuja cada torre, y cada torre dibuja sus discos
    draw()
    {
        this.torres.forEach(t => {
            t.draw();
        });
    }

    //-------------------------------------------

    // Mover discos entre dos torres:
    moverDiscos(origen, destino)
    {
        // Obtener los discos en la parte superior de cada torre
        const torre1TopDisco = origen.discos.length > 0 ? origen.discosShift() : null;
        const torre2TopDisco = destino.discos.length > 0 ? destino.discosShift() : null;

        // Torre 1 está vacía
        if (torre1TopDisco == null)
        {
            origen.discosUnshift(this.calcularPosicionDisco(origen, torre2TopDisco));
        }
        // Torre 2 está vacía
        else if (torre2TopDisco == null)
        {
            destino.discosUnshift(this.calcularPosicionDisco(destino, torre1TopDisco));
        }
        // Disco de torre 1 es mayor que disco de torre 2
        else if (torre1TopDisco.ancho > torre2TopDisco.ancho)
        {
            origen.discosUnshift(torre1TopDisco);
            origen.discosUnshift(this.calcularPosicionDisco(origen, torre2TopDisco));
        }
        // Disco de torre 1 es menor que disco de torre 2
        else
        {
            destino.discosUnshift(torre2TopDisco);
            destino.discosUnshift(this.calcularPosicionDisco(destino, torre1TopDisco));
        }
    }

    // Al mover disco, calcula su posición en torre destino antes de insertarlo
    calcularPosicionDisco(torre, disco)
    {
        disco.setDestino(torre.posX, HEIGHT - this.separacionDiscos * (torre.discos.length + 1));
        disco.iniciaMovimiento();

        return disco;
    }

    //-------------------------------------------

    // Solución paso por paso para ver movimientos
    solucionPorPasos()
    {
        // Si el número de discos es par, cambiar torres auxiliar y destino
        if (this.iPorPasos == 0 && this.numDiscos % 2 == 0)
        {
            let torreTemp = this.torres[1];
            this.torres[1] = this.torres[2];
            this.torres[2] = torreTemp;
        }

        // Control de movimientos
        if (this.iPorPasos >= this.movs)
            return;
        this.iPorPasos++;

        if (this.iPorPasos % 3 == 1)
            this.moverDiscos(this.torres[0], this.torres[2]);   // origen <-> destino
        else if (this.iPorPasos % 3 == 2)
            this.moverDiscos(this.torres[0], this.torres[1]);   // origen <-> auxiliar
        else if (this.iPorPasos % 3 == 0)
            this.moverDiscos(this.torres[1], this.torres[2]);   // auxiliar <-> destino
    }

    //-------------------------------------------
}

//-----------------------------------------------

class Torre
{
    //-------------------------------------------

    constructor(nombre)
    {
        this.nombre = nombre;
        this.posX = null;
        this.discos = [];
    }

    //-------------------------------------------

    // Insertar disco en parte superior de la torre
    discosUnshift(disco)
    {
        this.discos.unshift(disco);
    }

    //-------------------------------------------

    // Tomar disco superior de la torre
    discosShift()
    {
        return this.discos.shift();
    }

    //-------------------------------------------

    // Definir la posición en X de la torre
    setX(posX)
    {
        this.posX = posX;
    }

    //-------------------------------------------

    // Dibuja la torre, de la base al centro (vertical)
    draw()
    {
        stroke(100);
        line(
            this.posX, HEIGHT / 2,
            this.posX, HEIGHT
        );

        noStroke();
        fill(100)
        text(this.nombre, this.posX, HEIGHT - 2);

        // Dibuja los discos de la torre
        this.discos.forEach(d => {
            d.draw();
        });
    }

    //-------------------------------------------
}

//-----------------------------------------------

class Disco
{
    //-------------------------------------------

    constructor(ancho, posX, posY)
    {
        this.posX = posX;
        this.posY = posY;

        // Para controlar el destino al momento de moverse entre torres
        this.destinoX = null;
        this.destinoY = null;
        this.velocidad = 5;
        this.estado = "enPosicion"; // Estados: "sube", "movHorizontal", "baja", "enPosicion"

        // Cálculo de ancho del disco
        this.factorAncho = 25;
        this.ancho = this.factorAncho * (1 + ancho);
    }

    //-------------------------------------------

    // Definir posición actual del disco
    setPos(posX, posY)
    {
        this.posX = posX;
        this.posY = posY;
    }

    //-------------------------------------------

    // Dibjar el disco
    draw()
    {
        // Realizar movimiento si está pasando a otra torre
        if (this.estado != "enPosicion")
            this.mover();

        // Centrar disco en posición
        const FINALX = this.posX - this.ancho / 2;

        stroke(0);
        strokeWeight(5);
        line(
            FINALX, this.posY,
            FINALX + this.ancho, this.posY,
        );
        strokeWeight(1);
    }

    //-------------------------------------------

    // Datos para definir el destino del disco al moverse a otra torre
    setDestino(destinoX, destinoY)
    {
        this.destinoX = destinoX;
        this.destinoY = destinoY;
    }

    //-------------------------------------------

    // Cambia estado de disco para iniciar movimiento
    iniciaMovimiento()
    {
        this.estado = "sube";
    }

    //-------------------------------------------

    // Mover el disco a otra torre (la posición final ya fue calculada)
    mover()
    {
        switch (this.estado)
        {
            // El disco sube para salir de torre
            case "sube":
                this.posY -= this.velocidad;
                if (this.posY <= HEIGHT / 2 - 10)
                {
                    this.posY = HEIGHT / 2 - 10;
                    this.estado = "movHorizontal";
                }
                break;
            
            // El disco se mueve horizontalmente hacia la torre destino
            case "movHorizontal":
                if (this.posX < this.destinoX)      // Se mueve a la derecha
                {
                    this.posX += this.velocidad;
                    if (this.posX >= this.destinoX)
                    {
                        this.posX = this.destinoX;
                        this.estado = "baja";
                    }
                }
                else        // Se mueve a la izquierda
                {
                    this.posX -= this.velocidad;
                    if (this.posX <= this.destinoX)
                    {
                        this.posX = this.destinoX;
                        this.estado = "baja";
                    }
                }
                break;
            
            // El disco baja en la torre destino hasta su posición final
            case "baja":
                this.posY += this.velocidad;
                if (this.posY >= this.destinoY)
                {
                    this.posY = this.destinoY;
                    this.estado = "enPosicion";
                }
                break;
        
            default:
                break;
        }
    }

    //-------------------------------------------
}

//-----------------------------------------------