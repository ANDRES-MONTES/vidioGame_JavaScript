const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')
const up = document.querySelector('#up')
const left = document.querySelector('#left')
const right = document.querySelector('#right')
const down = document.querySelector('#down')
const hearts = document.querySelector('#lives')
const time = document.querySelector('#time')
const bestTime = document.querySelector('#bestTime')
const presult = document.querySelector('#result')

let canvasSize
let elemetsSize
let level = 0
let lives = 3
let timeStar
let timePlayer
let timeIntervale
let formattedTime
let recordBestTime

const playerPositions = {
    x : undefined,
    y : undefined
}

const giftPosition = {
     x : undefined,
     y : undefined
}

let enemyPositions = []


window.addEventListener('load', setCanvaSize)
window.addEventListener('resize', setCanvaSize)


function setCanvaSize () {
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.75
    } else {
        canvasSize = window.innerHeight * 0.75
    }

    canvasSize = Number(canvasSize.toFixed(0))

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    elemetsSize = (canvasSize / 10) 
    playerPositions.x = undefined
    playerPositions.y = undefined
    startGame()
}

function startGame(){

    game.font = elemetsSize + 'px Verdana'
    game.textAlign = 'end'

    const map = maps[level]
    if (!map) {
        gameWin()
        return
    }

    if (!timeStar) {
        timeStar = Date.now()
        timeIntervale = setInterval(showTime, 100)
        showRecord()
    }

    const rowMap = map.trim().split('\n')
    const rowMapColumn = rowMap.map((row) =>{
        return row.trim().split('')
    })
    showLives()
    enemyPositions = []
    game.clearRect(0,0,canvasSize, canvasSize)

    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col<= 10; col++) {
            if (rowMapColumn[row - 1][col - 1] == 'O') {
                if (!playerPositions.x && !playerPositions.y) {
                    playerPositions.x = elemetsSize * col
                    playerPositions.y =  elemetsSize * row
                 }
            } else if (rowMapColumn[row - 1][col - 1] == 'I') {
                giftPosition.x = elemetsSize * col
                giftPosition.y = elemetsSize * row
            } else if (rowMapColumn[row - 1][col - 1] == 'X') {
                enemyPositions.push({
                    x:  elemetsSize * col,
                    y:   elemetsSize * row
                })
            }

            game.fillText(emojis[rowMapColumn[row - 1][col - 1]], elemetsSize * col, elemetsSize * row)

        }
    }

    movePlayer ()
  
}

function movePlayer (){
    game.fillText(emojis['PLAYER'], playerPositions.x, playerPositions.y )
   
    const collisionX = playerPositions.x.toFixed(3) == giftPosition.x.toFixed(3) 
    const collisiony = playerPositions.y.toFixed(3) == giftPosition.y.toFixed(3)
    const collision = collisionX && collisiony
    if (collision) {
        levelWin()
    }

    const enemyCollision = enemyPositions.find((enemy) => {
        const enemyColisionX = enemy.x.toFixed(3) == playerPositions.x.toFixed(3)
        const enemyColisiony = enemy.y.toFixed(3) == playerPositions.y.toFixed(3)
        return enemyColisionX && enemyColisiony
    })

    if (enemyCollision) {
        repeatLevel ()
    }

}

function levelWin() {
    console.log('subiste de nivel')
    level ++
    startGame()
}

function repeatLevel(){
    lives--
    if (lives == 0) {
        level = 0
        lives = 3
        timeStar = undefined
        clearInterval(timeIntervale)
    }

    playerPositions.x = undefined
    playerPositions.y = undefined
    startGame()
}


function gameWin() {
    clearInterval(timeIntervale)
    const recordTime = localStorage.getItem('record_time')
    const playerTime = formattedTime

    if (recordTime) {
        if(recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime)
            presult.innerHTML = 'SUPERASTE EL RECORD'
        } else {
            presult.innerHTML = 'LO SIENTO NO SUPERASTE EL RETO'
        }
    } else {
        localStorage.setItem('record_time', playerTime)
        presult.innerHTML = 'PRIMERA VEZ'
    }
}


function showLives () {
    const heartsArray = Array(lives).fill(emojis['HEARD'])
    hearts.innerHTML = heartsArray
}

function showTime () {
    //time.innerHTML = Date.now() - timeStar
    const currentTime = Date.now() - timeStar;
    const seconds = Math.floor(currentTime / 1000);
    const minutes = Math.floor(seconds / 60);
    formattedTime = padZero(minutes) + ":" + padZero(seconds % 60);
    time.innerHTML = formattedTime;
}

function showRecord() {
    bestTime.innerHTML = localStorage.getItem('record_time')
}

function padZero(value) {
    if (value < 10) {
        return "0" + value;
    } else {
        return value.toString();
    }
}
{}

window.addEventListener('keydown', moveByKeys)
up.addEventListener('click', moveup)
left.addEventListener('click', moveLeft)
right.addEventListener('click', moveRight)
down.addEventListener('click', moveDown)

function moveByKeys(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveup()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowRight':
            moveRight()
            break;
        case 'ArrowDown':
            moveDown()
            break;
        default:
            break;
    }
}

function moveup() {
    console.log('me quiero mover hacia arriba')
    if (playerPositions.y - elemetsSize < elemetsSize) {
        console.log('se salio')
    } else {
        playerPositions.y -= elemetsSize
    }
    startGame()
}

function moveLeft() {
    console.log('me quiero mover hacia izquierda')
    if (playerPositions.x - elemetsSize < elemetsSize) {
        console.log('se salio')
    } else {
        playerPositions.x -= elemetsSize
    }
    startGame()
}

function moveRight(){
    console.log('me quiero mover hacia derecha')
    if (playerPositions.x + elemetsSize > canvasSize) {
        console.log('se salio')
    } else {
        playerPositions.x += elemetsSize
    }
    startGame()
}

function moveDown() {
    console.log('me quiero mover hacia abajo')
    if (playerPositions.y + elemetsSize > canvasSize) {
        console.log('se salio')
    } else {
        playerPositions.y += elemetsSize
    }
    startGame()

}

















