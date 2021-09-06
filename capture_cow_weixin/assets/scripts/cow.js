const cow_skin = cc.Class({
    name: "cow_skin",
    properties: {
        cows: {
            default: [],
            type: [cc.SpriteFrame]
        }
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        cow_sets: {
            default: [],
            type: [cow_skin]
        }
    },

    onLoad() {
        this.intervalTime = 0;
        this.randomType = Math.floor(Math.random() * 3);
    },

    start() {

    },

    update(dt) {
        this.intervalTime += dt;
        // cc.log("dt", dt);
        let index = Math.floor(this.intervalTime / 0.2);
        index = index % 3;
        // cc.log("index", index + "");
        let cowSet = this.cow_sets[this.randomType];
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = cowSet.cows[index];
    },

    runCallback() {
        cc.log("一个轮回结束");
        this.randomType = Math.floor(Math.random() * 3);
    }
});