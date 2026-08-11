package com.skillforge.backend.enums;

public enum ChatIntent {

    // --- Public / General Course Information ---
    COURSE_SEARCH,
    COURSE_DETAILS,
    COURSE_FEES,
    COURSE_DURATION,

    // --- Student Intents ---
    ENROLLMENT,
    MY_ENROLLMENTS,
    CERTIFICATE,
    PAYMENT_STATUS,

    // --- Instructor Intents ---
    INSTRUCTOR_MY_COURSES,
    INSTRUCTOR_STUDENTS_LIST,
    INSTRUCTOR_EARNINGS,
    INSTRUCTOR_COURSE_STATUS,

    // --- Authentication & Account (All Users) ---
    LOGIN_HELP,
    PASSWORD_RESET,
    EMAIL_VERIFICATION,
    CONTACT_INFO,

    // --- Admin Intents ---
    ADMIN_USERS,
    ADMIN_PENDING_COURSES,
    ADMIN_INSTRUCTOR_APPROVALS,
    ADMIN_REVENUE,
    ADMIN_DASHBOARD,

    // --- Fallback ---
    GENERAL_QUERY
}