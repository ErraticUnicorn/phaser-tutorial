var menuState = {
    create: function() {
        game.add.image(0, 0, 'background');
        
        var nameLabel = game.add.text(game.width/2, -50, 
                                      'Super Coin Box', { font: '50px Geo', fill: '#ffffff'});
        nameLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(nameLabel).to({y: 80}, 1000)
        .easing(Phaser.Easing.Bounce.Out).start(); 
        
        if (!localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', 0);
        }
        
        if (game.global.score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', game.global.score);
        }
        var text = 'score: ' + game.global.score + '\nbest score: ' +localStorage.getItem('bestScore');
        var scoreLabel = game.add.text(game.width/2, game.height/2, text,
                                     { font: '25px Geo', fill: '#ffffff', align: 'center'});
        scoreLabel.anchor.setTo(0.5, 0.5);
        
        var text;
        if (game.device.desktop) {
            text = 'press the up arrow key to start';
        }
        else {
            text = 'touch the screen to start';
        }
        
        var startLabel = game.add.text(game.width/2, game.height-   80, text, { font: '25px Geo', fill: '#ffffff' });
        
        game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();
        
        startLabel.anchor.setTo(0.5, 0.5);
        
        if (!game.device.desktop) {
            game.input.onDown.add(this.start, this);
        }
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start, this);
        
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
    
    toggleSound: function() {
        game.sound.mute = !game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
    
    start: function() {
        if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
            return;
        }
        game.state.start('play');
    },
}