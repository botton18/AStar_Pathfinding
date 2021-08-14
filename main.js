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
    this.parent;
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

const board = [];
let temp = [];
function createGrid(x) {
  for (var rows = 0; rows < x; rows++) {
    for (var columns = 0; columns < x; columns++) {
      const grid = new Grid(columns, rows);
      temp.push(grid);
      // $("#container").append(grid.div);
      // var gridDiv = document.createElement("div");
      // gridDiv.id = [rows, columns];
      // gridDiv.className = "grid";
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
  console.log(coordinate);
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
    console.log("######################################");
    return false;
  }

  if (grid.checked === true) {
    console.log("%%%%%%%%%%%%%%%%%%%%%");
    return false;
  }

  return true;
}

function fillBlock(block, color) {
  board[block[0]][block[1]].wall = true;
  var element = document.getElementById(block);
  $(element).css("background-color", color);
}
// Function that prompts the user to select the number of boxes in a new grid
// the function then also creates that new grid
function refreshGrid() {
  var z = prompt("How many boxes per side?");
  clearGrid();
  createGrid(z);
}

function generateWall(num) {
  console.log(num);
  for (i = 0; i < num; ++i) {
    console.log("hit");
    const x = Math.floor(Math.random() * 15);
    const y = Math.floor(Math.random() * 15);
    console.log(x);
    console.log(y);
    fillBlock([x, y], "black");
  }
  // fillBlock([10, 7], "black");
  // fillBlock([10, 8], "black");
  // fillBlock([10, 9], "black");
  // fillBlock([10, 10], "black");
  // fillBlock([10, 11], "black");
  // fillBlock([10, 12], "black");
  // fillBlock([10, 13], "black");
}

function getDistance(start, end) {
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;
}

function getBestNode(list) {
  // list of grid
  let min = list[0];
  let index = 0;
  // console.log(list);
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

function colorPath(current) {
  let grid = current;
  while (1) {
    if (grid.parent === undefined) {
      break;
    }
    console.log("fill");
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
    console.log("******new iteration********");
    if (open.length === 0) {
      console.log("No Path Found");
      break;
    }
    let bestNode = getBestNode(open);
    let current = bestNode.min;
    console.log("---current----");
    console.log(current);
    console.log("-----------");
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

      console.log("top");
      console.log(top);
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
      console.log("bot");
      console.log(bot);
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
      console.log("right");
      console.log(right);
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

      console.log("left");
      console.log(left);
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
      console.log("topright");
      console.log(topright);
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

      console.log("topleft");
      console.log(topleft);
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
      console.log("botleft");
      console.log(botleft);
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
      console.log("botright");
      console.log(botright);
      open.push(botright);
    }
    console.log("***********************************");
  }
}

// Create a 16x16 grid when the page loads.
// Creates a hover effect that changes the color of a square to black when the mouse passes over it, leaving a (pixel) trail through the grid
// allows the click of a button to prompt the user to create a new grid
$(document).ready(function () {
  createGrid(16);
  generateWall(100);
  //board[15][15].fillColor("green");
  board[0][0].fillColor("green");
  $(".grid").click(function () {
    board[0][0].fillColor("green");
    console.log("click");
    const element = $(this.id).selector;
    const arr = element.split(",");
    console.log(arr);
    const end = [Number(arr[0]), Number(arr[1])];
    board[Number(arr[0])][Number(arr[1])].fillColor("green");
    // console.log(end);
    // var element = document.getElementById([0, 0]);
    // board[0][0].wall = true;
    // board[0][0].fillColor("green");
    // $(element).css("background-color", "black");
    solve(board[0][0], board[Number(arr[0])][Number(arr[1])]);
  });

  $(".newGrid").click(function () {
    refreshGrid();

    $(".grid").click(function () {
      $(this).css("background-color", "black");
    });
  });
});
