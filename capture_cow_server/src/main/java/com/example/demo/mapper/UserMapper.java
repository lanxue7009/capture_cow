package com.example.demo.mapper;

import com.example.demo.bean.User;

public interface UserMapper {

    User findByOpenid(String openid);

    void insert(User user);

    void updateScore(User user);
}
