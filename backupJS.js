//Initially describe the storyline and rules. 
//click button to begin game
//3 Sec Countdown timer until canvas starts 'moving'
window.onload = (e) => {
    makeLanes()
}

//I use multiple canvases to prevent them from 'cutting' into each other when crossing over on same canvas and to adjust z-index
const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d')
const canvasTwo = document.getElementById('canvas-two'), ctxTwo = canvasTwo.getContext('2d')
const canvasThree = document.getElementById('canvas-three'), ctxThree = canvasThree.getContext('2d')
const canvasFour = document.getElementById('canvas-four'), ctxFour = canvasFour.getContext('2d')
const scoreboard = document.getElementById('scoreboard')

const startBtn = document.getElementById('start-btn'), waterButton = document.getElementById('water-button')
let goldFrogArr = []
let goldFrogInWaterArr = []
let frogArr = []
let platformArr = []
let currentScore = 0
let lives = 3
let levelOne = true
let levelTwo = false

const showScore = () => {
    scoreboard.textContent = `SCORE: ${currentScore}      LIVES: ${lives}`
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
        lane1 = new Object(100, 0, ctxThree, 'white', 4, 900),
        lane2 = new Object(200, 0, ctxThree, 'white', 4, 900),
        lane3 = new Object(300, 0, ctxThree, 'white', 4, 900),
        lane4 = new Object(400, 0, ctxThree, 'white', 4, 900),
        lane5 = new Object(500, 0, ctxThree, 'white', 4, 900),
        lane6 = new Object(600, 0, ctxThree, 'white', 4, 900),
        lane7 = new Object(700, 0, ctxThree, 'white', 4, 900),
        lane8 = new Object(800, 0, ctxThree, 'white', 4, 900)
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

// *********** HIT TEST AND THE EFFECTS OF VARIOUS CONDITIONS AFTER A HIT ************
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
                obj2.clearObject()
                if (levelOne) {
                    //this is to give a quick reset so frogs don't immediately fly down and take another life
                    clearAllIntervalsLevelOne()
                    createIntervalsLevelOne()
                }
                if (levelTwo) {
                    clearAllIntervalsLevelTwo()
                    createIntervalsLevelTwo()
                    //call this again b/c the water is cleared as it's the object that touches and kills truck
                    makeWater()
                }
                lives--
                drawTruck()
                showScore()
                if (lives === 0) {
                    alert('Game Over, you lose!!')
                    resetGame()
                }
            }
        }
        if (obj2.color === 'gold') {
            currentScore += 100
            if (levelOne) {
                //remove touched goldFrog from array to keep it from re-rendering with the setInterval
                goldFrogArr.shift()
                obj2.clearObject()
                if (currentScore === 2000) {
                    alert('YOU WIN!!!! On to the next Level!')
                    resetGame()
                } else
                    //these make frogs faster as their speed gets quicker to keep the number of obstacles a similar density
                    if (currentScore >= 1500) {
                        clearInterval(frogsRainingDown)
                        frogsRainingDown = setInterval(makeRain, 1, frogArr, 4)
                        clearInterval(frogTimer)
                        frogTimer = setInterval(makeFrog, 100)
                    } else
                        if (currentScore >= 1000) {
                            clearInterval(frogsRainingDown)
                            frogsRainingDown = setInterval(makeRain, 1, frogArr, 3)
                            clearInterval(frogTimer)
                            frogTimer = setInterval(makeFrog, 150)
                        } else
                            if (currentScore >= 500) {
                                clearInterval(frogsRainingDown)
                                frogsRainingDown = setInterval(makeRain, 1, frogArr, 2)
                                clearInterval(frogTimer)
                                frogTimer = setInterval(makeFrog, 225)
                            }
            }
            if (levelTwo) {
                //this was the only way I could remove the specific gold frog
                for (let i = 0; i < goldFrogInWaterArr.length; i++) {
                    if (goldFrogInWaterArr[i] === obj2) {
                        console.log(`This is the frog: ${goldFrogInWaterArr[i]} at index: ${i}}`)
                        goldFrogInWaterArr.splice(i, 1)
                    }
                }
                obj2.clearObject()
            }
            showScore()
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
        detectHit(truck.createImage(), arr[i])
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
    truck.createImage().clearObject()
    truck.createImage().x = canvas.width / 2 - 25
    truck.createImage().y = canvas.height - 140
    truck.createImage().renderObject()
}


// ********* MOVING THE TRUCK WITH USER INPUTS ********************
//assign direction arrow inputs to car => each left and right shifts over one lane
const moveTruck = (e) => {
    //immediately clear out the 'old' truck
    truck.createImage().clearObject()
    switch (e.key) {
        case 'ArrowRight':
            if (levelTwo) {
                truck.createImage().x < 825 ? truck.createImage().x += 25 : null
            } else {
                truck.createImage().x < 825 ? truck.createImage().x += 100 : null
            }
            break
        case 'ArrowLeft':
            if (levelTwo) {
                truck.createImage().x > 25 ? truck.createImage().x -= 25 : null
            } else {
                //chose 25 because that's the closest it gets to the left border
                truck.createImage().x > 25 ? truck.createImage().x -= 100 : null
            }
            break
        case 'ArrowUp':
            console.log(truck.createImage().y)
            if (currentScore >= 3000) {
                truck.createImage().y > 0 ? truck.createImage().y -= 100 : null
                //How it's decided you win level 2
                if (truck.createImage().y < 10) {
                    alert('YOU BEAT LEVEL 2!!!')
                    resetGame()
                }
            } else
                truck.createImage().y > 10 ? truck.createImage().y -= 100 : null

            // truck.y > 450 ? truck.y -= 100 : null
            break
        case 'ArrowDown':
            truck.createImage().y < canvas.height - 140 ? truck.createImage().y += 100 : null
            break
    }
    //render truck with new coordinates
    truck.createImage().renderObject()
}
window.addEventListener('keydown', moveTruck)


// ******** BELOW ARE THE FUNCTIONS TO ADD/REMOVE INTERVALS AND TO RESET GAME *****
const createIntervalsLevelOne = () => {
    frogTimer = setInterval(makeFrog, 300)
    frogTimer2 = setInterval(makeGoldenFrog, 2000)
    frogsRainingDown = setInterval(makeRain, 1, frogArr, 1)
    goldFrogsRainingDown = setInterval(makeRain, 1, goldFrogArr, 2)
    displayDashes = setInterval(makeLaneDashes, 900)
}

const clearAllIntervalsLevelOne = () => {
    clearInterval(frogTimer)
    clearInterval(frogTimer2)
    clearInterval(frogsRainingDown)
    clearInterval(goldFrogsRainingDown)
    clearInterval(displayDashes)
    frogArr.forEach(frog => {
        frog.clearObject()
    })
    goldFrogArr.forEach(frog => {
        frog.clearObject()
    })
    frogArr.length = 0
    goldFrogArr.length = 0

}

const createIntervalsLevelTwo = () => {
    platformsInterval = setInterval(makePlatforms, 1000)
    movingPlatformsInterval = setInterval(movePlatforms, 10, platformArr)
    makingGoldFrogsInterval = setInterval(makeGoldFrogInWater, 1500)
    movingGoldFrogsInterval = setInterval(moveGoldFrogsInWater, 10, goldFrogInWaterArr)
}

const clearAllIntervalsLevelTwo = () => {
    clearInterval(platformsInterval)
    clearInterval(movingPlatformsInterval)
    clearInterval(makingGoldFrogsInterval)
    clearInterval(movingGoldFrogsInterval)
    goldFrogInWaterArr.forEach(frog => {
        frog.clearObject()
    })
    goldFrogInWaterArr.length = 0
    platformArr.forEach(platform => {
        platform.clearObject()
    })
    platformArr.length = 0

}
const resetGame = () => {
    currentScore = 0
    lives = 3
    showScore()
    if (levelOne) clearAllIntervalsLevelOne()
    if (levelTwo) clearAllIntervalsLevelTwo()
    truck.createImage().renderObject()
}


// *************** WATER LEVEL ********************************
const makeWater = () => {
    water = new Object(0, 0, ctxFour, 'blue', 920, 510)
    water.renderObject()
}

const makeWaterLanes = () => {
    const waterLanes = [
        waterLane0 = new Object(0, 510, ctxTwo, 'white', canvas.width + 12, 3),
        waterLane1 = new Object(0, 410, ctxTwo, 'white', canvas.width, 3),
        waterLane2 = new Object(0, 310, ctxTwo, 'white', canvas.width, 3),
        waterLane3 = new Object(0, 210, ctxTwo, 'white', canvas.width, 3),
        waterLane4 = new Object(0, 110, ctxTwo, 'white', canvas.width, 3),
        waterLane5 = new Object(0, 10, ctxTwo, 'white', canvas.width, 3),
    ]
    waterLanes.forEach(lane => {
        lane.renderObject()
    })
}

const preventDoublesArray = []
let usePreventDoubles = false
let possiblePlatformCoordinates = [60, 160, 260, 360, 460]
let usePossibleCoordinates = true


const makePlatforms = () => {
    // console.log(usePossibleCoordinates)
    if (possiblePlatformCoordinates.length === 0) {
        usePossibleCoordinates = false
        usePreventDoubles = true
    }
    if (preventDoublesArray.length === 0) {
        usePossibleCoordinates = true
        usePreventDoubles = false
    }
    //put the randomIndex in preventdoubles. Next time function is called that value goes back into to possibleCoordinates
    // possiblePlatformCoordinates = [60, 160, 260, 360, 460]

    if (usePossibleCoordinates) {
        randomIndex = Math.floor(Math.random() * possiblePlatformCoordinates.length)
        y = possiblePlatformCoordinates[randomIndex]
        preventDoublesArray.push(y)
        possiblePlatformCoordinates.splice(randomIndex, 1)
    } else
        if (usePreventDoubles) {
            randomIndex = Math.floor(Math.random() * preventDoublesArray.length)
            y = preventDoublesArray[randomIndex]
            possiblePlatformCoordinates.push(y)
            preventDoublesArray.splice(randomIndex, 1)
        }
    //cant use this anymore after moving around possiblePlatformCoordinates
    // x = (randomIndex % 2 === 0) ? -50 : canvas.width + 50
    if (y === 60 ||
        y === 260 ||
        y === 460) {
        x = -50
    } else {
        x = canvas.width + 50
    }


    platform = new Object(x, y - 50, ctxThree, 'purple', 150, 100)
    platformArr.push(platform)

}

const movePlatforms = (arr) => {
    showScore()
    distance = 1

    if (currentScore >= 3000) {
        distance = 3
        finishLine = new Object(0, 0, ctxTwo, 'gold', canvas.width + 12, 13)
        finishLine.renderObject()
    } else
        if (currentScore >= 2500) {
            distance = 2
        }

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
            //this moves truck with platform
            //*****  BUG ALERT  ***** => TRUCK STOPS AT EDGES OF SCREEN BUT WON'T SLIDE IF SWITCHING PLATFORMS
            if (detectHit(truck.createImage(), platform)) {
                //this keeps truck from going off screen
                if (truck.createImage().x < 0 || truck.createImage().x > 850) {
                    return null
                } else {
                    truck.createImage().clearObject()
                    moveObjectLeftOrRight(truck.createImage())
                    truck.createImage().renderObject()
                }
            }
        }
    })
    //if truck isn't on any platform, detectHit for water
    if (truck.createImage().y < 510 && arr.every(platform => !detectHit(truck.createImage(), platform))) {
        detectHit(truck.createImage(), water)
    }
    if (arr.length > 20) {
        arr.shift()
    }
}

const makeGoldFrogInWater = () => {
    possibleLaneArray = [60, 160, 260, 360, 460]
    //this keeps user from camping out at the bottom to rack up points
    if (currentScore >= 2500) {
        possibleLaneArray.pop()
    }

    randomIndex = Math.floor(Math.random() * possibleLaneArray.length)
    //x coordinates are opposite from platforms so they go in opposite directions
    x = (randomIndex % 2 === 1) ? -50 : canvas.width + 50
    goldFrog = new Object(x, possibleLaneArray[randomIndex] - 15, ctxTwo, 'gold', 50, 30)
    goldFrogInWaterArr.push(goldFrog)
    if (goldFrogInWaterArr.length > 9) {
        goldFrogInWaterArr.shift()
    }
}
const moveGoldFrogsInWater = (arr) => {
    distance = 2
    arr.forEach(frog => {
        frog.renderObject()
        if (arr.length > 0) {
            frog.clearObject()
            //this moves some platforms right, some platforms left
            const moveObjectLeftOrRight = (obj) => {
                if (obj.y === 60 - 15 ||
                    obj.y === 260 - 15 ||
                    obj.y === 460 - 15) {
                    obj.x -= distance
                } else {
                    obj.x += distance
                }
            }
            moveObjectLeftOrRight(frog)
            frog.renderObject()
            //this will automatically add to score because of conditions if hitTest is true
            detectHit(truck.createImage(), frog)
        }
    })
    // arr = arr.filter(frog => {
    //     return frog.x >= -50 && frog.x <= canvas.width + 50
    // })
}


// ****** EVENT LISTENERS FOR BUTTONS *******

startBtn.addEventListener('click', (e) => {
    score = 0
    levelOne = true
    levelTwo = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
    ctxThree.clearRect(0, 0, canvas.width, canvas.height)
    ctxFour.clearRect(0, 0, canvas.width, canvas.height)
    makeLanes()
    drawTruck()
    showScore()
    createIntervalsLevelOne()
})




waterButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
    ctxThree.clearRect(0, 0, canvas.width, canvas.height)
    ctxFour.clearRect(0, 0, canvas.width, canvas.height)
    goldFrogArr.length = 0
    levelOne = false
    levelTwo = true
    currentScore = 2000
    lives = 5
    showScore()
    drawTruck()
    // clearInterval(displayDashes)
    makeWater()
    makeWaterLanes()
    createIntervalsLevelTwo()
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