export default function convertHourToMinutes(time: string) {
	const [hour, minutes] = time.split(':').map(Number) //destructing an array
	const timeInMinutes = (hour * 60) + minutes
	return timeInMinutes
}