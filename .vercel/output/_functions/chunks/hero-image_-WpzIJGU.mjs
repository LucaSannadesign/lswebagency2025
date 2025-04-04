const heroImage = new Proxy({"src":"/_astro/hero-image.B3iawTBc.png","width":1792,"height":1024,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/hero-image.png";
							}
							
							return target[name];
						}
					});

export { heroImage as default };
