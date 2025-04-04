const voucherImage = new Proxy({"src":"/_astro/voucher-digitali-sardegna.Ddrw7otH.webp","width":1792,"height":1024,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/images/voucher-digitali-sardegna.webp";
							}
							
							return target[name];
						}
					});

export { voucherImage as default };
