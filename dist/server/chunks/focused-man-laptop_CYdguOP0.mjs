const focusedManLaptop = new Proxy({"src":"/_astro/focused-man-laptop.Bqh8D-XT.jpeg","width":2048,"height":2048,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/focused-man-laptop.jpeg";
							}
							
							return target[name];
						}
					});

export { focusedManLaptop as default };
