import { JsonSchema7 } from '@jsonforms/core';
import Ajv2020 from 'ajv/dist/2020';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (data: any) => {
  const doc = new jsPDF();

  // Définir la couleur bleu pour la page de garde
  // const blueColor = [41, 87, 160]; // RGB pour le bleu (ajuste si nécessaire)
  // Covea rgba(18,33,71,255)
  const blueColor: [number, number, number] = [18, 33, 71];
  // Page de garde avec fond bleu
  doc.setFillColor(blueColor[0], blueColor[1], blueColor[2]); // Définir la couleur de fond
  doc.rect(
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height,
    'F',
  ); // Remplir toute la page avec la couleur

  // Calculer la position horizontale pour centrer le texte
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const title = 'DORA Major Incident Report';
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255); // Texte blanc pour contraster avec le bleu
  const titleWidth = doc.getTextWidth(title); // Largeur du texte
  const titleX = (pageWidth - titleWidth) / 2; // Position horizontale pour centrer le texte
  const titleY = pageHeight / 3; // Position verticale (1/3 de la hauteur de la page)

  // Page de garde avec titre centré
  doc.text(title, titleX, titleY); // Titre centré

  // Date centrée
  const dateText = `Date : ${new Date().toLocaleString()}`;
  doc.setFontSize(14);
  const dateWidth = doc.getTextWidth(dateText); // Largeur du texte de la date
  const dateX = (pageWidth - dateWidth) / 2; // Position horizontale pour centrer la date
  const dateY = titleY + 20; // Position verticale sous le titre

  doc.text(dateText, dateX, dateY); // Date centrée

  // Description centrée
  const description = 'Ce document contient les données du formulaire.';
  doc.setFontSize(12);
  const descriptionWidth = doc.getTextWidth(description);
  const descriptionX = (pageWidth - descriptionWidth) / 2;
  const descriptionY = (pageHeight * 96) / 100; // Position verticale sous la date

  doc.text(description, descriptionX, descriptionY); // Description centrée

  // Nouvelle page pour les données
  doc.addPage();

  // Entête du tableau avec le même bleu
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Texte noir pour le tableau
  doc.text('Résumé du formulaire soumis', 14, 20);

  const tableData: any[] = [];

  const flatten = (obj: any, prefix = '') => {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const newPrefix = `${prefix}[${index}]`;
        if (typeof item === 'object' && item !== null) {
          flatten(item, newPrefix);
        } else {
          tableData.push([newPrefix, String(item)]);
        }
      });
    } else if (obj !== null && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        flatten(value, fullKey);
      });
    } else {
      tableData.push([prefix, String(obj)]);
    }
  };

  flatten(data);

  // Entête du tableau avec fond bleu
  autoTable(doc, {
    head: [['Champ', 'Valeur']],
    body: tableData,
    startY: 30,
    headStyles: {
      fillColor: blueColor, // Fond bleu pour l'entête du tableau
      textColor: [255, 255, 255], // Texte blanc
    },
  });

  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
  const fileName = `formulaire_${timestamp}.pdf`;
  doc.save(fileName);
};

export const handleDownload = (data: any) => {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
  const fileName = `formulaire_${timestamp}.json`;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export const validationCategory = (
  schema: JsonSchema7,
  ajv: Ajv2020,
  data: object,
  categories: any,
  activeStep: number,
): any => {
  const currentCategoryElements = categories[activeStep].elements ?? [];

  console.debug('Current Category: ', currentCategoryElements);

  // 1. Extraction récursive des scopes
  const extractScopes = (elements: any[]): string[] => {
    let scopes: string[] = [];
    for (const el of elements) {
      if (el.scope?.startsWith('#/properties/')) {
        const scopePath = el.scope.replace('#/properties/', '');
        scopes.push(scopePath);
      }
      if (el.elements) {
        scopes = [...scopes, ...extractScopes(el.elements)];
      }
    }
    return scopes;
  };

  const activeScopes = extractScopes(currentCategoryElements);
  console.debug('Current Scopes', activeScopes);

  const validate = ajv.compile(schema);
  const valid = validate(data);
  console.debug('Current Data: ', data);
  let currentErrors: any[] = [];
  validate.errors?.forEach(err => {
    activeScopes.forEach((scope: string) => {
      if (err.instancePath.includes(scope)) {
        currentErrors = [...currentErrors, err];
      } else if (
        'missingProperty' in err.params &&
        err.params.missingProperty.includes(scope)
      ) {
        currentErrors = [...currentErrors, err];
      }
    });
  });
  console.debug('Current Errors: ', currentErrors);
  console.debug('Validation: ', valid, validate);

  // const buildPartialSchema = (
  //   schema: JsonSchema7,
  //   scopes: string[],
  // ): JsonSchema7 => {
  //   const partial: JsonSchema7 = {
  //     type: 'object',
  //     properties: {},
  //     required: [],
  //     dependencies: {},
  //   };

  //   if ((schema as any).dependencies) {
  //     (partial as any).dependencies = (schema as any).dependencies;
  //   }

  //   if ((schema as any).$defs) {
  //     (partial as any).$defs = (schema as any).$defs;
  //   }

  //   if ((schema as any).additionalProperties) {
  //     (partial as any).additionalProperties = (
  //       schema as any
  //     ).additionalProperties;
  //   }

  //   for (const scope of scopes) {
  //     const parts = scope.split('/');
  //     let currentSchema: any = schema;
  //     let currentPartial: any = partial;

  //     for (let i = 0; i < parts.length; i++) {
  //       const key = parts[i];

  //       if (!currentSchema.properties?.[key]) break;

  //       currentSchema = currentSchema.properties[key];

  //       if (!currentPartial.properties[key]) {
  //         currentPartial.properties[key] = {
  //           type: 'object',
  //           properties: {},
  //           required: [],
  //         };
  //       }

  //       if (
  //         schema.required?.includes(key) &&
  //         i === 0 // ajouter seulement les champs de premier niveau comme requis
  //       ) {
  //         currentPartial.required?.push(key);
  //       }

  //       if (i === parts.length - 1) {
  //         // Dernier niveau : affectation réelle
  //         currentPartial.properties[key] = currentSchema;
  //       } else {
  //         currentPartial = currentPartial.properties[key];
  //       }
  //     }
  //   }

  //   return partial;
  // };

  // const schemaV7 = schema as JsonSchema7;
  // const partialSchema = buildPartialSchema(schemaV7, activeScopes);
  // cleanRequired(partialSchema);
  // console.log('Schema', partialSchema);

  // const extractPartialData = (
  //   data: any,
  //   scopes: string[],
  // ): Record<string, any> => {
  //   const result: any = {};
  //   for (const scope of scopes) {
  //     console.log(scope);
  //     const parts = scope.split('/');
  //     let currentData = data;
  //     let currentResult = result;
  //     for (let i = 0; i < parts.length; i++) {
  //       const key = parts[i];
  //       if (!(key in currentData)) break;

  //       if (i === parts.length - 1) {
  //         currentResult[key] = currentData[key];
  //       } else {
  //         if (!currentResult[key]) currentResult[key] = {};
  //         currentData = currentData[key];
  //         currentResult = currentResult[key];
  //       }
  //     }
  //   }
  //   return result;
  // };

  // const partialData = extractPartialData(data, activeScopes);
  // console.log(partialData);
  // const cleanpartialData = cleanEmptyObjects(partialData);
  // console.log(cleanpartialData);

  // const validate = ajv.compile(partialSchema);
  // const valid = validate(cleanpartialData);

  return { valid, validate, currentErrors };
};

export const cleanRequired = (schema: any) => {
  if (schema && typeof schema === 'object') {
    if (Array.isArray(schema.required)) {
      schema.required = Array.from(new Set(schema.required));
    }
    for (const key in schema) {
      cleanRequired(schema[key]);
    }
  }
};

export const cleanEmptyObjects = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    // Nettoyer chaque élément du tableau
    return obj
      .map(cleanEmptyObjects)
      .filter(item =>
        typeof item === 'object'
          ? item !== null && Object.keys(item).length > 0
          : item !== undefined,
      );
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanedValue = cleanEmptyObjects(value);
    if (
      typeof cleanedValue === 'object' &&
      cleanedValue !== null &&
      !Array.isArray(cleanedValue) &&
      Object.keys(cleanedValue).length === 0
    ) {
      continue; // ne garde pas les objets vides
    }
    result[key] = cleanedValue;
  }

  return result;
};
