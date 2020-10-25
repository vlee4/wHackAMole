import Phaser from "phaser";

let graphics;
let cursors;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "mainmenu" });
  },
  create: function () {
    cursors = this.input.keyboard.createCursorKeys();

    graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 800, 600);

    this.add.text(270, 300, "Press space to start.");
    this.add.text(270, 315, "Move with up, down, left, right.");
    this.add.text(270, 330, "Press spacebar to brake.");
    this.add.text(270, 345, "Collect all the stars to win.");
  },
  update: function () {

    var pointer = this.input.activePointer;

    if (cursors.space.isDown||pointer.isDown) {
      this.scene.start("game");
    }
  },
});
