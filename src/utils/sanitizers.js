export const sanitizeDocumentNumbers = (str = '') => {
    return String(str).replace(/[^0-9]/g, '');
};

export const sanitizeNameForSQL = (str = '') => {
    return String(str).replace(/'/g, "''");
};

export const sanitizeContentForPHP = (str = '') => {
    return String(str).replace(/'/g, "\\'");
};

export const sanitizeContentMigration = (str = '') => {
    return String(str).replace(/''/g, "\\'");
};
