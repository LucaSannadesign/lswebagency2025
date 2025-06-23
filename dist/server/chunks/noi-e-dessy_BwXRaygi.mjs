import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CROlnyxU.mjs';
import 'clsx';

const frontmatter = {
  "title": "Noi e Dessy - Arte e Didattica",
  "slug": "noi-e-dessy",
  "permalink": "/portfolio/noi-e-dessy/",
  "canonical": "https://www.lswebagency.com/portfolio/noi-e-dessy/",
  "description": "Un progetto di design personalizzato che racconta una storia di famiglia e amore attraverso un sito web moderno e accattivante.",
  "publishDate": "2025-02-23T00:00:00.000Z",
  "updateDate": "2025-02-23T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WordPress"],
  "image": {
    "src": "/images/portfolio/copertina-noi-e-dessy.webp",
    "alt": "Progetto Noi e Dessy",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Progetto Noi e Dessy - LS Web Agency",
    "description": "Scopri il progetto Noi e Dessy realizzato da LS Web Agency: un sito web che racconta una storia di famiglia con un design accattivante e moderno.",
    "keywords": ["web design", "progetto personalizzato", "sito web familiare"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "noi-e-dessy",
    "text": "Noi e Dessy"
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
      id: "noi-e-dessy",
      children: "Noi e Dessy"
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "Noi e Dessy"
      }), " è un progetto che mette al centro la storia di una famiglia, narrata attraverso un design moderno e coinvolgente. Il sito è stato realizzato con l’obiettivo di comunicare un senso di amore, unione e autenticità."]
    }), "\n", createVNode(_components.h3, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Creare un sito che raccontasse una storia personale e familiare."
      }), "\n", createVNode(_components.li, {
        children: "Sviluppare un design accattivante e semplice da navigare."
      }), "\n", createVNode(_components.li, {
        children: "Assicurare un’esperienza utente coinvolgente su ogni dispositivo."
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: "Il progetto è stato sviluppato utilizzando:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "HTML"
        }), " e ", createVNode(_components.strong, {
          children: "CSS"
        }), " per una struttura semantica e uno stile visivamente armonioso."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "JavaScript"
        }), " per aggiungere interattività."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "WordPress"
        }), " per la gestione dei contenuti, permettendo aggiornamenti semplici e veloci."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "il-nostro-approccio",
      children: "Il Nostro Approccio"
    }), "\n", createVNode(_components.p, {
      children: "Il design si basa su un layout visivamente accattivante, che utilizza colori caldi e immagini evocative per trasmettere un senso di familiarità e accoglienza. L’architettura del sito è stata pensata per guidare l’utente in un viaggio emozionale, mettendo al centro i contenuti visivi e narrativi."
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "LS Web Agency"
      }), " si è occupata di ogni fase del progetto: dall’ideazione, alla progettazione grafica, fino allo sviluppo e al lancio finale."]
    }), "\n", createVNode(_components.p, {
      children: ["Se vuoi scoprire di più su come possiamo realizzare un progetto unico per te, ", createVNode(_components.a, {
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

const url = "src/content/data/portfolio/noi-e-dessy.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/noi-e-dessy.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/noi-e-dessy.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
