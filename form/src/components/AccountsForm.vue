<script setup lang="ts">
import { useAccountsStore } from "../stores/accounts";
import { storeToRefs } from "pinia";

const store = useAccountsStore();
const { accounts } = storeToRefs(store);

function addAccount() {
	store.addAccount();
}

function removeAccount(id: number) {
	store.removeAccount(id);
}

function updateField(id: number, field: string, value: any) {
	store.updateField(id, field as any, value);
}

accounts.value.forEach((acc) => {
	Object.defineProperty(acc, "_labels", {
		get() {
			return acc.labels.map((l) => l.text).join("; ");
		},
		set(val: string) {
			store.updateField(acc.id, "labels", val);
		},
	});
});

</script>

<template>
	<div class="accounts-form">
		<h2 class="heading">Управление учетными записями</h2>
		<el-button class="label" type="primary" @click="addAccount"
			>+ Добавить</el-button
		>

		<div v-if="accounts.length === 0" class="empty label">
			Нет учетных записей
		</div>

		<div v-else>
			<div v-for="account in accounts" :key="account.id" class="account-item">
				<el-input
					class="label"
					placeholder="Метки (через ;)"
					v-model="account._labels"
					:class="{ error: account.errors.labels }"
				/>

				<el-select
					:model-value="account.type"
					class="label"
					placeholder="Тип записи"
					@change="updateField(account.id, 'type', $event)"
					style="width: 450px"
				>
					<el-option class="option" label="Локальная" value="Локальная" />
					<el-option class="option" label="LDAP" value="LDAP" />
				</el-select>

				<el-input
					class="label"
					placeholder="Логин"
					v-model.lazy="account.login"
					:class="{ error: account.errors.login }"
				/>

				<el-input
					class="label"
					v-if="account.type === 'Локальная'"
					type="password"
					placeholder="Пароль"
					v-model.lazy="account.password"
					:class="{ error: account.errors.password }"
				/>

				<el-button
					class="label"
					type="danger"
					@click="removeAccount(account.id)"
				>
					Удалить
				</el-button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.accounts-form {
	max-width: 900px;
	margin: 20px auto;
}
.account-item {
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 15px 0;
}
.empty {
	margin-top: 10px;
	color: #666;
}
.error :deep(.el-input__wrapper) {
	border: 1px solid red !important;
}

.label {
	color: #1e2126;
	font-family: "Manrope";
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 120%;
	letter-spacing: 0.7px;
}

.heading {
	color: #1e2126;
	font-family: "Manrope";
	font-size: 20px;
	font-style: normal;
	font-weight: 400;
	line-height: 120%;
	letter-spacing: 1px;
}

.option {
	display: flex;
	align-items: center;
	color: #1e2126;
	font-family: "Manrope";
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 120%;
	letter-spacing: 0.7px;
}
</style>
