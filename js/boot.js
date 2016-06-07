var bootState = {
    preload: function () {
        // Load the image
        game.load.image('progressBar', 'assets/progressBar.png');
    },
    create: function() {
        // Set some game settings
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
        // Start the load state
        
        // If the device is not a desktop (so it's a mobile device)
if (!game.device.desktop) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setMinMax(game.width/2, game.height/2,
        game.width*2, game.height*2);
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        document.body.style.backgroundColor = '#3498db';
    }
        game.state.start('load');
    }
};