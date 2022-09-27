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

const Player = {posX:500, posY:200, width:25, height:50, speedX:4, speedY:0}
class Platform{
    constructor(coordX, coordY){
        this.posX = coordX
        this.posY = coordY
    }
    width = 200
    height = 10
}

gameStart()

platformArray.push(new Platform(200,600))
platformArray.push(new Platform(600,600))

function gameStart(){
    gameTick()
}



function gameTick(){
    if(!dead){
        setTimeout(()=>{
            drawBG()
            drawPlatforms()
            moveChar()
            drawChar()

            gameTick()
        }, 30)
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
        if(((Player.posY+Player.height) >= platform.posY)&&(Player.posY < platform.posY+platform.height)&&(Player.posX + Player.width > platform.posX)&&(Player.posX< platform.posX + platform.width)){
            Player.posY = platform.posY - Player.height
            touchy = true
        }
    }
    console.log(touchy)
    return touchy
}



function gravity(){
    if(Player.speedY < 10){
        Player.speedY += 0.5
    }
    if(touchGrass){
        Player.speedY = 0
    }
}



function movePlatforms(){

}



function drawPlatforms(){
    ctx.fillStyle = platformColor
    for(const platform of platformArray){
        ctx.fillRect(platform.posX, platform.posY, platform.width, platform.height)
    }
}