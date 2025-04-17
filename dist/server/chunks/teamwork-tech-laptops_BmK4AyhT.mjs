const teamworkTechLaptops = new Proxy({"src":"/_astro/teamwork-tech-laptops.ClSRREk9.jpeg","width":2048,"height":2048,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/teamwork-tech-laptops.jpeg";
							}
							
							return target[name];
						}
					});

export { teamworkTechLaptops as default };
