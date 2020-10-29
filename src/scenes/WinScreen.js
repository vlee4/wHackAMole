import Phaser from "phaser";

let graphics;
let cursors;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "winscreen" });
  },
  create: function () {
    cursors = this.input.keyboard.createCursorKeys();

    graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 550, 820);

    this.add.text(275, 300, "WEAR A MASK!!!", {fontSize: "50px", fill: "#255"}).setOrigin(0.5);
    this.add.text(275, 345, "Press to space or touch screen to restart").setOrigin(0.5);
  },
  update: function () {
    var pointer = this.input.activePointer;

    if (cursors.space.isDown || pointer.isDown) {
      this.scene.start("mainmenu");
    }
  },
});
