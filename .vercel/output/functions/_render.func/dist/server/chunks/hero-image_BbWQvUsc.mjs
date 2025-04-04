const heroImage = new Proxy({"src":"/_astro/hero-image.DEu2rLX0.jpg","width":1792,"height":1024,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/hero-image.jpg";
							}
							
							return target[name];
						}
					});

export { heroImage as default };
