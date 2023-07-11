import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key)
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];
        this.fontSize = 34;
        this.lineHeight = 42;
        this.fontOptions = { fontSize: `${this.fontSize}px`, fill: '#fff' };
    }
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('back', 'assets/back.png');
    }
    create() {
        this.add.image(0, 0, 'sky').setOrigin(0);
        if (this.config.canGoBack) {
            const backBtn = this.add.image(this.config.width - 10, this.config.height - 10, 'back').setInteractive().setOrigin(2).setScale(2);
            backBtn.on('pointerup',()=>{
                this.scene.start('MenuScene');
            })
        }
    }
    createMenu(menu, setMenuEvents) {
        let lastMenuPositionY = 0;

        menu.forEach((menuItem) => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
            menuItem.textGameObj = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
            lastMenuPositionY += this.lineHeight;
            setMenuEvents(menuItem)
        })
    }
    update() {

    }
}
export default BaseScene;