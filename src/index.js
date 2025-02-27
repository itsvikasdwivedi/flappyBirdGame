
import Phaser, { Scene } from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from './scenes/MenuScene';
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";
import PreloadScene from "./scenes/PreloadScene";
const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 }

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    }
  }, scene: initScenes(),
};


new Phaser.Game(config);