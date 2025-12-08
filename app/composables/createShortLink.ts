/* Return NULL if the long url is not valid, and a regulated string if it is valid */
function regulateLongURL(LongURL: string) {
	let newLongURL = LongURL;

	if (newLongURL.length < 1 ){
		console.log("The long url is too short.")
		return null;
	}

	if (!checkIfIsTLD(newLongURL.toUpperCase())) {
		console.log("The url doesn't contain a top level domain.")
		return null
	}

	if (!newLongURL.includes("http") || !newLongURL.includes("https")) {
		newLongURL = `https://${newLongURL}`;
	}

	return newLongURL;
}

/**
 * 
 * @param host The hostname
 * @param headers Headers to use when invoking the edge function
 * @returns Returns null if there is an error and the short link link if everything went ok
 */

export default async function (host: string, headers: object):Promise<string | null> {
	const supabase = useSupabaseClient();

	const inputTextCustomURL = useState("inputTextCustomURL", () => "");
	const inputTextLongURL = useState("inputTextLongURL", () => "");
	const newShortURL = useState("newShortURL", () => "");

	const longURL = regulateLongURL(inputTextLongURL.value);

	if (!longURL) {
		return null;
	}

	interface Body {
		long_url:string,
		custom_url?:string
	}

	let body:Body = {
		long_url: longURL,
	};

	/* The custom url is above the legal limit*/
	if (inputTextCustomURL.value.trim().length > 2) {
		body.custom_url = inputTextCustomURL.value.trim();
	} 
	
	/* The custom url is under the limit  */
	if (inputTextCustomURL.value.trim().length <= 2 && inputTextCustomURL.value.trim().length > 0) {
		console.log("The custom name for the URL has too few leters.")
		return null
	}

	const { data, error } = await supabase.functions.invoke(
		"generateShortLink",
		{
			method: "POST",
			...headers,
			body: body,
		}
	);

	if (data) {
		newShortURL.value = `${host}/${data.short_url}`;
		return newShortURL.value
	}

	if (error) {
		console.error(error);
		return null
	}

	return null
}
