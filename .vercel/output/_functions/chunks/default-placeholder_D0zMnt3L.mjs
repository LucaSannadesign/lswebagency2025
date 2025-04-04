const defaultPlaceholder = new Proxy({"src":"/_astro/default-placeholder.CZ816Hke.png","width":2400,"height":1256,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/default-placeholder.png";
							}
							
							return target[name];
						}
					});

export { defaultPlaceholder as default };
