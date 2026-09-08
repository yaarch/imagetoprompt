// Cloudflare Pages Function for /api/refine-prompt
export async function onRequestPost(context: any) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { request } = context;
    const body: any = await request.json();
    const { basePrompt, instruction, targetModel = "midjourney" } = body;

    const cleanInstruction = (instruction || "").trim();
    const isMidjourney = (targetModel || "").toLowerCase().includes("midjourney");
    let refined = basePrompt || "";

    if (isMidjourney) {
      const paramMatch = refined.match(/(--[a-z0-9]+(\s+[^\s-]+)?)+$/i);
      const params = paramMatch ? paramMatch[0] : "";
      const core = paramMatch ? refined.slice(0, paramMatch.index).trim() : refined;
      refined = `${core}, ${cleanInstruction} ${params}`.trim();
    } else {
      refined = `${refined}, ${cleanInstruction}`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          refinedPrompt: refined,
          changesMade: `Applied: "${cleanInstruction}"`,
        },
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
