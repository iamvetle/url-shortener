export default async function (shortLink: string, headers:object) {
    const supabase = useSupabaseClient()
    
    const { data, error } = await supabase.functions.invoke("getLongURL", {
		method: "POST",
		...headers,
		body: {
			short_url: shortLink,
		},
	});

	if (error) {
		console.error(error);
	}

	if (data) {
		console.log("data", data);
		return data.data.long_url;
	}

	return null;
}