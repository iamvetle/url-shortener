<template>
	<div>
		{{ text }}
	</div>
</template>

<script setup lang="ts">
	const route = useRoute();

	const supabase = useSupabaseClient();

	const text: any = ref(null);

	async function getLongURL(shortLink: string) {
		const { data, error } = (await supabase
			.from("shortens")
			.select("long_url")
			.eq("shortened_url_end", shortLink)
			.single()) as {
			data: { long_url: string } | null;
			error: null;
		};

		if (error) {
			console.error(error);

			return null;
		}

		if (data?.long_url) {
			return data.long_url;
		}

		return null;
	}

	const path = route.fullPath;

  if (path != "/") {
    const fixedPath = path.slice(1);
    const url = await getLongURL(fixedPath);
  	if (url) {
		await navigateTo(url, {
			external: true,
		});
	} else {
    text.value = "That link doesn't work."
  }
  }


</script>
