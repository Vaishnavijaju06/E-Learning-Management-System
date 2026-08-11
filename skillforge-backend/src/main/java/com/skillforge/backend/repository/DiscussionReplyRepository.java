package com.skillforge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.DiscussionReply;

public interface DiscussionReplyRepository
        extends JpaRepository<DiscussionReply, Long> {

    List<DiscussionReply>
        findByDiscussionIdOrderByCreatedAtAsc(
            Long discussionId
        );
}