const puppeteer = require("puppeteer");
export default async (req, res) => {
	res.status(200).json(await getdata(req.body.cookies));
};

async function getdata(cookies) {
	// const browser = await puppeteer.launch();
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
	cookies = JSON.parse(cookies);
	const link = "https://bux.bracu.ac.bd/dashboard";
	await page.setCookie(...cookies);
	page.setDefaultNavigationTimeout(0);
	await page.goto(link, { waitUntil: "networkidle2" });
	let texts = await page.evaluate(() => {
		data = [];
		const parents = document.getElementsByClassName("action action-more");

		for (var parent of parents) {
			var course = {
				title: parent.getAttribute("data-course-name"),
				course_id: parent.getAttribute("data-course-number"),
				id:
					"https://bux.bracu.ac.bd/courses/" +
					parent.parentNode.getAttribute("data-course-key") +
					"/course/",
				semester: parent.parentNode
					.getAttribute("data-course-key")
					.split("+")[2]
					.split("/")[0],
			};
			data.push(course);
		}
		return data;
	});
	browser.close();
	return texts;
}
