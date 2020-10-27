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

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "game" });
    window.GAME = this;
  },
  preload: function preload() {
    this.load.image("background", background);

    this.load.spritesheet("tiles", tiles, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("virus", virus, { frameWidth: 208, frameHeight: 195 })

    this.load.image("star", star);
  },
  create: function create() {

    this.add.image(275, 410, "background"); //note: All Phaser3 Game Obj are positioned based on their center by default, and can be changed to have the drawing position set to the top-left by appending .setOrigin(0,0) to this line

    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setScale: { x: 0.2, y: 0.2 },
      setXY: { x: 400, y: 300 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setVelocityX(150 - Math.random() * 300);
      child.setVelocityY(150 - Math.random() * 300);
      child.setBounce(1, 1);
      child.setCollideWorldBounds(true);
    });

    const viruses = this.physics.add.staticGroup({
      key: "virus",
      setScale: { x: 0.75, y: 0.75 },
      setXY: { x: 300, y: 300 }
    })

    // viruses.children.iterate(function (child) {
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //   child.setVelocityX(150 - Math.random() * 300);
    //   child.setVelocityY(150 - Math.random() * 300);
    //   child.setBounce(1, 1);
    //   child.setCollideWorldBounds(true);
    // });
    // viruses.setInteractive();

    cursors = this.input.keyboard.createCursorKeys();

    box = this.physics.add.image(400, 100, "tiles", 15);

    const processCollision = (box, item) => {
      item.destroy();
      const starsLeft = stars.countActive();
      const virusesLeft = viruses.countActive();
      if (starsLeft === 0 && virusesLeft === 0) {
        this.scene.start("winscreen");
      }
    };

    this.physics.add.collider(stars, box, processCollision, null, this);
    this.physics.add.collider(viruses, box, processCollision, null, this);

    const onObjectClicked = (pointer, gameObject) =>{
      console.log("CLICKED!!!")
    }

    this.input.on("pointerdown", onObjectClicked);

    //  this.input.on("pointerup", function(pointer){
    //   if(pointer.leftButtonReleased()||pointer.wasTouch){
    //     console.log("Here it goes again!")
    //     viruses.killAndHide();
    //   }
    // })

    box.setBounce(1, 1);
    box.setCollideWorldBounds(true);
  },
  update: function () {
    var pointer = this.input.activePointer;

    // if(pointer.isDown){
    //   console.log("IN UPDATE!")
    // }

    const { velocity } = box.body;

    if (cursors.space.isDown) {
      const x = decelerate(velocity.x);
      const y = decelerate(velocity.y);
      box.setVelocity(x, y);
    }

    if (cursors.up.isDown) box.setVelocityY(accelerate(velocity.y, -1));
    if (cursors.right.isDown) box.setVelocityX(accelerate(velocity.x, 1));
    if (cursors.down.isDown) box.setVelocityY(accelerate(velocity.y, 1));
    if (cursors.left.isDown) box.setVelocityX(accelerate(velocity.x, -1));
  },
});
