/**
 * Utility function to get question type from resourcetype and multiple_true
 * @param {string} resourcetype - The resource type of the question
 * @param {boolean} multipleTrue - Whether the question allows multiple selections
 * @returns {string} The question type string
 */
export const getQuestionType = (resourcetype, multipleTrue = false) => {
  const typeMapping = {
    'MCQuestion': multipleTrue ? 'multiple-select' : 'single-select',
    'RatingQuestion': 'rating',
    'RearrangeQuestion': 'rearrange',
    'NumberQuestion': 'numeric-input',
    'EssayQuestion': 'essay',
    'CodeQuestion': 'code',
    'ExcelQuestion': 'ms-excel',
    'SheetsQuestion': 'google-sheets',
    'VideoQuestion': 'video',
    'AudioQuestion': 'audio'
  };

  return typeMapping[resourcetype] || 'unknown';
}; 