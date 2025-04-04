import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CxdTwKPW.mjs';
import 'clsx';

const frontmatter = {
  "title": "Valeria Chelo - Psicologa a Sassari",
  "slug": "valeriachelo-psicologa-sassari",
  "permalink": "/portfolio/valeriachelo-psicologa-sassari/",
  "description": "Progetto web dedicato a Valeria Chelo, psicologa a Sassari.",
  "publishDate": "2025-02-24T00:00:00.000Z",
  "updateDate": "2025-02-24T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WordPress"],
  "image": {
    "src": "/images/portfolio/Valeria-Chelo-psicologa-Sassari.webp",
    "alt": "Sito web di Valeria Chelo, psicologa a Sassari",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Valeria Chelo - Psicologa a Sassari - LS Web Agency",
    "description": "Scopri il progetto web realizzato per Valeria Chelo, psicologa a Sassari.",
    "keywords": ["psicologa Sassari", "web design", "WordPress"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "valeria-chelo---psicologa-a-sassari",
    "text": "Valeria Chelo - Psicologa a Sassari"
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
      id: "valeria-chelo---psicologa-a-sassari",
      children: "Valeria Chelo - Psicologa a Sassari"
    }), "\n", createVNode(_components.p, {
      children: "Valeria Chelo, psicologa professionista con sede a Sassari, desiderava un sito web in grado di riflettere professionalità, empatia e accessibilità per i suoi pazienti."
    }), "\n", createVNode(_components.h2, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.p, {
      children: "Il sito web è stato realizzato per:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Offrire una presenza online chiara e professionale"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Facilitare il contatto diretto tramite moduli intuitivi"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Comunicare i servizi offerti in modo accessibile e trasparente"
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
      children: "Il sito offre un’interfaccia pulita e semplice da navigare, valorizzando la figura di Valeria Chelo come professionista pronta ad accogliere i suoi pazienti con un approccio empatico e di ascolto."
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

const url = "src/content/data/portfolio/valeria-chelo-psicologa-sassari.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/valeria-chelo-psicologa-sassari.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/valeria-chelo-psicologa-sassari.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
