<script>
	import '../app.postcss';

	import Toaster, { addToast } from '$lib/components/custom/toast/toaster.svelte';
	import { getFlash } from 'sveltekit-flash-message/client';
	import '../app.postcss';
	import { page } from '$app/stores';

	/** Can be integrated with sveltekit-flash-messages too */
	const flash = getFlash(page);
	flash.subscribe(($flash) => {
		if (!$flash) return;

		if ($flash.type == 'success') {
			addToast({
				description: $flash.message
			});
		} else {
			addToast({
				description: $flash.message,
				variant: 'destructive'
			});
		}
		// Clearing the flash message could sometimes
		// be required here to avoid double-toasting.
		flash.set(undefined);
	});
</script>

<div class="container pl-0 pr-0">
	<slot />
</div>

<Toaster />
