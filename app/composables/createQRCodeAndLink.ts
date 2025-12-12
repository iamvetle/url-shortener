/**
 * Creates a short url for the long url, and creates a QR code throught library and CANVAS
 *
 * @param element The element to add the img to
 * @param url The url to create a URL code for
 * @param hostname The hostname
 * @param headers The headers to use
 */
export default async function (
	element: Element,
	hostname: string,
	headers: object,
	linkElementID?: string
): Promise<void> {
	const waiting = useState("waiting", () => true);

	waiting.value = true;
	const newLink = await createShortLink(hostname, headers);
	const newShortURL = useState("newShortURL", () => "");
	const readyForDownload = useState("readyForDownload", () => false);

	var canvas;
	var ctx;

	const svgURL = useState("svgURL", () => "");
	const pngURL = useState("pngURL", () => "");

	if (newLink) {
		const base64URL = createQRCode(newShortURL.value);
		const imgElement = document.createElement("img");
		imgElement.src = base64URL;
		imgElement.id = "qr-code-img";

		imgElement.onload = () => {
			canvas = document.createElement("canvas");
			canvas.width = imgElement.naturalWidth;
			canvas.height = imgElement.naturalHeight;
			ctx = canvas.getContext("2d");
			(ctx as CanvasRenderingContext2D).drawImage(imgElement, 0, 0);
			canvas.toBlob((blob) => {
				if (!blob) {
					return;
				}

				pngURL.value = URL.createObjectURL(blob);
				imgElement.src = pngURL.value;
				imgElement.alt = "QRcode";
			});
		};

		element.appendChild(imgElement);

		const linkElementPNG = document.getElementById(
			"downloadQRLinkPNG"
		) as HTMLAnchorElement | null;

		if (linkElementPNG) {
			linkElementPNG.href = pngURL.value;
			linkElementPNG.download = "qrcode.png";

			readyForDownload.value = true;
		}

		const linkElementSVG = document.getElementById(
			"downloadQRLinkSVG"
		) as HTMLAnchorElement | null;

		// TODO - Fix this svg download thing
		if (linkElementSVG) {
			const svgElementString = createQRCode(newShortURL.value, "svg");

			const blob = new Blob([svgElementString], {
				type: "image/svg+xml",
			});
			svgURL.value = URL.createObjectURL(blob);

			linkElementSVG.href = svgURL.value;
			linkElementSVG.download = "qrcode.svg";

			readyForDownload.value = true;
		}

		waiting.value = false;
	} else {
		readyForDownload.value = false;
		console.error(
			"There was something wrong with creating the new short url, and not QR code was created."
		);
	}

	waiting.value = false;
}
