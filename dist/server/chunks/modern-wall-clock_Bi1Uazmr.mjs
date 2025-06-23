const modernWallClock = new Proxy({"src":"/_astro/modern-wall-clock.BarcfnxH.jpeg","width":2048,"height":2048,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/modern-wall-clock.jpeg";
							}
							
							return target[name];
						}
					});

export { modernWallClock as default };
