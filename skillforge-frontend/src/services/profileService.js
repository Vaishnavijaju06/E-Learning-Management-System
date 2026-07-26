import { initialStudentProfile } from "../data/studentProfile";

const PROFILE_STORAGE_KEY = "skillforge-student-profile";

const cloneInitialProfile = () =>
  JSON.parse(JSON.stringify(initialStudentProfile));

export const getStudentProfile = () => {
  try {
    const storedProfile = localStorage.getItem(
      PROFILE_STORAGE_KEY
    );

    if (!storedProfile) {
      return cloneInitialProfile();
    }

    return {
      ...cloneInitialProfile(),
      ...JSON.parse(storedProfile),
    };
  } catch {
    return cloneInitialProfile();
  }
};

export const updateStudentProfile = (profile) => {
  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile)
  );

  return profile;
};

export const resetStudentProfile = () => {
  const defaultProfile = cloneInitialProfile();

  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(defaultProfile)
  );

  return defaultProfile;
};