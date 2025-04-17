const sitoWebProfessionale = new Proxy({"src":"/_astro/sito-web-professionale.Czeusa-m.jpg","width":720,"height":1080,"format":"jpg","orientation":6}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/portfolio/sito-web-professionale.jpg";
							}
							
							return target[name];
						}
					});

export { sitoWebProfessionale as default };
