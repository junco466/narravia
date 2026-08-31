// 'use client' porque useActionState es un Hook de React — y los Hooks
// solo existen en Client Components. El formulario en sí sigue
// enviando los datos al servidor (a la función login() en actions.ts);
// lo único que corre en el navegador es la parte de "mostrar el error
// y deshabilitar el botón mientras se procesa".
'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';
import styles from './page.module.css';

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <p className={styles.eyebrow}>Narravia</p>
        <h1 className={styles.title}>Acceso de administrador</h1>

        <label className={styles.field}>
          <span>Usuario</span>
          <input name="username" type="text" autoComplete="username" required />
        </label>

        <label className={styles.field}>
          <span>Contraseña</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>

        {state.error ? (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        ) : null}

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
