//Initially describe the storyline and rules. 
//click button to begin game
//3 Sec Countdown timer until canvas starts 'moving'
window.onload = (e) => {
    makeLanes()
    setInterval(makeLaneDashes, 900)
}


const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d')
const canvasTwo = document.getElementById('canvas-two'), ctxTwo = canvasTwo.getContext('2d')
const scoreboard = document.getElementById('scoreboard')
const waterButton = document.getElementById('water-button')
const startBtn = document.getElementById('start-btn')
let goldFrogArr = []
let frogArr = []
let currentScore = 0

const showScore = () => {
    scoreboard.textContent = `SCORE: ${currentScore}`
}


class Object {
    constructor(x, y, ctx, color, width, height) {
        this.x = x
        this.y = y
        this.ctx = ctx
        this.color = color
        this.width = width
        this.height = height
    }
    renderObject() {
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    clearObject() {
        this.ctx.clearRect(this.x, this.y, this.width, this.height)
    }

}

const makeLanes = () => {
    const lanes = [
        lane1 = new Object(100, 0, ctxTwo, 'white', 4, 900),
        lane2 = new Object(200, 0, ctxTwo, 'white', 4, 900),
        lane3 = new Object(300, 0, ctxTwo, 'white', 4, 900),
        lane4 = new Object(400, 0, ctxTwo, 'white', 4, 900),
        lane5 = new Object(500, 0, ctxTwo, 'white', 4, 900),
        lane6 = new Object(600, 0, ctxTwo, 'white', 4, 900),
        lane7 = new Object(700, 0, ctxTwo, 'white', 4, 900),
        lane8 = new Object(800, 0, ctxTwo, 'white', 4, 900)
    ]
    lanes.forEach(lane => {
        lane.renderObject()
    })
}

const makeLaneDashes = () => {
    //create array of staggered dashes across entire width
    const laneDashesArr = [
        laneDash1 = new Object(50, -50, ctxTwo, 'yellow', 2, 50),
        laneDash2 = new Object(150, -100, ctxTwo, 'yellow', 2, 50),
        laneDash3 = new Object(250, -50, ctxTwo, 'yellow', 2, 50),
        laneDash4 = new Object(350, -100, ctxTwo, 'yellow', 2, 50),
        laneDash5 = new Object(450, -50, ctxTwo, 'yellow', 2, 50),
        laneDash6 = new Object(550, -100, ctxTwo, 'yellow', 2, 50),
        laneDash7 = new Object(650, -50, ctxTwo, 'yellow', 2, 50),
        laneDash8 = new Object(750, -100, ctxTwo, 'yellow', 2, 50),
        laneDash9 = new Object(850, -50, ctxTwo, 'yellow', 2, 50)
    ]
    laneDashesArr.forEach(dash => {
        setInterval(() => {
            dash.clearObject()
            dash.y > 900 ? null : dash.y += 50
            dash.renderObject()
        }, 300)
    })
}

function detectHit(obj1, obj2) {
    let hitTest =
        obj1.y + obj1.height > obj2.y &&
        obj1.y < obj2.y + obj2.height &&
        obj1.x + obj1.width > obj2.x &&
        obj1.x < obj2.x + obj2.width
    if (hitTest) {
        if (obj2.color === 'green') {
            alert('Game Over, you lose!!')
            resetGame()
        }
        if (obj2.color === 'gold') {
            currentScore += 100
                //speed up frogs when points accumulate. 
                //Also make frogs faster to keep canvas from getting less frog-dense as they speed up
                if (currentScore === 500){
                    clearInterval(frogsRainingDown)
                    frogsRainingDown = setInterval(makeRain, 1, frogArr, 2)
                    clearInterval(frogTimer)
                    frogTimer = setInterval(makeFrog, 225)

                }
                if (currentScore === 1000){
                    clearInterval(frogsRainingDown)
                    frogsRainingDown = setInterval(makeRain, 1, frogArr, 3)
                    clearInterval(frogTimer)
                    frogTimer = setInterval(makeFrog, 150)

                }
                if (currentScore === 1500){
                    clearInterval(frogsRainingDown)
                    frogsRainingDown = setInterval(makeRain, 1, frogArr, 4)
                    clearInterval(frogTimer)
                    frogTimer = setInterval(makeFrog, 100)

                }
                if (currentScore === 2000){
                    alert('Game over, YOU WIN!!!!')
                    resetGame()
                }
            showScore()
            //remove touched goldFrog from array to keep it from re-rendering with the setInterval
            goldFrogArr.shift()
            obj2.clearObject()
        }
    }
}

const makeFrog = () => {

    //possible lane array are the middles of all of the lanes
    possibleLaneArray = [50, 150, 250, 350, 450, 550, 650, 750, 850]
    randomIndex = Math.floor(Math.random() * possibleLaneArray.length)
    //frog with random x axis
    frog = new Object(possibleLaneArray[randomIndex] -25, -100, ctx, 'green', 50, 40)
    //push frog object into array
    frogArr.push(frog)
}

const makeGoldenFrog = () => {
    possibleLaneArray = [50, 150, 250, 350, 450, 550, 650, 750, 850]
    randomIndex = Math.floor(Math.random() * possibleLaneArray.length)
    //frog with random x axis
    goldFrog = new Object(possibleLaneArray[randomIndex] - 15, -100, ctxTwo, 'gold', 30, 50)
    goldFrogArr.push(goldFrog)
    //each frog in array gets an interval to have it 'rain' down. 
}

const makeRain = (arr, distance) => {
    for (let i = 0; i < arr.length; i++) {
        detectHit(truck, arr[i])
        if (arr.length > 0) {
            arr[i].clearObject()
            arr[i].y += distance
            arr[i].renderObject()
            //This boots frog out of array when they've gone off screen
            if (arr[i].y > 800) {
                arr.shift()
            }
        }
    }
}

//to position truck in center of x axis, I divided the canvas in half and then subtracted half the truck's width
let truck = new Object(canvas.width / 2 - 25, canvas.height - 140, ctx, 'red', 50, 100)
//made this as a function to setInterval on it to minimize the lane lines carving into the truck
const drawTruck = () => {
    truck.clearObject()
    truck.renderObject()
}



//assign direction arrow inputs to car => each left and right shifts over one lane
const moveTruck = (e) => {
    //immediately clear out the 'old' truck
    truck.clearObject()
    switch (e.key) {
        case 'ArrowRight':
            truck.x < 825 ? truck.x += 100 : null
            break
        case 'ArrowLeft':
            //chose 25 because that's the closest it gets to the left border
            truck.x > 25 ? truck.x -= 100 : null
            break
        case 'ArrowUp':
            truck.y > 450 ? truck.y -= 100 : null
            break
        case 'ArrowDown':
            truck.y < canvas.height - 140 ? truck.y += 100 : null
            break
    }
    //render truck with new coordinates
    truck.renderObject()
}

const clearAllIntervals = () => {
    clearInterval(frogTimer)
    clearInterval(frogTimer2)
    clearInterval(frogsRainingDown)
    clearInterval(goldFrogsRainingDown)
}

const resetGame = () => {
    currentScore = 0
    showScore()
    clearAllIntervals()
    frogArr.forEach(frog => {
        frog.clearObject()
    })
    goldFrogArr.forEach(frog => {
        frog.clearObject()
    })
    frogArr.length = 0
    goldFrogArr.length = 0
    truck.renderObject()
}

window.addEventListener('keydown', moveTruck)


startBtn.addEventListener('click', (e) => {
    drawTruck()
    showScore()
    frogTimer = setInterval(makeFrog, 300)
    frogTimer2 = setInterval(makeGoldenFrog, 2000)
    frogsRainingDown = setInterval(makeRain, 1, frogArr, 1)
    goldFrogsRainingDown = setInterval(makeRain, 1, goldFrogArr, 2)
    setTimeout(frogsRainingDown, 5000)
})


// ***** WATER LEVEL *****
const makeWater = () => {
    water = new Object(0, 0, ctx, 'blue', ctx.width, 450)
    water.renderObject()
}
waterButton.addEventListener('click', makeWater)




//spawn frogs that come down from x axis and come across from y axis
//use math.random() to choose x axis
//make frogs move => some move linearly, some 'hop' two spaces forward, one space back etc
//use math.random() to change their speed 
//spit out a handful of frogs from two points on x axis. Have them every 1sec shift to the left or right

//have obstacles to avoid i.e. bodies of water that have bridges over them
//these will be called periodically with a timeout function

//make some frogs able to be run over for points. Have this be reflected on the points display

//other *Larger* frogs trigger gameOver when touched. Have a losing Endgame popup that has button to reset game

//Once enough points are accumulated you face a boss
//even more frogs are spawned to make it harder
//beat the boss by driving up ramps to hit him
//have a life bar? each hit takes 20% off life bar?
//Trigger a winning Endgame popup with button to restart