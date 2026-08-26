import styles from '@/presentation/pages/About/AboutPage.module.css';

export const AboutPage = () => {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Sobre mí</p>
      <h1 className={styles.title}>Escribo bajo el nombre de Simón Vergel.</h1>
      <div className={styles.body}>
        <p className={styles.dropCap}>
          No es un seudónimo para esconderme, sino uno que me permite ser más honesto de lo que suelo ser con mi
          propio nombre. Detrás de él está alguien que encontró en la escritura una forma de gritar en silencio,
          de ordenar lo que la vida a veces vuelve un ruido constante.
        </p>
        <p>
          Este espacio nació sin un propósito más profundo que el de tener un lugar propio para mis ideas: poemas
          que aparecen a mitad de la noche, novelas que crecen despacio y reflexiones que solo tienen sentido
          cuando se escriben. No busco enseñar nada; busco compartir quién soy y en quién me voy convirtiendo.
        </p>
        <p>
          Si algo de lo que leas aquí te toca, te incomoda o simplemente te acompaña un rato, este cuaderno ya
          cumplió su propósito.
        </p>
      </div>
    </section>
  );
};
