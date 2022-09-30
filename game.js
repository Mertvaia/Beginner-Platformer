const gameBoard = document.getElementById("gameArea")
const ctx = gameBoard.getContext("2d")
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height
const gameBG = "aqua"
const charColor = "#ff00ff"
const platformColor = "black"
const playButton = document.getElementById("playButton")
let dead = true
let keyObject = {}
let keyPress = window.addEventListener("keydown", (event) => {keyObject[event.key] = true})
document.addEventListener("keyup", (event) => {delete keyObject[event.key]})
let touchGrass = false
let platformArray = []
let platformsSpeed = 1
let extraJump = false
let score = 0


const Player = {posX:500, posY:0, width:25, height:50, speedX:6, speedY:0}
class Platform{
    constructor(coordX, coordY){
        this.posX = coordX
        this.posY = coordY
    }
    width = 200
    height = 10
    exists = true
}

playButton.onclick = ()=>{if(dead == true){dead = false;score = 0;Player.posX = 500; Player.posY=0;Player.speedY=0;platformArray = [];platformArray.push(platformArray.push(new Platform(400,50))) ;gameStart()}}



function gameStart(){
    gameTick()
    newPlaformTimer()
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
            score += 20
            document.getElementById("score").innerHTML = `score:${Math.ceil(score/1000)}`
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
        extraJump = true
        touchGrass = touchControl()
    }
    if(touchGrass && (keyObject["w"] || keyObject[" "] || keyObject["ArrowUp"])){
        Player.speedY = -15
        touchGrass = false
    }
    //else if(extraJump && !touchGrass && Player.speedY > 3 && (keyObject["w"] || keyObject[" "] || keyObject["ArrowUp"])){
        //Player.speedY = -11                       will add double jump here (maybe?)
        //extraJump = false
    //}
    if(!touchGrass){
        Player.posY += Player.speedY
        touchGrass = touchControl()
        
    }
    gravity()

}



function touchControl(){
    let touchy
    if(gameHeight <= Player.posY){
        dead = true
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
    if(Player.speedY < 15){
        Player.speedY += 0.5
    }
    if(touchGrass && Player.speedY > platformsSpeed*4){
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
        if(platform.posY > (gameHeight + 20)){
            let index = platformArray.indexOf(platform)
            platformArray.splice(index, 1)
        }
    }
}



function newPlaformTimer(){
    if(!dead){
        setTimeout(()=>{
            createPlatform()
            newPlaformTimer()}, 3000)
    }
}



function createPlatform(){
    let randpos = Math.ceil(Math.random()*(gameWidth-200))
    platformArray.push(new Platform(randpos, -50))
}