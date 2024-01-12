import { Entity, Vec3 } from "playcanvas";
import { Key } from "./key";
import { ObjectType } from "./objectType";
import { Spawner } from "../../scripts/spawners/spawner";
import { Road } from "./road";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { FinishLine } from "./finishLine";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { MathOperator, MathWall } from "../obstacles/wall/mathWall";
import { Jump } from "../obstacles/jump/jump";
import { SawBlade } from "../obstacles/sawBlade/sawBlade";
import { SawBladeMove } from "../obstacles/sawBlade/sawBaldeMove";
import { Barrier } from "../obstacles/barrier/barrier";
import { Pillar } from "../obstacles/piller/piller";
import { CollisionTag } from "../../../physics/collisionTag";
import { RotatingObject } from "../obstacles/rotatingObject/rotatingObject";
import { TrapFlipL } from "../obstacles/trap_flip_L/trapFlipL";
import { Thorn } from "../obstacles/thorn/thorn";
import { ChibiCat } from "../obstacles/chibiCat/chibiCat";
import { EndWall } from "../obstacles/wall/endWall";
import { TrapThorn } from "../obstacles/thorn/trapThorn";
import { SpikeTunnel } from "../obstacles/spikeTunnel/spikeTunnel";
import { RotatingObjectOneSide } from "../obstacles/rotatingObject/rotatingObjectOneSide";
import { BananaRun } from "../bot/bananaRun";

export const LevelState = Object.freeze({
  Running: "running",
  Arena: "arena",
  Waiting: "waiting",
});


export class Level extends Entity {
  constructor() {
    super();
    this._initMaterial();
    this._initSpawner();
    this.state = LevelState.Waiting;
    this.objs = []
  }

  reset() {
    this.objs.forEach((obj) => {
      obj.fire(SpawningEvent.Despawn);
    })
    this.objs = [];
  }

  _initMaterial() {
    this.redMat = AssetLoader.getAssetByKey("mat_red_wall").resource;
    this.greenMat = AssetLoader.getAssetByKey("mat_green_wall").resource;
  }

  generate(levelData) {
    for (let i = 0; i < levelData.length; i++) {
      const data = levelData[i];
      if (data.tp === ObjectType.FINISH_LINE) {
        this.finishLineEntity.config(data);
        continue;
      }
      let obj = null;
      switch (data.tp) {
        case ObjectType.ROAD:
          obj = this.roadSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.ROTATING_OBJECT:
          obj = this.rotatingSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.ROTATING_OBJECT_ONE_SIDE:
          obj = this.rotatingOneSideSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.THORN:
          obj = this.thornSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.PILLER:
          obj = this.pillerSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.TRAPFLIPL:
          obj = this.traFlipLSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.BANANA:
          obj = this.bananaSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.BARRIER:
          obj = this.barrierSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.MATH_WALL:
          obj = this.mathWallSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.END_WALL:
          obj = this.endWallSpawner.spawn();
          let matEndWall = null;
          let operator = data.value.substring(0, 1);
          let val = data.value.substring(1, data.value.length);
          if (operator === MathOperator.SUB || operator === MathOperator.DIV) {
            matEndWall = AssetLoader.getAssetByKey("mat_red_wall").resource;
          } else {
            matEndWall = AssetLoader.getAssetByKey("mat_green_wall").resource;
          }
          let rightWallConfig = {
            position: new Vec3(data.pos.x, data.pos.y, data.pos.z),
            rot: new Vec3(data.rot.x, data.rot.y, data.rot.z),
            size: new Vec3(3.6, 3, 0.08),
            material: matEndWall,
            value: val,
          }
          obj.config(rightWallConfig, operator);
          break;
        case ObjectType.JUMP:
          obj = this.jumpSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.SAW_BLADE:
          obj = this.sawBladeSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.KEY:
          obj = this.keySpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.CHIBI_CAT:
          obj = this.chibiCatSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.SAW_BLADE_MOVE:
          obj = this.sawBladeMoveSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.TRAP_THORN:
          obj = this.trapThornSpawner.spawn();
          obj.config(data);
          break;
        case ObjectType.SPIKE_TUNNEL:
          obj = this.spiketunnelSpawner.spawn();
          obj.config(data);
          break;
        default: {
          obj = new Entity();
          break;
        }
      }
      this.addChild(obj);
      this.objs.push(obj);
    }
  }

  _initSpawner() {
    let roadSpawnerEntity = new Entity("road-spawner");
    this.addChild(roadSpawnerEntity);
    this.roadSpawner = roadSpawnerEntity.addScript(Spawner, {
      class: Road,
      poolSize: 20,
    });

    let spiketunnelSpawnerEntity = new Entity("road-spawner");
    this.addChild(spiketunnelSpawnerEntity);
    this.spiketunnelSpawner = spiketunnelSpawnerEntity.addScript(Spawner, {
      class: SpikeTunnel,
      poolSize: 3,
    });

    let keySpawnerEntity = new Entity();
    this.addChild(keySpawnerEntity);
    this.keySpawner = keySpawnerEntity.addScript(Spawner, {
      class: Key,
      poolSize: 5,
    });

    let chibiCatSpawnerEntity = new Entity();
    this.addChild(chibiCatSpawnerEntity);
    this.chibiCatSpawner = chibiCatSpawnerEntity.addScript(Spawner, {
      class: ChibiCat,
      poolSize: 5,
    });

    let trapThornSpawnerEntity = new Entity();
    this.addChild(trapThornSpawnerEntity);
    this.trapThornSpawner = trapThornSpawnerEntity.addScript(Spawner, {
      class: TrapThorn,
      poolSize: 5,
    });

    let thornSpawnerEntity = new Entity();
    this.addChild(thornSpawnerEntity);
    this.thornSpawner = thornSpawnerEntity.addScript(Spawner, {
      class: Thorn,
      poolSize: 10,
    });

    let rotatingEntity = new Entity();
    this.addChild(rotatingEntity);
    this.rotatingSpawner = rotatingEntity.addScript(Spawner, {
      class: RotatingObject,
      poolSize: 3,
    });

    let rotatingOneSideEntity = new Entity();
    this.addChild(rotatingOneSideEntity);
    this.rotatingOneSideSpawner = rotatingOneSideEntity.addScript(Spawner, {
      class: RotatingObjectOneSide,
      poolSize: 3,
    });


    let traFlipLEntity = new Entity();
    this.addChild(traFlipLEntity);
    this.traFlipLSpawner = traFlipLEntity.addScript(Spawner, {
      class: TrapFlipL,
      poolSize: 3,
    });

    let pillerSpawnerEntity = new Entity();
    this.addChild(pillerSpawnerEntity);
    this.pillerSpawner = pillerSpawnerEntity.addScript(Spawner, {
      class: Pillar,
      poolSize: 10,
    });

    let bananaSpawnerEntity = new Entity();
    this.addChild(bananaSpawnerEntity);
    this.bananaSpawner = bananaSpawnerEntity.addScript(Spawner, {
      class: BananaRun,
      poolSize: 20,
      args: [CollisionTag.SoliderEnemy],
    });

    let barrierSpawnerEntity = new Entity();
    this.addChild(barrierSpawnerEntity);
    this.barrierSpawner = barrierSpawnerEntity.addScript(Spawner, {
      class: Barrier,
      poolSize: 10,
    });

    let mathWallSpawnerEntity = new Entity();
    this.addChild(mathWallSpawnerEntity);
    this.mathWallSpawner = mathWallSpawnerEntity.addScript(Spawner, {
      class: MathWall,
      poolSize: 5,
    });

    let endWallSpawnerEntity = new Entity();
    this.addChild(endWallSpawnerEntity);
    this.endWallSpawner = endWallSpawnerEntity.addScript(Spawner, {
      class: EndWall,
      poolSize: 5,
    });

    let jumpSpawnerEntity = new Entity();
    this.addChild(jumpSpawnerEntity);
    this.jumpSpawner = jumpSpawnerEntity.addScript(Spawner, {
      class: Jump,
      poolSize: 2,
    });

    let sawBladeSpawnerEntity = new Entity();
    this.addChild(sawBladeSpawnerEntity);
    this.sawBladeSpawner = sawBladeSpawnerEntity.addScript(Spawner, {
      class: SawBlade,
      poolSize: 5,
    });

    let sawBladeMoveSpawnerEntity = new Entity();
    this.addChild(sawBladeMoveSpawnerEntity);
    this.sawBladeMoveSpawner = sawBladeMoveSpawnerEntity.addScript(Spawner, {
      class: SawBladeMove,
      poolSize: 5,
    });

    this.finishLineEntity = new FinishLine()
    this.addChild(this.finishLineEntity);
  }
}