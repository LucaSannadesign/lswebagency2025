import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CxdTwKPW.mjs';
import 'clsx';

const frontmatter = {
  "title": "Soluzioni Digitali Intuitive per la Chiaroveggenza - Estrella Yoruba Tarot",
  "slug": "soluzioni-digitali-chiaroveggenza-estrella-yoruba-tarot",
  "permalink": "/portfolio/soluzioni-digitali-chiaroveggenza-estrella-yoruba-tarot/",
  "description": "Progetto web realizzato per Estrella Yoruba Tarot, con l'obiettivo di creare una presenza online intuitiva e professionale per la chiaroveggenza e la lettura dei tarocchi.",
  "publishDate": "2025-02-24T00:00:00.000Z",
  "updateDate": "2025-02-24T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WordPress"],
  "image": {
    "src": "/images/portfolio/estrella-yoruba-tarot-chiarovveggente-1920x864.webp",
    "alt": "Sito web Estrella Yoruba Tarot per la chiaroveggenza e i tarocchi",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Soluzioni Digitali per Estrella Yoruba Tarot - LS Web Agency",
    "description": "Scopri il progetto web realizzato per Estrella Yoruba Tarot: una presenza online intuitiva e professionale per la chiaroveggenza e la lettura dei tarocchi.",
    "keywords": ["chiaroveggenza", "lettura tarocchi", "sito web professionale", "Estrella Yoruba Tarot", "WordPress"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "soluzioni-digitali-intuitive-per-la-chiaroveggenza---estrella-yoruba-tarot",
    "text": "Soluzioni Digitali Intuitive per la Chiaroveggenza - Estrella Yoruba Tarot"
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
      id: "soluzioni-digitali-intuitive-per-la-chiaroveggenza---estrella-yoruba-tarot",
      children: "Soluzioni Digitali Intuitive per la Chiaroveggenza - Estrella Yoruba Tarot"
    }), "\n", createVNode(_components.p, {
      children: "Estrella Yoruba Tarot desiderava un sito web in grado di trasmettere professionalità, empatia e intuizione per offrire servizi di chiaroveggenza e lettura dei tarocchi."
    }), "\n", createVNode(_components.h2, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.p, {
      children: "Il sito web è stato realizzato per:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Offrire una presenza online intuitiva e professionale"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Fornire informazioni sui servizi di chiaroveggenza e lettura dei tarocchi"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Facilitare il contatto diretto e la prenotazione di sessioni online"
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
      }), " per garantire un design accattivante e una navigazione semplice."]
    }), "\n", createVNode(_components.h2, {
      id: "risultato-finale",
      children: "Risultato Finale"
    }), "\n", createVNode(_components.p, {
      children: "Il risultato finale è un sito web che mette in risalto i servizi offerti da Estrella Yoruba Tarot, creando un’esperienza online empatica e coinvolgente per i visitatori."
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

const url = "src/content/data/portfolio/estrella-yoruba-tarot-chiaroveggente.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/estrella-yoruba-tarot-chiaroveggente.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/estrella-yoruba-tarot-chiaroveggente.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
