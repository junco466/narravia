import styles from '@/presentation/pages/About/AboutPage.module.css';

export const AboutPage = () => {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Sobre mí</p>
      <h1 className={styles.title}>Escribir para dejar constancia de la respiración del tiempo.</h1>
      <div className={styles.body}>
        <p>
          Esta plantilla asume que la obra literaria es el centro. La identidad del autor puede crecer en esta
          página mediante contenido estático, Markdown o datos remotos, sin alterar la composición principal.
        </p>
        <p>
          La decisión arquitectónica clave es separar el contenido de la experiencia de lectura. Por eso la UI no
          conoce si un texto viene de `import.meta.glob`, de un CMS headless o de una API versionada.
        </p>
      </div>
    </section>
  );
};
