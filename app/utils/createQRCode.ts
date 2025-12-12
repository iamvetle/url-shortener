import qrcode from "qrcode-generator"

/**
* @param url The url to create a URL code for
* @returns A Base64 image url
*/
export default function (url:string, type?:string):string {
    const qr = qrcode(4, "M")
    qr.addData(url);    
    qr.make();

    if (type == "svg") {
        return qr.createSvgTag(12)
    }

    return qr.createDataURL(12)

}