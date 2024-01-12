import { log, math, Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";
import { GameConstant } from "../../../gameConstant";
import { GameState } from "../../../template/gameStateManager";
import { GameStateManager } from "../../../template/gameStateManager";

export const SwipeMovement = Script.createScript({
    name: "swipeMovementTest",
    attributes: {
        screenEntity: {},
        multiplier: { default: 0 },
        speed: { default: 1 },
        paddingLeft: { default: 0 },
        paddingRight: { default: 0 },
        blockAreas: { default: [] },
        collider: { default: null },
    },

    touchedDown: false,
    startPos: 0,
    currPos: 0,
    _tmpPos: new Vec3(),
    _tmpTouchPosition: new Vec3(),

    onEnable() {
        // Avoid big move distance when swipe on disabled
    },

    getBouding(box) {
        return box.model.meshInstances[0].aabb;
    },



    initialize() {
        this.reset();
    },

    reset() {
        this.posCheck = new Vec3();
        this.startPos = this.currPos;
    },



    update() {
        if (!this.touchedDown) {
            return;
        }
        let distance = this.startPos - this.currPos;
        let moveAmount = distance * this.multiplier;
        let velocity = Math.min(1, this.speed * Time.dt);
        // let velocity = this.speed * Time.dt;
        this.startPos = math.lerp(this.startPos, this.currPos, velocity);
        this._tmpPos.copy(this.entity.getLocalPosition());
        let x = math.lerp(this._tmpPos.x, this._tmpPos.x + moveAmount, velocity);

        this._tmpPos.x = pc.math.clamp(x, -GameConstant.PLAYER_LIMIT_X + this.paddingLeft, GameConstant.PLAYER_LIMIT_X - this.paddingRight);

        this.entity.setLocalPosition(this._tmpPos);

    },

    onPointerDown(event) {
        this.touchedDown = true;

        if (event.touches && event.touches[0]) {
            this.setStart(event.touches[0]);
        }
        else {
            this.setStart(event);
        }
    },

    onPointerMove(event) {
        if (!this.touchedDown) {
            return;
        }

        if (event.touches && event.touches[0]) {
            this.setMove(event.touches[0]);
        }
        else {
            this.setMove(event);
        }
    },

    onPointerUp() {
        this.touchedDown = false;
        this.startPos = 0;
        this.currPos = 0;
    },

    setStart(position) {
        this.getScreenSpacePosition(position, this._tmpTouchPosition);
        this.startPos = this._tmpTouchPosition.x;
        this.currPos = this.startPos;
    },

    setMove(position) {
        this.getScreenSpacePosition(position, this._tmpTouchPosition);
        this.currPos = this._tmpTouchPosition.x;
    },

    getScreenSpacePosition(deviceScreenPos, dst = new Vec3()) {
        dst.x = deviceScreenPos.x * this.app.graphicsDevice.maxPixelRatio;
        dst.y = this.app.graphicsDevice.height - deviceScreenPos.y * this.app.graphicsDevice.maxPixelRatio;
        dst.z = 0;
        dst.scale(1 / this.screenEntity.screen.scale);
    },

    setPadding(elements) {
        var minX = 0;
        var maxX = 0;
        elements.forEach((element) => {
            var x = element.getLocalPosition().x;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
        });
        this.paddingLeft = -minX;
        this.paddingRight = maxX;
    },
});
