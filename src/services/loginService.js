import apiClient from "@/services/apiClient"; // твой экземпляр axios

export default {
    async login(credentials) {
        try {
            const response = await apiClient.post("/user/login", credentials);
            return { success: true, data: response.data };
        } catch (error) {
            let message = "Ошибка входа";

            if (error.response && error.response.data.message) {
                message = error.response.data.message;
            } else if (error.request) {
                message = "Нет ответа от сервера";
            }

            return { success: false, message };
        }
    },
};