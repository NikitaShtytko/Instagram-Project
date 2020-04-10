package com.netcracker.edu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;


@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "login")
    private String login;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "gender")
    private String gender;

    @Column(name = "role")
    private String role;

    @Column(name = "status")
    private String status;

//    @ManyToOne()
//    @JoinColumn(name = "role_id", nullable = false)
//    private Role role;

    @OneToMany()
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
    private List<Ban> ban;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id")
    private List<Post> post;

    @JsonIgnore
    @OneToMany
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private List<Comment> comment;
}


//TODO generic