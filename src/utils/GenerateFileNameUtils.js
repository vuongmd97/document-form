export const generateFilename = ({ documentNumbers, documentName = 'Document', suffix = '', includeDate = true }) => {
    const formatDate = (value) => String(value).padStart(2, '0');

    const now = new Date();
    const year = now.getFullYear();
    const month = formatDate(now.getMonth() + 1);
    const day = formatDate(now.getDate());

    const formatDocumentName = documentName
        .replace(/[’'&,.-]/g, '')
        .replace(/[\s/]+/g, '_')
        .trim();

    const dataPrefix = includeDate ? `${year}_${month}_${day}_` : '';

    return `${dataPrefix}${documentNumbers}_${formatDocumentName}${suffix}`;
};
