import { defineStore } from "pinia";

export type AccountType = "Локальная" | "LDAP";

export interface Account {
	id: number;
	labels: { text: string }[];
	type: AccountType;
	login: string;
	password: string | null;
	errors: {
		labels?: boolean;
		login?: boolean;
		password?: boolean;
	};
}

let idCounter = 1;

export const useAccountsStore = defineStore("accounts", {
	state: () => ({
		accounts: [] as Account[],
	}),

	actions: {
		addAccount() {
			this.accounts.push({
				id: idCounter++,
				labels: [],
				type: "Локальная",
				login: "",
				password: "",
				errors: {},
			});
		},

		removeAccount(id: number) {
			this.accounts = this.accounts.filter((acc) => acc.id !== id);
		},

		updateField<K extends keyof Account>(
			id: number,
			field: K,
			value: Account[K]
		) {
			const acc = this.accounts.find((a) => a.id === id);
			if (!acc) return;

			if (field === "labels" && typeof value === "string") {
				acc.labels = value
					.split(";")
					.map((t) => t.trim())
					.filter(Boolean)
					.map((t) => ({ text: t }));
			} else {
				acc[field] = value as Account[K];
			}

			this.validateAccount(acc);
		},

		validateAccount(account: Account) {
			account.errors = {};

			if (!account.login || account.login.length > 25) {
				account.errors.login = true;
			}

			if (account.type === "Локальная") {
				if (!account.password || account.password.length > 100) {
					account.errors.password = true;
				}
			}

			if (account.labels.some((l) => l.text.length > 50)) {
				account.errors.labels = true;
			}
		},
	},

	persist: true,
});
