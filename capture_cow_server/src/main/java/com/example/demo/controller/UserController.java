package com.example.demo.controller;

import com.alibaba.fastjson.JSONObject;
import com.example.demo.bean.User;
import com.example.demo.serviceimpl.UserService;
import com.example.demo.util.OkHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
public class UserController {

    private static final String WX_APPID = "wxa23a01713aa2899c";
    private static final String WX_SECRET = "a6d0cf682fdcde0cfa5ceec121fb2f57";
    private static final String WX_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

    //将Service注入Web层
    @Autowired
    UserService userService;

    @RequestMapping(value = "/login",method = RequestMethod.POST)
    @ResponseBody
    public Object login(String code,String nickName,String avatarUrl) {
        // 拼接微信api请求地址
        String url = String.format(WX_URL,WX_APPID,WX_SECRET,code);
        String result = null;
        try {
            result = OkHttpClient.syncGet(url, null);
            JSONObject jsonObject = JSONObject.parseObject(result);
            System.out.println("result " + result);
            String openid = jsonObject.getString("openid");
            // 根据获取的微信openid 去判断，判断是否已经存在
            User user = userService.findByOpenid(openid);
            if (user == null) {
                // 新增一个用户
                user = new User();
                user.setNickName(nickName);
                user.setAvatarUrl(avatarUrl);
                user.setOpenid(openid);
                user.setTopScore(0);
                userService.insert(user);
                System.out.println("openid 1" + openid);
            } else {
                System.out.println("openid 2" + openid);
            }
            return "success";
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping(value = "/updateScore",method = RequestMethod.POST)
    @ResponseBody
    public Object updateScore(String code,int score) {
        // 通过code换openid
        String openid = null;
        try {
            openid = code2Openid(code);
            User user = userService.findByOpenid(openid);
            if (user == null) {
                return "error";
            }
            user.setTopScore(score);
            userService.updateScore(user);
            return "success";
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }


    private String code2Openid(String code) throws IOException {
        String url = String.format(WX_URL,WX_APPID,WX_SECRET,code);
        String result = OkHttpClient.syncGet(url, null);
        JSONObject jsonObject = JSONObject.parseObject(result);
        String openid = jsonObject.getString("openid");
        return openid;
    }

}
