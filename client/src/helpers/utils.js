export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const generateId = (len) => {
	const dec2hex = (dec) => {
		return dec.toString(16).padStart(2, "0")
	}
	const arr = new Uint8Array((len || 40) / 2)
	window.crypto.getRandomValues(arr)
	return Array.from(arr, dec2hex).join('')
};