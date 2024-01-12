import { Curve, CurveSet, Entity } from "playcanvas";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class MergeEffect extends Entity {
  constructor() {
    super("");
    this._initParticle();
  }

  _initParticle() {
    this.star1 = new Entity();
    this.addChild(this.star1);
    this.star2 = new Entity();
    this.addChild(this.star2);
    this.star3 = new Entity();
    this.addChild(this.star3);
    this.star4 = new Entity();
    this.addChild(this.star4);

    this.cloud1 = new Entity();
    this.addChild(this.cloud1);
    this.cloud2 = new Entity();
    this.addChild(this.cloud2);
    this.cloud3 = new Entity();
    this.addChild(this.cloud3);
    this.cloud4 = new Entity();
    this.addChild(this.cloud4);

    let texStar = AssetLoader.getAssetByKey("tex_star").resource;
    let texCloud = AssetLoader.getAssetByKey("tex_cloud").resource;

    let localVelocityGraph = new CurveSet([
      [0, 10, 0.01, 1.5, 0.5, 0.2, 1, 0.05],
      [0, 10, 0.01, 1.5, 0.5, 0.2, 0.6, -0.1, 1, -0.2],
      [0, 10, 0.01, 1.5, 0.5, 0.2, 0.6, 0.1, 1, 0.2],
    ]);

    let localVelocityGraph2 = new CurveSet([
      [0, -10, 0.01, -1.5, 0.5, -0.2, 1, -0.05],
      [0, -10, 0.01, -1.5, 0.5, -0.2, 1, -0.5],
      [0, -10, 0.01, -1.5, 0.5, -0.2, 1, 0.05],
    ]);

    let scaleGraph = new Curve([0, 0.065, 1, 0]);
    let scaleGraph2 = new Curve([0, 0.085, 1, 0]);

    let rotationSpeedGraph = new Curve([0, 360, 1, 0]);
    let rotationSpeedGraph2 = new Curve([0, -360, 1, 0]);

    let colorGraph = new CurveSet([
      [0, 255 / 255],
      [0, 128 / 255],
      [0, 128 / 255],
    ]);

    let colorGraph2 = new CurveSet([
      [0, 255 / 255],
      [0, 248 / 255],
      [0, 128 / 255],
    ]);

    let colorGraph3 = new CurveSet([
      [0, 156 / 255],
      [0, 255 / 255],
      [0, 128 / 255],
    ]);

    let colorGraph4 = new CurveSet([
      [0, 128 / 255],
      [0, 128 / 255],
      [0, 255 / 255],
    ]);

    this.star1.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texStar,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      colorGraph,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    this.star2.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texStar,
      colorGraph   : colorGraph2,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    this.star3.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texStar,
      colorGraph   : colorGraph3,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    this.star4.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texStar,
      colorGraph   : colorGraph4,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    this.cloud1.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texCloud,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      colorGraph,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    this.cloud2.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texCloud,
      colorGraph   : colorGraph2,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    this.cloud3.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texCloud,
      colorGraph   : colorGraph3,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    this.cloud4.addComponent("particlesystem", {
      autoPlay     : false,
      loop         : false,
      lifetime     : 0.8,
      numParticles : 5,
      rate         : 0,
      colorMap     : texCloud,
      colorGraph   : colorGraph4,
      scaleGraph,
      scaleGraph2,
      localVelocityGraph,
      localVelocityGraph2,
      rotationSpeedGraph,
      rotationSpeedGraph2,
    });

    setTimeout(() => {
      // this.star1.particlesystem.emitter.material.depthTest = false;
      // this.star2.particlesystem.emitter.material.depthTest = false;
      // this.star3.particlesystem.emitter.material.depthTest = false;
      // this.star4.particlesystem.emitter.material.depthTest = false;
      // this.cloud1.particlesystem.emitter.material.depthTest = false;
      // this.cloud2.particlesystem.emitter.material.depthTest = false;
      // this.cloud3.particlesystem.emitter.material.depthTest = false;
      // this.cloud4.particlesystem.emitter.material.depthTest = false;
    }, 1);
  }

  play() {
    this.star1.particlesystem.reset();
    this.star1.particlesystem.play();
    this.star2.particlesystem.reset();
    this.star2.particlesystem.play();
    this.star3.particlesystem.reset();
    this.star3.particlesystem.play();
    this.star4.particlesystem.reset();
    this.star4.particlesystem.play();
    this.cloud1.particlesystem.reset();
    this.cloud1.particlesystem.play();
    this.cloud2.particlesystem.reset();
    this.cloud2.particlesystem.play();
    this.cloud3.particlesystem.reset();
    this.cloud3.particlesystem.play();
    this.cloud4.particlesystem.reset();
    this.cloud4.particlesystem.play();

    setTimeout(() => {
      this.fire(SpawningEvent.Despawn);
    }, 800);
  }
}
