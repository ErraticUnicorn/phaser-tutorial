// We create our only state
var mainState = {
    // Here we add all the functions we need for our state
    // For this project we will just have 3
    preload: function() {
    // This function will be executed at the beginning
    // That's where we load the game's assets
        game.load.image('player', 'assets/player.png');
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
    },
    create: function() {
    // This function is called after the 'preload' function
    // Here we set up the game, display sprites, etc.
        this.player = game.add.sprite(game.width/2, game.height/2, 'player')
        this.player.anchor.setTo(0.5, 0.5);
        // Tell Phaser that the player will use the Arcade physics engine
        game.physics.arcade.enable(this.player);
        // Add vertical gravity to the player
        this.player.body.gravity.y = 500;
        this.cursor = game.input.keyboard.createCursorKeys();
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
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
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
        }
        else {
            this.player.body.velocity.x = 0;
        }
        if (this.cursor.up.isDown && this.player.body.touching.down) {
           this.player.body.velocity.y = -320;
        }
    },
    
    playerDie: function() {
        game.state.start('main');
    },
};
// We initialize Phaser
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
// And we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');