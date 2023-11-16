<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import AddIcon from '~icons/lucide/plus';
	import CancelIcon from '~icons/lucide/x';
	import * as flashModule from 'sveltekit-flash-message/client';

	import {
		userInsertSchema,
		UserType,
		type UserInsertSchema,
		UserRole
	} from '$lib/db/schema/domain.schema';
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { superForm as superFormLib } from 'sveltekit-superforms/client';
	import { addToast } from '$lib/components/custom/toast/toaster.svelte';

	export let data: SuperValidated<UserInsertSchema>;

	const form = superFormLib(data, {
		validators: userInsertSchema,
		onResult: ({ result }) => {
			if (result.status === 200) {
				open = false;

				addToast({
					type: 'success',
					description: 'Benutzer wurde erfolgreich hinzugefügt.'
				});

				form.reset();
			}
		},
		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				const errorMessage = result.error.message;
				message.set(errorMessage);
			}
		},
		syncFlashMessage: false
	});

	let open: boolean = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button variant="outline">
			<AddIcon class="w-4 h-4" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Benutzer hinzufügen</Dialog.Title>
			<Dialog.Description>Dies fügt einen neuen Benutzer hinzu.</Dialog.Description>
		</Dialog.Header>

		<Form.Root method="POST" {form} controlled schema={userInsertSchema} let:config>
			<Form.Field {config} name="authId">
				<Form.Item>
					<Form.Label>Interne SSO ID</Form.Label>
					<Form.Input />
					<Form.Description>Dies ist die interne ID des neuen Benutzers.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Separator class="my-4" />
			<Form.Field {config} name="role">
				<Form.Item>
					<Form.Label>Benutzertyp</Form.Label>
					<Form.Select>
						<Form.SelectTrigger placeholder="Wähle eine Rolle aus" />
						<Form.SelectContent>
							{#each Object.keys(UserRole) as userRole}
								<Form.SelectItem value={userRole.toLowerCase()}>{userRole}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Description>
						Achtung: Administratoren können alle Daten einsehen und bearbeiten.
					</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="type">
				<Form.Item>
					<Form.Label>Benutzertyp</Form.Label>
					<Form.Select>
						<Form.SelectTrigger placeholder="Wähle einen Benutzertyp aus" />
						<Form.SelectContent>
							{#each Object.keys(UserType) as userType}
								<Form.SelectItem value={userType.toLowerCase()}>{userType}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Description></Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="vorname">
				<Form.Item>
					<Form.Label>Vorname</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="nachname">
				<Form.Item>
					<Form.Label>Nachname</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Dialog.Footer>
				<Form.Button class="gap-1" type="submit">
					<AddIcon class="h-4 w-4" />
					Hinzufügen
				</Form.Button>
				<Button
					type="button"
					class="gap-1"
					variant="outline"
					on:click={() => {
						open = false;
						form.reset();
					}}
				>
					<CancelIcon class="h-4 w-4" />
					Abbrechen
				</Button>
			</Dialog.Footer>
		</Form.Root>
	</Dialog.Content>
</Dialog.Root>
