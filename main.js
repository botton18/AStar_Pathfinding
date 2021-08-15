// Function that builds a grid in the "container"
// diagonal move = 14
// regular move = 10
// if f is same, choose one with lowest h cost
class Grid {
  constructor(y, x) {
    this.x = x;
    this.y = y;
    this.gridDiv = document.createElement("div");
    this.gridDiv.id = [x, y];
    this.gridDiv.className = "grid";
    this.wall = false;
    this.parent = null;
    this.children;
    this.g = 0; // distance from starting point
    this.h = 0; // heuristic manahttan distance to ending point
    this.f = 0; // g + f
    this.coordinate = [x, y];
    this.checked = false;
  }

  fillColor(color) {
    var element = document.getElementById([this.x, this.y]);
    $(element).css("background-color", color);
  }
}

let board = [];
let temp = [];

const wallamount = 3000;
const gridamount = 100;
function createGrid(x) {
  for (var rows = 0; rows < x; rows++) {
    for (var columns = 0; columns < x; columns++) {
      const grid = new Grid(columns, rows);
      temp.push(grid);
      $("#container").append(grid.gridDiv);
    }
    board.push(temp);
    temp = [];
  }
  $(".grid").width(960 / x);
  $(".grid").height(960 / x);
}

// Function that clears the grid
function clearGrid() {
  $(".grid").remove();
}

function isTraversable(coordinate) {
  let grid;
  try {
    grid = board[coordinate[0]][coordinate[1]];
  } catch (e) {
    return false;
  }

  if (grid === undefined) {
    return false;
  }

  if (grid.wall === true) {
    return false;
  }

  if (grid.checked === true) {
    return false;
  }

  return true;
}

function fillBlock(block, color) {
  board[block[0]][block[1]].wall = true;
  var element = document.getElementById(block);
  $(element).css("background-color", color);
}

function refreshGrid() {
  var z = prompt("How many boxes per side?");
  clearGrid();
  createGrid(z);
}

function generateWall(num) {
  for (i = 0; i < num; ++i) {
    const x = Math.floor(Math.random() * (gridamount - 1)) + 1;
    const y = Math.floor(Math.random() * (gridamount - 1)) + 1;
    fillBlock([x, y], "black");
  }
}

function getBestNode(list) {
  // list of grid
  let min = list[0];
  let index = 0;
  for (let i = 0; i < list.length; ++i) {
    let grid = list[i];
    if (grid.f <= min.f && grid.g <= min.g) {
      min = grid;
      index = i;
    }
  }
  return { min, index };
}

function getH(current, end) {
  return Math.pow(current.x - end.x, 2) + Math.pow(current.y - end.y, 2);
  //compare their x to determine which direction to go diagonally,
}

function resetBoard() {
  for (let row of board) {
    for (let grid of row) {
      //grid.fillColor("white");
      grid.parent = null;
      grid.checked = false;

      if (!grid.wall) {
        grid.fillColor("white");
      }
    }
  }
}

function colorPath(current) {
  let grid = current.parent;
  while (1) {
    if (grid.parent === null) {
      break;
    }
    grid.fillColor("blue");

    grid = grid.parent;
  }
}
function solve(start, end) {
  start.f = 0;
  start.g = 0;

  const open = [start];
  const closed = [];

  while (1) {
    if (open.length === 0) {
      alert("No Path Found!");

      console.log("No Path Found");
      break;
    }
    let bestNode = getBestNode(open);
    let current = bestNode.min;

    let index = bestNode.index;
    if (current.x === end.x && current.y === end.y) {
      console.log("PATH FOUND!");
      colorPath(current);

      break;
    }
    current.checked = true;

    open.splice(index, 1);
    //check top
    if (isTraversable([current.x, current.y + 1])) {
      let top = board[current.x][current.y + 1];
      top.parent = current;

      if (current.g + 10 < top.g) {
        top.g = current.g + 10;
      }
      top.h = getH(top, end);
      top.f = top.g + top.h;

      open.push(top);
    }

    // check bottom
    if (isTraversable([current.x, current.y - 1])) {
      let bot = board[current.x][current.y - 1];
      bot.parent = current;

      if (current.g + 10 < bot.g) {
        bot.g = current.g + 10;
      }
      bot.h = getH(bot, end);

      bot.f = bot.g + bot.h;

      open.push(bot);
    }

    // check right
    if (isTraversable([current.x + 1, current.y])) {
      let right = board[current.x + 1][current.y];
      right.parent = current;

      if (current.g + 10 < right.g) {
        right.g = current.g + 10;
      }
      right.h = getH(right, end);

      right.f = right.h + right.g;

      open.push(right);
    }

    // check left
    if (isTraversable([current.x - 1, current.y])) {
      let left = board[current.x - 1][current.y];
      left.parent = current;

      if (current.g + 10 < left.g) {
        left.g = current.g + 10;
      }
      left.h = getH(left, end);

      left.f = left.h + left.g;

      open.push(left);
    }

    // check top right
    if (isTraversable([current.x + 1, current.y - 1])) {
      let topright = board[current.x + 1][current.y - 1];
      topright.parent = current;

      if (current.g + 10 < topright.g) {
        topright.g = current.g + 10;
      }
      topright.h = getH(topright, end);

      topright.f = topright.h + topright.g;

      open.push(topright);
    }

    // check top left
    if (isTraversable([current.x - 1, current.y - 1])) {
      let topleft = board[current.x - 1][current.y - 1];
      topleft.parent = current;

      if (current.g + 10 < topleft.g) {
        topleft.g = current.g + 10;
      }
      topleft.h = getH(topleft, end);

      topleft.f = topleft.h + topleft.g;

      open.push(topleft);
    }

    // check bot left
    if (isTraversable([current.x - 1, current.y + 1])) {
      let botleft = board[current.x - 1][current.y + 1];
      botleft.parent = current;

      if (current.g + 10 < botleft.g) {
        botleft.g = current.g + 10;
      }
      botleft.h = getH(botleft, end);

      botleft.f = botleft.h + botleft.g;

      open.push(botleft);
    }

    // check bot right
    if (isTraversable([current.x + 1, current.y + 1])) {
      let botright = board[current.x + 1][current.y + 1];
      botright.parent = current;

      if (current.g + 10 < botright.g) {
        botright.g = current.g + 10;
      }
      botright.h = getH(botright, end);

      botright.f = botright.h + botright.g;

      open.push(botright);
    }
  }
}

// Create a 16x16 grid when the page loads.
// Creates a hover effect that changes the color of a square to black when the mouse passes over it, leaving a (pixel) trail through the grid
// allows the click of a button to prompt the user to create a new grid
let first = true;

$(document).ready(function () {
  createGrid(gridamount);
  generateWall(wallamount);
  board[0][0].fillColor("green");

  $(".grid").click(function () {
    resetBoard();
    board[0][0].fillColor("green");

    const element = $(this.id).selector;
    const arr = element.split(",");

    // ensure the wall is not clicked
    if (!board[Number(arr[0])][Number(arr[1])].wall) {
      let start = new Date();
      console.log(start);
      board[Number(arr[0])][Number(arr[1])].fillColor("green");
      solve(board[0][0], board[Number(arr[0])][Number(arr[1])]);
      let end = new Date() - start;
      document.getElementById("elapsedTime").innerHTML = end.toString() + " ms";
    } else {
      alert("You cannot set your end point to a wall!");
    }
  });

  $(".newGrid").click(function () {
    board = [];
    createGrid(gridamount);
    resetBoard();
    generateWall(wallamount);
    board[0][0].fillColor("green");
  });
});
