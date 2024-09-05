<script setup lang="ts">
import FooterArea from "@/components/FooterArea.vue";
import HistoryPanel from "@/components/HistoryPanel.vue";
import IconBar from "@/components/IconBar.vue";
import NumberArea from "@/components/NumberArea.vue";
import SettingsPanel from "@/components/SettingsPanel.vue";
import { HistoryItem, SettingsInfo } from "@/types";
import { ref, Ref } from "vue";

const DESKTOP_WIDTH = 1160;

const names = ref<string[]>(((): string[] => {
	try {
		const storedNames = localStorage.getItem("names");
		return storedNames ? JSON.parse(storedNames) as string[] : ["巢梦媛", "崔灵琪", "崔欣玥", "范子衿", "高渊", "何思敏", "潘紫宸", "钱奕阳", "王睿漪", "王钰麟", "吴佳丽", "吴嘉希", "严雪菲", "虞雅睿", "朱思瑶", "朱怡雯", "陈思默", "陈奕云", "程卓立", "代子安", "邓然", "丁炫铭", "董蓼萧", "范思哲", "范裕盛", "葛隽涵", "李舟翔", "陆梓越", "马若桐", "马致远", "沐佳赟", "田海芮", "王毅超", "吴雨辰", "武易", "严士杰", "杨熙", "杨潇", "杨宜霖", "张孟哲", "赵佳齐", "周浩宸","朱佳威"];
	} catch {
		return ["巢梦媛", "崔灵琪", "崔欣玥", "范子衿", "高渊", "何思敏", "潘紫宸", "钱奕阳", "王睿漪", "王钰麟", "吴佳丽", "吴嘉希", "严雪菲", "虞雅睿", "朱思瑶", "朱怡雯", "陈思默", "陈奕云", "程卓立", "代子安", "邓然", "丁炫铭", "董蓼萧", "范思哲", "范裕盛", "葛隽涵", "李舟翔", "陆梓越", "马若桐", "马致远", "沐佳赟", "田海芮", "王毅超", "吴雨辰", "武易", "严士杰", "杨熙", "杨潇", "杨宜霖", "张孟哲", "赵佳齐", "周浩宸","朱佳威"];
	}
})());

const settings = ref<SettingsInfo>(((): SettingsInfo => {
	const defaultValue = {
		evenOnly: false,
		maximum: "43",
		minimum: "1",
		oddOnly: false,
		boyOnly: false,
		girlOnly: false,
		boyNumber: 26,
		girlNumber: 16,
		quantity: "1",
		repeat: true,
		speed: "100",
		special: false,
	};
	try {
		const storedSettings = localStorage.getItem("settings");
		if (!storedSettings) {
			return defaultValue;
		}
		const json = JSON.parse(storedSettings) as SettingsInfo;
		if (!json.quantity || parseInt(json.quantity) < 1) {
			json.quantity = defaultValue.quantity;
		}
		if (
			!json.minimum ||
			!json.maximum ||
			parseInt(json.minimum) >= parseInt(json.maximum)
		) {
			json.minimum = defaultValue.minimum;
			json.maximum = defaultValue.maximum;
		}
		return json;
	} catch {
		return defaultValue;
	}
})());

const historyItems = ref<{ value: string; correct: boolean; }[]>([]);
const showHistoryPanel = ref<boolean>(false);
const showSettingsPanel = ref<boolean>(window.innerWidth > DESKTOP_WIDTH);

let showHistoryPanelOnce = false;

function addHistoryItem(newItem: string, correct: boolean): void {
	historyItems.value.push(
		{
			value: newItem,
			correct: correct
		}
	);
	if (
		!showHistoryPanelOnce &&
		window.innerWidth > DESKTOP_WIDTH &&
		settings.value.quantity === "1"
	) {
		showHistoryPanel.value = true;
		showHistoryPanelOnce = true;
	}
}

function openGitHub(): void {
	window.open("https://github.com/shangzhenyang/random-number");
}

function setInputValue(key: string): ((event: Event) => void) {
	return (event: Event) => {
		const target = event.target as HTMLInputElement;
		const newSettings = { ...settings.value };
		if (target.type === "checkbox") {
			const conflicts = {
				evenOnly: "oddOnly",
				oddOnly: "evenOnly",
				boyOnly: "girlOnly",
				girlOnly: "boyOnly",
			};
			const conflict = conflicts[key as keyof typeof conflicts];
			if (conflict) {
				(newSettings[conflict as keyof typeof newSettings] as boolean) =
					false;
			}
			(newSettings[key as keyof typeof newSettings] as boolean) =
				target.checked;
			if (!newSettings.repeat) {
				historyItems.value = [];
			}
		} else {
			const hasMaxLimit = ["quantity", "speed"];
			if (hasMaxLimit.includes(key)) {
				if (parseInt(target.value) > 100) {
					return;
				}
			}
			(newSettings[key as keyof typeof newSettings] as string) =
				target.value;
		}
		setSettings(newSettings);
	};
}

function setNames(newValue: string[]): void {
	names.value = newValue;
	localStorage.setItem("names", JSON.stringify(newValue));

	const newSettings = { ...settings.value };
	newSettings.minimum = "1";
	newSettings.maximum = newValue.length === 0 ?
		"60" : newValue.length.toString();
	setSettings(newSettings);
}

function setSettings(newValue: SettingsInfo): void {
	settings.value = newValue;
	showSettingsPanel.value = true;
	localStorage.setItem("settings", JSON.stringify(newValue));
}

function togglePanel(
	panelToShow: Ref<boolean>,
	panelToHide: Ref<boolean>,
): void {
	if (!panelToShow.value && window.innerWidth <= DESKTOP_WIDTH) {
		panelToHide.value = false;
	}
	panelToShow.value = !panelToShow.value;
}

function toggleHistoryPanel(): void {
	togglePanel(showHistoryPanel, showSettingsPanel);
}

function toggleSettingsPanel(): void {
	togglePanel(showSettingsPanel, showHistoryPanel);
}
</script>

<template>
	<div class="app">
		<HistoryPanel v-bind:show="showHistoryPanel" v-bind:history-items="historyItems" v-bind:close-panel="() => {
			showHistoryPanel = false;
		}" v-bind:set-history-items="(newValue: HistoryItem[]) => {
			historyItems = newValue;
		}" />
		<main>
			<div class="number-areas">
				<NumberArea v-for="index in (parseInt(settings.quantity) || 0)" v-bind:key="index" v-bind:history-items="historyItems" v-bind:names="names" v-bind:settings="settings" v-bind:addHistoryItem="addHistoryItem" v-bind:set-settings="setSettings" />
			</div>
		</main>
		<SettingsPanel v-bind:show="showSettingsPanel" v-bind:names="names" v-bind:settings="settings" v-bind:closePanel="() => {
			showSettingsPanel = false;
		}" v-bind:setInputValue="setInputValue" v-bind:setNames="setNames" />
		<FooterArea />
		<IconBar class="corner-icons" v-bind:items="[
			{
				icon: ['fas', 'gear'],
				show: !showSettingsPanel,
				title: $t('settings'),
				onClick: toggleSettingsPanel
			},
			{
				icon: ['fas', 'clock-rotate-left'],
				show: !showHistoryPanel,
				title: $t('history'),
				onClick: toggleHistoryPanel
			},
		]" size="xl" />
	</div>
</template>

<style scoped>
main {
	align-items: center;
	display: flex;
	overflow: auto;
	width: 100%;
}

.app {
	display: flex;
	height: 100%;
}

.corner-icons {
	backdrop-filter: blur(10px);
	bottom: 0;
	right: 0;
	padding: 20px;
	position: fixed;
}

.number-areas {
	display: flex;
	gap: 30px;
	margin: 0 auto;
	padding: 30px;
}
</style>
