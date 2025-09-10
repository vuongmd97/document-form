export const pageNames = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
    'Twenty',
    'TwentyOne',
    'TwentyTwo',
    'TwentyThree',
    'TwentyFour',
    'TwentyFine',
    'TwentySix',
    'TwentySeven',
    'TwentyEight',
    'TwentyNine',
    'Thirty',
    'ThirtyOne',
    'ThirtyTwo',
    'ThirtyThree',
    'ThirtyFour',
    'ThirtyFine',
    'ThirtySix',
    'ThirtySeven',
    'ThirtyEight',
    'ThirtyNine',
    'Forty',
    'FortyOne'
];

export const contentController = ({
    fileController,
    fileName,
    fileCssPrint,
    fileCssPdf,
    pageCount,
    documentNumbers
}) => {
    let codePHP = `<?php
  class ${fileController} extends Controller
  {
    public function actionIndex()
    {
      $linkFolder = 'application.views.site.${fileName}.';`;

    if (pageCount === 1) {
        codePHP += `
      $pageOne = $this->renderPartial(
        $linkFolder . 'page-1',
        array(),
        true
      );
      $html = $pageOne;
      `;
    } else {
        for (let i = 0; i < pageCount; i++) {
            codePHP += `
      $page${pageNames[i]} = $this->renderPartial(
        $linkFolder . 'page-${i + 1}',
        array(),
        true
      );`;
        }

        codePHP += `
      $html = $page${pageNames[0]} . "<div class='page-document-divide'></div>";
      `;

        for (let i = 1; i < pageCount - 1; i++) {
            codePHP += `$html .= $page${pageNames[i]} . "<div class='page-document-divide'></div>";
      `;
        }
        codePHP += `$html .= $page${pageNames[pageCount - 1]};`;
    }

    codePHP += `
      echo $html;
    }
  
    public function actionField()
    {
      $imgBlank = "";
      $fields = array(
        'stylepdf' => array(
          'type' => 'style',
          'name' => '${documentNumbers}/${fileCssPdf}'
        ),
        'styleprint' => array(
          'type' => 'style',
          'name' => '${documentNumbers}/${fileCssPrint}'
        ),
  
  
  
      );
      print_r(json_encode($fields));
      die();
    }
  }
  `;

    return codePHP;
};

export const getPagesSnippet = (pageCount = 1) => {
    let codePHP = '';
    if (pageCount === 1) {
        codePHP += `$pageOne = $this->renderPartial(
    $linkFolder . 'page-1',
    array(),
    true
);
$html = $pageOne;
`;
    } else {
        for (let i = 0; i < pageCount; i++) {
            codePHP += `$page${pageNames[i]} = $this->renderPartial(
    $linkFolder . 'page-${i + 1}',
    array(),
    true
);
`;
        }

        codePHP += `
$html = $page${pageNames[0]} . "<div class='page-document-divide'></div>";`;

        for (let i = 1; i < pageCount - 1; i++) {
            codePHP += `
$html .= $page${pageNames[i]} . "<div class='page-document-divide'></div>";`;
        }
        codePHP += `
$html .= $page${pageNames[pageCount - 1]};`;
    }

    return codePHP;
};
