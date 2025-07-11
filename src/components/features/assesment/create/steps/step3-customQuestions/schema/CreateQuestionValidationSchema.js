import { z } from 'zod'

const baseSchema = {
  post: z.string().nonempty('Please enter a question'),
  timeToAnswer: z.number().min(1, 'Time must be at least 1 minute'),
  customScore: z.number().min(1, 'Score must be at least 1'),
  isCompulsory: z.boolean(),
  saveToLibrary: z.boolean(),
};

export const getValidationSchema = (questionType) => {
  switch (questionType) {
    // case 'single-select':
    //   return z.object({
    //     ...baseSchema,
    //     selectedAnswer: z.union([z.string(), z.number()]).refine(val => val !== '' && val != null, 'Please select the correct answer'),
    //     singleSelectAnswers: z.array(
    //       z.object({
    //         id: z.number(),
    //         text: z.string().nonempty('Answer text is required'),
    //       })
    //     ).min(2, 'At least 2 answers required'),
    //   });
    case 'single-select':
      return z.object({
        ...baseSchema,
        selectedAnswer: z.any().refine(
          val => val !== '' && val !== null && val !== undefined,
          'Please select the correct answer'
        ),
        singleSelectAnswers: z.array(
          z.object({
            answerId: z.number().optional(),
            text: z.string().nonempty('Answer text is required'),
          })
        ).min(2, 'At least 2 answers required'),
        shuffleEnabled: z.boolean().default(false),
      });

    case 'multiple-select':
      return z.object({
        ...baseSchema,
        selectedAnswers: z.array(z.any()).min(1, 'Please select at least one correct answer'),
        multipleSelectAnswers: z.array(
          z.object({
            id: z.number(),
            text: z.string().nonempty('Answer text is required'),
          })
        ).min(2, 'At least 2 answers required'),
        shuffleEnabled: z.boolean().default(false),
      });
    case 'numeric-input':
      return z.object({
        ...baseSchema,
        correctAnswer: z.number({ invalid_type_error: 'Please enter a valid numeric answer' }),
        numericCondition: z.string().nonempty('Condition is required'),
      });

    case 'rearrange':
      return z.object({
        ...baseSchema,
        rearrangeOptions: z.array(
          z.object({
            id: z.number().optional(),
            text: z.string().nonempty('Option text is required'),
          })
        ).min(2, 'At least 2 options required'),
      });

    case 'essay':
    case 'video':
    case 'audio':
      return z.object({
        ...baseSchema,
        title: z.string().nonempty('Title is required'),
        relevance_context: z.string().optional(),
        look_for_context: z.string().optional(),
      });

    default:
      return z.object(baseSchema);
  }
};