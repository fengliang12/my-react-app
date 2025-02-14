import { appStore } from "../store/index";

/**
 * 同步用户信息
 * @param user
 */
export const setLayoutUser = (user: Partial<Edit.User>) => appStore.setUser(user);

