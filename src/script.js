const canvas = document.getElementById("container")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let ctx = canvas.getContext("2d")

const Number_of_Balls = 35
const FPS = 25


//random number
function randomNumber(max) {
    return Math.floor(Math.random()*max)
}
class Ball {
    constructor() {
        this.posX = 2 + randomNumber(canvas.width * .75)
        this.posY = 2 + randomNumber(canvas.height * .75)

        this.valX = 1 + randomNumber(4)
        this.valY = randomNumber(2)

        this.radius = 3 + randomNumber(17)

        this.mass = this.radius **2
        this.color =`hsl(${randomNumber(360)}, 60%, 70%)`
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color

        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI)
        ctx.fill()
    }
    move() {

        if(this.posX <= this.radius || this.posX>= canvas.width - this.radius)
        {
            this.valX *= -1
        }
        if(this.posY <= this.radius || this.posY >= canvas.height - this.radius)
        {
            this.valY *= -1
        }


        this.posX += this.valX
        this.posY += this.valY

        this.draw()
    }
}
class ObjectManager{
    constructor() {
        this.width = canvas.width
        this.height = canvas.height
        this.ballArr = []
        this.populateMap()
        this.update()
    }
    
    distance(obj1, obj2) {
        return Math.sqrt(
            (obj1.posX - obj2.posX) **2 +
            (obj2.posY -obj2.posY) **2
        )
    }
    
    isColliding(obj1, obj2) {
        return this.distance(obj1, obj2) <= (obj1.radius + obj2.radius)
    }
    populateMap() {
        for ( let i = 0; i < Number_of_Balls; i++) {
            let newBall;
            while (true) {
                newBall = new Ball()
                let colliding = false
                for (let ball of this.ballArr) {
                    colliding = this.isColliding(ball, newBall) || colliding
                }
                if (!colliding) {
                    this.ballArr.push(newBall)
                    newBall.draw()
                    break
                }
                
            }
        }
    }
    update() {
        ctx.clearRect(0,0, canvas.width, canvas.height)
        this.ballArr.forEach(ball => {
            ball.move()
        })
        for (let i in this.ballArr) {
            for (let j in this.ballArr){
                if (i != j) {
                    const ball1 = this.ballArr[i]
                    const ball2 = this.ballArr[j]

                    if (this.isColliding(ball1, ball2)) {
                        const tempX = ball1.valX
                        const tempY = ball2.valY

                        ball1.valX = (
                            (ball1.mass - ball2.mass)* ball1.valX + 2* ball2.mass * ball2.valX
                        ) / (ball1.mass + ball2.mass)

                        ball1.valY = (
                            (ball1.mass - ball2.mass)* ball1.valY + 2* ball2.mass * ball2.valY
                        ) / (ball1.mass + ball2.mass)

                        ball2.valX = (
                            (ball2.mass - ball1.mass)* ball2.valX + 2* ball1.mass* tempX
                        ) / (ball1.mass + ball2.mass)

                        ball2.valY = (
                            (ball2.mass - ball1.mass)* ball2.valY + 2* ball1.mass* tempY
                        ) / (ball1.mass + ball2.mass)

                        ball1.move()
                        ball2.move()
                    }
                }
            }
        }
        setTimeout(() => {
            requestAnimationFrame(() => {
                this.update()
            })
        }, 1000/FPS)
    }
    
}

let objectManager = new ObjectManager()
