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


export function getWebsiteGemeniAnalysis(content: string): Promise<any> {
    const prompt = `Rate this website HTML and CSS in the file
                    by the categories:
                    is the color scheme match the website genre?
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
                    Show the output in the following JSON format:
                    \n
                    {
                        "website_evaluation": {
                            "category_ratings": [
                            {
                                "category": "Is the color scheme match the website genre?",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "Usability",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "Visual Design",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "Accessibility",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "Content Quality & Readability",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "Navigation & Information Architecture",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "Mobile-Friendliness (Responsiveness)",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "User Engagement",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                            {
                                "category": "Consistency",
                                "text_rating": "...",
                                "numeric_rating": 0
                            },
                    ],
                            "final_score": 0,
                            "best_thing": "...",
                            "worst_thing": "..."
                        }
                    }
                    \n\n
                    the website HTML and CSS is:
                    \n
                    ${content}`;
    return generateContentWithGemini(prompt);
  }
    

export function convertApiResponse(apiResponseString: string): any | null {
    // Remove the ```json and ``` markers
    const cleanString = apiResponseString.replace(/```json\n/g, '').replace(/```/g, '');
  
    try {
      const apiResponse: any = JSON.parse(cleanString);
      return apiResponse;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }