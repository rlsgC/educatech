import { readSessionAccount } from './account'

// Perfil de la cuenta de prueba: muestra la página con datos de ejemplo.
const demoProfile = {
  firstName: "Lucas",
  fullName: "Lucas Cordero",
  initials: "MG",
  role: "Docente",
  email: "maria.gonzalez@institucion.edu.ar",
  institution: "Instituto Técnico EducaTech",
};

const account = readSessionAccount()

// true con la cuenta de prueba: solo ella trae cursos, avances y certificados de ejemplo.
export const isDemoProfile = !account

export const currentProfile = account
  ? {
      firstName: account.firstName,
      fullName: `${account.firstName} ${account.lastName}`.trim(),
      initials: `${account.firstName[0] ?? ''}${account.lastName[0] ?? ''}`.toUpperCase(),
      role: "Docente",
      email: account.email,
      institution: account.institution || "Sin institución cargada",
    }
  : demoProfile;
