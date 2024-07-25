export interface IconInfo {
	icon: string[];
	show: boolean;
	title: string;
	onClick: () => void;
}

export interface SettingsInfo {
	maximum: string;
	minimum: string;
	quantity: string;
	speed: string;
	repeat: boolean;
	oddOnly: boolean;
	evenOnly: boolean;
	boyOnly: boolean;
	girlOnly: boolean;
	boyNumber: number;
	girlNumber: number;
}

export interface HistoryItem {
	value: string;
	correct: boolean;
}
