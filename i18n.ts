import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "header": {
        "title": "Tobacco",
        "subtitle": "Track"
      },
      "language": {
        "english": "English",
        "spanish": "Español"
      },
      "tabs": {
        "dashboard": "Dashboard",
        "goals": "Goals",
        "weekly": "Weekly",
        "monthly": "Monthly",
        "yearly": "Yearly",
        "settings": "Settings"
      },
      "dashboard": {
        "smokesToday": "Smokes Today",
        "weeklyAverage": "Weekly Average",
        "totalTracked": "Total Tracked",
        "past7Days": "Past 7 Days",
        "currentStreak": "Current Streak",
        "days": "days"
      },
      "history": {
        "title": "History",
        "empty": {
          "title": "No activity yet",
          "subtitle": "Press the button below to start tracking."
        },
        "today": "Today",
        "yesterday": "Yesterday"
      },
      "reports": {
        "weekly": "Weekly Report",
        "monthly": "Monthly Report",
        "yearly": "Yearly Report",
        "inRange": "In Range",
        "dailyAverage": "Daily Average",
        "monthlyAverage": "Monthly Average",
        "vsPrevious": "Vs. Previous Period",
        "vsLastMonth": "Vs. Last Month",
        "vsLastYear": "Vs. Last Year",
        "trend": "Trend",
        "comparison": {
          "upFrom": "Up from {{value}}",
          "stillAt": "Still at {{value}}",
          "noChange": "No change",
          "increase": "{{percent}}% increase",
          "decrease": "{{percent}}% decrease"
        }
      },
      "goals": {
        "tabs": {
          "daily": "Daily",
          "weekly": "Weekly",
          "monthly": "Monthly"
        },
        "setGoalTitle": "Set Your {{type}} Goal",
        "setGoalSubtitle": "Define your consumption limit for this period to stay on track.",
        "setGoalButton": "Set Goal",
        "inputPlaceholder": "e.g., 5",
        "progressTitle": "Your Progress",
        "noGoal": {
          "title": "No goal set for this period.",
          "subtitle": "Use the form above to set one!"
        },
        "motivation": {
          "start": "Every great journey begins with a single step. Set a goal to get started!",
          "cleanSlate": "Goal set and a clean slate for the period. You've got this!",
          "excellent": "Excellent progress. Keep up the great work and stay mindful!",
          "gettingClose": "You're getting close to your goal. Stay focused and finish strong!",
          "limitReached": "You've reached your limit. This is a crucial moment—hold steady!",
          "overLimit": "You've gone over, but don't be discouraged. Tomorrow is a new day."
        }
      },
      "actions": {
        "log": "Log a Smoke",
        "lastLog": "Last: {{time}}",
        "clearAll": "Clear All"
      },
      "settings": {
        "title": "Data Management",
        "description": "Backup your data or import it to another device. Importing will overwrite all current data in this app.",
        "export": {
          "label": "Export Data",
          "description": "Download a JSON file containing all your logs and goals.",
          "button": "Export Data",
          "error": "Failed to export data."
        },
        "import": {
          "label": "Import Data",
          "description": "Import data from a previously exported JSON file. This is a destructive action and cannot be undone.",
          "button": "Import Data",
          "confirm": "Are you sure you want to import this file? All existing data will be permanently overwritten.",
          "success": "Data imported successfully! The application will now reload.",
          "error": {
            "invalidFile": "Import failed. The selected file is invalid or corrupted. Please ensure you are using a valid backup file."
          }
        }
      },
       "share": {
        "button": "Share",
        "title": "My Tobacco Track Progress",
        "text": {
          "daily": "Check out my daily progress on Tobacco Track!",
          "weekly": "Check out my weekly progress on Tobacco Track!"
        },
        "card": {
          "dailyTitle": "Daily Summary",
          "weeklyTitle": "Weekly Progress",
          "smokesToday": "Smokes Today",
          "currentStreak": "Current Streak"
        },
        "error": "Could not generate shareable image."
      },
      "general": {
        "loading": "Loading..."
      }
    }
  },
  es: {
    translation: {
      "header": {
        "title": "Tabaco",
        "subtitle": "Track"
      },
      "language": {
        "english": "English",
        "spanish": "Español"
      },
      "tabs": {
        "dashboard": "Panel",
        "goals": "Metas",
        "weekly": "Semanal",
        "monthly": "Mensual",
        "yearly": "Anual",
        "settings": "Ajustes"
      },
      "dashboard": {
        "smokesToday": "Fumados Hoy",
        "weeklyAverage": "Promedio Semanal",
        "totalTracked": "Total Registrado",
        "past7Days": "Últimos 7 Días",
        "currentStreak": "Racha Actual",
        "days": "días"
      },
      "history": {
        "title": "Historial",
        "empty": {
          "title": "Aún no hay actividad",
          "subtitle": "Presiona el botón de abajo para empezar a registrar."
        },
        "today": "Hoy",
        "yesterday": "Ayer"
      },
      "reports": {
        "weekly": "Reporte Semanal",
        "monthly": "Reporte Mensual",
        "yearly": "Reporte Anual",
        "inRange": "En el Rango",
        "dailyAverage": "Promedio Diario",
        "monthlyAverage": "Promedio Mensual",
        "vsPrevious": "Vs. Periodo Anterior",
        "vsLastMonth": "Vs. Mes Anterior",
        "vsLastYear": "Vs. Año Anterior",
        "trend": "Tendencia",
        "comparison": {
          "upFrom": "Más que {{value}}",
          "stillAt": "Sigue en {{value}}",
          "noChange": "Sin cambios",
          "increase": "{{percent}}% de aumento",
          "decrease": "{{percent}}% de disminución"
        }
      },
      "goals": {
        "tabs": {
          "daily": "Diaria",
          "weekly": "Semanal",
          "monthly": "Mensual"
        },
        "setGoalTitle": "Establece tu Meta {{type}}",
        "setGoalSubtitle": "Define tu límite de consumo para este período para mantenerte en el camino.",
        "setGoalButton": "Fijar Meta",
        "inputPlaceholder": "ej., 5",
        "progressTitle": "Tu Progreso",
        "noGoal": {
          "title": "No hay meta establecida para este período.",
          "subtitle": "¡Usa el formulario de arriba para establecer una!"
        },
        "motivation": {
          "start": "Todo gran viaje comienza con un solo paso. ¡Establece una meta para empezar!",
          "cleanSlate": "Meta establecida y borrón y cuenta nueva para el período. ¡Tú puedes!",
          "excellent": "Excelente progreso. ¡Sigue con el gran trabajo y mantente atento!",
          "gettingClose": "Te estás acercando a tu meta. ¡Mantente enfocado y termina fuerte!",
          "limitReached": "Has alcanzado tu límite. Este es un momento crucial, ¡mantente firme!",
          "overLimit": "Te has pasado, pero no te desanimes. Mañana será otro día."
        }
      },
      "actions": {
        "log": "Registrar Fumado",
        "lastLog": "Último: {{time}}",
        "clearAll": "Limpiar Todo"
      },
      "settings": {
        "title": "Gestión de Datos",
        "description": "Haz una copia de seguridad de tus datos o impórtalos a otro dispositivo. La importación sobrescribirá todos los datos actuales en esta aplicación.",
        "export": {
          "label": "Exportar Datos",
          "description": "Descarga un archivo JSON que contiene todos tus registros y metas.",
          "button": "Exportar Datos",
          "error": "Error al exportar los datos."
        },
        "import": {
          "label": "Importar Datos",
          "description": "Importa datos desde un archivo JSON previamente exportado. Esta es una acción destructiva y no se puede deshacer.",
          "button": "Importar Datos",
          "confirm": "¿Estás seguro de que quieres importar este archivo? Todos los datos existentes se sobrescribirán permanentemente.",
          "success": "¡Datos importados con éxito! La aplicación se recargará ahora.",
          "error": {
            "invalidFile": "Falló la importación. El archivo seleccionado es inválido o está corrupto. Por favor, asegúrate de usar un archivo de respaldo válido."
          }
        }
      },
       "share": {
        "button": "Compartir",
        "title": "Mi Progreso en Tobacco Track",
        "text": {
          "daily": "¡Mira mi progreso diario en Tobacco Track!",
          "weekly": "¡Mira mi progreso semanal en Tobacco Track!"
        },
        "card": {
          "dailyTitle": "Resumen Diario",
          "weeklyTitle": "Progreso Semanal",
          "smokesToday": "Fumados Hoy",
          "currentStreak": "Racha Actual"
        },
        "error": "No se pudo generar la imagen para compartir."
      },
      "general": {
        "loading": "Cargando..."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;