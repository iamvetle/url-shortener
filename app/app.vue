<template>
	<div id="page-wrapper">
		<h1>Shorten your long URL</h1>
		<div id="shortener-or-qrcode-box">
			<div id="tops">
				<button id="shorten-url-top">Shorten a link</button>
				<button id="create-qr-code-top">Create a QR code</button>
			</div>
			<ShortenURL />
		</div>
	</div>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
	#page-wrapper {
		background-color: var(--bg-color);
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 36px;
		text-align: center;
	}

	#shortener-or-qrcode-box {
		margin-top: 32px;
	}

	#shorten-url-top, #create-qr-code-top {
		width:50%;
		display: inline-block;
		padding-top: 16px;
		padding-bottom: 16px;
		text-align: center;
		border-radius: 5px 5px 0 0;
	}

	#shorten-url-top {
		background-color: var(--bg-color-2);
	}

	#create-qr-code-top {
		background-color: var(--bg-color-1-5);
	}

	#tops {
		width: 486px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
