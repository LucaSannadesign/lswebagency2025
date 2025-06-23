const logoManus_ai = new Proxy({"src":"/_astro/logo-manus.ai.g4fbDFlS.webp","width":866,"height":650,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/logo-manus.ai.webp";
							}
							
							return target[name];
						}
					});

export { logoManus_ai as default };
