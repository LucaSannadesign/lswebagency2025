const cdCoverTheTemponauts = new Proxy({"src":"/_astro/cd-cover-the-temponauts.BRlIuLTj.jpg","width":984,"height":936,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/portfolio/cd-cover-the-temponauts.jpg";
							}
							
							return target[name];
						}
					});

export { cdCoverTheTemponauts as default };
