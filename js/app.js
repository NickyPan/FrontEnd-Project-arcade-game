//通用角色
var Role = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

Role.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 这是我们的玩家要躲避的敌人
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png';
    Role.call(this, x, y, this.sprite);
    this.speed = this.randomSpeed();
};

Enemy.prototype = Object.create(Role.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
    if (this.x < 500) {
        this.x += dt * this.speed;
    } else {
        this.x = 0;
    }
    if ( Math.abs(this.x - player.x) < 30 && Math.abs(this.y - player.y) < 30 ) {
        gameOver();
    }
};

//每次游戏开始后随机获取速度（100-400）
Enemy.prototype.randomSpeed = function (speedNum) {
    var speed = Math.round(Math.random()*300 + 100);
    return speed;
}

//这是玩家
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    Role.call(this, x, y, this.sprite);
};

Player.prototype = Object.create(Role.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    if ( player.y < 50) {
        gameSuccess();
        resetPlayer();
    }
};

//控制玩家移动，并且保证不会移出画面
Player.prototype.handleInput = function(move) {
    switch (move) {
      case 'left':
        if (this.x > 0) {
          this.x -= 100;
        }
        break;
      case 'up':
        if (this.y > 0) {
          this.y -= 85;
        }
        break;
      case 'right':
        if (this.x > 350) {
          return;
        }
        this.x += 100;
        break;
      case 'down':
        if (this.y < 400) {
          this.y += 85;
        }
        break;
      default:

    }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

var allEnemies = [ new Enemy(10, 60), new Enemy(50, 145), new Enemy(20, 225) ];
var player =  new Player(200, 400);

//重置玩家的位置和计时器
var resetPlayer = function () {
    player.x = 200;
    player.y = 400;
    passedTime = 0;
}

//game over
var gameOver = function () {
    if (confirm("oops，you are dead，restart？") == true) {
        resetPlayer();
    } else {
        if (confirm("离开后当前网页将关闭，确定离开？") == true) {
            close();
        } else {
            resetPlayer();
        }
    }
}

//game success
var gameSuccess = function() {
    //记录当前通关的时间
    var currentdate = new Date();
    var datetime = " " + currentdate.getFullYear() + "-"
            + (currentdate.getMonth()+1)  + "-"
            + currentdate.getDate() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    //允许玩家输入姓名
    var person = prompt("Please enter your name:", "");
    if (person == null || person == "") {
        person = "unknown";
    }
    var textContainer = document.createElement("p");
    var text = document.createTextNode(person + '  /  ' + passedTime + 's  /  ' + datetime)
    textContainer.appendChild(text);
    document.body.appendChild(textContainer);
}

//timer
var passedTime = 0;
var timer = setInterval(function() {
    passedTime ++
    document.getElementById("timer").innerHTML = passedTime + "s ";
}, 1000);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
