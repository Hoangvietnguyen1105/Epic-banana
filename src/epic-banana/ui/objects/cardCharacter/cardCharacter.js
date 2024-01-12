import { Entity, Vec2, Vec4, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Vec3 } from "playcanvas";
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { DataManager } from "../../../data/dataManager";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { NameCard } from "./nameCard";
import { SoundManager } from "../../../../template/soundManager";
import { ElementCardCharacter } from "./elementCardCharacter";
import { UserData } from "../../../data/userData";


export class CardCharacter extends Entity {
    constructor() {
        super();
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0, 0, 1, 1),
            pivot: new Vec2(0.5, 0.5),
            opacity: 0.6,
            color: Util.createColor(0, 0, 0),
        });

        this.groupElementMelee = [];
        this.groupElementRange = [];
        this._initPanel();
        this._initText();
        this._initCloseButton();
        this._initNameCard();
        this._initContentMelee();
        this._initContentRange();

        this.setActiveMelee(true);
    }

    _initPanel() {
        this.panel = ObjectFactory.createImageElement("frameCard", {
            anchor: new Vec4(
                DataManager.getDataReposive().cardCharacter.anchor_x,
                DataManager.getDataReposive().cardCharacter.anchor_y,
                DataManager.getDataReposive().cardCharacter.anchor_x,
                DataManager.getDataReposive().cardCharacter.anchor_y
            ),
            pivot: new Vec2(0.5, 0.5),
        });
        var scale = DataManager.getDataReposive().cardCharacter.scale;
        this.panel.setLocalScale(scale, scale, scale);
        this.addChild(this.panel);
    }

    _initText() {
        let text = new Entity();
        text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.5, 0.9, 0.5, 0.9),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 40,
            text: "ALL CHARACTERS",
            fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
            outlineThickness: 0.4,
            outlineColor: Util.createColor(0, 0, 0),
        });
        this.panel.addChild(text);
    }

    _initCloseButton() {
        this.closeButton = ObjectFactory.createImageElement("btn-x1", {
            anchor: new Vec4(0.97, 0.97, 0.97, 0.97),
            pivot: new Vec2(0.5, 0.5),
        });
        this.closeButton.setLocalScale(0.4, 0.4, 0.4);
        this.panel.addChild(this.closeButton);

        Util.registerOnTouch(this.closeButton.element, () => {
            SoundManager.play("sfx_game_click");
            this.fire("CardCharacter:OnTapButtonClose")
        });
    }

    _initNameCard() {
        this.panel.addChild(this.nameCardMelee = new NameCard("Melee", {
            anchor: new Vec4(0.18, 0.82, 0.18, 0.82),
            pivot: new Vec2(0.5, 0.5),
            scale: 0.7,
        }));
        Util.registerOnTouch(this.nameCardMelee.element, () => {
            this.selectCard("melee");
            SoundManager.play("sfx_game_click");
        });


        this.panel.addChild(this.nameCardRange = new NameCard("Range", {
            anchor: new Vec4(0.5, 0.82, 0.5, 0.82),
            pivot: new Vec2(0.5, 0.5),
            scale: 0.7,
        }));
        Util.registerOnTouch(this.nameCardRange.element, () => {
            this.selectCard("range");
            SoundManager.play("sfx_game_click");
        });

        this.nameCardMelee.setActive(true);
    }

    selectCard(type) {
        if (type == "melee") {
            this.nameCardMelee.setActive(true);
            this.nameCardRange.setActive(false);
            this.setActiveMelee(true);
        } else {
            this.nameCardMelee.setActive(false);
            this.nameCardRange.setActive(true);
            this.setActiveMelee(false);
        }
    }
    _initContentMelee() {
        var groupMelee = new pc.Entity("Text");
        groupMelee.addComponent("element", {
            anchor: new pc.Vec4(0.2, 0, 0.8, 1),
            pivot: new pc.Vec2(0.5, 0.5),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: true,
        });

        var levelUnlock = this._getLevelCharacterMeleeUnlock();

        DataManager.getCardCharacterData().melee.forEach((item, index) => {
            let anchor_x = index % 2 == 0 ? 0.25 : 0.75;
            let pos = Math.floor(index / 2) * 250;
            let element = new ElementCardCharacter({
                anchor: new Vec4(anchor_x, 0.89, anchor_x, 0.89),
                pivot: new Vec2(0.5, 1),
                position: new Vec3(0, -pos, 0),
            }, item.image, item.hp, item.dame);

            groupMelee.addChild(element);
            this.groupElementMelee.push(element);
            if (item.level <= levelUnlock) {
                element.setActive(true);
            }
        })

        const content = new pc.Entity("Content");
        content.addChild(groupMelee);

        content.addComponent("element", {
            anchor: new pc.Vec4(0.5, 1, 0.5, 1),
            height: DataManager.getCardCharacterData().melee.length / 2 * 250 + 30,
            pivot: new pc.Vec2(0.5, 1),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: true,
            width: 600,
        });

        // Scroll view viewport
        const viewport = new pc.Entity("Viewport");
        viewport.addChild(content);

        viewport.addComponent("element", {
            anchor: new pc.Vec4(0, 0, 1, 1),
            color: new pc.Color(0, 1, 0),
            margin: new pc.Vec4(0, 20, 20, 0),
            mask: true,
            opacity: 1,
            pivot: new pc.Vec2(0, 1),
            rect: new pc.Vec4(0, 0, 1, 1),
            type: pc.ELEMENTTYPE_IMAGE,
            useInput: false,
        });

        this.scrollviewMelee = new pc.Entity("ScrollView");
        this.scrollviewMelee.addChild(viewport);

        this.panel.addChild(this.scrollviewMelee);

        this.scrollviewMelee.addComponent("element", {
            anchor: new pc.Vec4(0.5, 0.4, 0.5, 0.4),
            height: 550,
            pivot: new pc.Vec2(0.5, 0.5),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: false,
            width: 440,
        });

        this.scrollviewMelee.addComponent("scrollview", {
            bounceAmount: 0.5,
            contentEntity: content,
            friction: 0.05,
            useMouseWheel: true,
            mouseWheelSensitivity: pc.Vec2.ONE,
            scrollMode: pc.SCROLL_MODE_CLAMP,
            vertical: true,
            viewportEntity: viewport,
        });
    }

    _getLevelCharacterMeleeUnlock() {
        return UserData.levelMeleeUnlock;
    }

    _initContentRange() {
        var groupRange = new pc.Entity("Text");
        groupRange.addComponent("element", {
            anchor: new pc.Vec4(0.2, 0, 0.8, 1),
            pivot: new pc.Vec2(0.5, 0.5),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: true,
        });

        var levelUnlock = this._getLevelCharacterRangeUnlock();

        DataManager.getCardCharacterData().range.forEach((item, index) => {
            let anchor_x = index % 2 == 0 ? 0.25 : 0.75;
            let pos = Math.floor(index / 2) * 250;
            let element = new ElementCardCharacter({
                anchor: new Vec4(anchor_x, 0.89, anchor_x, 0.89),
                pivot: new Vec2(0.5, 1),
                position: new Vec3(0, -pos, 0),
            }, item.image, item.hp, item.dame);

            groupRange.addChild(element);
            this.groupElementRange.push(element);
            if (item.level <= levelUnlock) {
                element.setActive(true);
            }
        })

        const content = new pc.Entity("Content");
        content.addChild(groupRange);

        content.addComponent("element", {
            anchor: new pc.Vec4(0.5, 1, 0.5, 1),
            height: DataManager.getCardCharacterData().melee.length / 2 * 250 + 30,
            pivot: new pc.Vec2(0.5, 1),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: true,
            width: 600,
        });

        // Scroll view viewport
        const viewport = new pc.Entity("Viewport");
        viewport.addChild(content);

        viewport.addComponent("element", {
            anchor: new pc.Vec4(0, 0, 1, 1),
            color: new pc.Color(0, 1, 0),
            margin: new pc.Vec4(0, 20, 20, 0),
            mask: true,
            opacity: 1,
            pivot: new pc.Vec2(0, 1),
            rect: new pc.Vec4(0, 0, 1, 1),
            type: pc.ELEMENTTYPE_IMAGE,
            useInput: false,
        });

        this.scrollviewRange = new pc.Entity("ScrollView");
        this.scrollviewRange.addChild(viewport);

        this.panel.addChild(this.scrollviewRange);

        this.scrollviewRange.addComponent("element", {
            anchor: new pc.Vec4(0.5, 0.4, 0.5, 0.4),
            height: 550,
            pivot: new pc.Vec2(0.5, 0.5),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: false,
            width: 440,
        });

        this.scrollviewRange.addComponent("scrollview", {
            bounceAmount: 0.5,
            contentEntity: content,
            friction: 0.05,
            useMouseWheel: true,
            mouseWheelSensitivity: pc.Vec2.ONE,
            scrollMode: pc.SCROLL_MODE_CLAMP,
            vertical: true,
            viewportEntity: viewport,
        });
    }

    _getLevelCharacterRangeUnlock() {
        return UserData.levelRangeUnlock;
    }

    setActiveMelee(active) {
        this.scrollviewMelee.enabled = active;
        this.scrollviewRange.enabled = !active;
    }

    updateCardUnlock() {
        this.groupElementMelee.forEach((item, index) => {
            if (index + 1 <= UserData.levelMeleeUnlock) {
                item.setActive(true);
            }
            else {
                item.setActive(false);
            }
        });
        this.groupElementRange.forEach((item, index) => {
            if (index + 1 <= UserData.levelRangeUnlock) {
                item.setActive(true);
            }
            else {
                item.setActive(false);
            }
        });
    }

    resize() {
        this.panel.element.anchor = new Vec4(
            DataManager.getDataReposive().cardCharacter.anchor_x,
            DataManager.getDataReposive().cardCharacter.anchor_y,
            DataManager.getDataReposive().cardCharacter.anchor_x,
            DataManager.getDataReposive().cardCharacter.anchor_y
        );

        var scale = DataManager.getDataReposive().cardCharacter.scale;
        this.panel.setLocalScale(scale, scale, scale);

    }
}