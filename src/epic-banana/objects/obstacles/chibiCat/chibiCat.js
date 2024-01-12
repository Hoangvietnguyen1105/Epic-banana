import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";
import { Banana } from "../../bot/banana";
import { Tween } from "../../../../template/systems/tween/tween";
import { SoundManager } from "../../../../template/soundManager";
import { DieEffect } from "../../effects/dieEffect";

export const ChibiCatState = Object.freeze({
    Disable: "disable",
    Enable: "enable",
    WaitCollider: "waitCollider",
});

export const ChibiCatEvent = Object.freeze({
    WaitAttack: "waitAttack",
});


export class ChibiCat extends Entity {
    constructor() {
        super();
        this.addComponent("model", { asset: AssetLoader.getAssetByKey("ChibiCat") });

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.ChibiCat,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(20, 1.5, 11),
            position: new Vec3(0, 0, 6)
        });
        this.state = ChibiCatState.Disable;

        this.on(SpawningEvent.Spawn, () => {
            this.collider && this.collider.enable();
            this.state = ChibiCatState.Enable;
            this.bananaRun.enabled = false;
        }, this);

        this.on(ChibiCatEvent.WaitAttack, this.startAttack, this)

        this.addComponent("animation", {
            assets: [
                AssetLoader.getAssetByKey("ChibiCat@idle")
            ],
            speed: 1,
            loop: true,
            activate: true,
        });

        this.bananaRun = new Banana(CollisionTag.SoliderPlayer);
        this.addChild(this.bananaRun);
        this.bananaRun.enabled = false;

        this.fx = new DieEffect();
        this.fx.dieFx.setLocalScale(1.5, 1.5, 1.5)
        this.addChild(this.fx);
    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        // let scale = data.scale;
        let scale = new Vec3(0.8, 0.8, 0.8);
        this.setPosition(pos.x, pos.y, pos.z);
        this.setEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
    }

    startAttack(other) {
        this.state = ChibiCatState.WaitCollider;
        this.bananaRun.setPosition(other.entity.getPosition().clone());
        this.bananaRun.enabled = true;
        this.bananaRun.actionRun();

        Tween.createGlobalTranslateTween(this.bananaRun, {
            x: this.getPosition().x,
            y: this.getPosition().y,
            z: this.getPosition().z
        }, {
            duration: GameConstant.TIME_ATTACK_CHIBICAT,
            onComplete: () => {
                let pos = this.bananaRun.getPosition();
                pos.y += 0.75;
                pos.z -= 0.5;
                this.fx.setPosition(pos);
                this.fx.play();
                SoundManager.play("sfx_game_death");
                this.bananaRun.enabled = false;

                Tween.createCountTween({
                    duration: 0.3,
                    onComplete: () => {
                        this.fire(SpawningEvent.Despawn);
                    },
                }).start();
            },
        }).start();
    }
}