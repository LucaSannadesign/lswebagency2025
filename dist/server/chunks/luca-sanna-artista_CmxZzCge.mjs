const lucaSannaArtista = new Proxy({"src":"/_astro/luca-sanna-artista.BixUM4Az.webp","width":1600,"height":727,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/luca-sanna-artista.webp";
							}
							
							return target[name];
						}
					});

export { lucaSannaArtista as default };
