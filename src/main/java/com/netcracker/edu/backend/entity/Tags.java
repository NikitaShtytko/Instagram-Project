package com.netcracker.edu.backend.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Tags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long id;

    private String tag;

    private String txt;

    @ManyToMany(mappedBy = "tags")
    private List<Posts> posts = new ArrayList<>();
}
