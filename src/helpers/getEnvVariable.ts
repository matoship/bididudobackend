/**
 * return key from .env
 *
 * @param   {string}  key
 *
 * @return  {string}
 */
export function getEnvVar(key: string): string {
  const value = process.env[key];
  console.log(value);
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
}
