/**
 * Creates a short url for the long url, and creates a QR code
 *
 * @param element The element to add the img to
 * @param url The url to create a URL code for
 * @param hostname The hostname
 * @param headers The headers to use
 * @param linkElementID (optional) The <a> elements ID to add download link to 
 */
export default async function (
	element: Element,
	hostname: string,
	headers: object,
	linkElementID?: string,
): Promise<void> {
	const newLink = await createShortLink(hostname, headers);
	const newShortURL = useState("newShortURL", () => "");

	if (newLink) {
		const base64URL = createQRCode(newShortURL.value);

		const imgElement = document.createElement("img");
		imgElement.src = base64URL;
		imgElement.id = "qr-code-img"
        // imgElement.height = 150;

		element.appendChild(imgElement);

		if (linkElementID) {

			const linkElement = document.getElementById(linkElementID) as HTMLAnchorElement;
			console.log(linkElement)

			linkElement.href = base64URL;
			linkElement.download = "qrcode.gif"
		}
	} else {
		console.error(
			"There was something wrong with creating the new short url, and not QR code was created."
		);
	}
}
