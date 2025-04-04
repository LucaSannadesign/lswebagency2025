const logoArteSenzaConfini = new Proxy({"src":"/_astro/logo-arte-senza-confini.Crf-hjYj.webp","width":984,"height":985,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/logo-arte-senza-confini.webp";
							}
							
							return target[name];
						}
					});

export { logoArteSenzaConfini as default };
