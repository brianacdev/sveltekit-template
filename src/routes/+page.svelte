<script lang="ts">
	import { getTime } from '$lib/remotes/app.remote'
	const time = getTime()
</script>

<div>
	<h1>Time</h1>
	<p>{await time}</p>
	<p>connected: {time.connected}</p>
	<button onclick={() => time.reconnect()}>Reconnect</button>
</div>
