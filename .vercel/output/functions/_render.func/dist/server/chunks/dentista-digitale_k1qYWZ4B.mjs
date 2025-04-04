const dentistaDigitale = new Proxy({"src":"/_astro/dentista-digitale.CvqIXsam.jpg","width":1318,"height":1316,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/portfolio/dentista-digitale.jpg";
							}
							
							return target[name];
						}
					});

export { dentistaDigitale as default };
