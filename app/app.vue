<template>
	<div>
		<p>Add your url to shorten it</p>
		<input v-model="inputText" />
		<button @click="createShortLink()">Create Link</button>
		<p v-if="newShortURL">{{ newShortURL }}</p>
	</div>
</template>

<script setup lang="ts">
	const supabase = useSupabaseClient();
	const host = "localhost:3000";

			const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers":
				"authorization, x-client-info, apikey, content-type",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		};

	async function getLongURL(shortLink: string) {
		const { data, error } = (await supabase
			.from("shortens")
			.select("long_url")
			.eq("short_url", shortLink)
			.single()) as {
			data: { long_url: string } | null;
			error: any;
		};

		if (error) {
			console.error(error);
			return null;
		}

		if (data?.long_url) {
			return data.long_url;
		}

		return null;

	// 	const { data, error } = await supabase.functions.invoke(
	// 		"generateShortLink",
	// 		{
	// 			method: "POST",
	// 			...corsHeaders,
	// 			body: {
	// 				short_url: shortLink
	// 			},
	// 		}
	// 	);	

	// 	if (error) {
	// 		console.error(error)
	// 	}

	// 	if (data) {
	// 		data.long_url
	// 	}

	// 	return null

	}

	const route = useRoute();

	if (route.path !== "/") {
		const fixedPath = route.path.slice(1);
		console.log(fixedPath);

		const url = await getLongURL(fixedPath);
		if (url) {
			await navigateTo(url, {
				external: true,
			});
		}
	}

	const inputText = ref("");
	const newShortURL = ref("");

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

	async function createShortLink() {

		const longURL = regulateShortLink(inputText.value);

		if (!longURL) {
			return;
		}

		const { data, error } = await supabase.functions.invoke(
			"generateShortLink",
			{
				method: "POST",
				...corsHeaders,
				body: {
					long_url: longURL
				},
			}
		);

		if (data) {
			newShortURL.value = `${host}/${data.short_url}`;
		}

		if (error) {
			console.error(error);
		}
	}
</script>
