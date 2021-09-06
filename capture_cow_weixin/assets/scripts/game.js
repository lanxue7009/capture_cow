cc.Class({
    extends: cc.Component,

    properties: {
        rope_node: {
            default: null,
            type: cc.Node
        },
        cow_ins: {
            default: null,
            type: cc.Node
        },

        rope_imgs: {
            default: [],
            type: [cc.SpriteFrame]
        },
        cow_prefab: {
            default: null,
            type: cc.Prefab
        },
        time: 0
    },

    onLoad() {
        this.success = false;
        this.scoreNum = 0;
    },

    start() {
        let countDownLabel = cc.find("Canvas/bg_sprite/count_down").getComponent(cc.Label);
        countDownLabel.string = this.time + "s";
        this.schedule(function() {
            this.time--;
            countDownLabel.string = this.time + "s";
            if (this.time == 0) {
                cc.log("游戏结束...");
                // 获取弹窗节点
                let resultNode = cc.find("Canvas/bg_sprite/result");
                cc.log("游戏结束...", (resultNode == null));
                //获取title和content两个节点
                let titleNode = resultNode.getChildByName("title");
                let contentNode = resultNode.getChildByName("content");
                // 展示分数
                titleNode.getComponent(cc.Label).string = "最终得分 " + this.scoreNum;
                // 获取组件
                let contentLabel = contentNode.getComponent(cc.Label);
                switch (true) {
                    case this.scoreNum <= 3:
                        contentLabel.string = "套牛青铜";
                        break;
                    case this.scoreNum < 6:
                        contentLabel.string = "套牛高手";
                        break;
                    case this.scoreNum >= 6:
                        contentLabel.string = "套牛王者";
                        break;

                }
                resultNode.active = true;
                this.rope_node.active = false;
                let bgNode = cc.find("Canvas/bg_sprite");
                bgNode.removeChild(this.cow_ins);
                let score = this.scoreNum;
                //调用接口，后台更新成绩
                wx.login({
                    success(res) {
                        if (res.code) {
                            wx.request({
                                url: "http://localhost:8080/updateScore",
                                method: "POST",
                                header: {
                                    'content-type': "application/x-www-form-urlencoded"
                                },
                                data: {
                                    code: res.code,
                                    score: score
                                }
                            })
                        }
                    }
                });
                //暂停游戏
                cc.director.pause();
                cc.log("游戏结束...pause");
            }
        }, 1);

        let sysInfo = wx.getSystemInfoSync();
        let screenWidth = sysInfo.screenWidth;
        let screenHeight = sysInfo.screenHeight;

        //创建一个用户授权按钮
        const wxLoginBtn = wx.createUserInfoButton({
            type: "text",
            text: "",
            style: {
                left: 0,
                top: 0,
                width: screenWidth,
                height: screenHeight,
                backgroundColor: '#00000000',
            }
        });

        let self = this;
        wxLoginBtn.onTap((res) => {
            console.log(res.userInfo);
            let userInfo = res.userInfo;
            self.wxLogin(userInfo);
            wxLoginBtn.destroy();
        });

        wx.getUserInfo({
            success(res) {
                let userInfo = res.userInfo;
                console.log(userInfo);
                self.wxLogin(userInfo);
                wxLoginBtn.destroy();
            },
            fail(res) {
                console.log("获取用户信息失败");
            }
        });

        // let bannerAd = wx.createBannerAd({
        //     adUnitId: "adunit-7d733ad66a23b87b",
        //     style: {
        //         left: 27.5,
        //         top: 80,
        //         width: 320
        //     }
        // });
        // bannerAd.onError(err => {
        //     console.log(err);
        // });

        // bannerAd.show();

    },

    wxLogin(userInfo) {
        let icon = cc.find("Canvas/bg_sprite/icon").getComponent(cc.Sprite);
        cc.loader.load({
            url: userInfo.avatarUrl,
            type: "png"
        }, function(err, texture) {
            icon.spriteFrame = new cc.SpriteFrame(texture);
        });

        //调用后台接口，登陆成功
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求给游戏后台
                    console.log(res);
                    wx.request({
                        url: "http://localhost:8080/login",
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            code: res.code,
                            nickName: userInfo.nickName,
                            avatarUrl: userInfo.avatarUrl
                        },
                        success(res) {
                            console.log(res);
                        }
                    })
                } else {
                    console.log("登录失败" + res.errMsg);
                }
            }
        })

    },

    update(dt) {

    },
    clickCapture(event, customEventData) {
        this.rope_node.active = true;
        //设置当前节点在父节点中的顺序
        this.rope_node.setSiblingIndex(100);

        this.rope_node.y = -480;
        const up = cc.moveTo(0.5, this.rope_node.x, 60);
        // this.rope_node.runAction(up);

        let result = cc.callFunc(function() {
            let currentX = this.cow_ins.x;
            if (currentX > -100 && currentX < 100) {
                cc.log("捕捉成功!");
                //移除牛儿
                // let bgNode = cc.find("Canvas/bg_sprite");
                let bgNode = this.node.getChildByName("bg_sprite");
                bgNode.removeChild(this.cow_ins);

                //获取牛的类型
                let ropeType = this.cow_ins.getComponent("cow").randomType + 1;
                this.rope_node.getComponent(cc.Sprite).spriteFrame = this.rope_imgs[ropeType];

                //生成新的牛节点
                this.cow_ins = cc.instantiate(this.cow_prefab);
                this.cow_ins.y = 0;
                bgNode.addChild(this.cow_ins);

                this.success = true;
                this.scoreNum++;

            } else {
                cc.log("捕捉失败!");
            }
        }, this);

        let down = cc.moveTo(0.5, this.rope_node.x, -600);

        let finish = cc.callFunc(function() {
            this.rope_node.getComponent(cc.Sprite).spriteFrame = this.rope_imgs[0];
            if (this.success == true) {
                //显示分数+1
                let scoreLabel = cc.find("Canvas/bg_sprite/score").getComponent(cc.Label);
                scoreLabel.string = "Score:" + this.scoreNum;
                // cc.log("Score:" + this.scoreNum);
                this.success = false;
            }
        }, this);

        let sequence = cc.sequence(up, result, down, finish);
        this.rope_node.runAction(sequence);

    },

    closeBtn() {
        cc.log("继续游戏");
        cc.director.resume();
        cc.director.loadScene("game");
    },

    shareBtn() {
        wx.shareAppMessage({
            title: "大家都来玩套牛小游戏",
            imageUrl: "http://img.zhubohome.com.cn/game_share.png",
            success(res) {
                console.log("分享成功，" + res);
            },
            fail(res) {
                console.log("分享失败，" + res);
            }
        })
    },

});