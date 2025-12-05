/* Return NULL if the short link is not valid, and a regulated string if it is valid */
function regulateShortLink(shortLink: string) {
	let newShortlink = shortLink;

	if (newShortlink.length < 1 && !newShortlink.includes(".")) {
		return null;
	}

	if (!newShortlink.includes("http") || !newShortlink.includes("https")) {
		newShortlink = `https://${newShortlink}`;
	}

	return newShortlink;
}

export default async function (host: string, headers: object) {
	const supabase = useSupabaseClient();

	const inputTextCustomURL = useState("inputTextCustomURL", () => "");
	const inputTextLongURL = useState("inputTextLongURL", () => "");
	const newShortURL = useState("newShortURL", () => "");

	const longURL = regulateShortLink(inputTextLongURL.value);

	if (!longURL) {
		return;
	}

	interface Body {
		long_url:string,
		custom_url?:string
	}

	let body:Body = {
		long_url: longURL,
	};

	if (inputTextCustomURL.value.trim().length > 3) {
		body.custom_url = inputTextCustomURL.value.trim();
	} else {
		inputTextCustomURL.value = ""
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
	}

	if (error) {
		console.error(error);
	}
}
