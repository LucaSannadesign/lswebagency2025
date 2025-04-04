import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CxdTwKPW.mjs';
import 'clsx';

const frontmatter = {
  "title": "Luca Sanna - Artista Contemporaneo",
  "slug": "luca-sanna-artista-contemporaneo",
  "permalink": "/portfolio/luca-sanna-artista-contemporaneo/",
  "description": "Progetto web dedicato a Luca Sanna, artista contemporaneo, con l'obiettivo di creare una presenza online che valorizzi le sue opere e il suo percorso creativo.",
  "publishDate": "2025-02-24T00:00:00.000Z",
  "updateDate": "2025-02-24T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WordPress"],
  "image": {
    "src": "/images/portfolio/luca-sanna-artista.webp",
    "alt": "Sito web di Luca Sanna, artista contemporaneo",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Luca Sanna - Artista Contemporaneo - LS Web Agency",
    "description": "Scopri il progetto web realizzato per Luca Sanna, artista contemporaneo, con una presenza online che mette in risalto il suo percorso artistico e le sue opere.",
    "keywords": ["artista contemporaneo", "Luca Sanna", "sito web artistico", "web design", "WordPress"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "luca-sanna---artista-contemporaneo",
    "text": "Luca Sanna - Artista Contemporaneo"
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
      id: "luca-sanna---artista-contemporaneo",
      children: "Luca Sanna - Artista Contemporaneo"
    }), "\n", createVNode(_components.p, {
      children: "Luca Sanna è un artista contemporaneo che desiderava un sito web in grado di mettere in risalto il suo percorso artistico, le sue opere e la sua visione creativa."
    }), "\n", createVNode(_components.h2, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.p, {
      children: "Il sito web è stato realizzato per:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Valorizzare le opere artistiche di Luca Sanna"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Fornire informazioni sul percorso e sulla visione creativa dell’artista"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Facilitare il contatto diretto e la comunicazione con i visitatori"
        }), "."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: ["Abbiamo scelto di realizzare il sito con ", createVNode(_components.strong, {
        children: "WordPress"
      }), ", integrando elementi di ", createVNode(_components.strong, {
        children: "HTML"
      }), ", ", createVNode(_components.strong, {
        children: "CSS"
      }), " e ", createVNode(_components.strong, {
        children: "JavaScript"
      }), " per garantire un design moderno e una navigazione intuitiva."]
    }), "\n", createVNode(_components.h2, {
      id: "risultato-finale",
      children: "Risultato Finale"
    }), "\n", createVNode(_components.p, {
      children: "Il risultato finale è un sito web che mette in risalto le opere di Luca Sanna e il suo stile artistico unico, offrendo un’esperienza visiva coinvolgente per il pubblico."
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

const url = "src/content/data/portfolio/luca-sanna-artista-sardo-sassari.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/luca-sanna-artista-sardo-sassari.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/luca-sanna-artista-sardo-sassari.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
