//Initially describe the storyline and rules. 
//click button to begin game
//3 Sec Countdown timer until canvas starts 'moving'
window.onload = (e) => {
    makeLanes()
    return displayDashes = setInterval(makeLaneDashes, 900)
}


const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d')
const canvasTwo = document.getElementById('canvas-two'), ctxTwo = canvasTwo.getContext('2d')
const canvasThree = document.getElementById('canvas-three'), ctxThree = canvasThree.getContext('2d')
const scoreboard = document.getElementById('scoreboard')

const startBtn = document.getElementById('start-btn'), waterButton = document.getElementById('water-button')
let goldFrogArr = []
let frogArr = []
let platformArr = []
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
        laneDash1 = new Object(50, -50, ctxThree, 'yellow', 2, 50),
        laneDash2 = new Object(150, -100, ctxThree, 'yellow', 2, 50),
        laneDash3 = new Object(250, -50, ctxThree, 'yellow', 2, 50),
        laneDash4 = new Object(350, -100, ctxThree, 'yellow', 2, 50),
        laneDash5 = new Object(450, -50, ctxThree, 'yellow', 2, 50),
        laneDash6 = new Object(550, -100, ctxThree, 'yellow', 2, 50),
        laneDash7 = new Object(650, -50, ctxThree, 'yellow', 2, 50),
        laneDash8 = new Object(750, -100, ctxThree, 'yellow', 2, 50),
        laneDash9 = new Object(850, -50, ctxThree, 'yellow', 2, 50)
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
        if (obj2.color === 'purple') {
            return true
        } else {
            if (obj2.color === 'green' ||
                obj2.color === 'blue') {
                drawTruck()
                alert('Game Over, you lose!!')
                resetGame()
            }
        }
        if (obj2.color === 'gold') {
            currentScore += 100
            //speed up frogs when points accumulate. 
            //Also create frogs faster to keep canvas from getting less frog-dense as they speed up
            if (currentScore === 500) {
                clearInterval(frogsRainingDown)
                frogsRainingDown = setInterval(makeRain, 1, frogArr, 2)
                clearInterval(frogTimer)
                frogTimer = setInterval(makeFrog, 225)

            }
            if (currentScore === 1000) {
                clearInterval(frogsRainingDown)
                frogsRainingDown = setInterval(makeRain, 1, frogArr, 3)
                clearInterval(frogTimer)
                frogTimer = setInterval(makeFrog, 150)

            }
            if (currentScore === 1500) {
                clearInterval(frogsRainingDown)
                frogsRainingDown = setInterval(makeRain, 1, frogArr, 4)
                clearInterval(frogTimer)
                frogTimer = setInterval(makeFrog, 100)

            }
            if (currentScore === 2000) {
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
    frog = new Object(possibleLaneArray[randomIndex] - 25, -100, ctx, 'green', 50, 40)
    //push frog object into array
    frogArr.push(frog)
}

const makeGoldenFrog = () => {
    possibleLaneArray = [50, 150, 250, 350, 450, 550, 650, 750, 850]
    randomIndex = Math.floor(Math.random() * possibleLaneArray.length)
    //put this one on ctx2 to be behind other frogs 
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
    truck.x = canvas.width / 2 - 25
    truck.y = canvas.height - 140
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
            truck.y > 0 ? truck.y -= 100 : null
            // truck.y > 450 ? truck.y -= 100 : null
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
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
    truck.renderObject()
    water = new Object(0, 0, ctxThree, 'blue', 920, 510)
    water.renderObject()

}

const makeWaterLanes = () => {
    const waterLanes = [
        waterLane0 = new Object(0, 510, ctx, 'white', canvas.width + 12, 3),
        waterLane1 = new Object(0, 410, ctx, 'white', canvas.width, 3),
        waterLane2 = new Object(0, 310, ctx, 'white', canvas.width, 3),
        waterLane3 = new Object(0, 210, ctx, 'white', canvas.width, 3),
        waterLane4 = new Object(0, 110, ctx, 'white', canvas.width, 3),
        waterLane5 = new Object(0, 10, ctx, 'white', canvas.width, 3),
    ]
    waterLanes.forEach(lane => {
        lane.renderObject()
    })
}

const makePlatforms = () => {
    possiblePlatformCoordinates = [60, 160, 260, 360, 460]
    randomIndex = Math.floor(Math.random() * possiblePlatformCoordinates.length)
    x = (randomIndex % 2 === 0) ? -50 : canvas.width + 50
    platform = new Object(x, possiblePlatformCoordinates[randomIndex] - 50, ctxTwo, 'purple', 150, 100)
    platformArr.push(platform)
}

const movePlatforms = (arr, distance) => {
    arr.forEach(platform => {
        platform.renderObject()
        if (arr.length > 0) {
            platform.clearObject()
            //this moves some platforms right, some platforms left
            const moveObjectLeftOrRight = (obj) => {
                if (obj.y === 10 ||
                    obj.y === 210 ||
                    obj.y === 410) {
                    obj.x += distance
                } else {
                    obj.x -= distance
                }
            }
            moveObjectLeftOrRight(platform)
            platform.renderObject()
            if (detectHit(truck, platform)) {
                truck.clearObject()
                moveObjectLeftOrRight(truck)
                truck.renderObject()
                console.log('platform')
            } 
        }
    })
    //if truck isn't on any platform, detectHit for water
    if (truck.y < 510 && arr.every(platform => !detectHit(truck, platform))){
        detectHit(truck, water)
    }
    if (arr.length > 20) {
        arr.shift()
    }
}

//hit test for water
//if you touch any part of the water you die
//if your entire truck is on the platform, it moves with the platform







waterButton.addEventListener('click', () => {
    clearInterval(displayDashes)
    makeWater()
    makeWaterLanes()
    platformsInterval = setInterval(makePlatforms, 1000)
    movingPlatformsInterval = setInterval(movePlatforms, 10, platformArr, 1)
    // movingPlatformsInterval = setInterval(movePlatforms, 1000, platformArr, 10)
})



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