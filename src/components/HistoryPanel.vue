<script setup lang="ts">
import TitleBar from "@/components/TitleBar.vue";
import { HistoryItem } from "@/types";

const props = defineProps<{
	show: boolean;
	historyItems: HistoryItem[];
	closePanel: () => void;
	setHistoryItems: (newValue: HistoryItem[]) => void;
}>();

function deleteHistoryItem(index: number): void {
	const newHistoryItems = [...props.historyItems];
	newHistoryItems.splice(index, 1);
	props.setHistoryItems(newHistoryItems);
}
</script>

<template>
	<div v-if="show" class="panel panel-left">
		<TitleBar v-bind:icons="[
			{
				icon: ['fas', 'delete-left'],
				title: $t('clear'),
				show: historyItems.length > 0,
				onClick: () => {
					setHistoryItems([]);
				}
			},
			{
				icon: ['fas', 'xmark'],
				title: $t('close'),
				show: true,
				onClick: closePanel
			},
		]" icon-size="xl">
			<h1>{{ $t("history") }}</h1>
		</TitleBar>
		<ul>
			<li v-for="item, index in historyItems" v-bind:key="index">
				<div class="list-item-main">{{ item.value }} | {{ item.correct ? $t("correct") : $t("incorrect") }}</div>
				<button v-on:click="() => deleteHistoryItem(index)">
					{{ $t("delete") }}
				</button>
			</li>
		</ul>
	</div>
</template>
