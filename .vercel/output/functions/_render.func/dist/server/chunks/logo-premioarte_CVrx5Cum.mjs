const logoPremioarte = new Proxy({"src":"/_astro/logo-premioarte.CaD54NR0.webp","width":283,"height":256,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/portfolio/logo-premioarte.webp";
							}
							
							return target[name];
						}
					});

export { logoPremioarte as default };
