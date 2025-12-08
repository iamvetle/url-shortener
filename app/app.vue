<template>
	<div id="page-wrapper">
		<h1>Shorten your long URL</h1>
		<div id="shortener-or-qrcode-box">
			<div id="tops">
				<button
					@click="shortenURLTopClicked()"
					class="selected-top"
					id="shorten-url-top"
				>
					Shorten a link
				</button>
				<button
					@click="createQRCodeTopClicked()"
					class="not-selected-top"
					id="create-qr-code-top"
				>
					Create a QR code
				</button>
			</div>
					
			<ShortenURL :host="host || ''" :corsHeaders="corsHeaders" v-if="showShortenURL"  />
			<CreateQRCode :host="host || ''" :corsHeaders="corsHeaders" v-if="!showShortenURL" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const showShortenURL = ref(true);
	const host:Ref<null | string> = ref(null)
	onMounted(() => {
		host.value = window.location.hostname
	})

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

	const resetShortInputs = () => {
		newShortURL.value = "";
		inputTextLongURL.value = "";
		inputTextCustomURL.value = "";
	}

	function shortenURLTopClicked() {
		resetShortInputs()

		if (!showShortenURL.value) {
			const shortenURLElement = document.getElementById("shorten-url-top");
			(shortenURLElement as Element).classList.toggle("selected-top");
			(shortenURLElement as Element).classList.toggle("not-selected-top");

			const createQRCodeElement = document.getElementById("create-qr-code-top");
			(createQRCodeElement as Element).classList.toggle("selected-top");
			(createQRCodeElement as Element).classList.toggle("not-selected-top");
			showShortenURL.value = !showShortenURL.value;
		}
	}

	function createQRCodeTopClicked() {
		if (showShortenURL.value) {
			const createQRCodeElement = document.getElementById("create-qr-code-top");
			(createQRCodeElement as Element).classList.toggle("selected-top");
			(createQRCodeElement as Element).classList.toggle("not-selected-top");

			const shortenURLElement = document.getElementById("shorten-url-top");
			(shortenURLElement as Element).classList.toggle("selected-top");
			(shortenURLElement as Element).classList.toggle("not-selected-top");
			showShortenURL.value = !showShortenURL.value;
		}
	}
</script>

<style scoped>
	#page-wrapper {
		background-color: var(--bg-color);
		min-height: 100vh;
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

	#shorten-url-top,
	#create-qr-code-top {
		width: 50%;
		display: inline-block;
		padding-top: 16px;
		padding-bottom: 16px;
		text-align: center;
		border-radius: 5px 5px 0 0;
	}

	.selected-top {
		background-color: var(--bg-color-2);
	}

	.not-selected-top {
		background-color: var(--bg-color-1-5);
	}

	#tops {
		width: 486px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
