console.log("jo");
function Pos(x, y) {
    this.x=x;
    this.y=y;
    this.copy=function() {
	var p = new Pos();
	p.x = this.x;
	p.y = this.y;
	return p;
    };
}

function Enemy (start_x, start_y) {
    this.pos = new Pos(start_x, start_y);
    this.el = $("<img>").attr("src", "Enemy Bug.png")
	.css({left: this.pos.x*50 + "px",
	      top: (this.pos.y*40-40) + "px",
	      zindex: 5
	     });

    var last_d=1;
    var last_exclude={1: 0, 0:1, 2:3, 3:2};


    this.move = function ()
    {
	var d = Math.floor(Math.random()*4);
	if(d==last_exclude[last_d]) return false;

	switch(d)
	{
	case 0:
	    bug.pos.x--;
	    if (board[b_ref(bug.pos.x, bug.pos.y)]=="s")
		{
		    bug.pos.x++;
		    return false;
		}
	    break;
	case 1:
	    bug.pos.x++;
	    if (board[b_ref(bug.pos.x, bug.pos.y)]=="s")
	    {
		bug.pos.x--;
		return false;
	    }
	    
	    break;
	case 2:
	    bug.pos.y--;
	    if (board[b_ref(bug.pos.x, bug.pos.y)]=="s")
	    {
		bug.pos.y++;
		return false;
	    }
	    break;
	case 3:
	    bug.pos.y++;
	    if (board[b_ref(bug.pos.x, bug.pos.y)]=="s")
		{
		bug.pos.y--;
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

var char_pos=new Pos(1,1);
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
    
    var char_i = $("<img>").attr("src", "Character Cat Girl.png")
	.css({left: char_pos.x*50 + "px",
	      top: (char_pos.y*40-40) + "px",
	      zindex: 10
	     });
    area.append(char_i);

    area.append(bug.el);

    timer = setInterval(update, 1000/10);

    var cnt=0;
    function update() {
	if (!(cnt%5))
	{
	    while(!bug.move()) {;}
	    bug.el.animate({left: bug.pos.x*50 + "px",
			   top: bug.pos.y*40 - 40 + "px"}, 500);
	    cnt=1;
	}
	cnt++;
//	console.log(cnt);
    };

    $(document).keydown(function(eo) {
	switch(eo.which)
	{
	    case 32: //spc
	    console.log("bomb");
	    var b_pos = char_pos.copy();
	    bomb_list.push(b_pos);
	    var bomb_i = $("<img>").attr("src", "Bomb.png")
		.css({left: b_pos.x*50 + "px",
		      top: (b_pos.y*40-20) + "px",
		      zindex: 4
		     });
	    area.append(bomb_i);

	    break;
	    case 39: //right
	    char_pos.x ++;
	    if (board[b_ref(char_pos.x, char_pos.y)]=="s")
		char_pos.x--;
	    break
	    case 37: //left
	    char_pos.x --;
	    if (board[b_ref(char_pos.x, char_pos.y)]=="s")
		char_pos.x++;
	    break

	    case 38: //up
	    char_pos.y -- ;
	    if (board[b_ref(char_pos.x, char_pos.y)]=="s")
		char_pos.y ++;
	    break
	    case 40: //down
	    char_pos.y ++;
	    if (board[b_ref(char_pos.x, char_pos.y)]=="s")
	    char_pos.y--;
	    break
	    
	    default:
	    console.log("key " + eo.which);
	    break;
	}
	    char_i.animate({left: char_pos.x*50 + "px",
	      top: char_pos.y*40 - 40 + "px"}, 100);
    });

});
