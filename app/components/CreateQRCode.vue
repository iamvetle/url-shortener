<template>
	<div id="create-qr-code-container">
		<div id="long-url-container">
			<label for="input-text-long-url" class="mute">Long URL</label>
			<input
				:readonly="Boolean(newShortURL)"
				minlength="4"
				id="input-text-long-url"
				type="text"
				v-model="inputTextLongURL"
				@keyup.enter="
					Boolean(!newShortURL)
						? createQRCodeAndLink(
								createQRCodePlaceholderElement as Element,
								host,
								corsHeaders,
								downloadQrLink
						  )
						: resetShortInputs()
				"
			/>
		</div>

		<div id="custom-url-container" v-if="!newShortURL">
			<div id="input-custom-url-label-group">
				<p class="mute domain-thing">Domain</p>
				<label for="input-text-custom-short-url" class="mute"
					>Custom URL (optional)</label
				>
			</div>

			<div id="input-custom-url-group" v-if="!newShortURL">
				<p class="domain-thing"> {{ host }}</p>
				<p class="domain-thing">/</p>
					<input
						@keyup.enter="
							createQRCodeAndLink(
								createQRCodePlaceholderElement as Element,
								host,
								corsHeaders,
								downloadQrLink
							)
						"
						id="input-text-custom-short-url"
						type="text"
						v-model="inputTextCustomURL"
						minlength="3"
					/>
			</div>
		</div>

		<div v-if="newShortURL">
			<p id="new-short-url-p">New short URL:</p>
			<input
				id="new-short-url-input"
				type="text"
				readonly
				v-model="newShortURL"
			/>
		</div>

		<div id="qr-code-and-download">
			<div id="qr-code-placeholder"></div>

			<div v-show="readyForDownload" id="download-group">
				<h2>Download your QR code</h2>
				<a id="downloadQRLink">Download PNG here</a>
			</div>
		</div>

		<button
			v-if="!newShortURL"
			@click="
				createQRCodeAndLink(
					createQRCodePlaceholderElement as Element,
					host,
					corsHeaders,
					downloadQrLink
				)
			"
		>
			Create QR code
		</button>

		<button
			v-if="newShortURL"
			@click="resetShortInputs()"
			@keyup.enter="resetShortInputs()"
		>
			Create another QR code
		</button>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		host: {
			type: String,
			default: "localhost:3000",
		},

		corsHeaders: {
			type: Object,
			required: true,
		},
	});

	const inputTextLongURL = useState("inputTextLongURL", () => "");
	const inputTextCustomURL = useState("inputTextCustomURL", () => "");
	const newShortURL = useState("newShortURL", () => "");

	const createQRCodePlaceholderElement: Ref<null | Element> = ref(null);
	const downloadQrLink = ref("downloadQRLink");

	const readyForDownload = useState("readyForDownload", () => false);

	onMounted(() => {
		createQRCodePlaceholderElement.value = document.getElementById(
			"qr-code-placeholder"
		);
	});

	const resetShortInputs = () => {
		newShortURL.value = "";
		inputTextLongURL.value = "";
		inputTextCustomURL.value = "";

		const imgElement = document.getElementById("qr-code-img");
		imgElement?.remove();
	};
</script>

<style scoped>
	.mute {
		color: var(--bg-color-muted);
	}

	input {
		margin-top: 4px;
		height: 36px;
		padding-right: 8px;
		padding-left: 8px;
	}

	input,
	button {
		background-color: var(--bg-color-3);
		border: none;
		border-radius: 5px;
	}

	#long-url-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	#create-qr-code-container {
		max-width: 486px;
		width: 100%;
		margin-right: auto;
		margin-left: auto;
		background-color: var(--bg-color-2);
		padding-left: 48px;
		padding-right: 48px;
		padding-top: 48px;
		padding-bottom: 48px;
		border-radius: 0 0 5px 5px;
	}

		@media (max-width: 470px){
		#create-qr-code-container{
			padding-right: 24px;
			padding-left: 24px;
		}		
	}

	#input-custom-url-label-group {
		margin-top: 32px;
		display: flex;
		justify-content: space-between;
	}

	#input-custom-url-label-group label {
		transform: translateX(-25px);
	}

	#input-custom-url-group {
		margin-top: 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	#input-text-long-url {
		width: 100%;
	}

	#input-text-custom-short-url {
		width: 193px;
	}

	button {
		margin-top: 32px;
		width: 100%;
		padding-top: 12px;
		padding-bottom: 12px;
	}

	#new-short-url-p {
		margin-top: 32px;
		color: var(--bg-color-muted);
	}

	#new-short-url-input {
		width: 100%;
	}

	#qr-code-and-download {
		display: flex;
		gap: 16px;
	}

	#downloadQRLink {
		margin-top: 8px;
		text-decoration: none;
		display: block;
		width: 100%;
		color: var(--bg-color-text);
		background-color: var(--bg-color-3);
		text-align: center;
		padding-top: 8px;
		padding-bottom: 8px;
		border-radius: 5px;
	}

	#downloadQRLink:hover {
		color: var(--bg-color-muted);
	}

	#download-group {
		margin-top: 32px;

		display: flex;
		flex-direction: column;
		gap: 8px;
	}

		@media (max-width: 470px) {
		.domain-thing {
			display: none;
		}

		#input-custom-url-label-group label {
			transform: translate(0);
		}

		#input-text-custom-short-url {
			width: 100%;
		}
	}
</style>

<style>
	#qr-code-img {
		margin-top: 32px;

		height: 150px;
		display: inline-block;
	}
</style>
