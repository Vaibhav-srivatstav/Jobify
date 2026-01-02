export function getUserId() {
  if (typeof window !== "undefined") {
    let id = localStorage.getItem("app_user_id");
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("app_user_id", id);
    }
    return id;
  }
  return "user_fallback";
}