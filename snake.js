const gridSize = 25 
const grid = document.getElementById("game-grid")
const cellTypes = {
    empty: "empty",
    snake: "snake",
    head: "head",
    berry: "berry",
}

let moveVector = [1, 0]
let position = [0, 0]
function xyToIndex(x, y) {

    return gridSize * y + x
}
function updatePostion(x, y){
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
        return `<div class="cell ${this.type} " data-x="${this.x}" data-y="${this.y}"></div>`
    }
}

let cells = []

for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        cells.push(new Cell(x, y, cellTypes.empty))
    }
}
// добавляем змею
cells[xyToIndex(...position)].type = cellTypes.head

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

function move() {
    let [move_x, move_y] = moveVector
    console.log(cells[xyToIndex(...position)])
    cells[xyToIndex(...position)].type = cellTypes.empty
    position[0] += move_x
    position[1] += move_y
    position = updatePostion(...position)
    cells[xyToIndex(...position)].type = cellTypes.head
    render()
}

function handleKeyPress(event) {
    keyToFunction[event.keyCode]()
}

// Добавляем слушатель события нажатия клавиши к элементу (например, к document)
window.addEventListener("keydown", handleKeyPress)

const intervalId = setInterval(move, 100)
