import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  inviteCode: z.string().min(1, "Invite code required"),
});

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const { email, password, inviteCode } = result.data;

  const expectedCode = process.env.ADMIN_INVITE_CODE;
  if (!expectedCode || inviteCode !== expectedCode) {
    return NextResponse.json({ error: "Invalid invite code." }, { status: 403 });
  }

  const service = await createServiceClient();

  // Create the auth user
  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Upsert profile with admin role
  const { error: profileError } = await service
    .from("profiles")
    .upsert({
      id: created.user.id,
      role: "admin",
    });

  if (profileError) {
    // Rollback: delete the auth user we just created
    await service.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: "Failed to set admin role." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
