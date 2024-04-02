import dbConnect from "./db";

export async function withDbConnect(handler) {
  return async (req) => {
    await dbConnect();
    return handler(req);
  };
}

export async function checkRegistrarAndHosting(domainRegistrarId, hostingId) {
  const existingRegistrar = await DomainRegistrar.findById(domainRegistrarId);
  const existingHosting = await Hosting.findById(hostingId);

  if (!existingRegistrar || !existingHosting) {
    throw new Error("Domain Registrar or Hosting not found");
  }
}

export function handleApiResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status });
}

export function handleError(error) {
  return new Response(JSON.stringify({ message: error.message }), {
    status: 500,
  });
}
