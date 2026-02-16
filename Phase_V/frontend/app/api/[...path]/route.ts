import { NextRequest, NextResponse } from 'next/server';

/**
 * API Proxy Route
 * Proxies all /api/* requests to the backend service
 * This allows the frontend to make requests without CORS issues
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend-service:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'POST');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'PATCH');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Build the backend URL
    const path = pathSegments.join('/');
    const url = new URL(`/api/${path}`, BACKEND_URL);

    // Copy query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Prepare headers
    const headers = new Headers();

    // Copy important headers from the original request
    const headersToForward = [
      'authorization',
      'content-type',
      'accept',
      'user-agent',
    ];

    headersToForward.forEach((header) => {
      const value = request.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    });

    // Prepare request options
    const options: RequestInit = {
      method,
      headers,
    };

    // Add body for POST, PATCH, PUT requests
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      try {
        const body = await request.text();
        if (body) {
          options.body = body;
        }
      } catch (error) {
        console.error('Error reading request body:', error);
      }
    }

    // Make the request to the backend
    const response = await fetch(url.toString(), options);

    // Get response body
    const responseBody = await response.text();

    // Create the response
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { detail: 'Internal proxy error' },
      { status: 500 }
    );
  }
}
