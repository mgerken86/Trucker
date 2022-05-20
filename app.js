//Initially describe the storyline and rules. 
//click button to begin game
//3 Sec Countdown timer until canvas starts 'moving'



//Create the canvas
//75% of width of screen? 100% height
//create the car
//create multiple lanes to travel left and right in. Have yellow lines for lanes come down from x axis in middle of lane
//Display the points (or even better, have it be 'points until fighting boss' and subtract from that)
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const startBtn = document.getElementById('start-btn')
ctx.width = canvas.width
ctx.height = canvas.height
let truck
let smallFrog, mediumFrog, largeFrog
let lane1, lane2, lane3, lane4, lane5, lane6, lane7, lane8



class Object {
    constructor(x, y, color, width, height) {
        this.x = x
        this.y = y
        this.color = color
        this.width = width
        this.height = height
        this.alive = true
    }
    renderObject() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    clearObject() {
        ctx.clearRect(this.x, this.y, this.width, this.height)
    }

}

//to position truck in center of x axis, I divided the canvas in half and then subtracted half the truck's width
truck = new Object(canvas.width/2 -25, canvas.height -140, 'red', 50, 100)

const makeLanes = () => {
    const lanes = [
    lane1 = new Object(100, 0, 'yellow', 4, 900),
    lane2 = new Object(200, 0, 'yellow', 4, 900),
    lane3 = new Object(300, 0, 'yellow', 4, 900),
    lane4 = new Object(400, 0, 'yellow', 4, 900),
    lane5 = new Object(500, 0, 'yellow', 4, 900),
    lane6 = new Object(600, 0, 'yellow', 4, 900),
    lane7 = new Object(700, 0, 'yellow', 4, 900),
    lane8 = new Object(800, 0, 'yellow', 4, 900)
    ]
    lanes.forEach(lane => {
        lane.renderObject()
    })
}

startBtn.addEventListener('click', (e)=> {
    truck.renderObject()
    makeLanes()
})


//assign direction arrow inputs to car => each left and right shifts over one lane
//limit car to stay within boundaries(the road, not the grass)
//limit the car to only being able to travel the y axis a little bit 
//switch statement with Arrow Key cases

const moveTruck = (e) => {
    //immediately clear out the 'old' truck
    truck.clearObject()
    switch(e.key) {
        case 'ArrowRight':
            truck.x < 825 ? truck.x += 100 : null
            break
        case 'ArrowLeft':
            //chose 25 because that's the closest it gets to the left border
            truck.x > 25 ? truck.x -= 100 : null
    }
    //render truck with new coordinates
    truck.renderObject()
    console.log(truck.x)
}
window.addEventListener('keydown', moveTruck)

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