import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action = 'generate-draft', // 'generate-draft' | 'continue-writing' | 'polish' | 'key-takeaways' | 'generate-sections'
      title = '',
      category = 'Business',
      existingContent = '',
      customPrompt = '',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Clean plain text from existing HTML content
    const cleanExisting = existingContent.replace(/<[^>]*>?/gm, ' ').trim();

    // Fallback Generator
    const generateSmartFallback = () => {
      const topic = title.trim() || 'Global Technology and Economic Outlook';
      
      if (action === 'key-takeaways') {
        return `<blockquote><strong>Key Editorial Takeaways:</strong><ul><li><strong>Strategic Shift:</strong> Accelerated investment in ${topic} is driving measurable efficiency gains across the sector.</li><li><strong>Market Dynamics:</strong> Early adopters are capturing a disproportionate share of global enterprise capital.</li><li><strong>Foresight & Outlook:</strong> Regulatory frameworks and infrastructure scaling will define the competitive benchmark through 2026.</li></ul></blockquote>`;
      }

      if (action === 'continue-writing') {
        return `<p>Building on these developments, industry leaders are increasingly focusing on sustainable scalability. As capital allocators reassess risk profiles in the current macro environment, the ability to balance aggressive innovation with structural resilience has become the hallmark of institutional success.</p><p>Furthermore, cross-border partnerships and technical standardization are emerging as critical catalysts, ensuring that the momentum behind ${topic} translates into long-term enterprise value.</p>`;
      }

      if (action === 'polish') {
        return `<p>${cleanExisting || `${topic} represents a paradigm shift across global markets, reshaping strategic priorities and institutional workflows.`}</p>`;
      }

      // Default: Full editorial story draft
      return `<h2>The Strategic Imperative</h2><p>In an increasingly interconnected global economy, the emergence of <strong>${topic}</strong> marks a pivotal inflection point. Industry leaders, institutional investors, and policymakers are recalibrating their strategic frameworks to navigate the structural shifts currently underway.</p><blockquote>"The organizations that recognize and adapt to these fundamental market transitions today will define the competitive landscape of tomorrow."</blockquote><h2>Market Dynamics & Structural Impact</h2><p>Recent data underscores an unprecedented acceleration across capital allocation and technological deployment. Companies integrating modern operational workflows have demonstrated resilience against macroeconomic headwinds, outperforming traditional benchmarks across key performance indicators.</p><p>As supply chain integrity and digital infrastructure continue to converge, the demand for high-conviction decision-making has never been more urgent. Strategic resilience is no longer an optional hedge—it is the foundational prerequisite for sustained growth.</p><h2>Looking Ahead: The 2026 Horizon</h2><p>Over the next eighteen months, market participants must closely monitor regulatory harmonization, liquidity dynamics, and infrastructure capacity. The trajectory of ${topic} will continue to serve as a bellwether for the broader trajectory of modern industry.</p>`;
    };

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        content: generateSmartFallback(),
        source: 'local_engine',
      });
    }

    let systemInstruction = '';

    if (action === 'generate-draft') {
      systemInstruction = `You are a senior editor and chief investigative writer for prestige publications like Financial Times, Bloomberg, and The Economist.
Write a comprehensive, compelling, and in-depth editorial news article draft for the title: "${title}".
Category: ${category}.
${customPrompt ? `Special Editor Instructions: ${customPrompt}` : ''}

FORMAT REQUIREMENTS:
- Output clean, semantic HTML directly suitable for a rich WYSIWYG editor.
- Use <h2> for major section headings.
- Use <p> for paragraphs with rich, articulate, professional journalism vocabulary.
- Include one high-impact <blockquote> for a memorable quote or key thesis.
- Do NOT use markdown code fences (\`\`\`html). Output the raw HTML markup directly.
- Aim for 350-500 words of deeply engaging editorial prose.`;
    } else if (action === 'continue-writing') {
      systemInstruction = `You are a prestige publication editor continuing an in-progress news story.
Article Title: "${title}"
Existing Draft Content:
"${cleanExisting.slice(-1200)}"

TASK:
Write the natural, high-quality next 2-3 paragraphs continuing this story seamlessly.
Output clean HTML (<p>, <h2> if needed). Do NOT repeat the existing text. Output only the continuation.`;
    } else if (action === 'polish') {
      systemInstruction = `You are an elite copy editor for Financial Times and Bloomberg.
Rewrite and elevate the following draft text to make it punchy, authoritative, eloquent, and grammatically flawless:
"${cleanExisting}"

Output clean HTML paragraphs (<p>) with elevated prose and sophisticated vocabulary.`;
    } else if (action === 'key-takeaways') {
      systemInstruction = `Generate a sleek editorial "Key Takeaways" summary box for an article titled "${title}".
Output a <blockquote> with a bold title and 3-4 concise, high-value bullet points (<ul><li>...) highlighting the critical insights.`;
    } else {
      systemInstruction = `Write a compelling editorial draft for: "${title}". Output clean HTML (<p>, <h2>, <blockquote>).`;
    }

    const models = [
      'gemini-2.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
      'gemini-2.5-flash',
    ];

    let rawResponseText = '';

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: systemInstruction }],
                },
              ],
              generationConfig: {
                temperature: 0.4,
              },
            }),
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
          rawResponseText = candidateText;
          break;
        }
      } catch (err) {
        // try next model
      }
    }

    if (!rawResponseText) {
      return NextResponse.json({
        success: true,
        content: generateSmartFallback(),
        source: 'smart_fallback',
      });
    }

    // Clean potential markdown wrap
    let cleanedHtml = rawResponseText.trim();
    if (cleanedHtml.startsWith('```html')) {
      cleanedHtml = cleanedHtml.replace(/^```html\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedHtml.startsWith('```')) {
      cleanedHtml = cleanedHtml.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return NextResponse.json({
      success: true,
      content: cleanedHtml,
      source: 'gemini_ai',
    });
  } catch (error: any) {
    console.error('AI Writer API Route Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Error generating AI content.',
      },
      { status: 500 }
    );
  }
}
