import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_QQ5SR1oO.mjs';
import 'clsx';

const frontmatter = {
  "title": "Patrizia Sabbadin - Counselor a Sassari",
  "slug": "patrizia-sabbadin-counselor-sassari",
  "permalink": "/portfolio/patrizia-sabbadin-counselor-sassari/",
  "description": "Progetto web dedicato a Patrizia Sabbadin, counselor a Sassari, con l'obiettivo di creare una presenza online professionale e accessibile.",
  "publishDate": "2025-02-24T00:00:00.000Z",
  "updateDate": "2025-02-24T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WordPress"],
  "image": {
    "src": "/images/portfolio/Patrizia-Sabbadin-Psicologa-counselor-Sassari.webp",
    "alt": "Sito web di Patrizia Sabbadin, counselor a Sassari",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Patrizia Sabbadin - Counselor a Sassari - LS Web Agency",
    "description": "Scopri il progetto web realizzato per Patrizia Sabbadin, counselor a Sassari, con una presenza online studiata per offrire informazioni e contatti in modo chiaro e professionale.",
    "keywords": ["counselor Sassari", "web design", "sito professionale", "WordPress"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "patrizia-sabbadin---counselor-a-sassari",
    "text": "Patrizia Sabbadin - Counselor a Sassari"
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
      id: "patrizia-sabbadin---counselor-a-sassari",
      children: "Patrizia Sabbadin - Counselor a Sassari"
    }), "\n", createVNode(_components.p, {
      children: "Patrizia Sabbadin, counselor professionista con sede a Sassari, desiderava un sito web in grado di riflettere professionalità, empatia e accessibilità per i suoi pazienti."
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
      children: "Il sito offre un’interfaccia pulita e semplice da navigare, valorizzando la figura di Patrizia Sabbadin come professionista pronta ad accogliere i suoi pazienti con un approccio empatico e di ascolto."
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

const url = "src/content/data/portfolio/patriiza-sabbaidin-counselor-sassari.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/patriiza-sabbaidin-counselor-sassari.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/patriiza-sabbaidin-counselor-sassari.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
