import BaseScene from "./BaseScene";


const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);
        this.isGamePaused = false;
        this.flapVelocity = 250;
        this.score = 0;
        this.scoreText = 0;
        this.pipeHorizontalDistance = 0;

        this.currentDifficulty = 'easy';
        this.difficulties = {
            'easy': {
                pipeHorizontalDistanceRange: [400, 450],
                pipeVerticalDistanceRange: [200, 250]
            },
            'medium': {
                pipeHorizontalDistanceRange: [300, 350],
                pipeVerticalDistanceRange: [150, 200]
            },
            'hard': {
                pipeHorizontalDistanceRange: [250, 310],
                pipeVerticalDistanceRange: [120, 150]
            }
        }
    }

    // Loading assets like images, music , animation etc
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('birdSprite', 'assets/birdSprite.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pause', 'assets/pause.png');
    }

    create() {
        this.currentDifficulty = 'easy';
        super.create();
        this.createBird();
        this.createPipes();
        this.createCollider();
        this.createScore();
        this.createPause();
        this.listenTOEvents();
        this.handleInput();
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNames('birdSprite', { start: 8, end: 16 }),
            frameRate: 8,
            repeat:-1
        })
        this.bird.play('fly')
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }
    listenTOEvents() {
        if (this.pauseEvent) { return }

        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3
            this.countDownText = this.add.text(...this.screenCenter, 'Fly in :' + this.initialTime, this.fontOptions).setOrigin(0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                loop: true,
                callbackScope: this
            })
        })
    }
    countDown() {
        this.initialTime--;
        this.countDownText.setText('Fly in: ' + this.initialTime);
        if (this.initialTime <= 0) {
            this.isGamePaused = false;
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }
    creatBG() {
        this.add.image(0, 0, 'sky').setOrigin(0);
    }
    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'birdSprite')
            .setOrigin(0)
            .setScale(3)
            .setFlipX(true)
            this.bird.setBodySize(this.bird.width-1,this.bird.height-8);
        this.bird.body.gravity.y = 400;
        this.bird.body.setCollideWorldBounds(true);
    }
    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            const upperPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1)
            const lowerPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);

            this.placePipe(upperPipe, lowerPipe)
        }

        this.pipes.setVelocityX(-200);
    }
    createCollider() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }
    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('highScore');
        this.scoreText = this.add.text(16, 16, `Score ${0}`, { fontSize: "32px", fill: "#00ff00" });
        this.add.text(16, 52, `Best Score ${bestScore || 0}`, { fontSize: "18px", fill: "#00000" });

    }
    createPause() {
        this.isGamePaused = false;

        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
            .setScale(3)
            .setOrigin(1)
            .setInteractive();

        pauseButton.on('pointerdown', () => {
            this.isGamePaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        })
    }
    handleInput() {
        this.input.on('pointerdown', this.flap, this);
        let spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', this.flap, this);
    }
    checkGameStatus() {
        if (this.bird.getBounds().bottom <= 0 || this.bird.y >= this.config.height) {
            this.gameOver();
        }

    }
    placePipe(uPipe, lPipe) {
        const difficulty = this.difficulties[this.currentDifficulty];
        const rightMostX = this.getRightMostPipe();
        const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);

        uPipe.x = rightMostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;

        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance
    }

    recyclePipes() {
        let tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.placePipe(...tempPipes);
                    this.increaseScore();
                    this.saveBestScore();
                    this.increaseDifficulty();
                }
            }
        })
    }
    increaseDifficulty() {
        if (this.score === 1) {
            this.currentDifficulty = 'easy';
        }
        else if (this.score >= 5) {
            this.currentDifficulty = 'medium';
        }
        else if (this.score >= 15){
            this.currentDifficulty = 'hard';
        }
    }

    getRightMostPipe() {
        let rightMostX = 0;

        this.pipes.getChildren().forEach(function (pipe) {
            rightMostX = Math.max(pipe.x, rightMostX);
        })
        return rightMostX;
    }


    gameOver() {
        // this.bird.x = this.config.startPosition.x;
        // this.bird.y = this.config.startPosition.y;
        // this.bird.body.velocity.y = 0;
        this.physics.pause();
        this.bird.setTint(0XFF4527);
        this.saveBestScore();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        })
    }
    saveBestScore() {
        const bestScoreText = localStorage.getItem('highScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if (!bestScore || this.score > bestScore) {
            localStorage.setItem('highScore', this.score);
        }
    }

    flap() {
        if (this.isGamePaused) {
            return
        }
        this.bird.body.velocity.y = -this.flapVelocity;
    }
    increaseScore() {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}

export default PlayScene;