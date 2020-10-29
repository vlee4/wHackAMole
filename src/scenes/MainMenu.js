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

    this.add.text(275, 315, "Press space/touch screen to start.").setOrigin(0.5);
    this.add.text(275, 330, "Click/touch viruses to kill them.").setOrigin(0.5);
    this.add.text(275, 345, "Kill as many as possible before time runs out").setOrigin(0.5);
  },
  update: function () {

    var pointer = this.input.activePointer;

    if (cursors.space.isDown || pointer.isDown) {
      this.scene.start("game");
    }
  },
});
