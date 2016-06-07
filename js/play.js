var playState = {
    
    create: function() {
        
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        this.player = game.add.sprite(game.width/2, game.height/2, 'player')
        
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);
        this.player.anchor.setTo(0.5, 0.5);;
        // Add vertical gravity to the player
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        this.cursor = game.input.keyboard.createCursorKeys();
        // Display the coin
        this.coin = game.add.sprite(60, 140, 'coin');
        // Add Arcade physics to the coin
        game.physics.arcade.enable(this.coin);
        // Set the anchor point to its center
        this.coin.anchor.setTo(0.5, 0.5);
        // Display the score
        this.scoreLabel = game.add.text(30, 30, 'score: 0',
        { font: '18px Geo', fill: '#ffffff' });
        // Initialize the score variable
        game.global.score = 0;
        
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        this.nextEnemy = 0;
        
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setScale(2, 0, 2, 0, 800);
        this.emitter.gravity = 0;
        
        if (!game.device.desktop) {
            this.addMobileInputs();
        }
        
        game.input.keyboard.addKeyCapture(
            [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
            Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        
        if (!game.device.dekstop) {
            game.scale.onOrientationChange.add(this.orientationChange, this);
            this.rotateLabel = game.add.text(game.width/2, game.height/2, '',
            { font: '30px Arial', fill: '#fff', backgroundColor: '#000' });
            this.rotateLabel.anchor.setTo(0.5, 0.5);
            this.orientationChange();
        }
        
        this.createWorld();
    },
    
    update: function() {
    // This function is called 60 times per second
    // It contains the game's logic
        game.physics.arcade.collide(this.player, this.walls);
        this.movePlayer();
        if(!this.player.inWorld){
            this.playerDie();
        }
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin,
                                    null, this);
        // Make the enemies and walls collide
        game.physics.arcade.collide(this.enemies, this.walls);
        // Call the 'playerDie' function when the player and an enemy overlap
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,
        null, this);
        
        if (this.nextEnemy < game.time.now) {
            var start = 4000, end = 1000, score = 100;
            var delay = Math.max(
            start - (start - end) * game.global.score / score, end);
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
        
        if (!this.player.alive) {
            return;
        }
    },
    
    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;
        game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
        game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right
        game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0,
        this.walls);
        middleBottom.scale.setTo(1.5, 1);
        this.walls.setAll('body.immovable', true)
    },
    
    movePlayer: function() {
        
        if (game.input.totalActivePointers == 0) {
            this.moveLeft = false;
            this.moveRight = false;
        }
        
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        }
        
        else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) { 
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        }
       
        else {
            this.player.body.velocity.x = 0;
        }
        
        if (this.cursor.up.isDown || this.wasd.up.isDown && this.player.body.touching.down) {
            this.jumpPlayer();
        }
    },
    
    addMobileInputs: function() {
        // Add the jump button
        var jumpButton = game.add.sprite(350, 240, 'jumpButton');
        jumpButton.inputEnabled = true;
        jumpButton.alpha = 0.5;
        jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        
        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;
        
        // Add the move left button
        var leftButton = game.add.sprite(50, 240, 'leftButton');
        leftButton.inputEnabled = true;
        leftButton.alpha = 0.5;
        leftButton.events.onInputOver.add(this.setLeftTrue, this);
        leftButton.events.onInputOut.add(this.setLeftFalse, this);
        leftButton.events.onInputDown.add(this.setLeftTrue, this);
        leftButton.events.onInputUp.add(this.setLeftFalse, this);
        
        // Add the move right button
        var rightButton = game.add.sprite(130, 240, 'rightButton');
        rightButton.inputEnabled = true;
        rightButton.alpha = 0.5;
        rightButton.events.onInputOver.add(this.setRightTrue, this);
        rightButton.events.onInputOut.add(this.setRightFalse, this);
        rightButton.events.onInputDown.add(this.setRightTrue, this);
        rightButton.events.onInputUp.add(this.setRightFalse, this);
    },
    
    setLeftTrue: function() {
        this.moveLeft = true;
    },
    setLeftFalse: function() {
        this.moveLeft = false;
    },
    setRightTrue: function() {
        this.moveRight = true;
    },
    setRightFalse: function() {
        this.moveRight = false;
    },
    
    jumpPlayer: function() {
        if (this.player.body.touching.down) {
            this.player.body.velocity.y = -320;
            this.jumpSound.play();
        }
    },
    
    
    playerDie: function() {
        this.player.kill();
        
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 800, null, 15);
        
        this.deadSound.play();
        game.camera.shake(0.02, 300);
        
        game.time.events.add(1000, this.startMenu, this);
    },
    
    startMenu: function() {
        game.state.start('menu');
    },
    
    takeCoin: function(player, coin) {
        this.coin.scale.setTo(0, 0);
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
        game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100).yoyo(true).start();
        this.coinSound.play();
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.updateCoinPosition();
    },
    
    updateCoinPosition: function() {
        // Store all the possible coin positions in an array
        var coinPosition = [
        {x: 140, y: 60}, {x: 360, y: 60}, // Top row
        {x: 60, y: 140}, {x: 440, y: 140}, // Middle row
        {x: 130, y: 300}, {x: 370, y: 300} // Bottom row
        ];
        // Remove the current coin position from the array
        // Otherwise the coin could appear at the same spot twice in a row
        for (var i = 0; i < coinPosition.length; i++) {
        if (coinPosition[i].x == this.coin.x) {
        coinPosition.splice(i, 1);
        }
        }
        // Randomly select a position from the array with 'game.rnd.pick'
        var newPosition = game.rnd.pick(coinPosition);
        // Set the new position of the coin
        this.coin.reset(newPosition.x, newPosition.y);
    },
    
    addEnemy: function() {
        // Get the first dead enemy of the group
        var enemy = this.enemies.getFirstDead();
        // If there isn't any dead enemy, do nothing
        if (!enemy) {
            return;
        }
        // Initialize the enemy
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },
    
    orientationChange: function() {
        if (game.scale.isPortrait) {
            game.paused = true;
            this.rotateLabel.text = 'rotate your device in landscape';
        }
        else {
            game.paused = false;
            this.rotateLabel.text = '';
        }
    },
};