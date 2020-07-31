function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

/* const b = new Barreira(true)
b.setAltura(200)
document.querySelector('[wm-flappy]').appendChild(b.elemento) */

function ParDeBarreiras(altura, abertura, x) {
    //this transforma o atributo fora da function
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {

        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

/* const b = new ParDeBarreiras(700, 200, 400)
document.querySelector('[wm-flappy]').appendChild(b.elemento) */

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando o elemento sair da area de jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if (cruzouOMeio) notificarPonto()
        })
    }
}

function Passaro(alturaJogo) {
    let voando = false;
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        //quanto o passaro sobe ou cai
        const novoY = this.getY() + (voando ? 8 : -5)
        // altura maxima que o passaro pode voar
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    //altura inicial do passaro
    this.setY(alturaJogo / 2)
}

/* const barreiras = new Barreiras(700, 1200, 200, 400)

const passaro = new Passaro(700)
const areaDoJogo = document.querySelector(['[wm-flappy]'])

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval(() => {
    barreiras.animar()
    passaro.animar()
}, 20)
 */

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}


function estaoSobrepostos(elementoA, elementoB) {
    //pega o retangulo associado ao elemento
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return horizontal && vertical

}

//verifica se houve colisão entre o passaro e as barreiras
function colidiu(passaro, barreiras) {
    let colidiu = false;
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            // se estiver sobreposto significa que o passaro colidiu com a barreira
            colidiu = estaoSobrepostos(passaro.elemento, superior) ||
                estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function RandomBackgroundColor(element) {
    this.setBackgroundColor = () => {
        const _element = element
        let backgroundColorRgb = []
        let elementBackgroundColor = ''
        elementBackgroundColor = element.style.backgroundColor
        if (!(elementBackgroundColor.includes('rgb', 0))) {
            //elementBackgroundColor = "rgb(0, 0, 1)"
            elementBackgroundColor = "rgb(1, 1, 1)"
            _element.style.backgroundColor = elementBackgroundColor
        }
        else {
            elementBackgroundColor = retrieveRgbCharAt(elementBackgroundColor)
            backgroundColorRgb = fromArrStringToArrNumber(elementBackgroundColor)
            backgroundColorRgb = increaseRgbNumber(backgroundColorRgb)
            _element.style.backgroundColor = backgroundColorRgb
        }
    }
}

function increaseRgbNumber(backgroundColor = []) {
    let numbers = backgroundColor
    let randomInt = (min, max) => { return Math.floor(Math.random() * (max - min) + min) }
    let randomBoolean = () => Math.random() > 0.3
    let randomResetRgb = () => {
        let randomPos = randomInt(0, 3)
        if (numbers[randomPos] >= 200) {
            numbers[randomPos] = Math.floor((Math.random() + 1) * randomInt(50, 200))
        }
    }
    for (let i = 0; i < numbers.length; i++) {
        if (randomBoolean()) {
            numbers[randomInt(0, 3)]++
        } else if (randomBoolean()) {
            numbers[randomInt(0, 3)]++
        } else if (randomBoolean()) {
            numbers[randomInt(0, 3)]++
        }
        if(randomBoolean()) {
            randomResetRgb()
        }
        break
    }
    return `rgb(${numbers[0]}, ${numbers[1]}, ${numbers[2]})`
}

function fromStringToArrayNumber(text = '') {
    let arr = []
    let arrNumbers = []
    let toNumber = n => parseInt(n)
    arr = text.split('')
    arrNumbers = arr.map(toNumber)
    return arrNumbers
}

function fromArrStringToArrNumber(stringArr = []) {
    let arrRgbNumbers = []
    let toNumber = n => parseInt(n)
    stringArr.forEach(e => {
        arrRgbNumbers = stringArr.map(toNumber)
    })
    return arrRgbNumbers
}

function retrieveRgbCharAt(text = '') {
    const isNumber = n => !isNaN(n)
    let rgbChar = ''
    let rgbCharArr = []
    for (let i = 0; i < text.length; i++) {
        if (isNumber(text.charAt(i))) {
            rgbChar += text.charAt(i)
        }
        if (text.charAt(i) == ',' || text.charAt(i) == ')') {
            rgbChar = rgbChar.trim()
            rgbCharArr.push(rgbChar)
            rgbChar = ''
        }
    }
    return rgbCharArr
}

function FlappyBird() {
    let pontos = 0

    //representa area do jogo
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const backgroundElementoFlappy = document.querySelector('[wm-flappy]')
    //altura do jogo == altura da div
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400, () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)
    const randomBackgroundColor = new RandomBackgroundColor(areaDoJogo)
    let time = 1

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)

    //para cada par adiciona dentro da area do jogo
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    //inicio o jogo
    this.start = () => {

        //loop do jogo
        const temporizador = setInterval(() => {
            //barreiras.animar()
            passaro.animar()
            randomBackgroundColor.setBackgroundColor()
            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
            }
        }, 20)

        const temp = setInterval(() => {
            randomBackgroundColor.setBackgroundColor()
        }, 1)

    }

}

new FlappyBird().start()

