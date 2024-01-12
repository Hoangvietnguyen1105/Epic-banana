import { Entity, Vec3 } from "playcanvas";
import { Spawner } from "../../scripts/spawners/spawner";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { Move } from "../../scripts/components/move";
import { GameConstant } from "../../../gameConstant";
import { CollisionTag } from "../../../physics/collisionTag";
import { PlayerRunEvent } from "../../scripts/controllers/playerRunSoliderController";
import { BananaRun } from "../bot/bananaRun";
import { DieEffect } from "../effects/dieEffect";
import { Tween } from "../../../template/systems/tween/tween";


export class Player extends Entity {
    constructor() {
        super();
        this._initSpawner();
        this._initEffectSpawner();
        this.elements = [];
        this.stack = 0;
        this.elementCount = 0;

        this.move = this.addScript(Move, {
            speed: new Vec3(0, 0, GameConstant.GAME_SPEED),
        });
        this.move.disable();
    }

    initialize() {
        this.elementCount = 0;
        this.elements.forEach((element) => {
            element.fire(SpawningEvent.Despawn);
        });
        this.elements = [];

        this.elements.push(this.bananaSpawner.spawn());
        this.addChild(this.elements[0]);
        this.elements[0].actionStand();
        this.elements[0].setPosition(0, 0, 0);
    }

    spawn(pos) {
        this._spawn(pos);
        this.fire(PlayerRunEvent.ChangeSolider)

    }

    _spawn(pos) {
        let banana = this.bananaSpawner.spawn(parent = this)
        this.elements.push(banana);
        banana.setPosition(pos.x, 0, pos.z);
        if (this.move.enabled) {
            banana.actionRun();
        }
    }

    despawn(element, useEffect = true) {
        this._despawn(element, useEffect);
        this.fire(PlayerRunEvent.ChangeSolider)
    }

    _despawn(element, useEffect = true) {
        if (useEffect) {
            let pos = element.getPosition();
            pos.y += 0.75;
            let fx = this.dieEffectSpawner.spawnTo(pos);
            fx.play();
            Tween.createCountTween({
                duration: 1,
                onComplete: () => {
                    fx.fire(SpawningEvent.Despawn);
                },
            }).start();
        }

        this.elements.splice(this.elements.indexOf(element), 1);
        element.fire(SpawningEvent.Despawn);

        if (this.elements.length <= 0) {
            this.fire(PlayerRunEvent.Lose);
        }
    }

    despawnMutiple(number) {
        for (var i = 0; i < number; i++) {
            if (this.elements.length <= 0) {
                return;
            }
            this._despawn(this.elements[this.elements.length - 1]);
        }
        this.fire(PlayerRunEvent.ChangeSolider)
    }

    spawnMutiple(number) {
        let arr = this.findNextPosSpiral(number);
        arr.forEach((pos) => {
            this._spawn(new Vec3(pos.x, 0, pos.z));
        });
        this.fire(PlayerRunEvent.ChangeSolider)
    }

    findNextPosSpiral(number) {
        let array = new Array();
        let center = this.elements[0].getPosition();
        let radius = GameConstant.PLAYER_GROUP_RADIUS;
        let angle = GameConstant.PLAYER_GROUP_ANGLE;
        let step = GameConstant.PLAYER_GROUP_STEP;
        let count = 0;
        let maxCount = number;
        while (count < maxCount) {
            let x = center.x + radius * Math.cos(angle);
            let y = center.z + radius * Math.sin(angle);
            let pos = new Vec3(x, 0, y);
            if (this.isExit(pos)) {
                array.push(pos);
                count++;
            }
            angle += step;
            radius += 0.1;
        }
        return array;
    }

    isExit(pos) {
        let isExist = false;
        this.elements.forEach((element) => {
            if (element.getPosition().x - pos.x < GameConstant.NUMBER_MIN && element.getPosition().z - pos.z < GameConstant.NUMBER_MIN) {
                isExist = true;
            }
        });
        return !isExist;
    }

    _initSpawner() {
        this.bananaSpawner = this.addScript(Spawner, {
            class: BananaRun,
            poolSize: 10,
            args: [CollisionTag.SoliderPlayer],
        });
        this.bananaSpawner.initialize();
        this.bananaSpawner.postInitialize();
    }

    _initEffectSpawner() {
        let dieFxEntity = new pc.Entity();
        this.addChild(dieFxEntity);
        this.dieEffectSpawner = dieFxEntity.addScript(Spawner, {
            class: DieEffect,
            poolSize: 10,
        });
    }

    actionRun() {
        this.elements.forEach((element) => {
            element.actionRun();
        });
    }

    actionStand() {
        this.move.disable();
        this.elements.forEach((element) => {
            element.actionStand();
        });
    }

    actionVictoty() {
        this.move.disable();
        this.elements.forEach((element) => {
            element.actionVictory();
        });
    }
}