"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertHourToMinutes(time) {
    const [hour, minutes] = time.split(':').map(Number); //destructing an array
    const timeInMinutes = (hour * 60) + minutes;
    return timeInMinutes;
}
exports.default = convertHourToMinutes;
