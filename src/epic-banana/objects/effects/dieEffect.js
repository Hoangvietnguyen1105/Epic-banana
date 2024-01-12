import { Curve, CurveSet, EMITTERSHAPE_BOX, Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";


export class DieEffect extends Entity {
    constructor() {
        super();
        this._initParticle();
    }

    _initParticle() {
        this.dieFx = new Entity();
        this.addChild(this.dieFx);
        this.dieFx.setLocalScale(0.9, 0.9, 0.9)
        let texture = AssetLoader.getAssetByKey("tex_cloud").resource;

        let scaleGraph = new Curve([0, 1, 1, 0]);
        let rotationSpeedGraph = new Curve([0, 1, 1, -180]);

        let colorGraph = new CurveSet([
            [0, 217 / 255, 0.5, 253 / 255, 1, 242 / 255],
            [0, 172 / 255, 0.5, 238 / 255, 1, 242 / 255],
            [0, 172 / 255, 0.5, 0 / 255, 1, 50],
        ]);

        this.dieFx.addComponent("particlesystem", {
            autoPlay: true,
            loop: false,
            lifetime: 0.3,
            numParticles: 4,
            rate: 0,
            rate2: 0.1,
            emitterShape: EMITTERSHAPE_BOX,
            startAngle: 1,
            startAngle2: 360,
            lighting: false,
            intensity: 1,
            colorMap: texture,
            localSpace: true,
            rotationSpeedGraph,
            scaleGraph,
            colorGraph,
        });
    }

    play() {
        this.dieFx.particlesystem.reset();
        this.dieFx.particlesystem.play();
    }
}
