const sitoWebProfessionale = new Proxy({"src":"/_astro/sito-web-professionale.DwrxGSLi.jpg","width":1080,"height":720,"format":"jpg","orientation":1}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/sito-web-professionale.jpg";
							}
							
							return target[name];
						}
					});

export { sitoWebProfessionale as default };
