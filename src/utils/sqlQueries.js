export const getSqlInsertLocal = ({
    companySchema,
    companyID,
    documentName,
    documentContent,
    documentField
}) => `INSERT INTO ${companySchema}.user_documents (user_id, doc_id, name, content, fields, status, created_date, updated_date)
VALUES ('${companyID}', '0', '${documentName}', '${documentContent}', '${documentField}', 1, NOW(), NULL);
`;

export const getSqlInsertGlobal = ({
    documentName,
    documentContent,
    documentField
}) => `INSERT INTO gorilladesk.documents (name, content, fields, status, created_date, updated_date)
VALUES ('${documentName}', '${documentContent}', '${documentField}', 1, NOW(), NULL);
`;

export const getSqlUpdateLocal = ({
    companyID,
    documentID,
    documentUpdateMode,
    documentContent,
    documentField
}) => `CALL gorilladesk.localUpdateDocument(${companyID}, ${documentID}, ${documentUpdateMode}, '${documentContent}', '${documentField}');
  `;

export const getSqlUpdateGlobal = ({
    documentID,
    documentUpdateMode,
    documentContent,
    documentField
}) => `CALL gorilladesk.globalUpdateDocument(${documentID}, ${documentUpdateMode}, '${documentContent}', '${documentField}');
  `;

export const getMigrationSQLInsert = ({
    companySchema,
    companyID,
    documentName,
    documentContent,
    documentField,
    documentNumbers,
    createTime,
    createDate,
    scopeUpdate = 'local'
}) => {
    let codeSQL = `<?php

use yii\\db\\Migration;

class m${createDate}_${createTime}_${documentNumbers}_insert_new_doc_${scopeUpdate} extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {`;
    if (scopeUpdate === 'local') {
        codeSQL += `
        $schema = '${companySchema}';
        $userId = ${companyID};
        $docId = 0;`;
    }
    codeSQL += `
        $name = '${documentName}';
        $content = '${documentContent}';
        $fields = '${documentField}';`;
    if (scopeUpdate === 'local') {
        codeSQL += `

        \\Yii::$app->db->createCommand()->insert($schema .'.user_documents', [
            'user_id' => $userId,
            'doc_id' => $docId,`;
    } else {
        codeSQL += `
        
        \\Yii::$app->db->createCommand()->insert('gorilladesk.documents', [`;
    }
    codeSQL += `
            'name' => $name, 
            'content' => $content, 
            'fields' => $fields, 
            'status' => 1, 
            'created_date' => date('Y-m-d H:i:s'), 
        ])->execute();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m${createDate}_${createTime}_${documentNumbers}_insert_new_doc_${scopeUpdate} cannot be reverted.\\n";

        return false;
    }
}`;

    return codeSQL;
};

export const getMigrationSQLUpdate = ({
    companyID,
    documentID,
    documentUpdateMode,
    documentContent,
    documentField,
    documentNumbers,
    createTime,
    createDate,
    scopeUpdate = 'local'
}) => {
    let codeSQL = `<?php

use yii\\db\\Migration;

class m${createDate}_${createTime}_${documentNumbers}_update_doc_${scopeUpdate} extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {`;
    if (scopeUpdate === 'local') {
        codeSQL += `
        $ownerId = ${companyID};
        $userDocumentsId = ${documentID};`;
    } else {
        codeSQL += `
        $documentId = ${documentID};`;
    }
    codeSQL += `
        $updateAll = ${documentUpdateMode};
        $content = '${documentContent}';
        $fields = '${documentField}';`;
    if (scopeUpdate === 'local') {
        codeSQL += `
        
        \\Yii::$app->db->createCommand('CALL gorilladesk.localUpdateDocument(:owner, :user_doc_id, :update_all, :content, :fields);', [
            ':owner' => $ownerId, 
            ':user_doc_id' => $userDocumentsId,`;
    } else {
        codeSQL += `
        
        \\Yii::$app->db->createCommand('CALL gorilladesk.globalUpdateDocument(:document_id, :update_all, :content, :fields);', [
            ':document_id' => $documentId,`;
    }
    codeSQL += `
            ':update_all' => $updateAll, 
            ':content' => $content, 
            ':fields' => $fields, 
        ])->execute();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m${createDate}_${createTime}_${documentNumbers}_update_doc_${scopeUpdate} cannot be reverted.\\n";

        return false;
    }
}`;

    return codeSQL;
};
