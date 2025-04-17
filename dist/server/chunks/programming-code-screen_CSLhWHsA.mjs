const programmingCodeScreen = new Proxy({"src":"/_astro/programming-code-screen.B1edgg5e.jpeg","width":2048,"height":2048,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/programming-code-screen.jpeg";
							}
							
							return target[name];
						}
					});

export { programmingCodeScreen as default };
