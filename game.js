const gameBoard = document.getElementById("gameArea")
const ctx = gameBoard.getContext("2d")
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height
const gameBG = "aqua"
const charColor = "#ff00ff"
const platformColor = "black"
let dead = false
let keyObject = {}
let keyPress = window.addEventListener("keydown", (event) => {keyObject[event.key] = true})
document.addEventListener("keyup", (event) => {delete keyObject[event.key]})
let touchGrass = false
let platformArray = []
let platformsSpeed = 1

const Player = {posX:500, posY:0, width:25, height:50, speedX:4, speedY:0}
class Platform{
    constructor(coordX, coordY){
        this.posX = coordX
        this.posY = coordY
    }
    width = 200
    height = 10
}

gameStart()

platformArray.push(new Platform(400,100))
platformArray.push(new Platform(600,400))

function gameStart(){
    gameTick()
}



function gameTick(){
    if(!dead){
        setTimeout(()=>{
            drawBG()
            movePlatforms()
            drawPlatforms()
            moveChar()
            drawChar()

            gameTick()
        }, 20)
    }
}



function drawChar(){
    ctx.fillStyle = charColor
    ctx.fillRect(Player.posX, Player.posY, Player.width, Player.height)
}



function drawBG(){
    ctx.fillStyle = gameBG
    ctx.fillRect(0,0,gameWidth,gameHeight)
}



function moveChar(){
    if(keyObject["d"] || keyObject["ArrowRight"]){
        Player.posX += Player.speedX
    }
    if(keyObject["a"] || keyObject["ArrowLeft"]){
        Player.posX -= Player.speedX
    }
    if(touchGrass){
        for(const platform of platformArray){
            if((Player.posX + Player.width < platform.posX)||(Player.posX > platform.posX + platform.width)){
                touchGrass = touchControl()
            }
            //else{
                //touchGrass = true
                //break
            //}
        }
    }
    if(touchGrass && (keyObject["w"] || keyObject[" "] || keyObject["ArrowUp"])){
        Player.speedY = -15
        touchGrass = false
    }
    if(!touchGrass){
        Player.posY += Player.speedY
        touchGrass = touchControl()
    }
    gravity()

}



function touchControl(){
    let touchy
    if(gameHeight <= Player.posY+Player.height){
        Player.posY = gameHeight - Player.height //will change if statement this as death
        touchy = true
    }
    for(let i = 0; i < platformArray.length;i+=1){
        let platform = platformArray[i]
        if((Player.posX + Player.width > platform.posX)&&(Player.posX< platform.posX + platform.width)){
            for(let j = 0; j < Player.height/2; j+= 5){
                if((Player.posY + j > platform.posY) && (Player.posY + j < platform.posY + platform.height)){
                    Player.posY = platform.posY + platform.height
                    Player.speedY = 1
                }
            }
            for(let j = Player.height/2 + 5; j<=Player.height; j += 5){
                if((Player.posY + j > platform.posY) && (Player.posY + j < platform.posY + platform.height)){
                    Player.posY = platform.posY - Player.height
                }

                if(Player.posY + Player.height <= platform.posY && Player.posY + Player.height >= platform.posY - platformsSpeed){
                    touchy = true
                }
            }
        }
    }
    return touchy
}



function gravity(){
    if(Player.speedY < 10){
        Player.speedY += 0.5
    }
    if(touchGrass && Player.speedY > 8){
        Player.speedY = 0
    }
}



function drawPlatforms(){
    ctx.fillStyle = platformColor
    for(const platform of platformArray){
        ctx.fillRect(platform.posX, platform.posY, platform.width, platform.height)
    }
}



function movePlatforms(){
    for(let platform of platformArray){
        platform.posY += platformsSpeed
    }
}