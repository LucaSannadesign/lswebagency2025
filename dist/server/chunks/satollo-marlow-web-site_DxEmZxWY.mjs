import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CROlnyxU.mjs';
import 'clsx';

const frontmatter = {
  "title": "Satollo Marlow",
  "slug": "satollo-marlow",
  "permalink": "/portfolio/satollo-marlow/",
  "canonical": "https://www.lswebagency.com/portfolio/satollo-marlow/",
  "description": "Progetto di design per Satollo Marlow, un locale moderno che unisce eleganza e accoglienza in uno spazio esclusivo.",
  "publishDate": "2025-02-23T00:00:00.000Z",
  "updateDate": "2025-02-23T00:00:00.000Z",
  "category": "Interior Design",
  "technologies": ["HTML", "CSS", "JavaScript"],
  "image": {
    "src": "/images/portfolio/satollo-marlow.webp",
    "alt": "Progetto Satollo Marlow",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Progetto Satollo Marlow - LS Web Agency",
    "description": "Scopri il progetto di design per Satollo Marlow realizzato da LS Web Agency: eleganza e accoglienza in un ambiente moderno e sofisticato.",
    "keywords": ["interior design", "satollo marlow", "progetto locale moderno", "design esclusivo"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "satollo-marlow",
    "text": "Satollo Marlow"
  }, {
    "depth": 3,
    "slug": "obiettivi-del-progetto",
    "text": "Obiettivi del Progetto"
  }, {
    "depth": 3,
    "slug": "tecnologie-utilizzate",
    "text": "Tecnologie Utilizzate"
  }, {
    "depth": 3,
    "slug": "il-nostro-approccio",
    "text": "Il Nostro Approccio"
  }];
}
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "satollo-marlow",
      children: "Satollo Marlow"
    }), "\n", createVNode(_components.p, {
      children: ["Il progetto ", createVNode(_components.strong, {
        children: "Satollo Marlow"
      }), " rappresenta l’unione perfetta tra design moderno e accoglienza. Questo locale esclusivo, progettato per offrire un’esperienza unica ai clienti, si distingue per l’eleganza e la cura dei dettagli."]
    }), "\n", createVNode(_components.h3, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Creare un ambiente raffinato e moderno che inviti i clienti a rilassarsi e a godersi il locale."
      }), "\n", createVNode(_components.li, {
        children: "Garantire una perfetta armonia tra estetica e funzionalità dello spazio."
      }), "\n", createVNode(_components.li, {
        children: "Utilizzare elementi di design unici per dare personalità e stile al locale."
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: "Per il progetto Satollo Marlow, abbiamo utilizzato:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "HTML"
        }), " per creare una struttura solida e ben organizzata."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "CSS"
        }), " per curare il design, la grafica e lo stile visivo del sito."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "JavaScript"
        }), " per aggiungere interattività e migliorare l’esperienza utente."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "il-nostro-approccio",
      children: "Il Nostro Approccio"
    }), "\n", createVNode(_components.p, {
      children: "Abbiamo collaborato con il cliente per comprendere appieno la sua visione e tradurla in uno spazio unico che rispecchia il suo stile e la sua filosofia. Il risultato finale è un ambiente in cui l’eleganza e il comfort si fondono, creando un’esperienza esclusiva per tutti i visitatori."
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "LS Web Agency"
      }), " si è occupata della progettazione e della realizzazione del progetto, garantendo un risultato finale che rispecchia l’essenza e la raffinatezza del locale Satollo Marlow."]
    }), "\n", createVNode(_components.p, {
      children: ["Per saperne di più su come possiamo aiutare a realizzare il tuo progetto di design, ", createVNode(_components.a, {
        href: "https://lucasanna.eu/contatti",
        children: "contattaci oggi stesso"
      }), "."]
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

const url = "src/content/data/portfolio/satollo-marlow-web-site.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/satollo-marlow-web-site.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/satollo-marlow-web-site.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
