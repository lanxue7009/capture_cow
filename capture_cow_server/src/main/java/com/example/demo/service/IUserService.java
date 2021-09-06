package com.example.demo.service;

import com.example.demo.bean.User;

public interface IUserService {

    User findByOpenid(String openid);

    void insert(User user);

    void updateScore(User user);
}
