// Validación de correo compartida por el navegador Y el servidor.
//
// Por qué no basta con <input type="email">: el navegador acepta
// "juan@localhost" o "a@b" (sin punto ni dominio real), y además
// cualquiera puede saltarse el navegador y llamar al servidor
// directamente. Por eso se valida en los DOS lados con la MISMA regla.
//
// Regla: texto@dominio.extensión, donde
//  - la parte local usa letras, números y . _ % + -
//  - el dominio usa letras, números y guiones, con al menos un punto
//  - la extensión final tiene 2 letras o más (.com, .co, .org...)
export const EMAIL_PATTERN = '[A-Za-z0-9._%+\\-]+@[A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*\\.[A-Za-z]{2,}';

const EMAIL_REGEX = new RegExp(`^${EMAIL_PATTERN}$`);

export const isValidEmail = (value: string): boolean => value.length <= 120 && EMAIL_REGEX.test(value);
