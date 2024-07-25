<template>
	<footer>
		&copy; {{ new Date().getFullYear() }} {{ $t("ZianTT") }} {{ $t("footerText") }}
	</footer>
</template>

<style scoped>
a {
	color: inherit;
}

footer {
	backdrop-filter: blur(10px);
	bottom: 0;
	left: 0;
	padding: 20px;
	position: fixed;
}
</style>
