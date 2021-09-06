package com.example.demo.serviceimpl;

import com.example.demo.bean.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    //将DAO注入Service层
    @Autowired
    private UserMapper userMapper;

    @Override
    public User findByOpenid(String openid) {
        User user = userMapper.findByOpenid(openid);
//        System.out.println("findByOpenid " + user);
        return user;
    }

    @Override
    public void insert(User user) {
        userMapper.insert(user);
    }

    @Override
    public void updateScore(User user) {
        userMapper.updateScore(user);
    }
}
