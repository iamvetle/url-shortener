<template>
	<div id="page-wrapper">
		<div id="create-short-url-container">
			<div id="long-url-container">
				<label for="input-text-long-url">Long URL</label>
				<input
					id="input-text-long-url"
					type="text"
					v-model="inputTextLongURL"
				/>
			</div>

			<div id="custom-url-container">
				<div>
					<p>Domain</p>
					<p>localhost:3000</p>
				</div>
				<p>/</p>
				<div>
					<label for="input-text-custom-short-url">Custom URL (optional)</label>
					<input id="input-text-custom-short-url" type="text" v-model="inputTextCustomURL" />
				</div>
			</div>
			<button @click="createShortLink(host, corsHeaders)">
				Create Link
			</button>

			<p v-if="newShortURL">{{ newShortURL }}</p>
		</div>

		<div id="qrcode-placeholder">
		</div>
	</div>
</template>

<script setup lang="ts">
	const host = "localhost:3000";

	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers":
			"authorization, x-client-info, apikey, content-type",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	};

	const route = useRoute();

	if (route.path !== "/") {
		const fixedPath = route.path.slice(1);
		console.log(fixedPath);

		const url = await getLongURL(fixedPath, corsHeaders);
		if (url) {
			await navigateTo(url, {
				external: true,
			});
		}
	}

	const inputTextLongURL = useState("inputTextLongURL", () => "");
	const inputTextCustomURL = useState("inputTextCustomURL", () => "");
	const newShortURL = useState("newShortURL", () => "");
</script>

<style scoped>
	#long-url-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	#create-short-url-container {
		width: 450px;
		margin-right: auto;
		margin-left: auto;
	}

	#custom-url-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	#custom-url-container div {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	#custom-url-container p {
		align-self: flex-end;
	}

	#custom-url-container div p {
		align-self: flex-start;
	}

	#input-text-long-url {
		width: 100%;
	}

	button {
		width: 100%;
	}
</style>
