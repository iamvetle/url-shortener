import qrcode from "qrcode-generator"

/**
* @param element The element to add the img to
* @param url The url to create a URL code for
*/
export default function (element: Element, url:string) {
    const qr = qrcode(4, "M")
    qr.addData(url)
    qr.make();
    element.innerHTML = qr.createImgTag(12);
}