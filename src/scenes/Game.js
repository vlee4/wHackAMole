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
let timer, timeEvent;
let gameOver = true;
let initialTime = 30, curTime = initialTime;
let killingTime;


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
    gameOver = false;
    //Creating game elements
    this.add.image(275, 410, "background"); //note: All Phaser3 Game Obj are positioned based on their center by default, and can be changed to have the drawing position set to the top-left by appending .setOrigin(0,0) to this line

    //Score keeping
    scoreText = this.add.text(20,20, "Score: 0", {fontSize: "30px", fill: "#000"})

    //Kills virus sprite
    const killSprite = function(virus){
      let killedVirus = virus;
          killedVirus.anims.play("hit");
          setTimeout(function(){
            killedVirus.disableBody(true, true);
          }, 100)
    }

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

    //Create Viruses
    viruses = this.physics.add.staticGroup({
      key: "virus",
      repeat: 8,
      setScale: { x: 0.75, y: 0.75 },
      gridAlign: {width: 3, height: 3, cellWidth: 160, cellHeight: 150, x: 105, y: 260}
    })
    //Helps generate random num of viruses
    let randomNum = Math.floor(Math.random()*(8-1)+1);
    for (let i = 0; i < randomNum; i++) {
      let reaper = Math.floor(Math.random()*(8-1)+1);
      viruses.children.entries[reaper].disableBody(true,true);
    }

    this.time.addEvent({delay: 1000, callback: killSprite, args: [viruses.children.entries[randomNum]], callbackScope: this, loop: true })

    // while(gameOver && curTime>0){
    //   setTimeout(function(){
    //     viruses.children.entries[randomNum].disableBody(true, true)
    //   }, 100)
    // }

    //Create animations
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


    //Making viruses interactive
    Phaser.Actions.Call(viruses.getChildren(), function(virus){
      virus.setInteractive();
      //When virus is clicked it is killed
      virus.on("pointerdown", function(pointer){
        killSprite(virus);
        //Update score
        score++;
        scoreText.setText(`Score: ${score}`)
      }, this);
    }, this);



  },
  update: function () {
    function getRandom(max, min=0){
      return Math.floor(Math.random()*(max-min)+min)
    }

    if((viruses.countActive())<=3){
      let dead = viruses.getChildren().filter(virus => !virus.active);
      let randomIdx = getRandom(dead.length);
      let chosen = dead[randomIdx];
      console.log("CHOSEN", chosen)
      chosen.anims.play("neutral");
      chosen.enableBody(false, chosen.x, chosen.y, true, true)
    }

    // while(!gameOver){
    //  let alive = viruses.getChildren().filter(virus => virus.active);
    //   setTimeout(function(){
    //     alive[getRandom(alive.length)].disableBody(true, true);
    //   }, 1000)
    // }

    if(curTime==0){
      this.scene.start("winscreen");
      curTime = initialTime;
      score = 0;
      gameOver = true;
    }
    //TODO: find way to kill random viruses and make them reappear randomly

    // let randomVirus = viruses.getRandomExists();
    // console.log("CHILDREN",viruses.getChildren())

  },
});
