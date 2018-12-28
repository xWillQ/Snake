const a = 25;
const columns = 20;
const rows = 20;

const speed = 5;

const snakeColor = '#E4E4E4';
const backgroundColor = '#3A3937';
const deadColor = '#0D0D0D';
const foodColor = '#F52222';


//------------------------------      Глобальные переменные      ----------------------------------


let canv = document.getElementById('canvas');
let ctx = canv.getContext('2d');

function Pos(x, y) { 
    this.x = x;
    this.y = y;
}

let snake = {
    'body': [],
    'dir': 0,
    'grow': false,

    move() {
        ctx.fillStyle = snakeColor;
        switch (this.dir) {
            case 0:
                this.body.push(new Pos(this.head.x, this.head.y - 1));
                break;
            case 1:
                this.body.push(new Pos(this.head.x, this.head.y + 1));
                break;
            case 2:
                this.body.push(new Pos(this.head.x - 1, this.head.y));
                break;
            case 3:
                this.body.push(new Pos(this.head.x + 1, this.head.y));
                break;
        }
        this.head = this.body[this.body.length - 1];
        ctx.fillRect(this.head.x * (a + 1) + 1, this.head.y * (a + 1) + 1, a, a);

        if (snake.grow == false) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(this.body[0].x * (a + 1) + 1, this.body[0].y * (a + 1) + 1, a, a);
            this.body.shift();
        } else { 
            this.grow = false;
        }
    },
    /*eslint complexity: 'off' */
    isAlive() {
        switch (this.dir) { 
            case 0:
                if (this.head.y == 0) {
                    return false;
                }
                for (let i = 0; i < this.body.length - 1; i++) {
                    if ((this.head.x == this.body[i].x) && (this.head.y - 1 == this.body[i].y)) {
                        return false;
                    }
                }
                break;
            
            case 1:
                if (this.head.y == rows - 1) {
                    return false;
                }
                for (let i = 0; i < this.body.length - 1; i++) {
                    if ((this.head.x == this.body[i].x) && (this.head.y + 1 == this.body[i].y)) {
                        return false;
                    }
                }
                break;
            
            case 2:
                if (this.head.x == 0) {
                    return false;
                }
                for (let i = 0; i < this.body.length - 1; i++) {
                    if ((this.head.x - 1 == this.body[i].x) && (this.head.y == this.body[i].y)) {
                        return false;
                    }
                }
                break;
            
            case 3:
                if (this.head.x == columns - 1) {
                    return false;
                }
                for (let i = 0; i < this.body.length - 1; i++) {
                    if ((this.head.x + 1 == this.body[i].x) && (this.head.y == this.body[i].y)) {
                        return false;
                    }
                }
                break;
        }
        
        return true;
    },

    die() { 
        ctx.fillStyle = deadColor;
        for (let i = 0; i < snake.body.length; i++) { 
            ctx.fillRect(snake.body[i].x * (a + 1) + 1, snake.body[i].y * (a + 1) + 1, a, a);
        }
    },

    eat() {
        switch (this.dir) {
            case 0:
                if ((snake.head.x == food.x) && (snake.head.y - 1 == food.y)) {
                    return true;
                }
                break;
            case 1:
                if ((snake.head.x == food.x) && (snake.head.y + 1 == food.y)) {
                    return true;
                }
                break;
            case 2:
                if ((snake.head.x - 1 == food.x) && (snake.head.y == food.y)) {
                    return true;
                }
                break;
            case 3:
                if ((snake.head.x + 1 == food.x) && (snake.head.y == food.y)) {
                    return true;
                }
                break;
        }
        return false;
    }
}; 

let food;
let time1;
let time2;
let gap;
let score = 0;

//------------------------------         Тело программы          ----------------------------------


function setup() { 
    document.body.style.background = backgroundColor;
    canv.style.background = backgroundColor;
    canv.style.borderColor = snakeColor;
    canv.width = columns * (a + 1) + 1;
    canv.height = rows * (a + 1) + 1;

    snake.body.push(new Pos(columns / 2, rows - 1));
    snake.head = snake.body[0];

    gap = 1000 / speed;
    time1 = Date.now();
    placeFood();
    draw();
}

// Формула для отрисовки по сетке: (column * (a + 1) + 1, row * (a + 1) + 1, a, a)
function draw() { 
    
    time2 = Date.now();
    if (time2 - time1 >= gap) { 
        
        if (snake.eat()) { 
            snake.grow = true;
            placeFood();
            score++;
        }

        if (snake.isAlive()) {
            snake.move();
        } else {
            snake.die();
            return;
        }
        
        time1 = Date.now();
    }
    requestAnimationFrame(draw);
}

setup();


//------------------------------             Функции             ----------------------------------


document.addEventListener('keydown', controls);

function controls(event) {
    if ((event.code == 'ArrowUp') && (snake.dir != 1)) {
        snake.dir = 0;
        return;
    }
    if ((event.code == 'ArrowDown') && (snake.dir != 0)) {
        snake.dir = 1;
        return;
    }
    if ((event.code == 'ArrowLeft') && (snake.dir != 3)) {
        snake.dir = 2;
        return;
    }
    if ((event.code == 'ArrowRight') && (snake.dir != 2)) {
        snake.dir = 3;
        return;
    }
    if (event.code == 'KeyR') { 
        location.reload();
        return;
    }
    if (event.code == 'Space') { 
        snake.grow = true;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/* eslint no-labels: 'off' */
function placeFood() { 
    food = new Pos(0, 0);
    outer: while (true) { 
        food.x = getRandomInt(columns);
        food.y = getRandomInt(rows);
        for (let i = 0; i < snake.body.length; i++) { 
            if ((food.x == snake.body[i].x) && (food.y == snake.body[i].y)) { 
                break;
            }
            if (i == snake.body.length - 1) { 
                break outer;
            }
        }
    }
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * (a + 1) + 1, food.y * (a + 1) + 1, a, a);
}
