const puppeteer = require("puppeteer");
export default async (req, res) => {
	res.status(200).json(await getdata(req.body.email, req.body.password));
};

async function getdata(email, password) {
	let browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--incognito",
			"--single-process",
			"--no-zygote",
		],
	});
	let page = await browser.newPage();
	await page.goto("https://bux.bracu.ac.bd/login"),
		await page.type("#login-email", email);
	await page.type("#login-password", password);

	await page.click("#login > button");
	page.setDefaultNavigationTimeout(9000);

	try {
		await page.waitForNavigation({ waitUntil: "networkidle2" });
	} catch (error) {
		browser.close();
		return "{}";
	}

	let currentcookies = await page.cookies();
	browser.close();
	return currentcookies;
}
