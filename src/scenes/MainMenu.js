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
    graphics.fillRect(0, 0, 550, 820);

    this.add.text(275, 300, "Press space to start.").setOrigin(0.5);
    this.add.text(275, 315, "Move with up, down, left, right.").setOrigin(0.5);
    this.add.text(275, 330, "Press spacebar to brake.").setOrigin(0.5);
    this.add.text(275, 345, "Collect all the stars to win.").setOrigin(0.5);
  },
  update: function () {

    var pointer = this.input.activePointer;

    if (cursors.space.isDown || pointer.isDown) {
      this.scene.start("game");
    }
  },
});
