function Node(i, j, w) {
	this.i = i;
	this.j = j;
	this.x = i * w;
	this.y = j * w;
	this.w = w;
	this.parent = null;
	this.start = this.isStart();
	this.end = this.isEnd();
	this.h = -1;
	this.g = -1;
	this.f = -1;
	this.open = false;
	this.closed = false;
	this.obstacle = false;
	this.optimal = false;
}

Node.prototype.draw = function() {
	if (this.obstacle) {
		fill(0);
	} else if (this.start) {
		fill(0, 0, 255);
	} else if (this.end) {
		fill(0, 0, 255);
	} else if (this.optimal) {
		fill(0, 255, 255);
	} else if (this.closed) {
		fill(255, 0, 0);
	} else if (this.open) {
		fill(0, 255, 0);
	} else {
		fill(255);
	}
	square(this.x, this.y, this.w);
	// if (this.f > 0) {
	// 	fill(0);
	// 	text(this.f, this.x+this.w/2, this.y+this.w/2);
	// }
}

Node.prototype.contains = function(x, y) {
	return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

Node.prototype.isStart = function() {
	return (this.i == startX && this.j == startY);
}

Node.prototype.isEnd = function() {
	return (this.i == endX && this.j == endY);
}

Node.prototype.path = function() {
	for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) {
		var xoff = this.i + i;
		var yoff = this.j + j;
		if (xoff > -1 && xoff < cols && yoff > -1 && yoff < rows) {
			if (i != 0 || j != 0) {
				var curr = grid[xoff][yoff];
				if (!curr.closed) {
					var h = this.getDistance(xoff, yoff, endX, endY);
					var g = this.getDistance(xoff, yoff, this.i, this.j);
					// var h = 10 * dist(xoff, yoff, endX, endY);
					// var g = 10 * dist(xoff, yoff, this.i, this.j);
					if (this.g != -1) {
						g += this.g;
					}
					
					if (curr.f == -1 || curr.f > h + g) {
						curr.h = h;
						curr.g = g;
						curr.f = h + g;
						curr.parent = this;
					}
					if (!curr.open && !curr.obstacle) {
						curr.open = true;
						openNodes.push(curr);
					}
				}
			}
			
		}
	}
	this.closed = true;
	closedNodes.push(this);
}

Node.prototype.getDistance = function(x, y, x1, y1) {
	var xdist = abs(x1 - x);
	var ydist = abs(y1 - y);
	if (xdist > ydist) {
		return (14*ydist + 10*(xdist-ydist));
	} else {
		return (14*xdist + 10*(ydist-xdist));
	}
}

Node.prototype.retrace = function() {
	this.optimal = true;
	if (this.parent != null) {
		this.parent.retrace();
	}
}