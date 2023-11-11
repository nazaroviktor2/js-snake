const gridSize = 25
const grid = document.getElementById("game-grid")
const html_score = document.getElementById("score")
const html_joke = document.getElementById("joke")
const cellTypes = {
    empty: "empty",
    snake: "snake",
    head: "head",
    berry: "berry",
}

let moveVector = [1, 0]
let positions = [
    [0, 1],
    [0, 0],
]
let score = 0
let cells = []

function xyToIndex(x, y) {
    return gridSize * y + x
}

function updatePostion(x, y) {
    if (x < 0) {
        x = gridSize - 1
    } else if (x >= gridSize) {
        x = 0
    }
    if (y < 0) {
        y = gridSize - 1
    } else if (y >= gridSize) {
        y = 0
    }
    return [x, y]
}

class Cell {
    constructor(x, y, type) {
        this.x = x
        this.y = y
        this.type = type
    }
    toSting(params) {
        return `<div class="cell ${this.type}" data-x="${this.x}" data-y="${this.y}"></div>`
    }
}

for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        cells.push(new Cell(x, y, cellTypes.empty))
    }
}

// добавляем змею
cells[xyToIndex(...positions[0])].type = cellTypes.head
cells[50].type = cellTypes.berry

function render() {
    grid.innerHTML = ""
    for (let cell of cells) {
        grid.insertAdjacentHTML("beforeend", cell.toSting())
    }
}

render()

keyToFunction = {
    37: function () {
        moveVector = [-1, 0] // лево
    },
    38: function () {
        moveVector = [0, -1] // верх
    },
    39: function () {
        moveVector = [1, 0] // право
    },
    40: function () {
        moveVector = [0, 1] // лево
    },
}

function placeBerry() {
    let x, y
    do {
        x = Math.floor(Math.random() * gridSize)
        y = Math.floor(Math.random() * gridSize)
    } while (cells[xyToIndex(x, y)].type !== cellTypes.empty)
    cells[xyToIndex(x, y)].type = cellTypes.berry
}

function check_dead(snake, new_head) {
    for (let el of snake) {
        if (JSON.stringify(el) == JSON.stringify(new_head)) {
            return true
        }
    }
    return false
}



function move() {
    let [move_x, move_y] = moveVector

    // Обновление хвоста змейки
    let tail = positions.pop()
    cells[xyToIndex(...tail)].type = cellTypes.empty

    // Рассчитать новую позицию головы и добавить ее в начало массива позиций
    let head = positions[0].slice()
    head[0] += move_x
    head[1] += move_y

    head = updatePostion(...head)
    if (check_dead(positions, head)){
        dead_with_joke()
        clearInterval(intervalId)
    }

    positions.unshift(head)

    let next_cell = cells[xyToIndex(...head)]

    // Проверка на сбор ягоды
    if (next_cell.type == cellTypes.berry) {
        score += 5
        html_score.innerHTML = `Score: ${score}`
        positions.push(tail) // Увеличиваем змейку
        placeBerry() // Размещаем новую ягоду на поле
    }


    // Отображаем голову и хвост змейки
    cells[xyToIndex(...head)].type = cellTypes.head
    cells[xyToIndex(...tail)].type = cellTypes.empty

    render()
}

function handleKeyPress(event) {
    keyToFunction[event.keyCode]()
}


function dead_with_joke(){
    fetch('https://geek-jokes.sameerkumar.website/api?format=json')
    .then(response => response.json())
    .then(data => {
         alert("dead\n" + data.joke);
    })
    .catch(error => console.error('Error:', error));
}

// Добавляем слушатель события нажатия клавиши к элементу
window.addEventListener("keydown", handleKeyPress)

const intervalId = setInterval(move, 100)
