import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
    constructor(config) {
        super('MenuScene',config);
        this.menu= [
            {scene: 'PlayScene',text: 'Play'},
            {scene: 'ScoreScene',text:'High Score'},
            {scene: null, text: "Exit"}
        ]
    }
   
    create() {
        super.create();
        this.createMenu(this.menu,this.setMenuEvents.bind(this));
    }
    setMenuEvents(menuItem){
        const textGameObj = menuItem.textGameObj
        textGameObj.setInteractive()

        textGameObj.on('pointerover',()=>{
            textGameObj.setStyle({fill: "#008000"});
        })
        textGameObj.on('pointerout',()=>{
            textGameObj.setStyle({fill: "#F0F8FF"});
        })
        textGameObj.on('pointerup',()=>{
            menuItem.scene && this.scene.start(menuItem.scene);
            if(menuItem.text === 'Exit'){
                this.game.destroy(true);
                alert("Thanks For Playing")
            }
        })

    }
    
}
export default MenuScene;