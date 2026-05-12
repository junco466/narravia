import styles from '@/presentation/pages/Contact/ContactPage.module.css';

export const ContactPage = () => {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Contacto</p>
      <h1 className={styles.title}>Canales para lectores, editores y colaboraciones.</h1>
      <div className={styles.card}>
        <p>
          Este frontend deja la página de contacto deliberadamente simple para que la integración posterior con un
          backend, formulario transaccional o CRM se haga sin rediseñar la vista.
        </p>
        <ul className={styles.list}>
          <li>Correo editorial: editorial@cuadernodemedianoche.com</li>
          <li>Prensa y colaboraciones: prensa@cuadernodemedianoche.com</li>
          <li>Instagram literario: @cuadernodemedianoche</li>
        </ul>
      </div>
    </section>
  );
};
