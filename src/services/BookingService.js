
const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offsetMinutes * 60 * 1000);
    return localTime.toISOString().slice(0, 16); // Формат: "YYYY-MM-DDTHH:mm"
};

export default {
    getCurrentDateTimeLocal,
}
