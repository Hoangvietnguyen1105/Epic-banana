import { Entity } from "playcanvas";
import { CharacterType } from "./characterType";
import { Spawner } from "../../scripts/spawners/spawner";
import { MeleeCharacter } from "./melee/meleeCharacter";
import { MeleeConfig } from "./melee/meleeConfig";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { AnimationName } from "../animationName/animationName";
import { RangeCharacter } from "./range/rangeCharacter";
import { RangeConfig } from "./range/rangeConfig";
import data from "../../../../assets/jsons/stat.json";
import { GameConstant } from "../../../gameConstant";


export class CharacterFactory {
  static createCharacter(level, type) {
    switch (type) {
      case CharacterType.MELEE:
        return this.createMeleeCharacter(level);
      case CharacterType.RANGE:
        return this.createRangeCharacter(level);
      default:
    }
  }

  static initSpawner(scene) {
    this.initSpawnerMelee(scene);
    this.initSpawnerRange(scene);
  }

  static initSpawnerMelee(scene) {

    let bananaEntity = new Entity();
    scene.addChild(bananaEntity);

    let bananaConfig = new MeleeConfig();
    bananaConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    bananaConfig.hp = data.melee[0].hp;
    bananaConfig.attackDamage = data.melee[0].dame;
    bananaConfig.level = data.melee[0].level;
    bananaConfig.modelName = "Banana";
    bananaConfig.animations = [
      AssetLoader.getAssetByKey("banana@attack"),
      AssetLoader.getAssetByKey("banana@die"),
      AssetLoader.getAssetByKey("banana@idle"),
      AssetLoader.getAssetByKey("banana@run"),
      AssetLoader.getAssetByKey("banana@victory"),
    ]
    bananaConfig.animationMap.set();
    bananaConfig.animationMap.set(AnimationName.Fall, "banana@die");
    bananaConfig.animationMap.set(AnimationName.Dead, "banana@die");
    bananaConfig.animationMap.set(AnimationName.Land, "banana@idle");
    bananaConfig.animationMap.set(AnimationName.Move, "banana@run");
    bananaConfig.animationMap.set(AnimationName.Idle, "banana@idle");
    bananaConfig.animationMap.set(AnimationName.Attack, "banana@attack");
    bananaConfig.animationMap.set(AnimationName.Victory, "banana@victory");

    this.bananaSpawner = bananaEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [bananaConfig]
    });

    let avocadoEntity = new Entity();
    scene.addChild(avocadoEntity);

    let avocadoConfig = new MeleeConfig();
    avocadoConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    avocadoConfig.hp = data.melee[1].hp;
    avocadoConfig.attackDamage = data.melee[1].dame;
    avocadoConfig.level = data.melee[1].level;
    avocadoConfig.modelName = "Avocado";
    avocadoConfig.animations = [
      AssetLoader.getAssetByKey("avocado@attack"),
      AssetLoader.getAssetByKey("avocado@die"),
      AssetLoader.getAssetByKey("avocado@idle"),
      AssetLoader.getAssetByKey("avocado@run"),
      AssetLoader.getAssetByKey("avocado@victory"),
    ]
    avocadoConfig.animationMap.set();
    avocadoConfig.animationMap.set(AnimationName.Fall, "avocado@die");
    avocadoConfig.animationMap.set(AnimationName.Dead, "avocado@die");
    avocadoConfig.animationMap.set(AnimationName.Land, "avocado@idle");
    avocadoConfig.animationMap.set(AnimationName.Move, "avocado@run");
    avocadoConfig.animationMap.set(AnimationName.Idle, "avocado@idle");
    avocadoConfig.animationMap.set(AnimationName.Attack, "avocado@attack");
    avocadoConfig.animationMap.set(AnimationName.Victory, "avocado@victory");

    this.avocadoSpawner = avocadoEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [avocadoConfig]
    });


    let carrotEntity = new Entity();
    scene.addChild(carrotEntity);

    let carrotConfig = new MeleeConfig();
    carrotConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    carrotConfig.hp = data.melee[2].hp;
    carrotConfig.attackDamage = data.melee[2].dame;
    carrotConfig.level = data.melee[2].level;
    carrotConfig.modelName = "Carrot";
    carrotConfig.animations = [
      AssetLoader.getAssetByKey("carrot@attack"),
      AssetLoader.getAssetByKey("carrot@die"),
      AssetLoader.getAssetByKey("carrot@idle"),
      AssetLoader.getAssetByKey("carrot@run"),
      AssetLoader.getAssetByKey("carrot@victory"),
    ]
    carrotConfig.animationMap.set();
    carrotConfig.animationMap.set(AnimationName.Fall, "carrot@die");
    carrotConfig.animationMap.set(AnimationName.Dead, "carrot@die");
    carrotConfig.animationMap.set(AnimationName.Land, "carrot@idle");
    carrotConfig.animationMap.set(AnimationName.Move, "carrot@run");
    carrotConfig.animationMap.set(AnimationName.Idle, "carrot@idle");
    carrotConfig.animationMap.set(AnimationName.Attack, "carrot@attack");
    carrotConfig.animationMap.set(AnimationName.Victory, "carrot@victory");

    this.carrotSpawner = carrotEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [carrotConfig]
    });

    let lemoncatEntity = new Entity();
    scene.addChild(lemoncatEntity);

    let lemoncatConfig = new MeleeConfig();
    lemoncatConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    lemoncatConfig.hp = data.melee[3].hp;
    lemoncatConfig.attackDamage = data.melee[3].dame;
    lemoncatConfig.level = data.melee[3].level;
    lemoncatConfig.modelName = "LemonCat";
    lemoncatConfig.animations = [
      AssetLoader.getAssetByKey("lemoncat@attack"),
      AssetLoader.getAssetByKey("lemoncat@die"),
      AssetLoader.getAssetByKey("lemoncat@idle"),
      AssetLoader.getAssetByKey("lemoncat@run"),
      AssetLoader.getAssetByKey("lemoncat@victory"),
    ]
    lemoncatConfig.animationMap.set();
    lemoncatConfig.animationMap.set(AnimationName.Fall, "lemoncat@die");
    lemoncatConfig.animationMap.set(AnimationName.Dead, "lemoncat@die");
    lemoncatConfig.animationMap.set(AnimationName.Land, "lemoncat@idle");
    lemoncatConfig.animationMap.set(AnimationName.Move, "lemoncat@run");
    lemoncatConfig.animationMap.set(AnimationName.Idle, "lemoncat@idle");
    lemoncatConfig.animationMap.set(AnimationName.Attack, "lemoncat@attack");
    lemoncatConfig.animationMap.set(AnimationName.Victory, "lemoncat@victory");

    this.lemoncatSpawner = lemoncatEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [lemoncatConfig]
    });
    let tomatoEntity = new Entity();
    scene.addChild(tomatoEntity);

    let tomatoConfig = new MeleeConfig();
    tomatoConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    tomatoConfig.hp = data.melee[4].hp;
    tomatoConfig.attackDamage = data.melee[4].dame;
    tomatoConfig.level = data.melee[4].level;
    tomatoConfig.modelName = "TomatoCat";
    tomatoConfig.animations = [
      AssetLoader.getAssetByKey("tomatocat@attack"),
      AssetLoader.getAssetByKey("tomatocat@die"),
      AssetLoader.getAssetByKey("tomatocat@idle"),
      AssetLoader.getAssetByKey("tomatocat@run"),
      AssetLoader.getAssetByKey("tomatocat@victory"),
    ]

    tomatoConfig.animationMap.set();
    tomatoConfig.animationMap.set(AnimationName.Fall, "tomatocat@die");
    tomatoConfig.animationMap.set(AnimationName.Dead, "tomatocat@die");
    tomatoConfig.animationMap.set(AnimationName.Land, "tomatocat@idle");
    tomatoConfig.animationMap.set(AnimationName.Move, "tomatocat@run");
    tomatoConfig.animationMap.set(AnimationName.Idle, "tomatocat@idle");
    tomatoConfig.animationMap.set(AnimationName.Attack, "tomatocat@attack");
    tomatoConfig.animationMap.set(AnimationName.Victory, "tomatocat@victory");

    this.tomatoSpawner = tomatoEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [tomatoConfig]
    });

    let pearEntity = new Entity();
    scene.addChild(pearEntity);

    let pearConfig = new MeleeConfig();
    pearConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    pearConfig.hp = data.melee[5].hp;
    pearConfig.attackDamage = data.melee[5].dame;
    pearConfig.level = data.melee[5].level;
    pearConfig.modelName = "Pear";
    pearConfig.animations = [
      AssetLoader.getAssetByKey("pear@attack"),
      AssetLoader.getAssetByKey("pear@die"),
      AssetLoader.getAssetByKey("pear@idle"),
      AssetLoader.getAssetByKey("pear@run"),
      AssetLoader.getAssetByKey("pear@victory"),
    ]
    pearConfig.animationMap.set();
    pearConfig.animationMap.set(AnimationName.Fall, "pear@die");
    pearConfig.animationMap.set(AnimationName.Dead, "pear@die");
    pearConfig.animationMap.set(AnimationName.Land, "pear@idle");
    pearConfig.animationMap.set(AnimationName.Move, "pear@run");
    pearConfig.animationMap.set(AnimationName.Idle, "pear@idle");
    pearConfig.animationMap.set(AnimationName.Attack, "pear@attack");
    pearConfig.animationMap.set(AnimationName.Victory, "pear@victory");

    this.pearSpawner = pearEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [pearConfig]
    });

    let kiwiEntity = new Entity();
    scene.addChild(kiwiEntity);

    let kiwiConfig = new MeleeConfig();
    kiwiConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    kiwiConfig.hp = data.melee[6].hp;
    kiwiConfig.attackDamage = data.melee[6].dame;
    kiwiConfig.level = data.melee[6].level;
    kiwiConfig.modelName = "Kiwi";
    kiwiConfig.animations = [
      AssetLoader.getAssetByKey("kiwi@attack"),
      AssetLoader.getAssetByKey("kiwi@die"),
      AssetLoader.getAssetByKey("kiwi@idle"),
      AssetLoader.getAssetByKey("kiwi@run"),
      AssetLoader.getAssetByKey("kiwi@victory"),
    ]
    kiwiConfig.animationMap.set();
    kiwiConfig.animationMap.set(AnimationName.Fall, "kiwi@die");
    kiwiConfig.animationMap.set(AnimationName.Dead, "kiwi@die");
    kiwiConfig.animationMap.set(AnimationName.Land, "kiwi@idle");
    kiwiConfig.animationMap.set(AnimationName.Move, "kiwi@run");
    kiwiConfig.animationMap.set(AnimationName.Idle, "kiwi@idle");
    kiwiConfig.animationMap.set(AnimationName.Attack, "kiwi@attack");
    kiwiConfig.animationMap.set(AnimationName.Victory, "kiwi@victory");

    this.kiwiSpawner = kiwiEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [kiwiConfig]
    });

    let appleEntity = new Entity();
    scene.addChild(appleEntity);

    let appleConfig = new MeleeConfig();
    appleConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    appleConfig.hp = data.melee[7].hp;
    appleConfig.attackDamage = data.melee[7].dame;
    appleConfig.level = data.melee[7].level;
    appleConfig.modelName = "Apple";
    appleConfig.animations = [
      AssetLoader.getAssetByKey("apple@attack"),
      AssetLoader.getAssetByKey("apple@die"),
      AssetLoader.getAssetByKey("apple@idle"),
      AssetLoader.getAssetByKey("apple@run"),
      AssetLoader.getAssetByKey("apple@victory"),
    ]
    appleConfig.animationMap.set();
    appleConfig.animationMap.set(AnimationName.Fall, "apple@die");
    appleConfig.animationMap.set(AnimationName.Dead, "apple@die");
    appleConfig.animationMap.set(AnimationName.Land, "apple@idle");
    appleConfig.animationMap.set(AnimationName.Move, "apple@run");
    appleConfig.animationMap.set(AnimationName.Idle, "apple@idle");
    appleConfig.animationMap.set(AnimationName.Attack, "apple@attack");
    appleConfig.animationMap.set(AnimationName.Victory, "apple@victory");

    this.appleSpawner = appleEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [appleConfig]
    });


    let grapeEntity = new Entity();
    scene.addChild(grapeEntity);

    let grapeConfig = new MeleeConfig();
    grapeConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    grapeConfig.hp = data.melee[8].hp;
    grapeConfig.attackDamage = data.melee[8].dame;
    grapeConfig.level = data.melee[8].level;
    grapeConfig.modelName = "Grape";
    grapeConfig.animations = [
      AssetLoader.getAssetByKey("grape@attack"),
      AssetLoader.getAssetByKey("grape@die"),
      AssetLoader.getAssetByKey("grape@idle"),
      AssetLoader.getAssetByKey("grape@run"),
      AssetLoader.getAssetByKey("grape@victory"),
    ]
    grapeConfig.animationMap.set();
    grapeConfig.animationMap.set(AnimationName.Fall, "grape@die");
    grapeConfig.animationMap.set(AnimationName.Dead, "grape@die");
    grapeConfig.animationMap.set(AnimationName.Land, "grape@idle");
    grapeConfig.animationMap.set(AnimationName.Move, "grape@run");
    grapeConfig.animationMap.set(AnimationName.Idle, "grape@idle");
    grapeConfig.animationMap.set(AnimationName.Attack, "grape@attack");
    grapeConfig.animationMap.set(AnimationName.Victory, "grape@victory");

    this.grapeSpawner = grapeEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [grapeConfig]
    });


    let pineappleEntity = new Entity();
    scene.addChild(pineappleEntity);

    let pineappleConfig = new MeleeConfig();
    pineappleConfig.moveSpeed = GameConstant.SPEED_CHARACTER;
    pineappleConfig.hp = data.melee[9].hp;
    pineappleConfig.attackDamage = data.melee[9].dame;
    pineappleConfig.level = data.melee[9].level;
    pineappleConfig.modelName = "Pineapple";
    pineappleConfig.animations = [
      AssetLoader.getAssetByKey("pineapple@attack"),
      AssetLoader.getAssetByKey("pineapple@die"),
      AssetLoader.getAssetByKey("pineapple@idle"),
      AssetLoader.getAssetByKey("pineapple@run"),
      AssetLoader.getAssetByKey("pineapple@victory"),
    ]
    pineappleConfig.animationMap.set();
    pineappleConfig.animationMap.set(AnimationName.Fall, "pineapple@die");
    pineappleConfig.animationMap.set(AnimationName.Dead, "pineapple@die");
    pineappleConfig.animationMap.set(AnimationName.Land, "pineapple@idle");
    pineappleConfig.animationMap.set(AnimationName.Move, "pineapple@run");
    pineappleConfig.animationMap.set(AnimationName.Idle, "pineapple@idle");
    pineappleConfig.animationMap.set(AnimationName.Attack, "pineapple@attack");
    pineappleConfig.animationMap.set(AnimationName.Victory, "pineapple@victory");

    this.pineappleSpawner = pineappleEntity.addScript(Spawner, {
      class: MeleeCharacter,
      poolSize: 5,
      args: [pineappleConfig]
    });
  }

  static initSpawnerRange(scene) {
    let dog1Entity = new Entity();
    scene.addChild(dog1Entity);

    let dog1Config = new RangeConfig();
    dog1Config.hp = data.range[0].hp;
    dog1Config.attackDamage = data.range[0].dame;
    dog1Config.level = data.range[0].level;
    dog1Config.modelName = "dog1";
    dog1Config.spawnProjectileName = "dog1_rig01:Hip_L";

    this.dog1Spawner = dog1Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog1Config]
    });

    let dog2Entity = new Entity();
    scene.addChild(dog2Entity);

    let dog2Config = new RangeConfig();
    dog2Config.hp = data.range[1].hp;
    dog2Config.attackDamage = data.range[1].dame;
    dog2Config.level = data.range[1].level;
    dog2Config.modelName = "dog2";
    dog2Config.spawnProjectileName = "dog2_rig01:Hip_L";

    this.dog2Spawner = dog2Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog2Config]
    });

    let dog3Entity = new Entity();
    scene.addChild(dog3Entity);

    let dog3Config = new RangeConfig();
    dog3Config.hp = data.range[2].hp;
    dog3Config.attackDamage = data.range[2].dame;
    dog3Config.level = data.range[2].level;
    dog3Config.modelName = "dog3";
    dog3Config.spawnProjectileName = "dog3:Hip_L";

    this.dog3Spawner = dog3Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog3Config]
    });

    let dog4Entity = new Entity();
    scene.addChild(dog4Entity);

    let dog4Config = new RangeConfig();
    dog4Config.hp = data.range[3].hp;
    dog4Config.attackDamage = data.range[3].dame;
    dog4Config.level = data.range[3].level;
    dog4Config.modelName = "dog4";
    dog4Config.spawnProjectileName = "dog4:Hip_L";

    this.dog4Spawner = dog4Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog4Config]
    });

    let dog5Entity = new Entity();
    scene.addChild(dog5Entity);

    let dog5Config = new RangeConfig();
    dog5Config.hp = data.range[4].hp;
    dog5Config.attackDamage = data.range[4].dame;
    dog5Config.level = data.range[4].level;
    dog5Config.modelName = "dog5";
    dog5Config.spawnProjectileName = "dog5:Hip_L";

    this.dog5Spawner = dog5Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog5Config]
    });

    let dog6Entity = new Entity();
    scene.addChild(dog6Entity);

    let dog6Config = new RangeConfig();
    dog6Config.hp = data.range[5].hp;
    dog6Config.attackDamage = data.range[5].dame;
    dog6Config.level = data.range[5].level;
    dog6Config.modelName = "dog6";
    dog6Config.spawnProjectileName = "dog6:Hip_L";
    this.dog6Spawner = dog6Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog6Config]
    });

    let dog7Entity = new Entity();
    scene.addChild(dog7Entity);

    let dog7Config = new RangeConfig();
    dog7Config.hp = data.range[6].hp;
    dog7Config.attackDamage = data.range[6].dame;
    dog7Config.level = data.range[6].level;
    dog7Config.modelName = "dog7";
    dog7Config.spawnProjectileName = "dog7:Hip_L";

    this.dog7Spawner = dog7Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog7Config]
    });

    let dog8Entity = new Entity();
    scene.addChild(dog8Entity);

    let dog8Config = new RangeConfig();
    dog8Config.hp = data.range[7].hp;
    dog8Config.attackDamage = data.range[7].dame;
    dog8Config.level = data.range[7].level;
    dog8Config.modelName = "dog8";
    dog8Config.spawnProjectileName = "dog8:Hip_L";

    this.dog8Spawner = dog8Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog8Config]
    });

    let dog9Entity = new Entity();
    scene.addChild(dog9Entity);

    let dog9Config = new RangeConfig();
    dog9Config.hp = data.range[8].hp;
    dog9Config.attackDamage = data.range[8].dame;
    dog9Config.level = data.range[8].level;
    dog9Config.modelName = "dog9";
    dog9Config.spawnProjectileName = "dog9:Hip_L";

    this.dog9Spawner = dog9Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog9Config]
    });

    let dog10Entity = new Entity();
    scene.addChild(dog10Entity);

    let dog10Config = new RangeConfig();
    dog10Config.hp = data.range[9].hp;
    dog10Config.attackDamage = data.range[9].dame;
    dog10Config.level = data.range[9].level;
    dog10Config.modelName = "dog10";
    dog10Config.spawnProjectileName = "dog10:Hip_L";

    this.dog10Spawner = dog10Entity.addScript(Spawner, {
      class: RangeCharacter,
      poolSize: 5,
      args: [dog10Config]
    });
  }

  static createMeleeCharacter(level) {
    switch (level) {
      case 1:
        return this.bananaSpawner.spawn();
      case 2:
        return this.avocadoSpawner.spawn();
      case 3:
        return this.carrotSpawner.spawn();
      case 4:
        return this.lemoncatSpawner.spawn();
      case 5:
        return this.tomatoSpawner.spawn();
      case 6:
        return this.pearSpawner.spawn();
      case 7:
        return this.kiwiSpawner.spawn();
      case 8:
        return this.appleSpawner.spawn();
      case 9:
        return this.grapeSpawner.spawn();
      case 10:
        return this.pineappleSpawner.spawn();
      default:
        return this.bananaSpawner.spawn();
    }
  }

  static createRangeCharacter(level) {
    switch (level) {
      case 1:
        return this.dog1Spawner.spawn();
      case 2:
        return this.dog2Spawner.spawn();
      case 3:
        return this.dog3Spawner.spawn();
      case 4:
        return this.dog4Spawner.spawn();
      case 5:
        return this.dog5Spawner.spawn();
      case 6:
        return this.dog6Spawner.spawn();
      case 7:
        return this.dog7Spawner.spawn();
      case 8:
        return this.dog8Spawner.spawn();
      case 9:
        return this.dog9Spawner.spawn();
      case 10:
        return this.dog10Spawner.spawn();
      default:
        return this.dog1Spawner.spawn();
    }
  }
}
