package com.skillforge.backend.service;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.skillforge.backend.client.ChatbotClient;
import com.skillforge.backend.dto.ChatbotContext;
import com.skillforge.backend.dto.ChatbotRequest;
import com.skillforge.backend.dto.ChatbotResponse;
import com.skillforge.backend.enums.ChatIntent;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.security.CustomUserDetails;

@Service
public class ChatbotOrchestratorService {

	private final ChatbotClient chatbotClient;
	private final ChatbotContextService chatbotContextService;

	public ChatbotOrchestratorService(ChatbotClient chatbotClient, ChatbotContextService chatbotContextService) {
		this.chatbotClient = chatbotClient;
		this.chatbotContextService = chatbotContextService;
	}

	public ChatbotResponse processChat(ChatbotRequest request, Authentication authentication) {
		CustomUserDetails currentUser = detectUser(request, authentication);
		ChatIntent detectedIntent = detectIntent(request.getMessage(), request.getRole());

		// Defense-in-depth: Prevent unauthorized roles from triggering restricted
		// intents
		if (isAdminIntent(detectedIntent) && request.getRole() != Role.ADMIN) {
			detectedIntent = ChatIntent.GENERAL_QUERY;
		} else if (isInstructorIntent(detectedIntent) && request.getRole() != Role.INSTRUCTOR) {
			detectedIntent = ChatIntent.GENERAL_QUERY;
		}

		request.setIntent(detectedIntent);

		Long userId = currentUser != null ? currentUser.getId() : null;

		if (userId != null || isPublicCourseIntent(request.getIntent())
				|| request.getIntent() == ChatIntent.GENERAL_QUERY) {
			ChatbotContext context = chatbotContextService.getContext(request.getIntent(), userId, request.getRole());
			request.setContext(context);
		}

		return chatbotClient.send(request);
	}

	private boolean isPublicCourseIntent(ChatIntent intent) {
		return intent == ChatIntent.COURSE_FEES || intent == ChatIntent.COURSE_SEARCH
				|| intent == ChatIntent.COURSE_DETAILS || intent == ChatIntent.COURSE_DURATION;
	}

	private boolean isAdminIntent(ChatIntent intent) {
		return intent != null && intent.name().startsWith("ADMIN_");
	}

	private boolean isInstructorIntent(ChatIntent intent) {
		return intent != null && intent.name().startsWith("INSTRUCTOR_");
	}

	private CustomUserDetails detectUser(ChatbotRequest request, Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()
				|| authentication instanceof AnonymousAuthenticationToken) {
			request.setRole(Role.VISITOR);
			request.setUserName("Guest");
			return null;
		} else {
			CustomUserDetails currentUser = (CustomUserDetails) authentication.getPrincipal();
			request.setRole(currentUser.getRole());
			request.setUserName(currentUser.getFirstName());
			return currentUser;
		}
	}

	private ChatIntent detectIntent(String message, Role role) {
		String text = message.toLowerCase().trim();

		// --- Admin-Specific Queries ---
		if (role == Role.ADMIN) {
			if (text.contains("pending course") || text.contains("course approval")
					|| text.contains("pending courses")) {
				return ChatIntent.ADMIN_PENDING_COURSES;
			}
			if (text.contains("pending instructor") || text.contains("instructor approval")
					|| text.contains("instructor")) {
				return ChatIntent.ADMIN_INSTRUCTOR_APPROVALS;
			}
			if (text.contains("revenue") || text.contains("earnings") || text.contains("sales")
					|| text.contains("income")) {
				return ChatIntent.ADMIN_REVENUE;
			}
			if (text.contains("user") || text.contains("account") || text.contains("student")) {
				return ChatIntent.ADMIN_USERS;
			}
			if (text.contains("dashboard") || text.contains("analytics") || text.contains("overview")
					|| text.contains("stats")) {
				return ChatIntent.ADMIN_DASHBOARD;
			}
		}

		// --- Instructor-Specific Queries ---
		if (role == Role.INSTRUCTOR) {
			if (text.contains("earning") || text.contains("revenue") || text.contains("sale")
					|| text.contains("money")) {
				return ChatIntent.INSTRUCTOR_EARNINGS;
			}
			if (text.contains("student") || text.contains("enrolled") || text.contains("pupil")) {
				return ChatIntent.INSTRUCTOR_STUDENTS_LIST;
			}
			if (text.contains("status") || text.contains("approval")) {
				return ChatIntent.INSTRUCTOR_COURSE_STATUS;
			}
			if (text.contains("course") || text.contains("my class")) {
				return ChatIntent.INSTRUCTOR_MY_COURSES;
			}
		}

		// --- Student-Specific Queries ---
		if (text.contains("my course") || text.contains("my enrollment") || text.contains("enrolled")
				|| text.contains("progress")) {
			return ChatIntent.MY_ENROLLMENTS;
		}

		if (text.contains("certificate") || text.contains("certification")) {
			return ChatIntent.CERTIFICATE;
		}

		if (text.contains("payment") || text.contains("invoice") || text.contains("transaction")
				|| text.contains("refund")) {
			return ChatIntent.PAYMENT_STATUS;
		}

		// --- Account / Support Queries ---
		if (text.contains("forgot password") || text.contains("reset password") || text.contains("reset my password")
				|| text.contains("change my password")) {
			return ChatIntent.PASSWORD_RESET;
		}

		if (text.contains("verify") && text.contains("email")) {
			return ChatIntent.EMAIL_VERIFICATION;
		}

		if (text.contains("can't log in") || text.contains("cannot log in") || text.contains("can't login")
				|| text.contains("cannot login") || text.contains("unable to log in")
				|| text.contains("unable to login") || text.contains("sign in") || text.contains("login")) {
			return ChatIntent.LOGIN_HELP;
		}

		if (text.contains("how do i enroll") || text.contains("how to enroll") || text.contains("sign up for")
				|| text.contains("join this course") || text.contains("enroll")) {
			return ChatIntent.ENROLLMENT;
		}

		// --- Course Catalog & Information Queries ---
		if (text.contains("fee") || text.contains("price") || text.contains("cost") || text.contains("how much")) {
			return ChatIntent.COURSE_FEES;
		}

		if (text.contains("how long") || text.contains("duration") || text.contains("how many hours")
				|| text.contains("how many weeks")) {
			return ChatIntent.COURSE_DURATION;
		}

		if (text.contains("syllabus") || text.contains("curriculum") || text.contains("what will i learn")
				|| text.contains("course content") || text.contains("about this course")
				|| text.contains("course details")) {
			return ChatIntent.COURSE_DETAILS;
		}

		if (text.contains("find a course") || text.contains("looking for a course")
				|| text.contains("recommend a course") || text.contains("search course") || text.contains("courses on")
				|| text.contains("courses about")) {
			return ChatIntent.COURSE_SEARCH;
		}

		if (text.contains("contact") || text.contains("support") || text.contains("help desk")
				|| text.contains("phone number") || text.contains("customer service")) {
			return ChatIntent.CONTACT_INFO;
		}

		if (text.contains("course")) {
			return ChatIntent.COURSE_SEARCH;
		}
		

		return ChatIntent.GENERAL_QUERY;
	}
}