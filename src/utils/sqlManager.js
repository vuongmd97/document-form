import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
    getSqlInsertLocal,
    getSqlInsertGlobal,
    getSqlUpdateLocal,
    getSqlUpdateGlobal,
    getMigrationSQLInsert,
    getMigrationSQLUpdate
} from './sqlQueries';
import { generateFilename } from './GenerateFileNameUtils';
import { sanitizeDocumentNumbers, sanitizeContentForPHP, sanitizeContentMigration } from './sanitizers';

const getMigrationTimestamps = (date = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');

    return {
        createDate: `${pad(date.getFullYear() % 100)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`,
        createTime: `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
    };
};

export const getCurrentSQL = ({
    updateScope,
    selectedTab,
    documentName,
    documentID,
    documentUpdateMode,
    documentContent,
    documentField,
    isHtmlEnabled,
    isControllerEnabled,
    companySchema,
    companyID
}) => {
    const isLocal = updateScope === 'local';
    const isUpdating = selectedTab !== 'insert';

    const sqlFunctions = isUpdating
        ? { local: getSqlUpdateLocal, global: getSqlUpdateGlobal }
        : { local: getSqlInsertLocal, global: getSqlInsertGlobal };

    const sqlParams = {
        documentName,
        documentID,
        documentUpdateMode,
        documentContent: isUpdating && !isHtmlEnabled ? '' : documentContent,
        documentField: isUpdating && !isControllerEnabled ? '' : documentField
    };

    return isLocal ? sqlFunctions.local({ companySchema, companyID, ...sqlParams }) : sqlFunctions.global(sqlParams);
};

export const getCurrentSQLInsert = ({
    updateScope,
    companySchema,
    companyID,
    documentName,
    documentContent,
    documentField
}) => {
    return updateScope === 'local'
        ? getSqlInsertLocal({
              companySchema,
              companyID,
              documentName,
              documentContent,
              documentField
          })
        : getSqlInsertGlobal({
              documentName,
              documentContent,
              documentField
          });
};

export const exportSQL = async (params) => {
    const {
        updateScope,
        selectedTab,
        documentNumbers,
        companyID,
        companySchema,
        documentID,
        documentName,
        documentUpdateMode,
        documentContent,
        documentField,
        isHtmlEnabled,
        isControllerEnabled
    } = params;

    const zip = new JSZip();
    const folder = zip.folder(
        `${generateFilename({
            documentNumbers,
            documentName,
            includeDate: false,
            suffix: ''
        })}`
    );
    const { createDate, createTime } = getMigrationTimestamps();
    const scopeUpdate = updateScope.toLowerCase();
    const documentNumbersCleaned = sanitizeDocumentNumbers(documentNumbers);
    const documentContentMigration = sanitizeContentMigration(documentContent);
    const documentFieldMigration = sanitizeContentMigration(documentField);
    const documentNameSanitized = sanitizeContentForPHP(documentName);

    const migrationParams =
        selectedTab === 'insert'
            ? {
                  companySchema,
                  companyID,
                  documentName: documentNameSanitized,
                  documentContent: documentContentMigration,
                  documentField: documentFieldMigration,
                  documentNumbers: documentNumbersCleaned,
                  createTime,
                  createDate,
                  scopeUpdate
              }
            : {
                  companyID,
                  documentID,
                  documentUpdateMode,
                  documentContent: isHtmlEnabled ? documentContentMigration : '',
                  documentField: isControllerEnabled ? documentFieldMigration : '',
                  documentNumbers: documentNumbersCleaned,
                  createTime,
                  createDate,
                  scopeUpdate
              };

    const migrationSQL =
        selectedTab === 'insert' ? getMigrationSQLInsert(migrationParams) : getMigrationSQLUpdate(migrationParams);

    const fileSuffix = selectedTab === 'insert' ? 'insert_new_doc' : 'update_doc';

    const migrationFilename = `m${createDate}_${createTime}_${documentNumbersCleaned}_${fileSuffix}_${scopeUpdate}.php`;
    zip.file(migrationFilename, migrationSQL);

    // const migrationSQLInsert = getMigrationSQLInsert({
    //     companySchema,
    //     companyID,
    //     documentName: documentNameSanitized,
    //     documentContent: documentContentMigration,
    //     documentField: documentFieldMigration,
    //     documentNumbers: documentNumbersCleaned,
    //     createTime,
    //     createDate,
    //     scopeUpdate
    // });

    // const migrationSQLInsertFilename = `m${createDate}_${createTime}_${documentNumbersCleaned}_insert_new_doc_${scopeUpdate}.php`;

    folder.file(migrationFilename, migrationSQL);

    // Export file SQL
    const docDataContent = `-- DOCUMENT_NUMBERS
${documentNumbers}

-- COMPANY_ID
${companyID}

-- COMPANY_SCHEMA
${companySchema}

-- DOCUMENT_MODE_UPDATE
${documentUpdateMode}

-- DOCUMENT_NAME
${documentName}

-- DOCUMENT_ID
${documentID}

-- DOCUMENT_CONTENT
${isHtmlEnabled ? documentContent : ''}

-- DOCUMENT_FIELD
${isControllerEnabled ? documentField : ''}`;

    const dataFilename = generateFilename({
        documentNumbers,
        documentName,
        suffix: `_${selectedTab.toUpperCase()}_${updateScope.toUpperCase()}_DATA.sql`,
        includeDate: false
    });

    zip.file(dataFilename, docDataContent);

    // Generate the zip file
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${documentNumbers}.zip`);
};
