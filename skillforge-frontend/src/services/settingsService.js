const SETTINGS_STORAGE_KEY = "skillforge-student-settings";

const defaultSettings = {
  emailNotifications: true,
  courseUpdates: true,
  assignmentReminders: true,
  certificateNotifications: true,
  promotionalEmails: false,
  profileVisibility: "public",
  showCompletedCourses: true,
  language: "English",
  theme: "light",
};

export const getStudentSettings = () => {
  try {
    const storedSettings = localStorage.getItem(
      SETTINGS_STORAGE_KEY
    );

    if (!storedSettings) {
      return { ...defaultSettings };
    }

    return {
      ...defaultSettings,
      ...JSON.parse(storedSettings),
    };
  } catch {
    return { ...defaultSettings };
  }
};

export const updateStudentSettings = (settings) => {
  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(settings)
  );

  return settings;
};

export const changeStudentPassword = ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All password fields are required");
  }

  if (currentPassword !== "Student@123") {
    throw new Error("Current password is incorrect");
  }

  if (newPassword.length < 8) {
    throw new Error(
      "New password must contain at least 8 characters"
    );
  }

  if (!/[A-Z]/.test(newPassword)) {
    throw new Error(
      "Password must contain an uppercase letter"
    );
  }

  if (!/[a-z]/.test(newPassword)) {
    throw new Error(
      "Password must contain a lowercase letter"
    );
  }

  if (!/[0-9]/.test(newPassword)) {
    throw new Error("Password must contain a number");
  }

  if (!/[^A-Za-z0-9]/.test(newPassword)) {
    throw new Error(
      "Password must contain a special character"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords do not match");
  }

  return true;
};