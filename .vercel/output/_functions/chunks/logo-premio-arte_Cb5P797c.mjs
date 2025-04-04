import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CxdTwKPW.mjs';
import 'clsx';

const frontmatter = {
  "title": "Realizzazione Logo Premio Arte",
  "slug": "realizzazione-logo-premio-arte",
  "permalink": "/portfolio/realizzazione-logo-premio-arte/",
  "description": "Creazione di un logo elegante e rappresentativo per il Premio Arte, un evento dedicato alla valorizzazione degli artisti contemporanei.",
  "publishDate": "2025-02-23T00:00:00.000Z",
  "updateDate": "2025-02-23T00:00:00.000Z",
  "category": "Brand Identity",
  "technologies": ["Illustrator", "Graphic Design", "Branding"],
  "image": {
    "src": "/images/portfolio/logo-premioarte.webp",
    "alt": "Logo Premio Arte",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Realizzazione Logo Premio Arte - LS Web Agency",
    "description": "Scopri il progetto di creazione del logo per il Premio Arte realizzato da LS Web Agency: un logo elegante e rappresentativo per un evento dedicato agli artisti contemporanei.",
    "keywords": ["logo design", "premio arte", "brand identity", "graphic design"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "realizzazione-logo-premio-arte",
    "text": "Realizzazione Logo Premio Arte"
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
      id: "realizzazione-logo-premio-arte",
      children: "Realizzazione Logo Premio Arte"
    }), "\n", createVNode(_components.p, {
      children: ["La ", createVNode(_components.strong, {
        children: "realizzazione del logo per il Premio Arte"
      }), " rappresenta un progetto di grande valore creativo e simbolico. Il logo è stato progettato per incarnare l’eleganza, la passione e la creatività dell’evento, dedicato alla valorizzazione degli artisti contemporanei."]
    }), "\n", createVNode(_components.h3, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Creare un’identità visiva distintiva che rispecchi il prestigio del Premio Arte."
      }), "\n", createVNode(_components.li, {
        children: "Garantire un design che possa essere utilizzato su vari supporti promozionali, sia online che offline."
      }), "\n", createVNode(_components.li, {
        children: "Trasmettere valori di creatività, arte e innovazione attraverso un logo semplice ma di forte impatto visivo."
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Adobe Illustrator"
        }), " per la creazione del logo vettoriale."]
      }), "\n", createVNode(_components.li, {
        children: ["Principi di ", createVNode(_components.strong, {
          children: "graphic design"
        }), " per una comunicazione visiva efficace."]
      }), "\n", createVNode(_components.li, {
        children: ["Elementi di ", createVNode(_components.strong, {
          children: "branding"
        }), " per creare un’identità coerente e memorabile."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "il-nostro-approccio",
      children: "Il Nostro Approccio"
    }), "\n", createVNode(_components.p, {
      children: "Abbiamo scelto un design elegante e moderno, utilizzando forme geometriche bilanciate e una palette cromatica raffinata. L’obiettivo principale è stato quello di creare un simbolo facilmente riconoscibile, che rappresenti al meglio l’importanza dell’evento artistico."
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "LS Web Agency"
      }), " è orgogliosa di supportare l’arte e la creatività attraverso progetti di design di alta qualità."]
    }), "\n", createVNode(_components.p, {
      children: ["Per ulteriori informazioni su come possiamo aiutarti a realizzare il tuo progetto visivo, ", createVNode(_components.a, {
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

const url = "src/content/data/portfolio/logo-premio-arte.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/logo-premio-arte.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/logo-premio-arte.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
