<template>
	<div id="create-short-url-container">
		<div id="long-url-container">
			<label for="input-text-long-url" class="mute">Long URL</label>
			<input
				id="input-text-long-url"
				type="text"
				v-model="inputTextLongURL"
			/>
		</div>

		<div id="custom-url-container">
			<div id="input-custom-url-label-group">
				<p class="mute">Domain</p>
				<label for="input-text-custom-short-url" class="mute"
					>Custom URL (optional)</label
				>
			</div>

			<div id="input-custom-url-group">
				<p>localhost:3000</p>
				<p>/</p>
				<div>
					<input
						id="input-text-custom-short-url"
						type="text"
						v-model="inputTextCustomURL"
					/>
				</div>
			</div>
		</div>
		<button @click="createShortLink(host, corsHeaders)">Create Link</button>

		<p v-if="newShortURL">{{ newShortURL }}</p>
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

	const inputTextLongURL = useState("inputTextLongURL", () => "");
	const inputTextCustomURL = useState("inputTextCustomURL", () => "");
	const newShortURL = useState("newShortURL", () => "");
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

	#create-short-url-container {
		width: 486px;
		margin-right: auto;
		margin-left: auto;
		background-color: var(--bg-color-2);
		padding-left: 48px;
		padding-right: 48px;
		padding-top: 48px;
		padding-bottom: 48px;
		border-radius: 0 0 5px 5px;
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


</style>
