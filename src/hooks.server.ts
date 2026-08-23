import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Check for password protection cookie
	const authCookie = event.cookies.get('javster_auth');

	// Allow access to static assets and API routes without password
	const publicPaths = ['/api', '/static', '/favicon.ico', '/robots.txt'];
	const isPublicPath = publicPaths.some((path) => event.url.pathname.startsWith(path));

	// Allow access if cookie exists or path is public
	if (authCookie || isPublicPath) {
		return resolve(event);
	}

	// Check if this is a password submission
	if (event.request.method === 'POST' && event.url.pathname === '/auth') {
		const formData = await event.request.formData();
		const password = formData.get('password');

		// You should use environment variables for the password
		// For now, using a placeholder password
		const correctPassword = import.meta.env.VITE_ACCESS_PASSWORD || 'javster2024';

		if (password === correctPassword) {
			// Set auth cookie for 7 days
			event.cookies.set('javster_auth', 'true', {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 7 days
				httpOnly: true,
				secure: true,
				sameSite: 'lax'
			});
			return redirect(307, event.url.searchParams.get('redirect') || '/');
		}
	}

	// For non-public paths without auth, show password form
	if (event.request.method === 'GET') {
		const redirectUrl = event.url.pathname + event.url.search;
		const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Authentication Required - Javster</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { font-family: 'Tahoma', 'Segoe UI', sans-serif; background: #008080; min-height: 100vh; display: flex; align-items: center; justify-content: center; color: #000000; }
		.container { max-width: 400px; width: 100%; padding: 2rem; }
		.window { background: #c0c0c0; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; box-shadow: 2px 2px 0px #000000; text-align: center; }
		.title-bar { background: linear-gradient(90deg, #000080, #1084d0); color: white; padding: 4px 8px; font-size: 12px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
		.title-bar-close { background: #c0c0c0; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; width: 16px; height: 14px; font-size: 10px; line-height: 10px; cursor: pointer; }
		.window-content { padding: 20px; }
		.logo { font-size: 24px; font-weight: bold; color: #000080; margin-bottom: 10px; font-family: 'Times New Roman', serif; }
		.subtitle { color: #000000; margin-bottom: 20px; font-size: 13px; }
		.form-group { margin-bottom: 15px; text-align: left; }
		label { display: block; margin-bottom: 5px; font-size: 12px; color: #000000; }
		input { width: 100%; padding: 4px 8px; background: #ffffff; border: 2px solid; border-color: #808080 #ffffff #ffffff #808080; color: #000000; font-size: 13px; font-family: 'Tahoma', 'Segoe UI', sans-serif; }
		input:focus { outline: none; border-color: #000080; }
		button { width: 100%; padding: 6px 20px; background: #c0c0c0; color: #000000; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; font-size: 13px; font-family: 'Tahoma', 'Segoe UI', sans-serif; cursor: pointer; }
		button:active { border-color: #808080 #ffffff #ffffff #808080; }
		.error { color: #ff0000; font-size: 12px; margin-top: 10px; display: none; }
		.error.show { display: block; }
		.info { color: #000000; font-size: 11px; margin-top: 15px; }
		.icon { font-size: 32px; margin-bottom: 10px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="window">
			<div class="title-bar">
				<span>Authentication Required</span>
				<div class="title-bar-close">X</div>
			</div>
			<div class="window-content">
				<div class="icon">🔒</div>
				<div class="logo">JAVSTER</div>
				<p class="subtitle">Enter password to access this site</p>
				<form method="POST" action="/auth">
					<input type="hidden" name="redirect" value="${redirectUrl}" />
					<div class="form-group">
						<label for="password">Password:</label>
						<input type="password" id="password" name="password" required autocomplete="current-password" />
					</div>
					<button type="submit">OK</button>
					<div class="error show" id="error">Invalid password. Please try again.</div>
				</form>
				<p class="info">This site is password protected.</p>
			</div>
		</div>
	</div>
	<script>
	const form = document.querySelector('form');
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		const formData = new FormData(form);
		fetch('/auth', { method: 'POST', body: formData }).then(response => {
			if (response.redirected) { window.location.href = response.url; } else { document.getElementById('error').classList.add('show'); }
		});
	});
</script>
</body>
</html>`;
		return new Response(html, {
			headers: {
				'Content-Type': 'text/html'
			}
		});
	}

	return resolve(event);
};
