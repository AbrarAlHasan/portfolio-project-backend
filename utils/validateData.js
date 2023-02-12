import UserModal from "../models/user.model.js";

export const findUsername = (username) => UserModal.find(username);
export const findUserId = (userId) => UserModal.findById(userId);
