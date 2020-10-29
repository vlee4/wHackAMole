import Phaser from "phaser";
import mp3 from "../assets/Orbital Colossus.mp3";
import background from "../assets/background.png";
import tiles from "../assets/scifi_platformTiles_32x32.png";
import virus from "../assets/CoronaSpriteSheet.png";
import star from "../assets/star.png";
import { accelerate, decelerate } from "../utils";


var score = 0;
var scoreText;
var viruses;
let disabledBodies = [];
// let gameOver = false;
let timer, timeEvent;
let initialTime = 30, curTime = initialTime;
// let tracker = {
//   0: false,
//   1: false,
//   2: false,
//   3: false,
//   4: false,
//   5: false,
//   6: false,
//   7: false,
//   8: false,
// }


export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "game" });
    window.GAME = this;
  },
  preload: function preload() {
    this.load.image("background", background);
    this.load.spritesheet("virus", virus, { frameWidth: 210, frameHeight: 195 })

  },
  create: function create() {

    this.add.image(275, 410, "background"); //note: All Phaser3 Game Obj are positioned based on their center by default, and can be changed to have the drawing position set to the top-left by appending .setOrigin(0,0) to this line

    //Score keeping
    scoreText = this.add.text(20,20, "Score: 0", {fontSize: "30px", fill: "#000"})
    //Timer
    function formatTime(seconds){
      let min = Math.floor(seconds/60);
      let sec = seconds%60;
      sec = sec.toString().padStart(2, "0");
      return `${min}:${sec}`;
    }
    timer = this.add.text(340, 20, `Timer: ${formatTime(curTime)}`, {fontSize: "30px", fill: "#000"});

    function decreaseTime(){
      curTime--;
      timer.setText(`Time:${formatTime(curTime)}`)
    }
    timeEvent = this.time.addEvent({delay: 1000, callback: decreaseTime, callbackScope: this, loop: true})


    // stars.children.iterate(function (child) {
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //   child.setVelocityX(150 - Math.random() * 300);
    //   child.setVelocityY(150 - Math.random() * 300);
    //   child.setBounce(1, 1);
    //   child.setCollideWorldBounds(true);
    // });

    viruses = this.physics.add.staticGroup({
      key: "virus",
      repeat: 8,
      setScale: { x: 0.75, y: 0.75 },
      gridAlign: {width: 3, height: 3, cellWidth: 160, cellHeight: 150, x: 105, y: 260}
    })
    let randomNum = Math.floor(Math.random()*(8-1)+1);
    for (let i = 0; i < randomNum; i++) {
      let reaper = Math.floor(Math.random()*(8-1)+1);
      viruses.children.entries[reaper].disableBody(true,true);
    }

    console.log("GET CHILDREN",viruses.getChildren())
    console.log("CHILDREN", viruses.children.entries)

    this.anims.create({
      key:"neutral",
      frames: [{key: "virus", frame: 0}],
      frameRate: 20,
    })

    this.anims.create({
      key:"hit",
      frames: [{key: "virus", frame: 6, duration: 100}],
      frameRate: 20,
      duration: 100
    })

    // console.log("VIRUSES",viruses)

    const killSprite = function(virus){
      let killedVirus = virus;
          killedVirus.anims.play("hit");
          // console.log("killed virus", killedVirus)
          setTimeout(function(){
            killedVirus.disableBody(true, true);
            disabledBodies.push(killedVirus);
          }, 100)
          // console.log("disabled ones", disabledBodies)

    }

    //Making viruses interactive
    Phaser.Actions.Call(viruses.getChildren(), function(virus){
      virus.setInteractive();
      virus.on("pointerdown", function(pointer){
        killSprite(virus);
        //Add to score
        score++;
        // console.log("SCORE UPDATE", score)
        scoreText.setText(`Score: ${score}`)

        const virusesLeft = viruses.countActive();
        // console.log("Viruses left", virusesLeft)
        if(virusesLeft==0){
          this.scene.start("winscreen");
        }
      }, this);
    }, this);



  },
  update: function () {
    // var pointer = this.input.activePointer;
    function getRandom(max, min=0){
      return Math.floor(Math.random()*(max-min)+min)
    }

    if(disabledBodies.length &&(viruses.countActive())<=3){
      let disabledLength = disabledBodies.length;
      let randomIdx = getRandom(disabledLength)
      // console.log("reviving",disabledBodies[randomIdx])
      let chosen = disabledBodies.splice(randomIdx, 1)[0];
      chosen.anims.play("neutral");
      chosen.enableBody(true, chosen.x, chosen.y, true, true)
    }

    if(curTime==0){
      this.scene.start("winscreen");
      curTime = initialTime;
      score = 0;
      disabledBodies = [];
    }
    //TODO: find way to kill random viruses and make them reappear randomly
    //TODO: find way to track if there's a virus at x,y position
    // let alive = viruses.getChildren().filter(virus => virus.active)
    // console.log("alive", alive)


    // let randomVirus = viruses.getRandomExists();
    // console.log("CHILDREN",viruses.getChildren())

  },
});
