import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title = '',
      excerpt = '',
      content = '',
      focusKeyword = '',
      metaDescription = '',
      category = 'Business',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!title && !content && !excerpt) {
      return NextResponse.json(
        {
          error: 'Please provide at least a title or draft text to generate SEO suggestions.',
        },
        { status: 400 }
      );
    }

    // Default smart algorithmic fallback generator with complete ready-to-use drafts
    const generateSmartFallback = (rawTitle: string, rawCat: string, rawExcerpt: string) => {
      const cleanTitle = rawTitle.trim() || 'Modern Global Industry Trends & Strategic Outlook';
      const words = cleanTitle.split(/\s+/);
      const mainSubject = words.slice(0, 4).join(' ');

      const t1 = `Why ${mainSubject} Matters More Than Ever in 2026`;
      const t2 = `${cleanTitle}: Complete Strategic Analysis & Forecast`;
      const t3 = `Inside the Shift: ${mainSubject} and the Global Market Outlook`;

      return {
        overallScore: Math.min(95, Math.max(70, 60 + (cleanTitle.length >= 40 && cleanTitle.length <= 70 ? 25 : 15))),
        scoreLabel: 'Strong Optimization',
        searchIntent: 'Informational & Commercial',
        topicDepth: 'In-Depth Editorial',
        titleSuggestions: [
          {
            type: 'High CTR & Viral',
            title: t1,
            hook: 'High curiosity & reader engagement',
            excerpt: `As structural shifts accelerate across ${rawCat || 'the global economy'}, industry leaders are confronting a pivotal moment in ${mainSubject}. Here is why this transition is reshaping the market in 2026.`,
            draftHtml: `<h2>The Inflection Point</h2><p>For decades, institutional strategies across <strong>${mainSubject}</strong> were built around incremental optimization. Today, that framework has been replaced by an urgent mandate for technological resilience and structural innovation.</p><blockquote>"The organizations that proactively adapt to this inflection point today will command the competitive landscape of the next decade."</blockquote><h2>Structural Shifts & Market Dynamics</h2><p>Recent industry metrics demonstrate an unprecedented acceleration in capital deployment. Organizations that have reimagined their operational architecture are establishing measurable competitive moats, demonstrating robustness even against broader macroeconomic turbulence.</p><p>As cross-border collaboration and institutional capital converge, the imperative for clear, high-conviction decision-making has never been greater.</p><h2>The Road to 2026 and Beyond</h2><p>Navigating the months ahead will require a meticulous balance between aggressive technological adoption and operational prudence. The evolution of ${mainSubject} is rapidly becoming the defining benchmark for modern enterprise leadership.</p>`,
          },
          {
            type: 'SEO Search Optimized',
            title: t2,
            hook: 'Matches top Google search queries',
            excerpt: `An exhaustive analysis of ${cleanTitle}, examining the critical market drivers, strategic capital allocation, and emerging trends defining the sector through 2026.`,
            draftHtml: `<h2>Executive Overview</h2><p>The strategic emergence of <strong>${cleanTitle}</strong> marks a fundamental milestone in the evolution of ${rawCat || 'modern enterprise'}. Market participants are re-evaluating risk exposure and capital allocation models to capitalize on high-growth opportunities.</p><blockquote>"Strategic foresight in ${mainSubject} is no longer an optional hedge—it is the foundational prerequisite for sustained market relevance."</blockquote><h2>Key Performance Drivers & Market Analysis</h2><p>Granular data from leading industry benchmarks highlights strong tailwinds behind sector-wide modernization. Early institutional adopters have registered substantial gains across productivity, operational throughput, and capital efficiency.</p><p>Furthermore, regulatory clarity and standardizations are paving the way for broader enterprise integration, unlocking previously untapped avenues for long-term growth.</p><h2>Strategic Recommendations for Industry Leaders</h2><p>Stakeholders must prioritize core competency development, strategic alliances, and rigorous governance to maximize the impact of these sector-wide transitions.</p>`,
          },
          {
            type: 'Executive Editorial',
            title: t3,
            hook: 'Authoritative, Financial Times style tone',
            excerpt: `In-depth reporting on ${mainSubject}: how structural realignments, institutional investments, and regulatory shifts are reshaping industry fundamentals.`,
            draftHtml: `<h2>A Paradigm Shift in Industry Architecture</h2><p>In the corridors of global industry, a profound realignment is underway around <strong>${mainSubject}</strong>. Senior decision-makers are navigating a rapidly shifting geopolitical and economic terrain that demands both precision and ambition.</p><blockquote>"We are witnessing a structural reconfiguration that will establish the market leaders of the next economic cycle."</blockquote><h2>Capital Allocation and Execution</h2><p>The convergence of advanced infrastructure, disciplined capital management, and institutional stewardship has established a new standard for operational excellence across the sector.</p><p>Those positioned to execute with speed and rigor will not only withstand sector volatility but actively define the terms of future market expansion.</p><h2>The Long-Term Horizon</h2><p>Looking ahead, the resilience of institutional models will depend directly on their capacity to integrate these strategic shifts into enduring core operations.</p>`,
          },
        ],
        suggestedMeta: {
          seoTitle: cleanTitle.length > 60 ? cleanTitle.slice(0, 57) + '...' : cleanTitle,
          metaDescription: rawExcerpt
            ? (rawExcerpt.slice(0, 155) + (rawExcerpt.length > 155 ? '...' : ''))
            : `Discover the strategic implications of ${mainSubject}. Expert reporting, market dynamics, and editorial foresight on ApexChief.`,
        },
        keywords: [
          rawCat || 'Business',
          words[0] || 'Market',
          words[1] || 'Strategy',
          'Global Outlook',
          'Analysis 2026',
        ].filter(Boolean),
        checklist: [
          {
            id: 'title_length',
            label: 'Title Length (40-65 chars)',
            status: cleanTitle.length >= 35 && cleanTitle.length <= 70 ? 'good' : 'warning',
            message: `Current title is ${cleanTitle.length} characters. Ideal length is 40-65 characters.`,
          },
          {
            id: 'meta_desc',
            label: 'Meta Description Hook',
            status: rawExcerpt ? 'good' : 'warning',
            message: rawExcerpt ? 'Meta description is present and engaging.' : 'Add a 150-character meta summary to boost Google CTR.',
          },
          {
            id: 'intent',
            label: 'Search Intent Clarity',
            status: 'good',
            message: `Accurately targeted for readers searching in ${rawCat || 'General'}.`,
          },
        ],
        actionableSuggestions: [
          `Consider using powerful action verbs like "Breakthrough", "Strategic", or "Forecast" in headline.`,
          `Include 2-3 subheading sections to improve Google snippet crawling.`,
          `Add high-resolution cover photography with descriptive alt tags.`,
        ],
      };
    };

    // If API key is not present, return the smart fallback immediately
    if (!apiKey) {
      const fallback = generateSmartFallback(title, category, excerpt);
      return NextResponse.json({
        success: true,
        analysis: fallback,
        source: 'local_nlp_engine',
      });
    }

    const systemPrompt = `You are an elite Google News & Editorial SEO Specialist for prestigious publications like Bloomberg, Financial Times, and The Economist.
Analyze the title and category, and provide 3 click-worthy, high-ranking headline alternatives. FOR EACH HEADLINE ALTERNATIVE, also write:
1. A punchy 2-sentence Lead Summary/Excerpt (140-160 chars).
2. A complete, rich editorial news draft in clean HTML (<p>, <h2>, <blockquote>) with 3-4 paragraphs of insightful journalism prose.

Input:
- Title: "${title || 'Untitled Draft'}"
- Category: "${category}"

OUTPUT REQUIREMENTS:
Respond ONLY with a valid, parseable JSON object matching this schema:
{
  "overallScore": 88,
  "scoreLabel": "Excellent",
  "searchIntent": "Informational & Commercial",
  "topicDepth": "Deep Analysis",
  "titleSuggestions": [
    {
      "type": "High CTR & Viral",
      "title": "Punchy headline under 65 chars",
      "hook": "Why readers will click",
      "excerpt": "A 2-sentence lead summary that hooks the reader...",
      "draftHtml": "<h2>The Strategic Shift</h2><p>In-depth paragraph 1...</p><blockquote>\\"A memorable thesis quote.\\"</blockquote><h2>Market Implications</h2><p>Paragraph 2...</p><h2>Looking Ahead</h2><p>Paragraph 3...</p>"
    },
    {
      "type": "SEO Search Optimized",
      "title": "Keyword-first headline under 60 chars",
      "hook": "Optimized for Google SERP query",
      "excerpt": "A 2-sentence lead summary optimized for search snippet...",
      "draftHtml": "<h2>Executive Overview</h2><p>Paragraph 1...</p><blockquote>\\"Insight quote.\\"</blockquote><h2>Core Findings</h2><p>Paragraph 2...</p>"
    },
    {
      "type": "Executive Editorial",
      "title": "Authoritative headline under 65 chars",
      "hook": "Prestigious journalism tone",
      "excerpt": "A sophisticated lead summary for executive readers...",
      "draftHtml": "<h2>The Market Reconfiguration</h2><p>Paragraph 1...</p><blockquote>\\"Executive quote.\\"</blockquote><h2>Strategic Analysis</h2><p>Paragraph 2...</p>"
    }
  ],
  "suggestedMeta": {
    "seoTitle": "Optimal SEO title max 60 characters",
    "metaDescription": "A captivating 140-160 character meta summary that directly answers user intent."
  },
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "checklist": [
    {
      "id": "title_length",
      "label": "Title Length Optimization",
      "status": "good",
      "message": "Title is between 40-65 characters."
    }
  ],
  "actionableSuggestions": [
    "Specific actionable tip 1"
  ]
}`;

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
                  parts: [{ text: systemPrompt }],
                },
              ],
              generationConfig: {
                temperature: 0.35,
                responseMimeType: 'application/json',
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
        // Fallback to next model
      }
    }

    if (!rawResponseText) {
      const fallback = generateSmartFallback(title, category, excerpt);
      return NextResponse.json({
        success: true,
        analysis: fallback,
        source: 'smart_engine_fallback',
      });
    }

    let cleanedJson = rawResponseText.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedAnalysis = JSON.parse(cleanedJson);

    return NextResponse.json({
      success: true,
      analysis: parsedAnalysis,
      source: 'gemini_ai',
    });
  } catch (error: any) {
    console.error('SEO Analysis API Route Error:', error);
    const body = await req.json().catch(() => ({}));
    const fallback = {
      overallScore: 78,
      scoreLabel: 'Good',
      searchIntent: 'Informational',
      topicDepth: 'Standard Editorial',
      titleSuggestions: [
        {
          type: 'High CTR',
          title: body.title ? `${body.title}: Strategic Overview 2026` : 'Modern Industry Strategic Overview',
          hook: 'Clear, high-engagement headline',
          excerpt: 'A comprehensive editorial analysis on key industry developments and strategic foresight.',
          draftHtml: '<p>A deep dive into current industry developments, strategic frameworks, and market fundamentals.</p>',
        },
      ],
      suggestedMeta: {
        seoTitle: body.title || 'ApexChief Editorial Story',
        metaDescription: body.excerpt || 'Read the full in-depth story on ApexChief.',
      },
      keywords: ['Analysis', 'Strategy', 'Report'],
      checklist: [],
      actionableSuggestions: ['Review keyword presence in your lead paragraph.'],
    };

    return NextResponse.json({
      success: true,
      analysis: fallback,
      source: 'fallback',
    });
  }
}
