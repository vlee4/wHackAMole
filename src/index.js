import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";
import Game from "./scenes/Game";
import WinScreen from "./scenes/WinScreen";

var config = {
  type: Phaser.AUTO,
  width: 550,
  height: 820,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
    },
  },
  parent: "gameCanvas",
  scene: [MainMenu, Game, WinScreen],
};

var game = new Phaser.Game(config); //loads the game with the config's specs
