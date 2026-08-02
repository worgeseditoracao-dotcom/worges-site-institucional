import { getDb } from "../../../db";
import { leads } from "../../../db/schema";

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const name = clean(payload.name, 120);
    const phone = clean(payload.phone, 30);
    const email = clean(payload.email, 180);
    const projectType = clean(payload.projectType, 80);
    const packageInterest = clean(payload.packageInterest, 120);
    const projectSummary = clean(payload.projectSummary, 1000);
    const preferredTime = clean(payload.preferredTime, 80);
    const consent = payload.consent === true;

    if (!name || !phone || !projectType || !projectSummary || !consent) {
      return Response.json({ error: "Preencha nome, WhatsApp, tipo de projeto, resumo e autorização." }, { status: 400 });
    }
    if (!/^\+?[0-9()\-\s]{10,22}$/.test(phone)) {
      return Response.json({ error: "Informe um WhatsApp válido com DDD." }, { status: 400 });
    }

    const db = await getDb();
    const [lead] = await db.insert(leads).values({ name, phone, email: email || null, projectType, packageInterest: packageInterest || null, projectSummary, preferredTime: preferredTime || null, consent }).returning({ id: leads.id });
    return Response.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível registrar o contato.";
    return Response.json({ error: message }, { status: 500 });
  }
}
