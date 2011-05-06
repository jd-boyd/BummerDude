//From GDM, May '11, page 38
window.requestAnimFrame = (function () { return
					 window.requestAnimationFrame ||
					 window.webkitRequestAnimationFrame ||
					 window.mozRequestAnimationFrame ||
					 window.oRequestAnimationFrame ||
					 window.msRequestAnimationFrame ||
					 function(callbackFunc, element) {
					     window.setTimeout(callbackFunk, 1000/60);}});

function Pos(x, y) {
    this.x=x;
    this.y=y;
}

Pos.prototype.copy=function() {
    var p = new Pos();
    p.x = this.x;
    p.y = this.y;
    return p;
};


function Sprite() {
    this.pos = new Pos(0,0);
    this.el = $("<img>").attr("src", "")
	.css({left: this.pos.x*50 + "px",
	      top: (this.pos.y*40-40) + "px",
	      zindex: 5
	     });
}

Sprite.prototype.update = function (speed) {
    this.el.animate({left: this.pos.x*50 + "px",
		     top: this.pos.y*40 - 40 + "px"}, speed);
};


Enemy.prototype = new Sprite();
Enemy.prototype.constructor = Enemy;
function Enemy (start_x, start_y) {
    this.pos.x = start_x;
    this.pos.y = start_y;
    this.el.attr("src", "Enemy Bug.png")
	.css({left: this.pos.x*50 + "px",
	      top: (this.pos.y*40-40) + "px"
	     });

    var last_d=1;
    var last_exclude={1: 0, 0:1, 2:3, 3:2};
    this.calc_move = function () {
	var d = Math.floor(Math.random()*4);
	if(d==last_exclude[last_d]) return false;

	switch(d)
	{
	case 0:
	    this.pos.x--;
	    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
		{
		    this.pos.x++;
		    return false;
		}
	    break;
	case 1:
	    this.pos.x++;
	    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
	    {
		this.pos.x--;
		return false;
	    }
	    
	    break;
	case 2:
	    this.pos.y--;
	    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
	    {
		this.pos.y++;
		return false;
	    }
	    break;
	case 3:
	    this.pos.y++;
	    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
		{
		this.pos.y--;
		    return false;
		}

	    break;
	default:
	    break;
	}
	last_d=d;
	return true;
    };

}

Character.prototype = new Sprite();
Character.prototype.constructor = Character;
function Character (start_x, start_y) {
    this.pos.x = start_x;
    this.pos.y = start_y;
    this.el.attr("src", "Character Cat Girl.png")
	.css({left: this.pos.x*50 + "px",
	      top: (this.pos.y*40-40) + "px",
	      zindex: 10
	     });
}

Character.prototype.left = function () {
    this.pos.x--;
    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
	this.pos.x++;
}

Character.prototype.right = function () {
    this.pos.x++;
    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
	this.pos.x--;
}

Character.prototype.up = function () {
    this.pos.y--;
    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
	this.pos.y++;
}

Character.prototype.down = function () {
    this.pos.y++;
    if (board[b_ref(this.pos.x, this.pos.y)]=="s")
	this.pos.y--;
}

var char = new Character(1,1);
var board = [];

function b_ref(x, y)
{
    return y*17 + x;
}

var bomb_list=[];

var bug = new Enemy(15, 9);

$(document).ready(function() {
    console.log("Yo");
    var area = $("#game_area");
    for(var x=0; x<17; x++) {
	for(var y=0; y<11; y++) {
	    var a_lut={g: "Grass Block.png", s: "Stone Block Tall.png"};
	    var t = (x==0 || y==0 || y==10 || x==16 || x%2==0 && y%2==0) 
		? "s" : "g"; 
	    board[b_ref(x, y)]=t;

	    var i = $("<img>").attr("src", a_lut[t])
		.css({left: (x*50-1) + "px",
		      top: (y*40-10) + "px"});
	    area.append(i);
	}
    }
    
    area.append(char.el);
    area.append(bug.el);

    timer = setInterval(update, 1000/10);

    var cnt=0;
    function update() {
	if (!(cnt%5))
	{
	    while(!bug.calc_move()) {;}
	    bug.update(500);

	    cnt=1;
	}
	cnt++;
    };

    $(document).keyup(function(eo) {
	//console.log(eo.which);
    });

    $(document).keydown(function(eo) {
	switch(eo.which)
	{
	    case 32: //spc
	    event.preventDefault();

	    console.log("bomb");
	    var b_pos = char.pos.copy();
	    bomb_list.push(b_pos);
	    var bomb_i = $("<img>").attr("src", "Bomb.png")
		.css({left: b_pos.x*50 + "px",
		      top: (b_pos.y*40-20) + "px",
		      zindex: 4
		     });
	    area.append(bomb_i);

	    break;
	    case 39: //right
	    event.preventDefault();

	    char.right();
	    break;
	    case 37: //left
	    event.preventDefault();
	    
	    char.left();
	    break;

	case 38: //up
	    event.preventDefault();
	    
	    char.up();
	    break;
	    case 40: //down
	    event.preventDefault();
	    
	    char.down();
	    break
	    
	    default:
	    console.log("key " + eo.which);
	    break;
	}
	//char.move();
	char.update(250);
    });
});
