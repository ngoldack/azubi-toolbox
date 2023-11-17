<script lang="ts">
	import type { User } from '$lib/db/schema/domain.schema';
	import DataTable from './data-table.svelte';
	import DialogAdd from './dialog-add.svelte';

	export let data;
	let tableData: User[] = data.users;
</script>

<div class="container mx-auto py-10">
	<DataTable data={tableData}>
		<svelte:fragment slot="add">
			<DialogAdd data={data.form} />
		</svelte:fragment>
	</DataTable>
</div>
