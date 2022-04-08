import * as Phaser from "phaser";
export class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.setBaseURL("http://labs.phaser.io");

    this.load.image(ImageNames.Sky, "assets/skies/space3.png");
    this.load.image(ImageNames.Logo, "assets/sprites/phaser3-logo.png");
    this.load.image(ImageNames.RedParticle, "assets/particles/red.png");
  }

  create() {
    this.add.image(400, 300, ImageNames.Sky);

    const emitter = this.createEmitter(ImageNames.RedParticle);
    const logo = new BouncingLogo(this, 400, 100, ImageNames.Logo);

    emitter.startFollow(logo.display);
  }

  private createEmitter(textureName: string) {
    const particles = this.add.particles(textureName);

    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    return emitter;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [new HelloWorldScene()],
  dom: {
    createContainer: true,
  },
  parent: "app",
};

export class GameBoard extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
window.onload = () => {
  var game = new GameBoard(config);
};
enum ImageNames {
  Sky = "sky",
  Logo = "logo",
  RedParticle = "red_particle",
}
export class BouncingLogo {
  private image: Phaser.Physics.Arcade.Image;

  get display() {
    return this.image;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.image = scene.physics.add.image(x, y, texture);

    this.initialize();
  }

  private initialize() {
    this.image.setVelocity(100, 200);
    this.image.setBounce(1, 1);
    this.image.setCollideWorldBounds(true);
  }
}

export default new Phaser.Game(config);
