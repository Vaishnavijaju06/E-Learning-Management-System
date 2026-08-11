package com.skillforge.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.DiscussionReplyRequest;
import com.skillforge.backend.dto.DiscussionReplyResponse;
import com.skillforge.backend.dto.DiscussionRequest;
import com.skillforge.backend.dto.DiscussionResponse;
import com.skillforge.backend.service.DiscussionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/discussions")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class DiscussionController {

    private final DiscussionService discussionService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DiscussionResponse>
        createDiscussion(
            @Valid
            @RequestBody
            DiscussionRequest request
        ) {

        return ResponseEntity.ok(
            discussionService.createDiscussion(request)
        );
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<DiscussionResponse>>
        getCourseDiscussions(
            @PathVariable Long courseId
        ) {

        return ResponseEntity.ok(
            discussionService
                .getCourseDiscussions(courseId)
        );
    }

    @GetMapping("/{discussionId}")
    public ResponseEntity<DiscussionResponse>
        getDiscussion(
            @PathVariable Long discussionId
        ) {

        return ResponseEntity.ok(
            discussionService
                .getDiscussion(discussionId)
        );
    }

    @PostMapping("/{discussionId}/replies")
    public ResponseEntity<DiscussionReplyResponse>
        addReply(
            @PathVariable Long discussionId,
            @Valid
            @RequestBody
            DiscussionReplyRequest request
        ) {

        return ResponseEntity.ok(
            discussionService.addReply(
                discussionId,
                request
            )
        );
    }

    @PutMapping("/{discussionId}/resolve")
    public ResponseEntity<DiscussionResponse>
        resolveDiscussion(
            @PathVariable Long discussionId
        ) {

        return ResponseEntity.ok(
            discussionService
                .resolveDiscussion(discussionId)
        );
    }

    @PutMapping("/{discussionId}/close")
    @PreAuthorize(
        "hasAnyRole('INSTRUCTOR','ADMIN')"
    )
    public ResponseEntity<DiscussionResponse>
        closeDiscussion(
            @PathVariable Long discussionId
        ) {

        return ResponseEntity.ok(
            discussionService
                .closeDiscussion(discussionId)
        );
    }

    @DeleteMapping("/{discussionId}")
    public ResponseEntity<Map<String, String>>
        deleteDiscussion(
            @PathVariable Long discussionId
        ) {

        discussionService
            .deleteDiscussion(discussionId);

        return ResponseEntity.ok(
            Map.of(
                "message",
                "Discussion deleted successfully"
            )
        );
    }
}