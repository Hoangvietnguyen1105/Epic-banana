import { Entity } from "playcanvas";
import { Spawner } from "../../scripts/spawners/spawner";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { Banana } from "../bot/banana";
import { ObjectType } from "../level/objectType";
import { CollisionTag } from "../../../physics/collisionTag";


export class ArenaObject extends Entity {
    constructor() {
        super();
        this.setLocalPosition(0, 0, 2.773);
        this.setLocalScale(2, 2, 2);
        this.setEulerAngles(0, 180, 0);

        this._initSpawner();
        this.solidersPlayer = [];
        this.solidersEnemy = [];
    }

    initEnemy(dataEnemy) {
        for (let i = 0; i < dataEnemy.length; i++) {
            const data = dataEnemy[i];
            let obj = null;
            switch (data.tp) {
                case ObjectType.BANANA:
                    obj = this.bananaEnemySpawner.spawn();
                    this.solidersEnemy.push(obj);
                    obj.config(data);
                    break;
                default: {
                    obj = new Entity();
                    break;
                }
            }
            this.addChild(obj);
        }
    }

    initPlayer(dataPlayer) {
        for (let i = 0; i < dataPlayer.length; i++) {
            const data = dataPlayer[i];
            let obj = null;
            switch (data.tp) {
                case ObjectType.BANANA:
                    obj = this.bananaSpawner.spawn();
                    this.solidersPlayer.push(obj);
                    obj.config(data);
                    break;
                default: {
                    obj = new Entity();
                    break;
                }
            }
            this.addChild(obj);
        }
    }

    reset() {
        this._resetEnemy();
        this._resetPlayer();
    }

    _resetEnemy() {
        for (let i = this.solidersEnemy.length - 1; i >= 0; i--) {
            let obj = this.solidersEnemy[i];
            obj.fire(SpawningEvent.Despawn, obj);
        }
        this.solidersEnemy = [];
    }

    _resetPlayer() {
        for (let i = this.solidersPlayer.length - 1; i >= 0; i--) {
            let obj = this.solidersPlayer[i];
            obj.fire(SpawningEvent.Despawn, obj);
        }
        this.solidersPlayer = [];
    }

    _initSpawner() {
        let bananaEnemySpawnerEntity = new Entity();
        this.addChild(bananaEnemySpawnerEntity);
        this.bananaEnemySpawner = bananaEnemySpawnerEntity.addScript(Spawner, {
            class: Banana,
            poolSize: 10,
            args: [CollisionTag.SoliderEnemy]
        });
        this.bananaEnemySpawner.initialize();
        this.bananaEnemySpawner.postInitialize();

        let bananaSpawnerEntity = new Entity();
        this.addChild(bananaSpawnerEntity);
        this.bananaSpawner = bananaSpawnerEntity.addScript(Spawner, {
            class: Banana,
            poolSize: 10,
            args: [CollisionTag.SoliderPlayer]
        });
        this.bananaSpawner.initialize();
        this.bananaSpawner.postInitialize();
    }
}