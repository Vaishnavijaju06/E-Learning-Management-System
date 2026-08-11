package com.skillforge.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
    name = "course_modules",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"course_id", "position"}
    )
)
public class CourseModule extends BaseEntity {

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false)
    private Integer position;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(
        mappedBy = "module",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Lesson> lessons = new ArrayList<>();

    @OneToOne(
        mappedBy = "module",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private Quiz quiz;
}
