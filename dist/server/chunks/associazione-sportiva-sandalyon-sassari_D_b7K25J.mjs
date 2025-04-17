import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_QQ5SR1oO.mjs';
import 'clsx';

const frontmatter = {
  "title": "ASD Sandalyon Sassari",
  "slug": "asd-sandalyon-sassari",
  "permalink": "/portfolio/asd-sandalyon-sassari/",
  "description": "Progetto web dedicato all'ASD Sandalyon di Sassari, con l'obiettivo di creare una presenza online moderna e coinvolgente.",
  "publishDate": "2025-02-24T00:00:00.000Z",
  "updateDate": "2025-02-24T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WordPress"],
  "image": {
    "src": "/images/portfolio/sito-web-asd-sandalyon2-ss.webp",
    "alt": "Sito web ASD Sandalyon Sassari",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "ASD Sandalyon Sassari - LS Web Agency",
    "description": "Scopri il progetto web realizzato per ASD Sandalyon Sassari: una piattaforma moderna per promuovere le attività sportive e coinvolgere la comunità locale.",
    "keywords": ["ASD Sandalyon Sassari", "sito web sportivo", "web design", "WordPress"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "asd-sandalyon-sassari",
    "text": "ASD Sandalyon Sassari"
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
      id: "asd-sandalyon-sassari",
      children: "ASD Sandalyon Sassari"
    }), "\n", createVNode(_components.p, {
      children: "ASD Sandalyon è un’associazione sportiva dilettantistica con sede a Sassari. Il progetto aveva l’obiettivo di creare una piattaforma online moderna e coinvolgente che rispecchiasse i valori e le attività sportive dell’associazione."
    }), "\n", createVNode(_components.h2, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.p, {
      children: "Il sito web è stato realizzato per:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Promuovere le attività sportive dell’associazione"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Fornire informazioni utili sui corsi e sulle attività"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Facilitare la comunicazione con i membri e il pubblico"
        }), "."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: ["Il sito è stato sviluppato utilizzando ", createVNode(_components.strong, {
        children: "WordPress"
      }), ", con l’integrazione di ", createVNode(_components.strong, {
        children: "HTML"
      }), ", ", createVNode(_components.strong, {
        children: "CSS"
      }), " e ", createVNode(_components.strong, {
        children: "JavaScript"
      }), " per creare un design accattivante e una navigazione fluida."]
    }), "\n", createVNode(_components.h2, {
      id: "risultato-finale",
      children: "Risultato Finale"
    }), "\n", createVNode(_components.p, {
      children: "Il risultato finale è un sito dinamico e facile da navigare che rispecchia lo spirito sportivo dell’ASD Sandalyon e offre un punto di riferimento online per tutti gli appassionati e i membri dell’associazione."
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

const url = "src/content/data/portfolio/associazione-sportiva-sandalyon-sassari.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/associazione-sportiva-sandalyon-sassari.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/associazione-sportiva-sandalyon-sassari.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
