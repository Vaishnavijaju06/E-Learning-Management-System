const WISHLIST_STORAGE_KEY = "skillforge-wishlist";

const readWishlist = () => {
  try {
    const storedValue = localStorage.getItem(WISHLIST_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.map(Number).filter(Number.isFinite);
  } catch {
    return [];
  }
};

const saveWishlist = (courseIds) => {
  localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify(courseIds)
  );
};

export const getWishlistCourseIds = () => {
  return readWishlist();
};

export const isCourseWishlisted = (courseId) => {
  return readWishlist().includes(Number(courseId));
};

export const toggleCourseWishlist = (courseId) => {
  const numericCourseId = Number(courseId);
  const currentWishlist = readWishlist();

  const alreadyWishlisted =
    currentWishlist.includes(numericCourseId);

  const updatedWishlist = alreadyWishlisted
    ? currentWishlist.filter((id) => id !== numericCourseId)
    : [...currentWishlist, numericCourseId];

  saveWishlist(updatedWishlist);

  return {
    wishlist: updatedWishlist,
    added: !alreadyWishlisted,
  };
};

export const removeCourseFromWishlist = (courseId) => {
  const updatedWishlist = readWishlist().filter(
    (id) => id !== Number(courseId)
  );

  saveWishlist(updatedWishlist);

  return updatedWishlist;
};

export const clearWishlist = () => {
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
};