const blogSeoImage = new Proxy({"src":"/_astro/blog-seo-ai.DhyrBW26.webp","width":1536,"height":1024,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/blog-seo-ai.webp";
							}
							
							return target[name];
						}
					});

export { blogSeoImage as default };
