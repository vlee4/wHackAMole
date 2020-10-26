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

    this.add.text(275, 300, "You win! Press space to restart.").setOrigin(0.5);
  },
  update: function () {
    if (cursors.space.isDown) {
      this.scene.start("mainmenu");
    }
  },
});
