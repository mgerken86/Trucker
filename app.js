// ************************************************************

// --------======== GLOBAL VARIABLES ========---------

// ************************************************************

//I use multiple canvases to prevent them from 'cutting' into each other when crossing over on same canvas and to adjust z-index
const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d')
const canvasTwo = document.getElementById('canvas-two'), ctxTwo = canvasTwo.getContext('2d')
const canvasThree = document.getElementById('canvas-three'), ctxThree = canvasThree.getContext('2d')
const canvasFour = document.getElementById('canvas-four'), ctxFour = canvasFour.getContext('2d')
const scoreboard = document.getElementById('scoreboard')
const startBtn = document.getElementById('start-btn'), waterButton = document.getElementById('water-button'), tunnelButton = document.getElementById('tunnel-button')
const h1 = document.querySelector('h1')
const span1 = document.getElementById('span-1'), span2 = document.getElementById('span-2'), span3 = document.getElementById('span-3')
const mainPageImg = document.getElementById('main-page-img')

//the empty arrays are where I put objects once I make them, and then run intervals on the whole array
let goldFrogArr = []
let goldFrogInWaterArr = []
let frogArr = []
let createdLaneDashesArr = []
let platformArr = []
let tunnelArr = []
let openingArr = []
let tunnelDashes = []

let currentScore = 0
let lives = 3
let goldFrogsLeftCount = 20
let levelOne = false
let levelTwo = false
let levelThree = false

const showScore = () => {
    span1.textContent = `SCORE: ${currentScore}`
    span2.textContent = `LIVES: ${lives}`
    span3.textContent = `GOLD FROGS LEFT: ${goldFrogsLeftCount}`
}




// ************************************************************

// --------======== CLASSES FOR OBJECTS AND IMAGES ========---------

// ************************************************************

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

class ImageArt {
    constructor(ctx, src, x, y, width, height) {
        this.ctx = ctx
        this.src = src
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.img = new Image()
    }
    createImage() {
        this.img.src = this.src
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    clearObject() {
        this.ctx.clearRect(this.x, this.y, this.width, this.height)
    }
}

// ************************************************************

// --------======== HIT TEST AND CONDITIONS FOR DIFFERENT HITS ========---------

// ************************************************************
function detectHit(obj1, obj2) {
    let hitTest
    // anything but a black object b/c that's the color of the tunnel openings for level 3
    if (obj2.color !== 'black') {
        hitTest =
            obj1.y + obj1.height > obj2.y &&
            obj1.y < obj2.y + obj2.height &&
            obj1.x + obj1.width > obj2.x &&
            obj1.x < obj2.x + obj2.width
    } else {
        // console.log('in the tunnel')
        //this hitTest is more strict to make level 3 tunnel harder
        hitTest =
            obj1.y + obj1.height > obj2.y &&
            obj1.y < obj2.y + obj2.height &&
            obj1.x > obj2.x &&
            obj1.x + obj1.width < obj2.x + obj2.width
    }
    if (hitTest) {
        if (obj2.width === 150 ||
            obj2.width === 200) {
            //This is used to detect truck on platforms and in tunnel
            return true
        } else {
            //using height of 'bad' frogs to make conditions for them, color of water, and height of tunnel bricks
            if (obj2.height === 80 ||
                obj2.color === 'blue' ||
                obj2.height === 100) {
                obj2.clearObject()

                if (levelOne) {
                    //this is to give a reset so frogs don't immediately fly down and take another life
                    clearAllIntervalsLevelOne()
                    obj2.clearObject()
                    createIntervalsLevelOne()
                    setTimeout(changeThingsAsPointsIncrease(goldFrogsLeftCount), 500)
                }
                if (levelTwo) {
                    clearAllIntervalsLevelTwo()
                    obj2.clearObject()
                    createIntervalsLevelTwo()
                    //call this again b/c the water is cleared as it's the object that touches and kills truck
                    makeWater()
                }
                if (levelThree) {
                    //this resets tunnel so it doesn't repeatedly kill player
                    clearAllIntervalsLevelThree()
                    obj2.clearObject()
                    createIntervalsLevelThree()
                    setTimeout(() => {
                        changeThingsAsPointsIncrease(goldFrogsLeftCount)
                    }, 500)
                }
                lives--
                showScore()
                makeH1Dialogue('baddie')
                drawTruck()
                if (lives === 0) {
                    alert('Game Over, you lose!!')
                    return resetGame()
                }
                if (levelThree) {
                    //this is to start tunnel openings in middle of tunnel after player dies
                    return i = 16
                }
            }
        }

        // *********-----using height of gold frogs to create conditions for them-----**********
        if (obj2.height === 50) {
            currentScore += 100
            goldFrogsLeftCount > 0 ? goldFrogsLeftCount-- : null
            makeH1Dialogue('goldBoy')
            showScore()
            //remove specific truthy HitTest gold from from array so that it doesn't keep getting Interval to come down
            for (let i = 0; i < goldFrogArr.length; i++) {
                if (goldFrogArr[i] === obj2) {
                    goldFrogArr.splice(i, 1)
                }
            }
            for (let i = 0; i < goldFrogInWaterArr.length; i++) {
                if (goldFrogInWaterArr[i] === obj2) {
                    // console.log(`This is the frog: ${goldFrogInWaterArr[i]} at index: ${i}}`)
                    goldFrogInWaterArr.splice(i, 1)
                }
            }
            setTimeout(() => {
                obj2.clearObject()
                // ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
            }, 50)
            changeThingsAsPointsIncrease(goldFrogsLeftCount)
        }
    }
}

const makeH1Dialogue = (objectType) => {
    switch (objectType) {
        case 'baddie':
            potentialDialogue = [`Ouch, that hurt!!`, `That'll leave a mark!!`, `That left a scratch!!`, `Maybe that'll buff out`, `Time to see a mechanic for that!!`]
            randomIndex = Math.floor(Math.random() * potentialDialogue.length)
            h1.innerText = potentialDialogue[randomIndex]
            h1.style.color = '#ff0000'
            break
        case 'goldBoy':
            potentialDialogue = [`Got 'em!!`, `Great job!!`, `Keep trucking!!`, `Nailed it!!`, `Nice driving!!`, `Keep it up!!`]
            randomIndex = Math.floor(Math.random() * potentialDialogue.length)
            h1.innerText = potentialDialogue[randomIndex]
            h1.style.color = '#ffff1a'
            break
        case 'faster':
            h1.innerText = `Things are speeding up!!`
            h1.style.color = '#00ff00'
            break
    }
    //resets h1 text to blank and color back to green
    setTimeout(() => {
        h1.innerText = ''
        h1.style.color = '#00ff00'
    }, 1300)
}


// ************************************************************

//    --------======== TRUCK INPUTS ========---------

// ************************************************************


let truck = new ImageArt(ctx, 'images/Truck.png', canvas.width / 2 - 25, canvas.height - 140, 50, 100)
truck.createImage()

// //to position truck in center of x axis, I divided the canvas in half and then subtracted half the truck's width
// let truck = new Object(canvas.width / 2 - 25, canvas.height - 140, ctx, 'red', 50, 100, )
// //made this as a function to setInterval on it to minimize the lane lines carving into the truck
const drawTruck = () => {
    truck.clearObject()
    truck.x = canvas.width / 2 - 25
    truck.y = canvas.height - 140
    truck.createImage()
}

//assign direction arrow inputs to car => each left and right shifts over one lane
const moveTruck = (e) => {
    //this only lets user move truck if game is running
    if (levelOne || levelTwo || levelThree) {
        //immediately clear out the 'old' truck
        truck.clearObject()
        switch (e.key) {
            case 'ArrowRight':
                if (levelTwo || levelThree) {
                    truck.x < 825 ? truck.x += 25 : null
                } else {
                    truck.x < 825 ? truck.x += 100 : null
                }
                break
            case 'ArrowLeft':
                if (levelTwo || levelThree) {
                    truck.x > 25 ? truck.x -= 25 : null
                } else {
                    //chose 25 because that's the closest it gets to the left border
                    truck.x > 25 ? truck.x -= 100 : null
                }
                break
            case 'ArrowUp':
                // console.log(truck.y)
                //this lets truck go over the 'finish line' of lvl 2
                if (goldFrogsLeftCount === 0) {
                    truck.y > 0 ? truck.y -= 100 : null
                    //How it's decided you win level 2
                    if (truck.y < 10) {
                        alert('YOU BEAT LEVEL 2!!!')
                        clearAllIntervalsLevelTwo()
                        resetGame()
                    }
                } else
                    truck.y > 10 ? truck.y -= 100 : null

                // truck.y > 450 ? truck.y -= 100 : null
                break
            case 'ArrowDown':
                truck.y < canvas.height - 140 ? truck.y += 100 : null
                break
        }
        //render truck with new coordinates
        truck.createImage()
    }
}
window.addEventListener('keydown', moveTruck)



// ************************************************************

//    --------======== STREET LEVEL ========---------

// ************************************************************

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
        createdLaneDashesArr.push(dash)
    })
}

const makeFrog = () => {
    //possible lane array are the middles of all of the lanes
    possibleLaneArray = [50, 150, 250, 350, 450, 550, 650, 750, 850]
    randomIndex = Math.floor(Math.random() * possibleLaneArray.length)
    possibleImageSources = ['images/angry-boy.png', 'images/Agry-boy-2.png', 'images/Angry-boy-3.png']
    src = possibleImageSources[Math.floor(Math.random() * possibleImageSources.length)]

    frog = new ImageArt(ctx, src, possibleLaneArray[randomIndex] - 40, -100, 80, 80)
    //push frog object into array
    frogArr.push(frog)
}

const makeGoldenFrog = () => {
    possibleLaneArray = [50, 150, 250, 350, 450, 550, 650, 750, 850]
    randomIndex = Math.floor(Math.random() * possibleLaneArray.length)
    //put this one on ctx2 to be behind other frogs 
    goldFrog = new ImageArt(ctxTwo, 'images/Gold-boy.png', possibleLaneArray[randomIndex] - 25, -100, 50, 50)
    goldFrogArr.push(goldFrog)
    //each frog in array gets an interval to have it 'rain' down. 
}

const makeRain = (arr, distance) => {
    changeThingsAsPointsIncrease()
    for (let i = 0; i < arr.length; i++) {
        detectHit(truck, arr[i])
        if (arr.length > 0) {
            arr[i].clearObject()
            arr[i].y += distance
            arr[i].createImage()
            //This boots frog out of array when they've gone off screen
            if (arr[i].y > 800) {
                arr.shift()
            }
        }
    }
}



// ************************************************************

//    --------======== WATER LEVEL ========---------

// ************************************************************


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

//This array and the booleans allow platforms to spawn more evenly. When a platform is chosen it gets pushed into other array and removed from original array. Once first array is empty then bools switch and other array is used
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
    // x = (randomIndex % 2 === 0) ? -50 : canvas.width + 50
    //this chooses whether platform spawns from left or right
    if (y === 60 ||
        y === 260 ||
        y === 460) {
        x = -50
        src = 'images/dead-boy.png'
    } else {
        x = canvas.width + 50
        src = 'images/dead-boy-reverse.png'
    }
    platform = new ImageArt(ctxThree, src, x, y - 50, 150, 100)
    platformArr.push(platform)
}

const movePlatforms = (arr) => {
    showScore()
    distance = 1
    if (goldFrogsLeftCount === 0) {
        h1.innerText = `CROSS THE GOLDEN LINE!!`
        h1.style.color = '#ffff1a'
        distance = 3
        finishLine = new Object(0, 0, ctxTwo, 'gold', canvas.width + 12, 13)
        finishLine.renderObject()
    } else
        // if (goldFrogsLeftCount === 5) {
        //     makeH1Dialogue('faster')
        // }
        if (goldFrogsLeftCount <= 5) {
            distance = 2
        }

    arr.forEach(platform => {
        platform.createImage()
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
            platform.createImage()
            //this moves truck with platform
            //*****  BUG ALERT  ***** => TRUCK STOPS AT EDGES OF SCREEN BUT WON'T SLIDE WITH NEW PLATFORM IF SWITCHING PLATFORMS
            if (detectHit(truck, platform)) {
                //this keeps truck from going off screen
                if (truck.x < 0 || truck.x > 850) {
                    return null
                } else {
                    truck.clearObject()
                    moveObjectLeftOrRight(truck)
                    truck.createImage()
                }
            }
        }
    })
    //if truck isn't on any platform, detectHit for water
    if (truck.y < 510 && arr.every(platform => !detectHit(truck, platform))) {
        detectHit(truck, water)
    }
    if (arr.length > 20) {
        arr.shift()
    }
}

const makeGoldFrogInWater = () => {
    possibleLaneArray = [60, 160, 260, 360, 460]
    //this keeps user from camping out at the bottom to rack up points
    if (goldFrogsLeftCount <= 7) {
        possibleLaneArray.pop()
    }

    randomIndex = Math.floor(Math.random() * possibleLaneArray.length)
    //x coordinates for gold frogs are opposite from platforms so they go in reverse directions
    x = (randomIndex % 2 === 1) ? -50 : canvas.width + 50
    goldFrog = new ImageArt(ctxTwo, 'images/Gold-boy.png', x, possibleLaneArray[randomIndex] - 15, 50, 50)
    goldFrogInWaterArr.push(goldFrog)
    if (goldFrogInWaterArr.length > 9) {
        goldFrogInWaterArr.shift()
    }
}
const moveGoldFrogsInWater = (arr) => {
    distance = 2
    arr.forEach(frog => {
        frog.createImage()
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
            frog.createImage()
            //this will automatically add to score because of conditions if hitTest is true
            detectHit(truck, frog)
        }
    })
}


// ************************************************************

//    --------======== TUNNEL LEVEL ========---------

// ************************************************************

const makeTunnel = () => {
    tunnel = new ImageArt(ctxFour, 'images/bricks.png', 0, -100, canvas.width, 100)
    tunnel.createImage()
    tunnelArr.push(tunnel)
}

// i chooses the lane that the opening will be in. it starts in the middle and either stays the same for next opening or is one more or one less in coordinates array
let i = 16
//when counter reaches 50, a gold frog will be made at same coordinates as opening and will have setInterval to come down at same speed
let counter = 0

const makeTunnelOpening = () => {
    // console.log(i)
    // ***** AFTER SO MANY POINTS, MAKE TUNNEL OPENING SMALLER ********
    possibleXCoordinates = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250,
        275, 300, 325, 350, 375, 400, 425, 450, 475, 500,
        525, 550, 575, 600, 625, 650, 675, 700, 725, 750]
    tunnelX = possibleXCoordinates[i]
    opening = new Object(tunnelX, -25, ctxThree, 'black', 150, 100)
    openingArr.push(opening)

    //if truck isn't inside any of the openings, detectHit() for tunnel bricks
    if (openingArr.every(opening => !detectHit(truck, opening))) {
        tunnelArr.forEach(brick => {
            detectHit(truck, brick)
        })
    }
    //This makes i only stay the same or change by 1 to keep openings next to each other
    iIncrements = [0, -1, 1]
    randomIndex = Math.floor(Math.random() * iIncrements.length)
    //these conditions keep openings from going off screen
    if (tunnelX === 0) {
        i += 1
    } else if (tunnelX === 750) {
        i -= 1
    } else {
        i += iIncrements[randomIndex]
    }
    // **** THE CONDITION TO MAKE A GOLD FROG ********
    counter++
    if (counter === 50) {
        goldFrog = new ImageArt(ctxTwo, 'images/Gold-boy.png', tunnelX + 25, -25, 50, 50)
        goldFrogArr.push(goldFrog)
        return counter = 0
    }
    //this chooses how the x coordinates will change or stay the same the next time function is called
    return i
}


const moveTunnel = (arr, distance) => {
    arr.forEach(object => {
        object.clearObject()
        object.y += distance
        //detect hit for gold frogs
        if (arr === goldFrogArr) {
            detectHit(truck, object)
        }
        //this makes the tunnel/frogs create Image or the openings render
        arr === tunnelArr || arr === goldFrogArr ? object.createImage() : object.renderObject()
        if (object.y > 800) {
            arr.shift()
        }
    })
}

// ************************************************************

//    --------======== INTERVALS AND RESETTING GAME ========---------

// ************************************************************
const changeThingsAsPointsIncrease = (goldFrogsLeftCount) => {
    if (levelOne) {
        switch (goldFrogsLeftCount) {
            case 0:
                alert('YOU WIN!!!! On to the next Level!')
                clearAllIntervalsLevelOne()
                return resetGame()
                break
            case 15:
                makeH1Dialogue('faster')
                break
            case 10:
                makeH1Dialogue('faster')
                break
            case 5:
                makeH1Dialogue('faster')
                break
        }
        //these make frogs faster as their speed gets quicker to keep the number of obstacles a similar density 

        if (goldFrogsLeftCount <= 5) {
            clearInterval(frogsRainingDown)
            frogsRainingDown = setInterval(makeRain, 1, frogArr, 4)
            clearInterval(frogTimer)
            frogTimer = setInterval(makeFrog, 100)
        } else
            if (goldFrogsLeftCount <= 10) {
                clearInterval(frogsRainingDown)
                frogsRainingDown = setInterval(makeRain, 1, frogArr, 3)
                clearInterval(frogTimer)
                frogTimer = setInterval(makeFrog, 150)
            } else
                if (goldFrogsLeftCount <= 15) {
                    clearInterval(frogsRainingDown)
                    frogsRainingDown = setInterval(makeRain, 1, frogArr, 2)
                    clearInterval(frogTimer)
                    frogTimer = setInterval(makeFrog, 225)
                }
    }
    if (levelTwo) {
        //this was the only way I could remove the specific gold frog

    }
    if (levelThree) {
        if (goldFrogsLeftCount === 0) {
            alert('YOU WIN!!!! On to the next Level!')
            clearAllIntervalsLevelThree
            return resetGame()
        }
        if (goldFrogsLeftCount === 10) {
            makeH1Dialogue('faster')
        }
        if (goldFrogsLeftCount <= 10) {
            clearInterval(moveTunnelInterval)
            clearInterval(moveOpeningInterval)
            clearInterval(moveGoldFrogsInterval)
            //good ratios for moving pretty quickly
            moveTunnelInterval = setInterval(moveTunnel, 4, tunnelArr, 2)
            moveOpeningInterval = setInterval(moveTunnel, 4, openingArr, 2)
            moveGoldFrogsInterval = setInterval(moveTunnel, 4, goldFrogArr, 2)
        }
    }
}

const createIntervalsLevelOne = () => {
    levelOne = true
    levelTwo = false
    levelThree = false
    frogTimer = setInterval(makeFrog, 300)
    frogTimer2 = setInterval(makeGoldenFrog, 2000)
    frogsRainingDown = setInterval(makeRain, 1, frogArr, 1)
    goldFrogsRainingDown = setInterval(makeRain, 1, goldFrogArr, 2)
}

const clearAllIntervalsLevelOne = () => {
    levelOne = true
    levelTwo = false
    levelThree = false
    clearInterval(frogTimer)
    clearInterval(frogTimer2)
    clearInterval(frogsRainingDown)
    clearInterval(goldFrogsRainingDown)
    // setTimeout(() => {
    frogArr.forEach(frog => {
        frog.clearObject()
    })
    goldFrogArr.forEach(frog => {
        frog.clearObject()
    })
    frogArr.length = 0
    goldFrogArr.length = 0
    // }, 100);
}

const createIntervalsLevelTwo = () => {
    levelOne = false
    levelTwo = true
    levelThree = false
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
    // setTimeout(() => {
    goldFrogInWaterArr.forEach(frog => {
        frog.clearObject()
    })
    goldFrogInWaterArr.length = 0
    platformArr.forEach(platform => {
        platform.clearObject()
    })
    platformArr.length = 0
    // }, 100);
}

const createIntervalsLevelThree = () => {
    levelOne = false
    levelTwo = false
    levelThree = true
    makeTunnelInterval = setInterval(makeTunnel, 200)
    moveTunnelInterval = setInterval(moveTunnel, 2, tunnelArr, 1)
    makeOpeningInterval = setInterval(makeTunnelOpening, 30)
    moveOpeningInterval = setInterval(moveTunnel, 2, openingArr, 1)
    moveGoldFrogsInterval = setInterval(moveTunnel, 2, goldFrogArr, 1)
}

const clearAllIntervalsLevelThree = () => {
    clearInterval(makeTunnelInterval)
    clearInterval(moveTunnelInterval)
    clearInterval(makeOpeningInterval)
    clearInterval(moveOpeningInterval)
    clearInterval(moveGoldFrogsInterval)
    // setTimeout(() => {
    tunnelArr.forEach(brick => {
        brick.clearObject()
    })
    openingArr.forEach(opening => {
        opening.clearObject()
    })
    goldFrogArr.forEach(frog => {
        frog.clearObject()
    })
    tunnelArr.length = 0
    openingArr.length = 0
    goldFrogArr.length = 0
    // }, 1);
}

const hideButtons = () => {
    startBtn.classList.add('hide')
    waterButton.classList.add('hide')
    tunnelButton.classList.add('hide')
    mainPageImg.classList.add('hide')
    h1.innerText = ''
}
const showButtons = () => {
    startBtn.className = ''
    waterButton.className = ''
    tunnelButton.className = ''
    mainPageImg.className = ''
    setTimeout(() => {
        h1.innerText = 'TRUCKER: Smash the Frogs!'
        h1.style.color = '#00ff00'
    }, 1400)
}

const resetGame = () => {
    currentScore = 0
    lives = 3
    goldFrogsLeftCount = 20

    if (levelOne) {
        clearAllIntervalsLevelOne()
        //Clear the dashes here so that they still run for the whole duration of level 1
        clearInterval(displayDashes)
        clearInterval(dashInterval)
    }
    if (levelTwo) clearAllIntervalsLevelTwo()
    if (levelThree) clearAllIntervalsLevelThree()

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
        ctxThree.clearRect(0, 0, canvas.width, canvas.height)
        ctxFour.clearRect(0, 0, canvas.width, canvas.height)
        canvasFour.className = ''
        span1.textContent = ''
        span2.textContent = ''
        span3.textContent = ''
        //have this here again because level 3 keeps erasing h1 text after GameOver
        setTimeout(() => {
            h1.innerText = 'TRUCKER: Smash the Frogs!'
            h1.style.color = '#00ff00'
            showButtons()
        }, 1300)
    }, 100)

    levelOne = false
    levelTwo = false
    levelThree = false

}



// ************************************************************

//    --------======== EVENT LISTENERS AND BUTTONS ========---------

// ************************************************************

startBtn.addEventListener('click', (e) => {
    hideButtons()
    h1.innerText = `SMASH GOLD FROGS AND AVOID THE ANGRY ONES!!`
    h1.style.color = '#00ff00'
    setTimeout(() => h1.innerText = '', 2500)
    currentScore = 0
    lives = 3

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
    ctxThree.clearRect(0, 0, canvas.width, canvas.height)
    ctxFour.clearRect(0, 0, canvas.width, canvas.height)
    canvasFour.classList.add('levelOne')
    makeLanes()
    drawTruck()
    showScore()
    createIntervalsLevelOne()
    //Create these two intervals here so that they don't get started and cleared each time a player gets hit
    displayDashes = setInterval(makeLaneDashes, 900)
    dashInterval = setInterval(() => {
        createdLaneDashesArr.forEach(dash => {
            dash.clearObject()
            dash.y > 900 ? null : dash.y += 5
            dash.renderObject()
            if (dash.y > 800) createdLaneDashesArr.shift()
        })
    }, 20)
    return goldFrogsLeftCount = 20
})

waterButton.addEventListener('click', () => {
    hideButtons()
    h1.innerText = `SMASH GOLD FROGS UNTIL FINISH LINE APPEARS!!`
    h1.style.color = '#00ff00'
    setTimeout(() => h1.innerText = '', 2500)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
    ctxThree.clearRect(0, 0, canvas.width, canvas.height)
    ctxFour.clearRect(0, 0, canvas.width, canvas.height)
    canvasFour.classList.add('levelTwo')
    goldFrogArr.length = 0
    // currentScore = 2000
    lives = 3
    goldFrogsLeftCount = 10
    showScore()
    drawTruck()
    makeWater()
    makeWaterLanes()
    createIntervalsLevelTwo()
})

tunnelButton.addEventListener('click', () => {
    hideButtons()
    h1.innerText = `SMASH GOLD FROGS TO ESCAPE!!`
    h1.style.color = '#00ff00'
    setTimeout(() => h1.innerText = '', 2500)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctxTwo.clearRect(0, 0, canvas.width, canvas.height)
    ctxThree.clearRect(0, 0, canvas.width, canvas.height)
    ctxFour.clearRect(0, 0, canvas.width, canvas.height)
    canvasFour.classList.add('levelThree')
    drawTruck()
    lives = 3
    goldFrogsLeftCount = 20
    showScore()
    createIntervalsLevelThree()
    return i = 16
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
// Trigger a winning Endgame popup with button to restart