import { AnalyzeWebsiteDto } from '../dto/analyze-website.dto';

async function generateContentWithGemini(prompt: string): Promise<any> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export function getWebsiteGemeniAnalysis(
  content: string,
  options: AnalyzeWebsiteDto,
): Promise<any> {
  console.log(options);
  const prompt = `Rate this website HTML and CSS in the file
                    \n
                    when you analyze the website, please consider the following aspects:
                    \n
                    the audience target of the website are: ${options.audience?.join(', ')}.
                    the categories of the website are: ${options.categories?.join(', ')}.
                    the target emotions of the visitors when visiting the website are: ${options.emotions?.join(', ')}.
                    the website purpose is: ${options.purpose}
                    \n
                    Please evaluate the website based on the following categories:
                    \n
                    by the categories:
                    Color Schema
                    Usability
                    Visual Design
                    Accessibility
                    Content Quality & Readability
                    Navigation & Information Architecture
                    Mobile-Friendliness (Responsiveness)
                    User Engagement
                    Consistency. 
                    Add to each category text rate and numeric 1-10.
                    Add the final score 1-100,
                    with the best thing and the worst thing.
                    how can I improve each category? 
                    make me a short list of action items on each category listed.
                    add to each action rate how important it and by how much it will improve the category rate.
                    According to the improvement suggestions create new html with css with tailwind, keep the text from the original website and the some of colors.
                    \n
                    Show the output in the following JSON format:
                    \n
                    {
                        "website_evaluation": {
                            "category_ratings": [
                            {
                                "category": "Color Schema",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "Usability",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "Visual Design",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "Accessibility",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "Content Quality & Readability",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "Navigation & Information Architecture",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "Mobile-Friendliness (Responsiveness)",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "User Engagement",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                            {
                                "category": "Consistency",
                                "text_rating": "...",
                                "numeric_rating": 0,
                                "improvement_suggestions": [
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    },
                                    {
                                        "improvement": "...",
                                        "importance": 0,
                                        "expected_improvement": 0
                                    }
                                ]
                            },
                    ],
                            "final_score": 0,
                            "best_thing": "...",
                            "worst_thing": "...",
                            "suggested_new_html": "..."
                        }
                    }
                    \n\n
                    the website HTML and CSS is:
                    \n
                    ${content}`;
  return generateContentWithGemini(prompt);
}

export function convertApiResponse(apiResponseString: string): any | null {
  const cleanString = apiResponseString
    .replace(/```json\n/g, '')
    .replace(/```/g, '');

  try {
    const apiResponse: any = JSON.parse(cleanString);
    return apiResponse;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}
