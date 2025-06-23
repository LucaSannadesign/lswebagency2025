import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CROlnyxU.mjs';
import 'clsx';

const frontmatter = {
  "title": "Abacos - Women's Clothing eCommerce",
  "slug": "abacos-womens-clothing-ecommerce",
  "permalink": "/portfolio/abacos-womens-clothing-ecommerce/",
  "description": "Progetto eCommerce realizzato per Abacos, un brand di abbigliamento femminile...",
  "publishDate": "2025-02-24T00:00:00.000Z",
  "updateDate": "2025-02-24T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WooCommerce", "WordPress"],
  "image": {
    "src": "/images/portfolio/Abacos-womens-clothing-ecommerce-web-site.webp",
    "alt": "Sito eCommerce Abacos Women's Clothing",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Abacos - Women's Clothing eCommerce - LS Web Agency",
    "description": "Scopri il progetto eCommerce realizzato per Abacos...",
    "keywords": ["eCommerce abbigliamento", "sito di moda", "WooCommerce", "WordPress"]
  },
  "canonical": "https://www.lswebagency.com/portfolio/abacos-womens-clothing-ecommerce/",
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "abacos---womens-clothing-ecommerce",
    "text": "Abacos - Women’s Clothing eCommerce"
  }, {
    "depth": 2,
    "slug": "obiettivi-del-progetto",
    "text": "Obiettivi del Progetto"
  }, {
    "depth": 2,
    "slug": "tecnologie-utilizzate",
    "text": "Tecnologie Utilizzate"
  }, {
    "depth": 2,
    "slug": "risultato-finale",
    "text": "Risultato Finale"
  }, {
    "depth": 3,
    "slug": "contatta-ls-web-agency",
    "text": "Contatta LS Web Agency"
  }];
}
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    hr: "hr",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h1, {
      id: "abacos---womens-clothing-ecommerce",
      children: "Abacos - Women’s Clothing eCommerce"
    }), "\n", createVNode(_components.p, {
      children: "Abacos è un brand di abbigliamento femminile che desiderava una piattaforma di vendita online in grado di riflettere eleganza, modernità e funzionalità per la clientela."
    }), "\n", createVNode(_components.h2, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.p, {
      children: "Il sito eCommerce è stato realizzato per:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Offrire un’esperienza di shopping online elegante e intuitiva"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Facilitare la gestione degli ordini e del catalogo prodotti"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Comunicare l’identità del brand Abacos con uno stile visivo distintivo"
        }), "."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: ["Abbiamo scelto di realizzare il sito con ", createVNode(_components.strong, {
        children: "WooCommerce"
      }), " su piattaforma ", createVNode(_components.strong, {
        children: "WordPress"
      }), ", utilizzando ", createVNode(_components.strong, {
        children: "HTML"
      }), ", ", createVNode(_components.strong, {
        children: "CSS"
      }), " e ", createVNode(_components.strong, {
        children: "JavaScript"
      }), " per un’esperienza d’acquisto fluida e piacevole."]
    }), "\n", createVNode(_components.h2, {
      id: "risultato-finale",
      children: "Risultato Finale"
    }), "\n", createVNode(_components.p, {
      children: "Il risultato finale è un sito eCommerce elegante e facile da navigare, che valorizza i prodotti di Abacos e permette una gestione semplice e funzionale del negozio online."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.h3, {
      id: "contatta-ls-web-agency",
      children: "Contatta LS Web Agency"
    }), "\n", createVNode(_components.p, {
      children: "Se anche tu desideri creare o migliorare la tua presenza online, contattaci oggi stesso per discutere del tuo progetto."
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}

const url = "src/content/data/portfolio/abacos-brand-ecommerce-web-site.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/abacos-brand-ecommerce-web-site.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/abacos-brand-ecommerce-web-site.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
