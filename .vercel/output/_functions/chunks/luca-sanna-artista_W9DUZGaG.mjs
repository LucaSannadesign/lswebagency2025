const lucaSannaArtista = new Proxy({"src":"/_astro/luca-sanna-artista.meePUxTQ.jpg","width":1600,"height":727,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/portfolio/luca-sanna-artista.jpg";
							}
							
							return target[name];
						}
					});

export { lucaSannaArtista as default };
