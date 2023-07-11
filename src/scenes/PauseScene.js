import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
    constructor(config) {
        super('PauseScene',config);
        this.menu = [
            {scene: 'PlayScene',text: 'Continue'},
            {scene: 'MenuScene', text: 'Exit'}
        ]
    }
   
    create() {
        super.create();
        this.createMenu(this.menu,this.setMenuEvents.bind(this));
    }
    setMenuEvents(menuItem){
        const textGameObj = menuItem.textGameObj;
        textGameObj.setInteractive()

        textGameObj.on('pointerover',()=>{
            textGameObj.setStyle({fill: "#008000"});
        })
        textGameObj.on('pointerout',()=>{
            textGameObj.setStyle({fill: "#F0F8FF"});
        })
        textGameObj.on('pointerup',()=>{
            if (menuItem.scene && menuItem.text === 'Continue'){
                this.scene.stop();
                this.scene.resume('PlayScene');
            }
            else if (menuItem.scene && menuItem.text === 'Exit'){
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        })
    }
}
export default PauseScene;