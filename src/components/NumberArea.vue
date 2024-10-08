<script setup lang="ts">
import { HistoryItem, SettingsInfo } from "@/types";
import { ref } from "vue";

const props = defineProps<{
	historyItems: HistoryItem[];
	names: string[];
	settings: SettingsInfo;
	addHistoryItem: (item: string, correct: boolean) => void;
	setSettings: (newValue: SettingsInfo) => void;
}>();

const isScrolling = ref<boolean>(false);
const number = ref<string>("幸运儿"); // string for names

let timeoutId: number | undefined = undefined;

function getRandomInt(min: number, max: number): number {
	return Math.floor((Math.random() * (max - min + 1)) + min);
}

function getRandomValue(): string {
	const min = parseInt(props.settings.minimum);
	const max = parseInt(props.settings.maximum);
	if (isNaN(min) || isNaN(max)) {
		// Easter egg
		// returns a random Chinese character
		return String.fromCharCode(getRandomInt(19968, 40868));
	}
	const randomInt = getRandomInt(min, max);
	let result = randomInt.toString();
	if (
		(props.settings.oddOnly && randomInt % 2 === 0) ||
		(props.settings.evenOnly && randomInt % 2 !== 0)
	) {
		return getRandomValue();
	}
	if (
		(props.settings.girlOnly && randomInt > props.settings.girlNumber && randomInt <= props.settings.boyNumber + props.settings.girlNumber) ||
		(props.settings.boyOnly && randomInt <= props.settings.girlNumber) ||
		(!props.settings.special && randomInt > props.settings.boyNumber + props.settings.girlNumber)
	) {
		return getRandomValue();
	}
	if (props.names.length > 0) {
		const nameValue = props.names[randomInt - 1];
		if (nameValue) {
			result = nameValue;
		}
	}
	if (!props.settings.repeat) {
		let total = max - min + 1;
		if (props.settings.boyOnly) {
			total = props.settings.boyNumber;
		} else if (props.settings.girlOnly) {
			total = props.settings.girlNumber;
		}

		if (total - props.historyItems.length <= 1) {
			const newSettings = { ...props.settings };
			newSettings.repeat = true;
			props.setSettings(newSettings);
			isScrolling.value = false;
			stopScrolling();
			return "幸运儿";
		}
		if (props.historyItems.some((item) => item.value === result)) {
			return getRandomValue();
		}
	}
	return result;
}

function startScrolling(): void {
	// uses setTimeout instead of setInterval to dynamically change the speed
	timeoutId = window.setTimeout(() => {
		try {
			const randomValue = getRandomValue();
			number.value = randomValue;
			if (isScrolling.value) {
				startScrolling();
			}
		} catch (error) {
			console.error(error);
			localStorage.clear();
			window.location.reload();
		}
	}, 1000 / parseInt(props.settings.speed));
}

function stopScrolling(): void {
	clearTimeout(timeoutId);
}

function toggleScrolling(): void {
	if (isScrolling.value) {
		stopScrolling();
		const randomValue = getRandomValue();
		number.value = randomValue;
	} else {
		startScrolling();
	}
	isScrolling.value = !isScrolling.value;
}

function answerCorrect(): void {
	props.addHistoryItem(number.value, true);
}

function answerIncorrect(): void {
	props.addHistoryItem(number.value, false);
}
</script>

<template>
	<div class="number-area">
		<div v-bind:class="{
			'number-box': true,
			'name': props.names.length > 0,
		}">{{ number }}</div>
		<button class="main-btn" v-on:click="toggleScrolling">
			{{ isScrolling ? $t("stop") : $t("start") }}
		</button>
		<button class="main-btn" v-on:click="answerCorrect">
			{{ $t("answerCorrect") }}
		</button>
		<button class="main-btn" v-on:click="answerIncorrect">
			{{ $t("answerIncorrect") }}
		</button>
	</div>
</template>

<style scoped>
.main-btn {
	background-color: var(--theme-color);
	border: 1px solid var(--fg-alpha-2);
	border-radius: 5px;
	color: white;
	font-size: 24px;
	padding: 10px 30px;
	text-transform: uppercase;
	transition: filter .25s;
	width: 300px;
}

.main-btn:focus {
	filter: brightness(1.1);
}

.main-btn:hover {
	filter: brightness(1.2);
}

.main-btn:active {
	filter: brightness(.9);
}

.number-area {
	align-items: center;
	display: flex;
	flex-direction: column;
	gap: 20px;
	justify-content: center;
}

.number-box {
	align-items: center;
	border: 1px solid var(--fg-alpha-2);
	border-radius: 5px;
	display: flex;
	font-size: 64px;
	height: 135px;
	justify-content: center;
	overflow: hidden;
	text-align: center;
	width: 300px;
}

.number-box.name {
	font-size: 40px;
}
</style>
