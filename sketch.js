var gameState = "story";
var playButton, playButtonImage;
var ground,ambulance,invisibleGround;
var rockGroup, cloudGroup;
var gameOver, gameOverImage, reset, resetImage;
var score = 0;
var patientGroup;
var rand;
var groundImage;
var backGround, backGroundImage,bg;

function preload() {
  groundImage = loadImage("ground-1.png");
  gameOverImage = loadImage("game over.png");
  resetImage = loadImage("restart.png");
  playButtonImage = loadImage("play button.png");
  cloudImage = loadImage("cloud.png");
  rockImage = loadImage("rock.png");
  obstacleImage=loadImage("obstacle1.png");
  virusImage=loadImage("Virus.jpg");
  hospitalImage=loadImage("hospital.jpg");
  ambulanceImage=loadImage("ambulance.png");
  patient1=loadImage("patient1.jpg");
  patient2=loadImage("patient2.jpg");
  patient3=loadImage("patient3.png");
  patient4=loadImage("patient4.jpg");
}

function setup() {
  createCanvas(1000, 600);
  
  backGround = createSprite(0, 0, 1, 1);
  backGround.addImage("background",backGroundImage);
  backGround.scale = 1.2;
  
  ground = createSprite(700, 575, 1500, 70);
  ground.addImage("surface",groundImage);
  ground.scale = 0.4;
  
  playButton = createSprite(500, 400, 20, 20);
  playButton.addImage("play",playButtonImage);
  playButton.scale = 0.3;
  
  ambulance = createSprite(200, 540, 10, 10);
  ambulance.addAnimation("Main", ambulanceImage);
  ambulance.scale = 2;
  ambulance.setCollider("rectangle", 0, 0, 57.5, 56.5);
  ambulance.visible = false;
  
  invisibleGround = createSprite(300, 550, 1500, 10);
  invisibleGround.visible = false;
  
  patientGroup = new Group();
  hospitalGroup = new Group();
  obstacleGroup=new Group();
  rockGroup = new Group();
  virusGroup = new Group();
  cloudGroup = new Group();
  
  gameOver = createSprite(500, 200, 20, 20);
  gameOver.addImage("gameover",gameOverImage);
  gameOver.visible = false;
  
  reset = createSprite(500, 400, 20, 20);
  reset.addImage("restart",resetImage);
  reset.visible = false;
  reset.scale = 0.3
}

function draw() {
  background (backGroundImage);
  
  ambulance.collide(invisibleGround)
  
  if (gameState === "story") {
    story();
    
    if (mousePressedOver(playButton)) {
      gameState = "play";
    }
  }
  
  if (gameState === "play") {
    backGround.visible = true;
    backGround.velocityX = -6;
    playButton.visible = false;
    ambulance.visible = true;
    
    ground.visible = true;
    reset.visible = false;
    gameOver.visible = false;
    
    spawn();
    spawnObstacles();
    
    if (backGround.x < 0) {
      backGround.x = backGround.width / 2;
    }
    
    if (keyDown("space") && ambulance.y > 484) {
      ambulance.velocityY = -15;
    }
    
    if (ambulance.isTouching(virusGroup) || ambulance.isTouching(obstacleGroup) || ambulance.isTouching(rockGroup) ) {
      gameState = "end";
      ambulance.velocityY = 0;
    }
    
    if (ambulance.isTouching(patientGroup)) {
      patientGroup.destroyEach();
      score += 1;
    }
  }
  
  if (gameState === "end") {
    backGround.velocityX = 0;
    
    ambulance.velocityX = 0;
    ambulance.velocityY = 0;
    
    ground.visible = true;

    cloudGroup.setVelocityXEach(0);
    rockGroup.setVelocityXEach(0);
    virusGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    hospitalGroup.setVelocityXEach(0);
    patientGroup.setVelocityXEach(0);
    
    cloudGroup.setVelocityYEach(0);
    rockGroup.setVelocityYEach(0);
    virusGroup.setVelocityYEach(0);
    obstacleGroup.setVelocityYEach(0);
    hospitalGroup.setVelocityYEach(0);
    patientGroup.setVelocityYEach(0);
    
    cloudGroup.setLifetimeEach(-1);
    rockGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    virusGroup.setLifetimeEach(-1);
    hospitalGroup.setLifetimeEach(-1);
    patientGroup.setLifetimeEach(-1);
    
    reset.visible = true;
    gameOver.visible = true;
    
    if (mousePressedOver(reset)) {
      rockGroup.destroyEach();
      cloudGroup.destroyEach();
      virusGroup.destroyEach();
      obstacleGroup.destroyEach();
      hospitalGroup.destroyEach();
      cloudGroup.destroyEach();
      patientGroup.destroyEach();
      gameState = "play";
      score = 0;
    }
  }
  
  ambulance.velocityY = ambulance.velocityY + 0.5;  
  
  drawSprites();
  textSize(15)
  stroke("yellow");
  fill("black");
  text("SCORE: " + score, 10, 80);
}

function story() {
  playButton.visible = true;
  backGround.visible = true;
}

function control() {
  playButton.visible = false;

  fill("black")
  stroke("black")
  textSize(30);
  text("CONTROLS", 450, 100);
  text("PRESS SPACE TO JUMP", 390, 200);
  text("PRESS 'b' TO GO BACK", 10, 50);
  
  if (keyDown("b")) {
    gameState = "story";
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    hospital = createSprite(1100, Math.round(random(20, 250)), 20, 20);
    hospital.velocityX = -6;
    hospital.addImage("sickbay",hospitalImage);
    hospital.lifetime = 300;
    hospital.scale = 0.2;
    hospitalGroup.add(hospital);
  }
  
  if (frameCount % 160 === 0) {
    cloud = createSprite(1100, Math.round(random(20, 250)), 20, 20);
    cloud.velocityX = -6;
    cloud.addImage("clouds",cloudImage);
    cloud.lifetime = 300;
    cloud.scale = 0.2;
    ambulance.depth = cloud.depth;
    ambulance.depth = cloud.depth + 1;
    cloudGroup.add(cloud);
  }
  
  if (frameCount % 270 === 0) {
    patient = createSprite(1100, Math.round(random(300, ambulance.y)), 20, 20);
    var patients=Math.round(random(1,4));
    switch(patients){
      case 1: patient.addImage(patient1);
      break;
      case 2: patient.addImage(patient2);
      break;
      case 3: patient.addImage(patient3);
      break;
      case 4: patient.addImage(patient4);
      break;
    }
    patient.velocityX = -6;
    patient.scale = 0.2;
    patientGroup.add(patient);
  }  
}

function spawn() {
  if (frameCount % 400 === 0) {
    rand = Math.round(random(1, 3));
    if (rand === 1) {
      virus = createSprite(1100, 0, 20, 20);
      virus.addImage("corona",virusImage);
        virus.lifetime = 300;
        virus.velocityX  = -14;
        virus.setCollider("rectangle", 0, 0, virus.width - 10, virus.height - 10);
        virusGroup.add(virus);
    }
    
    if (rand === 2) {
        rock = createSprite(1100, invisibleGround.y - 30, 20, 20);
        rock.velocityX = -7;
        rock.addImage("rocks",rockImage);
        rock.lifetime = 300;
        rock.setCollider("rectangle", 0, 0, rock.width - 10, rock.height - 10);
        rockGroup.add(rock);
    }   

    if (rand === 3) {
      obstacle = createSprite(1100, 0, 20, 20);
      obstacle.addImage("obstacles",obstacleImage);
      obstacle.lifetime=300;
      obstacle.velocityX = -14;
      obstacle.setCollider("rectangle", 0, 0, obstacle.width - 10, obstacle.height - 10);
      obstacleGroup.add(obstacle);
    }
  }
}


async function getBackgroundImg(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = response.json();
  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  if(hour<=0600 && hour>=1900){
      bg = "the background.png";
  }
  else{
      bg = "HotAirBallon-01.png";
  }

  backGroundImage = loadImage(bg);
}