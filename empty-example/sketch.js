var openNodes = new Array();
var closedNodes = new Array();

function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (var i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

var grid = null;

const stepTime = 0;
var steps = 0;

const per = 10;

var foundPath = false;

var cols = 48;
var rows = 27;

var startX = 1;
var startY = 1;
var endX = 13;
var endY = 9;

var w = 40;

function setup() {
	createCanvas(1920, 1080);
	initGrid();
	background(0);
	
	for (var i = 0; i < 14; i++) {
		grid[10][i].obstacle = true;
	}
	for (var i = 3; i < 9; i++) {
		grid[2 + i][13].obstacle = true;
	}

	grid[10][0].obstacle = true;
}

function resetGrid() {
	grid = make2DArray(cols, rows);
	for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
		grid[i][j] = new Node(i, j, w);
	}
}

function initGrid() {
	if (grid == null) {
		resetGrid();
	}
	for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
		var curr = grid[i][j];
		var next = new Node(i, j, w);
		next.obstacle = curr.obstacle;
		grid[i][j] = next;
	}
	openNodes = new Array();
	closedNodes = new Array();
	openNodes.push(grid[startX][startY]);
	foundPath = false;
}

function draw() {
	
	for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
		grid[i][j].draw();
	}
	if (steps >= stepTime) {
		for (var i = 0; i < per; i++) {
			findPath();
		}
		steps = 0;
	} else {
		steps++;
	}
	
}

function keyPressed() {
	if (key == 'r') {
		initGrid();
	} else if (key == 's') {
		for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
			if (grid[i][j].contains(mouseX, mouseY)) {
				grid[i][j].start = true;
				grid[startX][startY].start = false;
				startX = i;
				startY = j;
			}
		}
	} else if (key == 'e') {
		for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
			if (grid[i][j].contains(mouseX, mouseY)) {
				grid[i][j].end = true;
				grid[endX][endY].end = false;
				endX = i;
				endY = j;
			}
		}
	} else if (key == 'c') {
		resetGrid();
	}
}

function mousePressed() {
	for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
		if (grid[i][j].contains(mouseX, mouseY)) {
			grid[i][j].obstacle = !grid[i][j].obstacle;
		}
	}
}

function mouseDragged() {
	for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
		if (grid[i][j].contains(mouseX, mouseY)) {
			grid[i][j].obstacle = true;
		}
	}
}

function findPath() {
	if (openNodes.length > 0 && !foundPath) {
		var current = findBestStep();
		current[0].path();
		if (current[0].h == 0) {
			console.log("found path");
			foundPath = true;
			current[0].retrace();
		}
	}
}

function findBestStep() {
	var min = openNodes[0];
	var n = 0;
	for (var i = 0; i < openNodes.length; i++) {
		var curr = openNodes[i];
		if (curr.f < min.f) {
			min = curr;
			n = i;
		} else if (curr.f == min.f && curr.h < min.h) {
			min = curr
			n = i;
		} else if (curr.f == min.f && curr.h == min.h) {
			var r = random(1);
			if (r < 0.5) {
				min = curr;
				n = i;
			}
		}
	}
	return openNodes.splice(n, 1);
}