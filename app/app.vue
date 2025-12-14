<template>
	<div id="page-wrapper">
		<div id="switch-between-light-dark-mode">
			<button @click="setLightMode()">Light</button>
			<button @click="setDarkMode()">Dark</button>
		</div>

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

			<ShortenURL
				:host="host || ''"
				:corsHeaders="corsHeaders"
				v-if="showShortenURL"
			/>
			<CreateQRCode
				:host="host || ''"
				:corsHeaders="corsHeaders"
				v-if="!showShortenURL"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	const showShortenURL = ref(true);
	const host: Ref<null | string> = ref(null);
	onMounted(() => {
		host.value = window.location.hostname;
	});

	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers":
			"authorization, x-client-info, apikey, content-type",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	};

	function setLightMode() {
		localStorage.setItem("data-mode", "light");
		document.documentElement.setAttribute("data-theme", "light");

		const firstButton = document.querySelector(
			"#switch-between-light-dark-mode button:first-child"
		) as HTMLElement;
		firstButton.style.backgroundColor = "var(--bg-color-2)";
		const secondButton = document.querySelector(
			"#switch-between-light-dark-mode button:nth-child(2)"
		) as HTMLElement;
		secondButton.style.backgroundColor = "var(--bg-color-1-5)";
	}

	function setDarkMode() {
		localStorage.setItem("data-mode", "dark");
		document.documentElement.setAttribute("data-theme", "dark");

		const firstButton = document.querySelector(
			"#switch-between-light-dark-mode button:first-child"
		) as HTMLElement;
		firstButton.style.backgroundColor = "var(--bg-color-1-5)";
		const secondButton = document.querySelector(
			"#switch-between-light-dark-mode button:nth-child(2)"
		) as HTMLElement;
		secondButton.style.backgroundColor = "var(--bg-color-2)";
	}

	onMounted(() => {
		const dataMode = localStorage.getItem("data-mode") || "light-mode";

		if (dataMode == "light") {
			setLightMode();
		}

		if (dataMode == "dark") {
			setDarkMode();
		}
	});

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
	const readyForDownload = useState("readyForDownload", () => false);

	const svgURL = useState("svgURL", () => "");
	const pngURL = useState("pngURL", () => "");

	const resetShortInputs = () => {
		newShortURL.value = "";
		inputTextLongURL.value = "";
		inputTextCustomURL.value = "";
		readyForDownload.value = false;

		if (svgURL.value.length >  0) {
			URL.revokeObjectURL(svgURL.value);
		}

		if (pngURL.value.length > 0) {
			URL.revokeObjectURL(pngURL.value)
		}
	};

	function shortenURLTopClicked() {
		resetShortInputs();

		if (!showShortenURL.value) {
			const shortenURLElement =
				document.getElementById("shorten-url-top");
			(shortenURLElement as Element).classList.toggle("selected-top");
			(shortenURLElement as Element).classList.toggle("not-selected-top");

			const createQRCodeElement =
				document.getElementById("create-qr-code-top");
			(createQRCodeElement as Element).classList.toggle("selected-top");
			(createQRCodeElement as Element).classList.toggle(
				"not-selected-top"
			);
			showShortenURL.value = !showShortenURL.value;
		}
	}

	function createQRCodeTopClicked() {
		resetShortInputs();

		if (showShortenURL.value) {
			const createQRCodeElement =
				document.getElementById("create-qr-code-top");
			(createQRCodeElement as Element).classList.toggle("selected-top");
			(createQRCodeElement as Element).classList.toggle(
				"not-selected-top"
			);

			const shortenURLElement =
				document.getElementById("shorten-url-top");
			(shortenURLElement as Element).classList.toggle("selected-top");
			(shortenURLElement as Element).classList.toggle("not-selected-top");
			showShortenURL.value = !showShortenURL.value;
		}
	}

	onUnmounted(() => {
		if (svgURL.value.length >  0) {
			URL.revokeObjectURL(svgURL.value);
		}
	});
</script>

<style scoped>
	#page-wrapper {
		background-color: var(--bg-color);
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding-left: 8px;
		padding-right: 8px;
	}

	#shortener-or-qrcode-box {
		width: 100%;
	}

	h1 {
		font-size: 36px;
		text-align: center;
	}

	@media (max-width: 400px) {
		h1 {
			font-size: 32px;
		}
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
		max-width: 486px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}

	#switch-between-light-dark-mode {
		position: absolute;
		/* top: 18.2%;
		right: 22%; */
		top: 5%;
		right: 5%;
	}

	#switch-between-light-dark-mode button:first-child {
		/* margin-right: 8px; */
		background-color: var(--bg-color-1-5);
		padding: 6px 4px;
		border-radius: 5px 0 0 5px;
		font-size: 16px;
	}

	#switch-between-light-dark-mode button:nth-child(2) {
		/* margin-right: 8px; */
		background-color: var(--bg-color-2);
		padding: 6px 4px;
		border-radius: 0 5px 5px 0;
		font-size: 16px;
	}
</style>
