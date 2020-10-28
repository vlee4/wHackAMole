import Phaser from "phaser";
import mp3 from "../assets/Orbital Colossus.mp3";
import background from "../assets/background.png";
import tiles from "../assets/scifi_platformTiles_32x32.png";
import virus from "../assets/CoronaSpriteSheet.png";
import star from "../assets/star.png";
import { accelerate, decelerate } from "../utils";

let box;
let cursors;
let pointer;
var score = 0;
var scoreText;
let gameOver = false;


export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "game" });
    window.GAME = this;
  },
  preload: function preload() {
    this.load.image("background", background);
    this.load.spritesheet("virus", virus, { frameWidth: 208, frameHeight: 195 })

  },
  create: function create() {

    this.add.image(275, 410, "background"); //note: All Phaser3 Game Obj are positioned based on their center by default, and can be changed to have the drawing position set to the top-left by appending .setOrigin(0,0) to this line

    //Score keeping
    scoreText = this.add.text(20,20, "Score: 0", {fontSize: "30px", fill: "#000"})

    // stars.children.iterate(function (child) {
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //   child.setVelocityX(150 - Math.random() * 300);
    //   child.setVelocityY(150 - Math.random() * 300);
    //   child.setBounce(1, 1);
    //   child.setCollideWorldBounds(true);
    // });

    const viruses = this.physics.add.staticGroup({
      key: "virus",
      repeat: 8,
      setScale: { x: 0.75, y: 0.75 },
      gridAlign: {width: 3, height: 3, cellWidth: 160, cellHeight: 150, x: 105, y: 260}
    })
    console.log("VIRUSES",viruses)

    //Making viruses interactive
    Phaser.Actions.Call(viruses.getChildren(), function(virus){
      virus.setInteractive();
      virus.on("pointerdown", function(pointer){
        //Destroy virus
        virus.destroy();
        //Add to score
        score++;
        console.log("SCORE UPDATE", score)
        scoreText.setText(`Score: ${score}`)

        const virusesLeft = viruses.countActive();
        console.log("Viruses left", virusesLeft)
        if(virusesLeft==0){
          this.scene.start("winscreen");
        }
      }, this);
    }, this);


  },
  update: function () {
    var pointer = this.input.activePointer;
  },
});
