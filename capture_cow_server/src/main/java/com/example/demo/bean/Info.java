package com.example.demo.bean;

public class Info {

    private String nickname;
    private String gender;
    private int age;

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getNickname() {
        return nickname;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getGender() {
        return gender;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return "Info{" +
                "nickname='" + nickname + '\'' +
                ", gender='" + gender + '\'' +
                ", age=" + age +
                '}';
    }

}
