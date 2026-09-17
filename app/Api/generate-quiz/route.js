import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { topic, grade, count } = await request.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const prompt = `Generate exactly ${count} multiple-choice questions for a student preparing for the Indonesian Curriculum (e.g., SMA Kurikulum Merdeka, UTBK, SNBT) on the topic of ${topic} at the ${grade} level.
    Return the response ONLY as a JSON array of objects.
    Each object must have the following structure:
    {
      "question": "The exact text of the question (use appropriate terminology in Indonesian or English depending on context)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact text of the correct option",
      "explanation": "A highly detailed, step-by-step mathematical/conceptual derivation of how to arrive at the correct answer."
    }
    Make sure the difficulty and style strictly align with UTBK or advanced high school standards. Ensure no markdown formatting is wrapping the JSON output, just raw JSON string.`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error:', JSON.stringify(errorData, null, 2))
      return NextResponse.json({
        error: `Gemini API error: ${errorData?.error?.message || 'Unknown error'}`,
        details: errorData
      }, { status: response.status })
    }

    const data = await response.json()
    const rawText = data.candidates[0].content.parts[0].text

    // Attempt robust parsing
    let jsonString = rawText.trim()
    const jsonMatch = jsonString.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      jsonString = jsonMatch[0]
    }

    const questions = JSON.parse(jsonString)
    return NextResponse.json({ questions })

  } catch (error) {
    console.error('Error in generate-quiz route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
