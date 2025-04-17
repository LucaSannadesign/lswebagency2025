const sitoWebProfessionale = new Proxy({"src":"/_astro/sito-web-professionale.DK6ADI2P.webp","width":1080,"height":720,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/sito-web-professionale.webp";
							}
							
							return target[name];
						}
					});

export { sitoWebProfessionale as default };
