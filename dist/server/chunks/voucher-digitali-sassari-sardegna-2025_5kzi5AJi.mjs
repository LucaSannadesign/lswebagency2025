const voucherImage = new Proxy({"src":"/_astro/voucher-digitali-sassari-sardegna-2025.DVuEDAVh.webp","width":1024,"height":1024,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/voucher-digitali-sassari-sardegna-2025.webp";
							}
							
							return target[name];
						}
					});

export { voucherImage as default };
