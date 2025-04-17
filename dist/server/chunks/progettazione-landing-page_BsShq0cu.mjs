const imageSrc = new Proxy({"src":"/_astro/progettazione-landing-page.Czga1a49.webp","width":1024,"height":1024,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/progettazione-landing-page.webp";
							}
							
							return target[name];
						}
					});

export { imageSrc as default };
